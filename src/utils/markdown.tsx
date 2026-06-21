import React from 'react';
import type { MarkdownOptions } from '../types/config';

/**
 * Lightweight markdown-to-JSX renderer. No external dependencies.
 * Supports: bold, italic, code (inline + block), links, lists,
 * strikethrough, headings, and line breaks.
 */
export function renderMarkdown(
  text: string,
  options: MarkdownOptions = {},
): React.ReactNode {
  const cfg: Required<MarkdownOptions> = {
    bold: options.bold ?? true,
    italic: options.italic ?? true,
    code: options.code ?? true,
    links: options.links ?? true,
    lists: options.lists ?? true,
    strikethrough: options.strikethrough ?? true,
    headings: options.headings ?? false,
  };

  // Split by code blocks first to avoid processing markdown inside them
  const parts = text.split(/(```[\s\S]*?```)/g);
  const elements: React.ReactNode[] = [];

  parts.forEach((part, idx) => {
    if (cfg.code && part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).replace(/^\w*\n/, ''); // strip optional language tag
      elements.push(
        <pre key={idx} style={{ background: 'rgba(0,0,0,0.06)', borderRadius: '6px', padding: '8px 12px', overflowX: 'auto', fontSize: '13px', margin: '4px 0' }}>
          <code>{code}</code>
        </pre>,
      );
    } else {
      elements.push(...renderBlock(part, cfg, idx));
    }
  });

  return <>{elements}</>;
}

function renderBlock(
  text: string,
  cfg: Required<MarkdownOptions>,
  blockKey: number,
): React.ReactNode[] {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      result.push(
        <ul key={`${blockKey}-ul-${listKey++}`} style={{ margin: '4px 0', paddingLeft: '20px' }}>
          {listItems}
        </ul>,
      );
      listItems = [];
    }
  };

  lines.forEach((line, lineIdx) => {
    const key = `${blockKey}-${lineIdx}`;

    // Headings
    if (cfg.headings) {
      const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        flushList();
        const level = headingMatch[1].length as 1 | 2 | 3;
        const content = renderInline(headingMatch[2], cfg);
        const sizes = { 1: '1.4em', 2: '1.2em', 3: '1.05em' };
        result.push(
          <div key={key} style={{ fontWeight: 700, fontSize: sizes[level], margin: '6px 0 2px' }}>
            {content}
          </div>,
        );
        return;
      }
    }

    // List items
    if (cfg.lists && /^[\-\*•]\s+/.test(line)) {
      const content = line.replace(/^[\-\*•]\s+/, '');
      listItems.push(<li key={key}>{renderInline(content, cfg)}</li>);
      return;
    }

    // Ordered list
    if (cfg.lists && /^\d+\.\s+/.test(line)) {
      flushList(); // flush unordered first
      const content = line.replace(/^\d+\.\s+/, '');
      // Wrap single ordered items inline for now
      result.push(
        <div key={key} style={{ paddingLeft: '20px' }}>
          {line.match(/^\d+/)![0]}. {renderInline(content, cfg)}
        </div>,
      );
      return;
    }

    flushList();

    // Empty line = paragraph break
    if (line.trim() === '') {
      result.push(<br key={key} />);
      return;
    }

    // Normal line
    result.push(
      <span key={key} style={{ display: 'block' }}>
        {renderInline(line, cfg)}
      </span>,
    );
  });

  flushList();
  return result;
}

/** Parses inline markdown (bold, italic, code, links, strikethrough) into React nodes. */
function renderInline(text: string, cfg: Required<MarkdownOptions>): React.ReactNode {
  // Build a regex that matches all inline patterns we support
  const patterns: string[] = [];

  if (cfg.code) patterns.push('`([^`]+)`');
  if (cfg.bold) patterns.push('\\*\\*([^*]+)\\*\\*', '__([^_]+)__');
  if (cfg.strikethrough) patterns.push('~~([^~]+)~~');
  if (cfg.italic) patterns.push('\\*([^*]+)\\*', '(?<!\\w)_([^_]+)_(?!\\w)');
  if (cfg.links) patterns.push('\\[([^\\]]+)\\]\\((https?:\\/\\/[^)]+)\\)');

  if (patterns.length === 0) return text;

  const combined = new RegExp(patterns.join('|'), 'g');
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = combined.exec(text)) !== null) {
    // Push preceding text
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const full = match[0];

    if (cfg.code && full.startsWith('`') && full.endsWith('`')) {
      parts.push(
        <code key={key++} style={{ background: 'rgba(0,0,0,0.06)', borderRadius: '3px', padding: '1px 4px', fontSize: '0.9em' }}>
          {full.slice(1, -1)}
        </code>,
      );
    } else if (cfg.bold && (full.startsWith('**') || full.startsWith('__'))) {
      const inner = full.startsWith('**') ? full.slice(2, -2) : full.slice(2, -2);
      parts.push(<strong key={key++}>{renderInline(inner, { ...cfg, bold: false })}</strong>);
    } else if (cfg.strikethrough && full.startsWith('~~')) {
      parts.push(<del key={key++}>{renderInline(full.slice(2, -2), { ...cfg, strikethrough: false })}</del>);
    } else if (cfg.italic && (full.startsWith('*') || full.startsWith('_'))) {
      const inner = full.slice(1, -1);
      parts.push(<em key={key++}>{renderInline(inner, { ...cfg, italic: false })}</em>);
    } else if (cfg.links && full.startsWith('[')) {
      const linkMatch = full.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
            {linkMatch[1]}
          </a>,
        );
      }
    } else {
      parts.push(full);
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

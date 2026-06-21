// ─── Code Highlight Plugin ───────────────────────────────────────
// Syntax-highlight code blocks in messages.
// Adds CSS classes for styling — bring your own highlight.js/prism theme or use built-in.

import type { ChatPlugin, PluginContext } from '../types/plugin';
import type { ChatMessage } from '../types/message';

export interface CodeHighlightPluginOptions {
  /** Theme: 'dark' | 'light' (default: 'dark') — applies CSS class */
  theme?: 'dark' | 'light';
  /** Add copy button to code blocks (default: true) */
  copyButton?: boolean;
  /** Max height for code blocks in px (default: 300) */
  maxHeight?: number;
  /** Languages to auto-detect (informational) */
  languages?: string[];
}

const CODE_BLOCK_REGEX = /```(\w*)\n([\s\S]*?)```/g;
const INLINE_CODE_REGEX = /`([^`]+)`/g;

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function codeHighlightPlugin(options: CodeHighlightPluginOptions = {}): ChatPlugin {
  const theme = options.theme ?? 'dark';
  const copyBtn = options.copyButton !== false;
  const maxHeight = options.maxHeight ?? 300;
  let styleInjected = false;

  const injectStyles = () => {
    if (styleInjected || typeof document === 'undefined') return;
    styleInjected = true;

    const bg = theme === 'dark' ? '#1e1e2e' : '#f5f5f5';
    const fg = theme === 'dark' ? '#cdd6f4' : '#333';
    const border = theme === 'dark' ? '#313244' : '#ddd';

    const style = document.createElement('style');
    style.id = 'chatbot-code-highlight';
    style.textContent = `
      .chatbot-code-block {
        position: relative;
        background: ${bg};
        color: ${fg};
        border: 1px solid ${border};
        border-radius: 6px;
        padding: 12px;
        margin: 4px 0;
        font-family: 'Fira Code', 'JetBrains Mono', monospace;
        font-size: 13px;
        line-height: 1.5;
        overflow-x: auto;
        max-height: ${maxHeight}px;
        overflow-y: auto;
        white-space: pre;
      }
      .chatbot-code-lang {
        position: absolute;
        top: 4px;
        right: ${copyBtn ? '40px' : '8px'};
        font-size: 10px;
        opacity: 0.6;
        text-transform: uppercase;
      }
      .chatbot-code-copy {
        position: absolute;
        top: 4px;
        right: 8px;
        background: transparent;
        border: 1px solid ${border};
        border-radius: 4px;
        color: ${fg};
        font-size: 11px;
        padding: 2px 6px;
        cursor: pointer;
        opacity: 0.7;
      }
      .chatbot-code-copy:hover { opacity: 1; }
      .chatbot-code-inline {
        background: ${bg};
        color: ${fg};
        padding: 2px 5px;
        border-radius: 3px;
        font-family: monospace;
        font-size: 0.9em;
      }
    `;
    document.head.appendChild(style);
  };

  return {
    name: 'codeHighlight',

    onInit(_ctx: PluginContext) {
      injectStyles();
    },

    onMessage(message: ChatMessage, _ctx: PluginContext) {
      if (!message.text || message.sender === 'user') return message;

      let text = message.text;

      // Replace fenced code blocks
      text = text.replace(CODE_BLOCK_REGEX, (_match, lang: string, code: string) => {
        const escaped = escapeHtml(code.trim());
        const langLabel = lang ? `<span class="chatbot-code-lang">${lang}</span>` : '';
        const copyButton = copyBtn
          ? `<button class="chatbot-code-copy" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').textContent)">Copy</button>`
          : '';
        return `<div class="chatbot-code-block">${langLabel}${copyButton}<code>${escaped}</code></div>`;
      });

      // Replace inline code
      text = text.replace(INLINE_CODE_REGEX, (_match, code: string) => {
        return `<span class="chatbot-code-inline">${escapeHtml(code)}</span>`;
      });

      return { ...message, text };
    },
  };
}

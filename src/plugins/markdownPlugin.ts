import type { ChatPlugin } from '../types/plugin';

/**
 * Markdown Plugin — transforms markdown syntax in bot messages to HTML
 * Lightweight built-in renderer, no external dependencies.
 */
export function markdownPlugin(options?: {
  enableBold?: boolean;
  enableItalic?: boolean;
  enableCode?: boolean;
  enableLinks?: boolean;
  enableLists?: boolean;
  enableLineBreaks?: boolean;
}): ChatPlugin {
  const cfg = {
    bold: options?.enableBold ?? true,
    italic: options?.enableItalic ?? true,
    code: options?.enableCode ?? true,
    links: options?.enableLinks ?? true,
    lists: options?.enableLists ?? true,
    lineBreaks: options?.enableLineBreaks ?? true,
  };

  const renderMarkdown = (text: string): string => {
    let result = text;

    // Code blocks (``` ```)
    if (cfg.code) {
      result = result.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
      result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
    }

    // Bold (**text** or __text__)
    if (cfg.bold) {
      result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      result = result.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    }

    // Italic (*text* or _text_)
    if (cfg.italic) {
      result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      result = result.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<em>$1</em>');
    }

    // Links [text](url)
    if (cfg.links) {
      result = result.replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      );
    }

    // Unordered lists
    if (cfg.lists) {
      result = result.replace(/^[•\-\*]\s+(.+)$/gm, '<li>$1</li>');
      result = result.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    }

    // Line breaks
    if (cfg.lineBreaks) {
      result = result.replace(/\n/g, '<br>');
    }

    return result;
  };

  return {
    name: 'markdown',

    onMessage(message) {
      if (message.sender === 'bot' && message.text) {
        const rendered = renderMarkdown(message.text);
        if (rendered !== message.text) {
          return { ...message, text: rendered };
        }
      }
    },
  };
}

import type { ChatPlugin } from '../types/plugin';
import type { MarkdownOptions } from '../types/config';

/**
 * Markdown Plugin — renders markdown in bot messages.
 *
 * This does **not** rewrite the message text. It flags the message so the
 * bubble renders it with the built-in markdown-to-JSX renderer, which produces
 * real React elements.
 *
 * It used to replace the text with an HTML string (`<strong>`, `<br>`, `<ul>`),
 * but nothing rendered that as HTML — bubbles render text as text — so the tags
 * appeared literally on screen. Emitting React nodes instead also keeps the
 * renderer free of `dangerouslySetInnerHTML`, so message text can never inject
 * markup.
 *
 * Equivalent to setting the `markdown` prop, but scoped to bot messages. The
 * prop wins where both are set.
 */
export function markdownPlugin(options?: {
  enableBold?: boolean;
  enableItalic?: boolean;
  enableCode?: boolean;
  enableLinks?: boolean;
  enableLists?: boolean;
  enableStrikethrough?: boolean;
  enableHeadings?: boolean;
  /** @deprecated Line breaks are always preserved. */
  enableLineBreaks?: boolean;
}): ChatPlugin {
  const markdown: MarkdownOptions = {
    bold: options?.enableBold ?? true,
    italic: options?.enableItalic ?? true,
    code: options?.enableCode ?? true,
    links: options?.enableLinks ?? true,
    lists: options?.enableLists ?? true,
    strikethrough: options?.enableStrikethrough ?? true,
    headings: options?.enableHeadings ?? true,
  };

  return {
    name: 'markdown',

    onMessage(message) {
      if (message.sender !== 'bot' || !message.text) return;
      if (message.metadata?.markdown) return;
      return {
        ...message,
        metadata: { ...message.metadata, markdown },
      };
    },
  };
}

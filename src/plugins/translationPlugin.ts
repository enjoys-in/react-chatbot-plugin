// ─── Translation Plugin ──────────────────────────────────────────
// Auto-translate messages between languages in real-time.
// Supports any translation API (Google, DeepL, LibreTranslate, etc.).

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';
import type { ChatMessage } from '../types/message';

export interface TranslationPluginOptions {
  /** Translation API endpoint (POST with { text, from, to } body) */
  endpoint: string;
  /** Request headers (e.g., API key) */
  headers?: Record<string, string>;
  /** Source language (default: 'auto') */
  sourceLang?: string;
  /** Target language (default: 'en') */
  targetLang?: string;
  /** Translate bot messages for user (default: true) */
  translateIncoming?: boolean;
  /** Translate user messages for bot/agent (default: false) */
  translateOutgoing?: boolean;
  /** Show original text alongside translation (default: false) */
  showOriginal?: boolean;
  /** Callback with translation result */
  onTranslate?: (original: string, translated: string, lang: string) => void;
}

export function translationPlugin(options: TranslationPluginOptions): ChatPlugin {
  let targetLang = options.targetLang ?? 'en';
  const sourceLang = options.sourceLang ?? 'auto';

  const translate = async (text: string): Promise<string> => {
    try {
      const res = await fetch(options.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...options.headers },
        body: JSON.stringify({ text, from: sourceLang, to: targetLang }),
      });
      const data = await res.json();
      return data.translatedText ?? data.translation ?? data.text ?? text;
    } catch {
      return text;
    }
  };

  return {
    name: 'translation',

    async onMessage(message: ChatMessage, ctx: PluginContext) {
      if (!message.text) return message;

      const shouldTranslate =
        (message.sender === 'bot' && options.translateIncoming !== false) ||
        (message.sender === 'user' && options.translateOutgoing === true);

      if (!shouldTranslate) return message;

      const translated = await translate(message.text);
      options.onTranslate?.(message.text, translated, targetLang);

      if (options.showOriginal) {
        return { ...message, text: `${translated}\n\n_Original: ${message.text}_` };
      }

      return { ...message, text: translated };
    },

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'translation:setLang' && typeof event.payload === 'string') {
        targetLang = event.payload;
        ctx.setData('__targetLang', targetLang);
        ctx.emit('translation:langChanged', targetLang);
      }

      if (event.type === 'translation:getLang') {
        ctx.emit('translation:currentLang', targetLang);
      }
    },
  };
}

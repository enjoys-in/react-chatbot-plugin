import type { ChatPlugin, PluginContext } from '../types/plugin';
import { postJSON } from './utils/http';

/**
 * AI Plugin — generates bot responses using external AI providers (OpenAI, Anthropic, custom)
 */
export function aiPlugin(options: {
  provider?: 'openai' | 'anthropic' | 'custom';
  endpoint?: string;
  apiKey?: string;
  model?: string;
  systemPrompt?: string;
  headers?: Record<string, string>;
  shouldRespond?: (text: string) => boolean;
  parseResponse?: (response: unknown) => string;
  timeout?: number;
}): ChatPlugin {
  const endpoint = options.endpoint ?? (
    options.provider === 'openai' ? 'https://api.openai.com/v1/chat/completions'
      : options.provider === 'anthropic' ? 'https://api.anthropic.com/v1/messages'
        : options.endpoint ?? ''
  );
  const model = options.model ?? (options.provider === 'openai' ? 'gpt-3.5-turbo' : 'claude-3-haiku-20240307');
  const conversationHistory: Array<{ role: string; content: string }> = [];

  if (options.systemPrompt) {
    conversationHistory.push({ role: 'system', content: options.systemPrompt });
  }

  const buildHeaders = (): Record<string, string> => {
    const h: Record<string, string> = { ...options.headers };
    if (options.apiKey) {
      if (options.provider === 'anthropic') {
        h['x-api-key'] = options.apiKey;
        h['anthropic-version'] = '2023-06-01';
      } else {
        h['Authorization'] = `Bearer ${options.apiKey}`;
      }
    }
    return h;
  };

  const buildBody = () => {
    if (options.provider === 'anthropic') {
      return {
        model,
        max_tokens: 1024,
        system: options.systemPrompt,
        messages: conversationHistory.filter(m => m.role !== 'system'),
      };
    }
    return { model, messages: conversationHistory };
  };

  const defaultParse = (res: unknown): string => {
    const data = res as Record<string, unknown>;
    // OpenAI format
    if (data.choices) {
      const choices = data.choices as Array<{ message?: { content?: string } }>;
      return choices[0]?.message?.content ?? '';
    }
    // Anthropic format
    if (data.content) {
      const blocks = data.content as Array<{ text?: string }>;
      return blocks[0]?.text ?? '';
    }
    return String(data);
  };

  return {
    name: 'ai',

    async onMessage(message, ctx: PluginContext) {
      if (message.sender !== 'user' || !message.text) return;
      if (options.shouldRespond && !options.shouldRespond(message.text)) return;
      if (!endpoint) return;

      conversationHistory.push({ role: 'user', content: message.text });

      try {
        const res = await postJSON(endpoint, buildBody(), buildHeaders(), options.timeout ?? 30000);
        const json = await res.json();
        const text = options.parseResponse ? options.parseResponse(json) : defaultParse(json);

        if (text) {
          conversationHistory.push({ role: 'assistant', content: text });
          ctx.addBotMessage(text);
        }
      } catch (err) {
        console.error('[ai] Response failed:', err);
      }
    },
  };
}

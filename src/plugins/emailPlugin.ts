import type { ChatPlugin } from '../types/plugin';
import { postJSON } from './utils/http';

/**
 * Email Plugin — triggers emails via external API when chat events occur
 */
export function emailPlugin(options: {
  endpoint: string;
  template?: string;
  headers?: Record<string, string>;
  triggers?: ('submit' | 'flowEnd' | 'login')[];
  mapPayload?: (data: Record<string, unknown>) => Record<string, unknown>;
}): ChatPlugin {
  const triggers = new Set(options.triggers ?? ['flowEnd']);

  const send = async (trigger: string, data: Record<string, unknown>) => {
    const payload = options.mapPayload ? options.mapPayload(data) : data;
    try {
      await postJSON(options.endpoint, {
        template: options.template,
        trigger,
        data: payload,
        timestamp: Date.now(),
      }, options.headers);
    } catch (err) {
      console.error('[email] Send failed:', err);
    }
  };

  return {
    name: 'email',

    async onSubmit(data) {
      if (triggers.has('submit')) await send('submit', data);
    },

    onEvent(event) {
      if (triggers.has(event.type) && event.payload) {
        send(event.type, event.payload as Record<string, unknown>);
      }
    },
  };
}

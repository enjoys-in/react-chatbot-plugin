import type { ChatPlugin } from '../types/plugin';
import { postJSON } from './utils/http';

type WebhookEventType = 'message' | 'submit' | 'init' | 'destroy' | 'open' | 'close' | 'flowEnd' | 'stepChange' | 'quickReply' | 'login';

/**
 * Webhook Plugin — sends messages/submissions/lifecycle events to an external endpoint
 */
export function webhookPlugin(options: {
  url: string;
  headers?: Record<string, string>;
  events?: WebhookEventType[];
  timeout?: number;
}): ChatPlugin {
  const events = new Set<string>(options.events ?? ['message', 'submit']);
  const timeout = options.timeout ?? 10000;

  const send = async (type: string, payload: unknown) => {
    try {
      await postJSON(options.url, { type, payload, timestamp: Date.now() }, options.headers, timeout);
    } catch (err) {
      console.error(`[webhook] Failed to send ${type}:`, err);
    }
  };

  return {
    name: 'webhook',

    async onInit() {
      if (events.has('init')) await send('init', {});
    },

    async onMessage(message) {
      if (events.has('message')) await send('message', message);
    },

    async onSubmit(data) {
      if (events.has('submit')) await send('submit', data);
    },

    onEvent(event) {
      if (events.has(event.type)) {
        send(event.type, event.payload);
      }
    },

    async onDestroy() {
      if (events.has('destroy')) await send('destroy', {});
    },
  };
}

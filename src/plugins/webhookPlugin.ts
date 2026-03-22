import type { ChatPlugin } from '../types/plugin';

export function webhookPlugin(options: {
  url: string;
  headers?: Record<string, string>;
  events?: ('message' | 'submit' | 'init' | 'destroy')[];
}): ChatPlugin {
  const events = options.events ?? ['message', 'submit'];

  const send = async (type: string, payload: unknown) => {
    try {
      await fetch(options.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify({ type, payload, timestamp: Date.now() }),
      });
    } catch {
    }
  };

  return {
    name: 'webhook',

    async onInit() {
      if (events.includes('init')) {
        await send('init', {});
      }
    },

    async onMessage(message) {
      if (events.includes('message')) {
        await send('message', message);
      }
    },

    async onSubmit(data) {
      if (events.includes('submit')) {
        await send('submit', data);
      }
    },

    async onDestroy() {
      if (events.includes('destroy')) {
        await send('destroy', {});
      }
    },
  };
}

import type { ChatPlugin } from '../types/plugin';

export function persistencePlugin(options?: {
  storageKey?: string;
  storage?: 'local' | 'session';
}): ChatPlugin {
  const key = options?.storageKey ?? 'chatbot_history';
  const store = options?.storage === 'session' ? sessionStorage : localStorage;

  return {
    name: 'persistence',

    onInit(ctx) {
      try {
        const saved = store.getItem(key);
        if (saved) {
          const messages = JSON.parse(saved);
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              if (msg.sender === 'bot') {
                ctx.addBotMessage(msg.text);
              }
            });
          }
        }
      } catch {
      }
    },

    onMessage(message, ctx) {
      try {
        const messages = ctx.getMessages();
        store.setItem(key, JSON.stringify(messages.slice(-50)));
      } catch {
      }
    },

    onDestroy() {
    },
  };
}

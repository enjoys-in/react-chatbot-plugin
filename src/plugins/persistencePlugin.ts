import type { ChatPlugin, PluginContext } from '../types/plugin';
import type { ChatMessage } from '../types/message';
import { createStorageAdapter, safeJsonParse } from './utils/storage';

/**
 * Persistence Plugin — saves/restores full chat history via browser storage
 */
export function persistencePlugin(options?: {
  storageKey?: string;
  storage?: 'local' | 'session';
  maxMessages?: number;
  ttl?: number;
}): ChatPlugin {
  const key = options?.storageKey ?? 'chatbot_history';
  const store = createStorageAdapter(options?.storage ?? 'local');
  const max = options?.maxMessages ?? 100;
  const ttl = options?.ttl ?? 0;

  interface Snapshot { messages: ChatMessage[]; savedAt: number }

  const save = (ctx: PluginContext) => {
    const messages = ctx.getMessages().slice(-max);
    const snapshot: Snapshot = { messages, savedAt: Date.now() };
    store.set(key, JSON.stringify(snapshot));
  };

  return {
    name: 'persistence',

    onInit(ctx) {
      const raw = store.get(key);
      const snapshot = safeJsonParse<Snapshot | null>(raw, null);
      if (!snapshot?.messages?.length) return;

      if (ttl > 0 && Date.now() - snapshot.savedAt > ttl) {
        store.remove(key);
        return;
      }

      for (const msg of snapshot.messages) {
        if (msg.sender === 'bot' && msg.text) {
          ctx.addBotMessage(msg.text);
        }
      }
    },

    onMessage(_message, ctx) {
      save(ctx);
    },

    onSubmit(_data, ctx) {
      save(ctx);
    },

    onDestroy(ctx) {
      save(ctx);
    },
  };
}

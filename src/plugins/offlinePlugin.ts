import type { ChatPlugin } from '../types/plugin';

/**
 * Offline Plugin — queues messages when device is offline and sends them on reconnect.
 */
export function offlinePlugin(options?: {
  /** Storage key for queued messages (default: 'cb_offline_queue') */
  storageKey?: string;
  /** Show indicator when offline */
  showOfflineIndicator?: boolean;
  /** Called when messages are flushed on reconnect */
  onFlush?: (count: number) => void;
}): ChatPlugin {
  const storageKey = options?.storageKey ?? 'cb_offline_queue';
  let queue: Array<{ text: string; timestamp: number }> = [];

  const loadQueue = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) queue = JSON.parse(stored);
    } catch { /* ignore */ }
  };

  const saveQueue = () => {
    localStorage.setItem(storageKey, JSON.stringify(queue));
  };

  return {
    name: 'offline',

    onInit(ctx) {
      loadQueue();

      // Flush queue on reconnect
      const handleOnline = () => {
        if (queue.length > 0) {
          queue.forEach((msg) => ctx.sendMessage(msg.text));
          options?.onFlush?.(queue.length);
          queue = [];
          saveQueue();
        }
        if (options?.showOfflineIndicator) {
          ctx.addBotMessage('🟢 Back online!');
        }
      };

      const handleOffline = () => {
        if (options?.showOfflineIndicator) {
          ctx.addBotMessage('🔴 You are offline. Messages will be sent when you reconnect.');
        }
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    },

    onMessage(message, ctx) {
      if (message.sender === 'user' && !navigator.onLine) {
        queue.push({ text: message.text ?? '', timestamp: Date.now() });
        saveQueue();
        ctx.addBotMessage('📥 Message queued — will send when online.');
        return undefined;
      }
    },
  };
}

// ─── Pin Plugin ──────────────────────────────────────────────────
// Pin/unpin messages. Pinned messages are stored and accessible via events.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';

export interface PinPluginOptions {
  /** Max pinned messages (default: 10) */
  maxPins?: number;
  /** Persist pins in localStorage */
  persist?: boolean;
  /** Storage key */
  storageKey?: string;
  /** Callback when a message is pinned */
  onPin?: (messageId: string) => void;
  /** Callback when a message is unpinned */
  onUnpin?: (messageId: string) => void;
}

export function pinPlugin(options: PinPluginOptions = {}): ChatPlugin {
  const maxPins = options.maxPins ?? 10;
  const storageKey = options.storageKey ?? 'chatbot_pinned';
  let pinned: string[] = [];

  const load = () => {
    if (options.persist) {
      try {
        pinned = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      } catch { pinned = []; }
    }
  };

  const save = () => {
    if (options.persist) {
      localStorage.setItem(storageKey, JSON.stringify(pinned));
    }
  };

  return {
    name: 'pin',

    onInit(_ctx: PluginContext) {
      load();
    },

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'pin:add' && typeof event.payload === 'string') {
        if (!pinned.includes(event.payload) && pinned.length < maxPins) {
          pinned.push(event.payload);
          save();
          options.onPin?.(event.payload);
          ctx.emit('pin:updated', [...pinned]);
        }
      }

      if (event.type === 'pin:remove' && typeof event.payload === 'string') {
        pinned = pinned.filter((id) => id !== event.payload);
        save();
        options.onUnpin?.(event.payload);
        ctx.emit('pin:updated', [...pinned]);
      }

      if (event.type === 'pin:list') {
        ctx.emit('pin:current', [...pinned]);
      }

      if (event.type === 'pin:clear') {
        pinned = [];
        save();
        ctx.emit('pin:updated', []);
      }
    },
  };
}

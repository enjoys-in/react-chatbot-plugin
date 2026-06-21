// ─── Event Bus ───────────────────────────────────────────────────
// A lightweight pub/sub event bus for decoupled communication between
// plugins, components, and external code.

export type EventHandler = (...args: unknown[]) => void;

export interface EventBus {
  /** Subscribe to an event */
  on(event: string, handler: EventHandler): () => void;
  /** Subscribe once — auto-removes after first call */
  once(event: string, handler: EventHandler): () => void;
  /** Emit an event to all subscribers */
  emit(event: string, ...args: unknown[]): void;
  /** Remove a specific handler */
  off(event: string, handler: EventHandler): void;
  /** Remove all handlers for an event (or all events if no event specified) */
  clear(event?: string): void;
}

/**
 * Create a standalone event bus instance.
 *
 * @example
 * ```ts
 * import { createEventBus } from '@enjoys/react-chatbot-plugin';
 *
 * const bus = createEventBus();
 * bus.on('user:login', (data) => console.log(data));
 * bus.emit('user:login', { name: 'Alice' });
 * ```
 */
export function createEventBus(): EventBus {
  const handlers = new Map<string, Set<EventHandler>>();

  const getSet = (event: string): Set<EventHandler> => {
    if (!handlers.has(event)) handlers.set(event, new Set());
    return handlers.get(event)!;
  };

  return {
    on(event, handler) {
      getSet(event).add(handler);
      return () => getSet(event).delete(handler);
    },

    once(event, handler) {
      const wrapper: EventHandler = (...args) => {
        getSet(event).delete(wrapper);
        handler(...args);
      };
      getSet(event).add(wrapper);
      return () => getSet(event).delete(wrapper);
    },

    emit(event, ...args) {
      const set = handlers.get(event);
      if (set) set.forEach((fn) => fn(...args));
    },

    off(event, handler) {
      getSet(event).delete(handler);
    },

    clear(event?) {
      if (event) handlers.delete(event);
      else handlers.clear();
    },
  };
}

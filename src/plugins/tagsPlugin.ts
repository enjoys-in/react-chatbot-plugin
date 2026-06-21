import type { ChatPlugin } from '../types/plugin';

/**
 * Tags Plugin — allows tagging conversations by topic for multi-flow bots.
 * Tags are stored in metadata and can be used for routing/analytics.
 */
export function tagsPlugin(options?: {
  /** Predefined tags users can assign */
  availableTags?: string[];
  /** Storage key for persisting tags */
  storageKey?: string;
  /** Called when a tag is added */
  onTagAdded?: (tag: string, messageId?: string) => void;
  /** Called when a tag is removed */
  onTagRemoved?: (tag: string) => void;
}): ChatPlugin {
  const tags = new Set<string>();
  const storageKey = options?.storageKey ?? 'cb_tags';

  return {
    name: 'tags',

    onInit(ctx) {
      // Restore tags from storage
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) JSON.parse(stored).forEach((t: string) => tags.add(t));
      } catch { /* ignore */ }
      ctx.emit('tags:loaded', Array.from(tags));
    },

    onEvent(event, ctx) {
      if (event.type === 'tags:add' && typeof event.payload === 'string') {
        tags.add(event.payload);
        localStorage.setItem(storageKey, JSON.stringify(Array.from(tags)));
        options?.onTagAdded?.(event.payload);
        ctx.emit('tags:updated', Array.from(tags));
      }
      if (event.type === 'tags:remove' && typeof event.payload === 'string') {
        tags.delete(event.payload);
        localStorage.setItem(storageKey, JSON.stringify(Array.from(tags)));
        options?.onTagRemoved?.(event.payload);
        ctx.emit('tags:updated', Array.from(tags));
      }
      if (event.type === 'tags:get') {
        ctx.emit('tags:current', Array.from(tags));
      }
    },
  };
}

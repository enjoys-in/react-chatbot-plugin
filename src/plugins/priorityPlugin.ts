// ─── Priority Plugin ─────────────────────────────────────────────
// Assign priority levels and labels to conversations.
// Useful for support queues, agent routing, and ticket management.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';

export type ConversationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface PriorityPluginOptions {
  /** Default priority (default: 'medium') */
  defaultPriority?: ConversationPriority;
  /** Max labels per conversation (default: 5) */
  maxLabels?: number;
  /** Persist in localStorage */
  persist?: boolean;
  /** Storage key */
  storageKey?: string;
  /** Callback on priority change */
  onPriorityChange?: (priority: ConversationPriority) => void;
  /** Callback on label change */
  onLabelsChange?: (labels: string[]) => void;
  /** Webhook URL to notify on priority change */
  webhookUrl?: string;
}

export function priorityPlugin(options: PriorityPluginOptions = {}): ChatPlugin {
  const storageKey = options.storageKey ?? 'chatbot_priority';
  const maxLabels = options.maxLabels ?? 5;
  let priority: ConversationPriority = options.defaultPriority ?? 'medium';
  let labels: string[] = [];

  const load = () => {
    if (options.persist !== false) {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
        if (saved.priority) priority = saved.priority;
        if (saved.labels) labels = saved.labels;
      } catch { /* ignore */ }
    }
  };

  const save = () => {
    if (options.persist !== false) {
      localStorage.setItem(storageKey, JSON.stringify({ priority, labels }));
    }
  };

  const notify = () => {
    if (options.webhookUrl) {
      fetch(options.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority, labels, timestamp: Date.now() }),
      }).catch(() => { /* silent */ });
    }
  };

  return {
    name: 'priority',

    onInit(ctx: PluginContext) {
      load();
      ctx.setData('__priority', priority);
      ctx.setData('__labels', labels);
    },

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'priority:set' && typeof event.payload === 'string') {
        const valid: ConversationPriority[] = ['low', 'medium', 'high', 'urgent'];
        if (valid.includes(event.payload as ConversationPriority)) {
          priority = event.payload as ConversationPriority;
          save();
          notify();
          options.onPriorityChange?.(priority);
          ctx.setData('__priority', priority);
          ctx.emit('priority:changed', priority);
        }
      }

      if (event.type === 'label:add' && typeof event.payload === 'string') {
        if (!labels.includes(event.payload) && labels.length < maxLabels) {
          labels.push(event.payload);
          save();
          options.onLabelsChange?.([...labels]);
          ctx.setData('__labels', [...labels]);
          ctx.emit('labels:updated', [...labels]);
        }
      }

      if (event.type === 'label:remove' && typeof event.payload === 'string') {
        labels = labels.filter((l) => l !== event.payload);
        save();
        options.onLabelsChange?.([...labels]);
        ctx.setData('__labels', [...labels]);
        ctx.emit('labels:updated', [...labels]);
      }

      if (event.type === 'priority:get') {
        ctx.emit('priority:current', { priority, labels });
      }
    },
  };
}

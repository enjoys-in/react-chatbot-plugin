import type { ChatPlugin, PluginContext } from '../types/plugin';
import { postJSON } from './utils/http';
import { createStorageAdapter } from './utils/storage';

/**
 * Lead Plugin — captures and stores user information as leads
 */
export function leadPlugin(options: {
  fields?: string[];
  endpoint?: string;
  headers?: Record<string, string>;
  storageKey?: string;
  onLeadCaptured?: (lead: Record<string, unknown>, ctx: PluginContext) => void;
}): ChatPlugin {
  const fields = new Set(options.fields ?? ['name', 'email', 'phone']);
  const store = createStorageAdapter('local');
  const storageKey = options.storageKey ?? 'chatbot_lead';

  const checkAndCapture = (data: Record<string, unknown>, ctx: PluginContext) => {
    const lead: Record<string, unknown> = {};
    let hasFields = false;

    for (const [key, value] of Object.entries(data)) {
      if (fields.has(key) && value) {
        lead[key] = value;
        hasFields = true;
      }
    }

    if (hasFields) {
      // Merge with existing lead data
      const existing = JSON.parse(store.get(storageKey) ?? '{}');
      const merged = { ...existing, ...lead, updatedAt: Date.now() };
      store.set(storageKey, JSON.stringify(merged));
      options.onLeadCaptured?.(merged, ctx);
      ctx.emit('lead:captured', merged);

      // Send to endpoint if configured
      if (options.endpoint) {
        postJSON(options.endpoint, merged, options.headers).catch(() => {});
      }
    }
  };

  return {
    name: 'lead',

    onSubmit(data, ctx) {
      checkAndCapture(data, ctx);
    },

    onEvent(event, ctx) {
      if (event.type === 'flowEnd' && event.payload) {
        checkAndCapture(event.payload as Record<string, unknown>, ctx);
      }
      if (event.type === 'login' && event.payload) {
        checkAndCapture(event.payload as Record<string, unknown>, ctx);
      }
    },
  };
}

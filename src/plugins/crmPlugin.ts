import type { ChatPlugin } from '../types/plugin';
import { postJSON } from './utils/http';

/**
 * CRM Plugin — pushes user/lead data to CRM systems
 */
export function crmPlugin(options: {
  endpoint: string;
  provider?: string;
  headers?: Record<string, string>;
  mapFields?: (data: Record<string, unknown>) => Record<string, unknown>;
  events?: ('submit' | 'flowEnd' | 'login')[];
}): ChatPlugin {
  const events = new Set(options.events ?? ['submit', 'flowEnd']);

  const push = async (type: string, data: Record<string, unknown>) => {
    const mapped = options.mapFields ? options.mapFields(data) : data;
    try {
      await postJSON(options.endpoint, {
        provider: options.provider,
        type,
        data: mapped,
        timestamp: Date.now(),
      }, options.headers);
    } catch (err) {
      console.error('[crm] Push failed:', err);
    }
  };

  return {
    name: 'crm',

    async onSubmit(data) {
      if (events.has('submit')) await push('submit', data);
    },

    onEvent(event) {
      if (events.has(event.type as string) && event.payload) {
        push(event.type, event.payload as Record<string, unknown>);
      }
    },
  };
}

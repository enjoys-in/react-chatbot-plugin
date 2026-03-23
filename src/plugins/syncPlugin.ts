import type { ChatPlugin, PluginContext } from '../types/plugin';
import { postJSON, getJSON } from './utils/http';

/**
 * Sync Plugin — syncs chat data with a backend endpoint
 */
export function syncPlugin(options: {
  endpoint: string;
  headers?: Record<string, string>;
  syncInterval?: number;
  sessionKey?: string;
}): ChatPlugin {
  const interval = options.syncInterval ?? 0;
  const sessionKey = options.sessionKey ?? `chat_${Date.now()}`;
  let timer: ReturnType<typeof setInterval> | null = null;

  const push = (ctx: PluginContext) => {
    postJSON(options.endpoint, {
      session: sessionKey,
      messages: ctx.getMessages(),
      data: ctx.getData(),
      timestamp: Date.now(),
    }, options.headers).catch(() => { /* silent */ });
  };

  return {
    name: 'sync',

    async onInit(ctx) {
      // Load remote state
      try {
        const data = await getJSON<{ messages?: unknown[]; data?: Record<string, unknown> }>(
          `${options.endpoint}?session=${encodeURIComponent(sessionKey)}`,
          options.headers,
        );
        if (data.data) {
          for (const [k, v] of Object.entries(data.data)) {
            ctx.setData(k, v);
          }
        }
      } catch { /* no remote state */ }

      // Periodic sync
      if (interval > 0) {
        timer = setInterval(() => push(ctx), interval);
      }
    },

    onSubmit(_data, ctx) {
      push(ctx);
    },

    onEvent(event, ctx) {
      if (event.type === 'flowEnd') push(ctx);
    },

    onDestroy(ctx) {
      if (timer) clearInterval(timer);
      push(ctx);
    },
  };
}

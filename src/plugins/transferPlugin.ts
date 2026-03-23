import type { ChatPlugin, PluginContext } from '../types/plugin';
import { postJSON } from './utils/http';

/**
 * Transfer Plugin — transfers chat to different departments/agents via API
 */
export function transferPlugin(options: {
  endpoint: string;
  headers?: Record<string, string>;
  departments?: string[];
  onTransfer?: (department: string, ctx: PluginContext) => void;
  onTransferComplete?: (result: unknown, ctx: PluginContext) => void;
  transferMessage?: string;
}): ChatPlugin {
  return {
    name: 'transfer',

    onInit(ctx) {
      ctx.on('transfer:request', async (...args: unknown[]) => {
        const department = (args[0] as string) ?? 'default';

        ctx.addBotMessage(
          options.transferMessage ?? `Transferring you to **${department}**. Please hold...`,
        );
        options.onTransfer?.(department, ctx);

        try {
          const res = await postJSON(options.endpoint, {
            department,
            messages: ctx.getMessages(),
            data: ctx.getData(),
            timestamp: Date.now(),
          }, options.headers);

          const result = await res.json();
          options.onTransferComplete?.(result, ctx);
          ctx.emit('transfer:complete', { department, result });
        } catch (err) {
          console.error('[transfer] Failed:', err);
          ctx.addBotMessage('Transfer failed. Please try again later.');
          ctx.emit('transfer:error', { department, error: String(err) });
        }
      });
    },
  };
}

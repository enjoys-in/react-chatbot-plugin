import type { ChatPlugin } from '../types/plugin';

/**
 * Rate Limit Plugin — prevents spam by limiting message frequency
 */
export function rateLimitPlugin(options?: {
  limit?: number;
  window?: number;
  onLimited?: (remaining: number) => void;
  warningMessage?: string;
}): ChatPlugin {
  const limit = options?.limit ?? 10;
  const window = options?.window ?? 60000;
  const timestamps: number[] = [];

  return {
    name: 'rateLimit',

    onMessage(message, ctx) {
      if (message.sender !== 'user') return;

      const now = Date.now();
      // Remove expired timestamps
      while (timestamps.length > 0 && now - timestamps[0]! > window) {
        timestamps.shift();
      }

      timestamps.push(now);

      if (timestamps.length > limit) {
        const remaining = Math.ceil((timestamps[0]! + window - now) / 1000);
        options?.onLimited?.(remaining);
        ctx.emit('rateLimit:exceeded', { remaining });
        ctx.addBotMessage(options?.warningMessage ?? `Too many messages. Please wait ${remaining}s.`);
        return { ...message, text: '' };
      }
    },
  };
}

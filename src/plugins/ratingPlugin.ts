import type { ChatPlugin } from '../types/plugin';

/**
 * Rating Plugin — shows a satisfaction survey at end of conversation.
 * Triggered on flow end or agent disconnect.
 */
export function ratingPlugin(options?: {
  /** Rating scale (default: 5) */
  scale?: number;
  /** Prompt text shown to user */
  prompt?: string;
  /** Trigger events that show the rating (default: ['flowEnd']) */
  triggers?: ('flowEnd' | 'agentDisconnect' | 'custom')[];
  /** Called when user submits a rating */
  onRate?: (rating: number, feedback?: string) => void;
  /** Endpoint to POST rating data */
  endpoint?: string;
  /** Custom headers for the POST */
  headers?: Record<string, string>;
}): ChatPlugin {
  const cfg = {
    scale: options?.scale ?? 5,
    prompt: options?.prompt ?? 'How was your experience?',
    triggers: options?.triggers ?? ['flowEnd'],
  };

  return {
    name: 'rating',

    onEvent(event, ctx) {
      const shouldTrigger =
        (cfg.triggers.includes('flowEnd') && event.type === 'flowEnd') ||
        (cfg.triggers.includes('agentDisconnect') && event.type === 'agent:left') ||
        (cfg.triggers.includes('custom') && event.type === 'rating:show');

      if (shouldTrigger) {
        ctx.addBotMessage(`${cfg.prompt} (Rate 1-${cfg.scale})`);
      }

      if (event.type === 'rating:submit' && typeof event.payload === 'number') {
        options?.onRate?.(event.payload);
        if (options?.endpoint) {
          fetch(options.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...options.headers },
            body: JSON.stringify({ rating: event.payload, timestamp: Date.now() }),
          }).catch(() => { /* silent */ });
        }
        ctx.addBotMessage(`Thanks for your ${event.payload}/${cfg.scale} rating! 🙏`);
      }
    },
  };
}

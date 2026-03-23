import type { ChatPlugin } from '../types/plugin';

/**
 * Typing Plugin — adds configurable typing delay before bot messages are shown
 */
export function typingPlugin(options?: {
  delay?: number;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
}): ChatPlugin {
  const typingDelay = options?.delay ?? 1000;

  return {
    name: 'typing',

    async onMessage(message, ctx) {
      if (message.sender === 'bot') {
        options?.onTypingStart?.();
        ctx.emit('typing:start', {});
        await new Promise((resolve) => setTimeout(resolve, typingDelay));
        options?.onTypingEnd?.();
        ctx.emit('typing:end', {});
      }
    },
  };
}

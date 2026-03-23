import type { ChatPlugin } from '../types/plugin';
import { TimerManager } from './utils/timer';

/**
 * Auto Reply Plugin — sends automated replies when user is inactive
 */
export function autoReplyPlugin(options?: {
  timeout?: number;
  message?: string;
  maxReplies?: number;
  onlyWhenOpen?: boolean;
}): ChatPlugin {
  const timeout = options?.timeout ?? 30000;
  const message = options?.message ?? "Are you still there? Let me know if you need help! 👋";
  const maxReplies = options?.maxReplies ?? 2;
  const timers = new TimerManager();
  let replyCount = 0;
  let active = false;

  return {
    name: 'autoReply',

    onInit(ctx) {
      active = true;
      replyCount = 0;
    },

    onMessage(msg, ctx) {
      // Reset timer on any user message
      if (msg.sender === 'user') {
        replyCount = 0;
        timers.clearTimeout('idle');
        if (active) {
          timers.setTimeout('idle', () => {
            if (replyCount < maxReplies) {
              replyCount++;
              ctx.addBotMessage(message);
            }
          }, timeout);
        }
      }
    },

    onEvent(event, ctx) {
      if (event.type === 'open') {
        active = true;
      } else if (event.type === 'close') {
        active = false;
        timers.clearTimeout('idle');
      }
    },

    onDestroy() {
      timers.destroy();
    },
  };
}

import type { ChatPlugin } from '../types/plugin';
import { TimerManager } from './utils/timer';

interface ScheduledMessage {
  message: string;
  delay: number;
  repeat?: boolean;
  interval?: number;
}

/**
 * Scheduler Plugin — triggers bot messages at scheduled times or intervals
 */
export function schedulerPlugin(options: {
  messages?: ScheduledMessage[];
  onScheduledMessage?: (message: string) => void;
}): ChatPlugin {
  const timers = new TimerManager();

  return {
    name: 'scheduler',

    onInit(ctx) {
      options.messages?.forEach((item, idx) => {
        const id = `sched_${idx}`;

        if (item.repeat && item.interval) {
          // Initial delay then repeat
          timers.setTimeout(`${id}_init`, () => {
            ctx.addBotMessage(item.message);
            options.onScheduledMessage?.(item.message);
            timers.setInterval(id, () => {
              ctx.addBotMessage(item.message);
              options.onScheduledMessage?.(item.message);
            }, item.interval!);
          }, item.delay);
        } else {
          // One-shot
          timers.setTimeout(id, () => {
            ctx.addBotMessage(item.message);
            options.onScheduledMessage?.(item.message);
          }, item.delay);
        }
      });

      // Allow dynamic scheduling
      ctx.on('scheduler:add', (...args: unknown[]) => {
        const msg = args[0] as ScheduledMessage;
        if (msg) {
          const id = `sched_dyn_${Date.now()}`;
          timers.setTimeout(id, () => {
            ctx.addBotMessage(msg.message);
            options.onScheduledMessage?.(msg.message);
          }, msg.delay);
        }
      });
    },

    onDestroy() {
      timers.destroy();
    },
  };
}

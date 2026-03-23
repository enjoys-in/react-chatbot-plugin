import type { ChatPlugin } from '../types/plugin';
import { TimerManager } from './utils/timer';

/**
 * Reminder Plugin — sends reminder messages to users after configured delays
 */
export function reminderPlugin(options?: {
  reminders?: Array<{ message: string; delay: number; condition?: string }>;
  onReminder?: (message: string) => void;
}): ChatPlugin {
  const timers = new TimerManager();

  return {
    name: 'reminder',

    onInit(ctx) {
      // Static reminders
      options?.reminders?.forEach((r, idx) => {
        timers.setTimeout(`reminder_${idx}`, () => {
          ctx.addBotMessage(r.message);
          options?.onReminder?.(r.message);
          ctx.emit('reminder:sent', { message: r.message, idx });
        }, r.delay);
      });

      // Dynamic reminders via events
      ctx.on('reminder:set', (...args: unknown[]) => {
        const config = args[0] as { id: string; message: string; delay: number } | undefined;
        if (config) {
          timers.setTimeout(`reminder_${config.id}`, () => {
            ctx.addBotMessage(config.message);
            options?.onReminder?.(config.message);
            ctx.emit('reminder:sent', config);
          }, config.delay);
        }
      });

      ctx.on('reminder:cancel', (...args: unknown[]) => {
        const id = args[0] as string;
        if (id) timers.clearTimeout(`reminder_${id}`);
      });
    },

    onDestroy() {
      timers.destroy();
    },
  };
}

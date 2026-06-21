// ─── Message Schedule Plugin ─────────────────────────────────────
// Schedule messages to be sent at a specific time.
// Useful for reminders, follow-ups, and delayed responses.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';

export interface ScheduledMessage {
  id: string;
  text: string;
  scheduledAt: number; // Unix timestamp (ms)
  sender?: 'bot' | 'user';
}

export interface MessageSchedulePluginOptions {
  /** Polling interval in ms (default: 1000) */
  checkInterval?: number;
  /** Max scheduled messages (default: 20) */
  maxScheduled?: number;
  /** Persist in localStorage */
  persist?: boolean;
  /** Storage key */
  storageKey?: string;
  /** Callback when a scheduled message fires */
  onFire?: (msg: ScheduledMessage) => void;
}

export function messageSchedulePlugin(options: MessageSchedulePluginOptions = {}): ChatPlugin {
  const interval = options.checkInterval ?? 1000;
  const maxScheduled = options.maxScheduled ?? 20;
  const storageKey = options.storageKey ?? 'chatbot_scheduled';
  let scheduled: ScheduledMessage[] = [];
  let timer: ReturnType<typeof setInterval> | null = null;

  const load = () => {
    if (options.persist !== false) {
      try {
        scheduled = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      } catch { scheduled = []; }
    }
  };

  const save = () => {
    if (options.persist !== false) {
      localStorage.setItem(storageKey, JSON.stringify(scheduled));
    }
  };

  return {
    name: 'messageSchedule',

    onInit(ctx: PluginContext) {
      load();

      timer = setInterval(() => {
        const now = Date.now();
        const due = scheduled.filter((m) => m.scheduledAt <= now);
        if (due.length === 0) return;

        scheduled = scheduled.filter((m) => m.scheduledAt > now);
        save();

        for (const msg of due) {
          if (msg.sender === 'user') {
            ctx.sendMessage(msg.text);
          } else {
            ctx.addBotMessage(msg.text);
          }
          options.onFire?.(msg);
          ctx.emit('schedule:fired', msg);
        }
      }, interval);
    },

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'schedule:add') {
        const payload = event.payload as ScheduledMessage | undefined;
        if (payload?.text && payload?.scheduledAt && scheduled.length < maxScheduled) {
          scheduled.push({
            id: payload.id ?? `sched_${Date.now()}`,
            text: payload.text,
            scheduledAt: payload.scheduledAt,
            sender: payload.sender ?? 'bot',
          });
          save();
          ctx.emit('schedule:added', payload);
        }
      }

      if (event.type === 'schedule:remove' && typeof event.payload === 'string') {
        scheduled = scheduled.filter((m) => m.id !== event.payload);
        save();
        ctx.emit('schedule:updated', [...scheduled]);
      }

      if (event.type === 'schedule:list') {
        ctx.emit('schedule:current', [...scheduled]);
      }

      if (event.type === 'schedule:clear') {
        scheduled = [];
        save();
        ctx.emit('schedule:updated', []);
      }
    },

    onDestroy(_ctx: PluginContext) {
      if (timer) clearInterval(timer);
    },
  };
}

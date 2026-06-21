import type { ChatPlugin } from '../types/plugin';

export interface ProactiveRule {
  /** Trigger type */
  trigger: 'idle' | 'scroll' | 'exitIntent' | 'pageLoad' | 'custom';
  /** Message to show */
  message: string;
  /** Delay in ms before showing (default: 5000) */
  delay?: number;
  /** Max number of times to show (default: 1) */
  maxShows?: number;
  /** Jump to flow step when user clicks */
  flowStep?: string;
}

/**
 * Proactive Plugin — triggers bot messages based on user behavior.
 * Supports: idle, scroll depth, exit intent, page load, custom events.
 */
export function proactivePlugin(options: {
  rules: ProactiveRule[];
  /** Called when a proactive message is triggered */
  onTrigger?: (rule: ProactiveRule) => void;
}): ChatPlugin {
  const showCounts = new Map<number, number>();
  const timers: ReturnType<typeof setTimeout>[] = [];

  return {
    name: 'proactive',

    onInit(ctx) {
      options.rules.forEach((rule, idx) => {
        showCounts.set(idx, 0);
        const maxShows = rule.maxShows ?? 1;
        const delay = rule.delay ?? 5000;

        const fire = () => {
          const count = showCounts.get(idx) ?? 0;
          if (count >= maxShows) return;
          showCounts.set(idx, count + 1);
          options.onTrigger?.(rule);
          ctx.addBotMessage(rule.message);
          if (rule.flowStep) ctx.emit('flow:goto', rule.flowStep);
        };

        if (typeof window === 'undefined') return;

        switch (rule.trigger) {
          case 'pageLoad':
            timers.push(setTimeout(fire, delay));
            break;

          case 'idle': {
            let idleTimer: ReturnType<typeof setTimeout>;
            const resetIdle = () => {
              clearTimeout(idleTimer);
              idleTimer = setTimeout(fire, delay);
            };
            ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach((evt) =>
              document.addEventListener(evt, resetIdle, { passive: true }),
            );
            idleTimer = setTimeout(fire, delay);
            break;
          }

          case 'scroll': {
            const handleScroll = () => {
              const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
              if (scrollPercent >= 50) fire();
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            break;
          }

          case 'exitIntent': {
            const handleMouseLeave = (e: MouseEvent) => {
              if (e.clientY <= 0) fire();
            };
            document.addEventListener('mouseleave', handleMouseLeave);
            break;
          }

          case 'custom':
            // Fired via event bus: emit('proactive:trigger', ruleIndex)
            break;
        }
      });
    },

    onEvent(event, ctx) {
      if (event.type === 'proactive:trigger' && typeof event.payload === 'number') {
        const rule = options.rules[event.payload];
        if (rule) {
          const count = showCounts.get(event.payload) ?? 0;
          if (count < (rule.maxShows ?? 1)) {
            showCounts.set(event.payload, count + 1);
            options.onTrigger?.(rule);
            ctx.addBotMessage(rule.message);
          }
        }
      }
    },

    onDestroy() {
      timers.forEach(clearTimeout);
    },
  };
}

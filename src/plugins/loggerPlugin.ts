import type { ChatPlugin } from '../types/plugin';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

/**
 * Logger Plugin — logs all chatbot events for debugging or auditing
 */
export function loggerPlugin(options?: {
  level?: LogLevel;
  prefix?: string;
  logger?: Pick<Console, 'debug' | 'info' | 'warn' | 'error'>;
}): ChatPlugin {
  const minLevel = LEVELS[options?.level ?? 'debug'];
  const prefix = options?.prefix ?? '[ChatBot]';
  const log = options?.logger ?? console;

  const write = (level: LogLevel, ...args: unknown[]) => {
    if (LEVELS[level] >= minLevel) log[level](prefix, ...args);
  };

  return {
    name: 'logger',

    onInit() {
      write('info', 'Initialized');
    },

    onMessage(message) {
      write('debug', `Message [${message.sender}]:`, message.text ?? '(no text)');
    },

    onSubmit(data) {
      write('info', 'Form submitted:', Object.keys(data));
    },

    onEvent(event) {
      write('debug', `Event [${event.type}]:`, event.payload ?? '');
    },

    onDestroy() {
      write('info', 'Destroyed');
    },
  };
}

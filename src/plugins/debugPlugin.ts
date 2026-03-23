import type { ChatPlugin } from '../types/plugin';

/**
 * Debug Plugin — exposes internal state and flow progression for debugging
 */
export function debugPlugin(options?: {
  logState?: boolean;
  logEvents?: boolean;
  logMessages?: boolean;
  groupName?: string;
}): ChatPlugin {
  const group = options?.groupName ?? '🐛 ChatBot Debug';
  const logState = options?.logState ?? true;
  const logEvents = options?.logEvents ?? true;
  const logMessages = options?.logMessages ?? true;
  let eventLog: Array<{ type: string; payload?: unknown; time: number }> = [];

  return {
    name: 'debug',

    onInit(ctx) {
      console.group(group);
      console.log('Initialized');
      if (logState) {
        console.log('Messages:', ctx.getMessages().length);
        console.log('Data:', ctx.getData());
      }
      console.groupEnd();

      // Expose debug helpers on window for dev console access
      if (typeof window !== 'undefined') {
        (window as unknown as Record<string, unknown>).__chatbotDebug = {
          getMessages: () => ctx.getMessages(),
          getData: () => ctx.getData(),
          getEventLog: () => [...eventLog],
          sendMessage: (text: string) => ctx.sendMessage(text),
          emit: (event: string, ...args: unknown[]) => ctx.emit(event, ...args),
        };
        console.log(`${group}: window.__chatbotDebug available`);
      }
    },

    onMessage(message) {
      if (logMessages) {
        console.log(`${group} [${message.sender}]:`, message.text ?? '(no text)', message);
      }
    },

    onEvent(event) {
      eventLog.push({ type: event.type, payload: event.payload, time: Date.now() });
      if (logEvents) {
        console.log(`${group} Event [${event.type}]:`, event.payload ?? '');
      }
    },

    onDestroy() {
      console.log(`${group}: Destroyed. Total events logged:`, eventLog.length);
      eventLog = [];
      if (typeof window !== 'undefined') {
        delete (window as unknown as Record<string, unknown>).__chatbotDebug;
      }
    },
  };
}

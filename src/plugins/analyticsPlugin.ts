import type { ChatPlugin } from '../types/plugin';

/**
 * Analytics Plugin — tracks sessions, messages, forms, timing, and step progression
 */
export function analyticsPlugin(options?: {
  onTrack?: (event: string, data?: unknown) => void;
  sessionId?: string;
}): ChatPlugin {
  const sessionId = options?.sessionId ?? `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  let messageCount = 0;
  let formSubmissions = 0;
  let startTime = 0;
  const stepTimings: Record<string, number> = {};
  let lastStepTime = 0;

  const track = (event: string, data?: unknown) => {
    options?.onTrack?.(event, { sessionId, ...(data as Record<string, unknown>) });
  };

  return {
    name: 'analytics',

    onInit() {
      messageCount = 0;
      formSubmissions = 0;
      startTime = Date.now();
      lastStepTime = startTime;
      track('chatbot:init', { timestamp: startTime });
    },

    onMessage(message) {
      messageCount++;
      track('chatbot:message', {
        sender: message.sender,
        messageCount,
        elapsed: Date.now() - startTime,
      });
    },

    onSubmit(data) {
      formSubmissions++;
      track('chatbot:submit', {
        formSubmissions,
        fields: Object.keys(data),
        elapsed: Date.now() - startTime,
      });
    },

    onEvent(event) {
      switch (event.type) {
        case 'open':
          track('chatbot:open');
          break;
        case 'close':
          track('chatbot:close', { duration: Date.now() - startTime });
          break;
        case 'stepChange': {
          const now = Date.now();
          const payload = event.payload as { stepId: string } | undefined;
          if (payload?.stepId) {
            stepTimings[payload.stepId] = now - lastStepTime;
            lastStepTime = now;
            track('chatbot:step', { stepId: payload.stepId, stepDuration: stepTimings[payload.stepId] });
          }
          break;
        }
        case 'flowEnd':
          track('chatbot:flowEnd', {
            totalMessages: messageCount,
            totalForms: formSubmissions,
            duration: Date.now() - startTime,
            stepTimings,
          });
          break;
        case 'quickReply':
          track('chatbot:quickReply', event.payload);
          break;
      }
    },

    onDestroy() {
      track('chatbot:destroy', {
        totalMessages: messageCount,
        totalFormSubmissions: formSubmissions,
        sessionDuration: Date.now() - startTime,
        stepTimings,
      });
    },
  };
}

import type { ChatPlugin } from '../types/plugin';

export function analyticsPlugin(options?: {
  onTrack?: (event: string, data?: unknown) => void;
}): ChatPlugin {
  let messageCount = 0;
  let formSubmissions = 0;

  return {
    name: 'analytics',

    onInit(ctx) {
      messageCount = 0;
      formSubmissions = 0;
      options?.onTrack?.('chatbot:init');
    },

    onMessage(message, ctx) {
      messageCount++;
      options?.onTrack?.('chatbot:message', {
        sender: message.sender,
        messageCount,
      });
    },

    onSubmit(data, ctx) {
      formSubmissions++;
      options?.onTrack?.('chatbot:submit', {
        formSubmissions,
        fields: Object.keys(data),
      });
    },

    onDestroy() {
      options?.onTrack?.('chatbot:destroy', {
        totalMessages: messageCount,
        totalFormSubmissions: formSubmissions,
      });
    },
  };
}

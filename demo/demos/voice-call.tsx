import { voiceCallPlugin } from '@enjoys/react-chatbot-plugin';
import type { DemoConfig } from './types';

// Value that the voiceCallPlugin listens for to place a call.
const CALL_TRIGGER = '__voice_call__';

const demo: DemoConfig = {
  id: 'voice-call',
  title: 'Voice Call',
  description:
    'Start a real WebRTC voice call from the chat via the "Call us" quick reply. Powered by @enjoys/voice-widget through voiceCallPlugin.',
  icon: '📞',
  category: 'plugins',
  flow: {
    startStep: 'greeting',
    steps: [
      {
        id: 'greeting',
        message: "Hi! 👋 Need to talk to us? You can chat here or start a voice call anytime.",
        quickReplies: [
          { label: '📞 Call us', value: CALL_TRIGGER },
          { label: '💬 Keep chatting', value: 'chat', next: 'chatting' },
        ],
      },
      {
        id: 'chatting',
        message: "Great — ask away! Tap 📞 Call us whenever you'd like to talk to us by voice.",
        quickReplies: [
          { label: '📞 Call us', value: CALL_TRIGGER },
        ],
      },
    ],
  },
  plugins: [
    voiceCallPlugin({
      accentColor: '#3FCF8E',
      title: 'Talk to Support',
      triggerValue: CALL_TRIGGER,
    }),
  ],
  customizeChat: {
    launcherNotification: {
      config: {
        enabled: true,
        delay: 3000,
        heading: 'Hi there 👋',
        message: 'You can chat with us or start a voice call anytime. How can we help?',
        sender: 'Support',
        timestamp: 'Just now',
        showClose: true,
        openOnClick: true,
      },
    },
  },
};

export default demo;

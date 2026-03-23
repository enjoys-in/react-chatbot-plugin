import { loggerPlugin, persistencePlugin, rateLimitPlugin, validationPlugin, schedulerPlugin } from '@enjoys/react-chatbot-plugin';
import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'plugin-showcase',
  title: 'Plugin Showcase',
  description: '5 plugins working together: logger, persistence, rate limiting, validation, and scheduled messages.',
  icon: '🔌',
  category: 'plugins',
  flow: {
    startStep: 'welcome',
    steps: [
      {
        id: 'welcome',
        messages: [
          'Welcome to the Plugin Showcase! 🔌',
          'This demo has 5 plugins running:',
          '• **Logger** — check the console for debug logs',
          '• **Persistence** — refresh the page and your messages are saved',
          '• **Rate Limit** — send 5+ messages in 30s to see it kick in',
          '• **Validation** — type "badword" to see profanity filtering',
          '• **Scheduler** — a tip message appears after 10 seconds',
        ],
        quickReplies: [
          { label: '📝 Fill a Form', value: 'form', next: 'form_step' },
          { label: '💬 Chat Freely', value: 'chat', next: 'chat_step' },
        ],
      },
      {
        id: 'form_step',
        message: 'Submit your info (data is persisted across reloads):',
        form: {
          id: 'plugin-form',
          title: 'Contact Info',
          fields: [
            { name: 'name', type: 'text', label: 'Name', required: true },
            { name: 'email', type: 'email', label: 'Email', required: true },
          ],
          submitLabel: 'Submit',
        },
        next: 'form_done',
      },
      {
        id: 'form_done',
        messages: [
          'Got it! Your data is saved via the persistence plugin.',
          'Try refreshing the page — your messages will be restored.',
        ],
        quickReplies: [
          { label: '🔄 Start Over', value: 'restart', next: 'welcome' },
        ],
      },
      {
        id: 'chat_step',
        message: 'Type anything! Try sending many messages quickly to trigger rate limiting, or type "badword" to see validation.',
      },
    ],
  },
  greetingResponse: 'Hello! 👋 This demo showcases our plugin system.',
  fallbackMessage: (text) => `Echo: "${text}" — try sending rapidly to test rate limiting!`,
  typingDelay: 300,
  plugins: [
    loggerPlugin({ level: 'debug', prefix: '[PluginDemo]' }),
    persistencePlugin({ storageKey: 'plugin_demo_chat', storage: 'local' }),
    rateLimitPlugin({ limit: 5, window: 30000, warningMessage: '⚠️ Slow down! Max 5 messages per 30 seconds.' }),
    validationPlugin({ profanityList: ['badword', 'spam'], sanitize: true }),
    schedulerPlugin({ messages: [{ delay: 10000, message: '💡 Tip: try typing /help for available commands!' }] }),
  ],
};

export default demo;

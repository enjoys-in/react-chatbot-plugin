import {
  // Core
  analyticsPlugin, webhookPlugin, persistencePlugin, loggerPlugin,
  // Communication
  crmPlugin, emailPlugin, syncPlugin,
  // Intelligence
  aiPlugin, intentPlugin, validationPlugin, markdownPlugin, mediaPlugin, i18nPlugin,
  // UX
  typingPlugin, autoReplyPlugin, soundPlugin, pushPlugin, themePlugin, componentPlugin,
  // Security
  authPlugin, rateLimitPlugin,
  // Agent
  agentPlugin, transferPlugin,
  // Marketing
  leadPlugin, campaignPlugin,
  // Scheduling
  schedulerPlugin, reminderPlugin,
  // File
  uploadPlugin,
  // Dev
  debugPlugin, devtoolsPlugin,
} from '@enjoys/react-chatbot-plugin';
import type { DemoConfig } from './types';

const MOCK_API = 'https://httpbin.org/post';

const demo: DemoConfig = {
  id: 'plugin-showcase',
  title: 'Plugin Showcase',
  description: 'All 30 plugins loaded — logger, persistence, rate limiting, validation, i18n, markdown, debug, and more.',
  icon: '🔌',
  category: 'plugins',
  flow: {
    startStep: 'welcome',
    steps: [
      {
        id: 'welcome',
        messages: [
          'Welcome to the Plugin Showcase! 🔌',
          'All **30 plugins** are loaded and running:',
          '• Check the **console** for logger + debug output',
          '• **Persistence** saves your messages across reloads',
          '• **Rate limit** kicks in after 5 messages in 30s',
          '• Type "badword" to see **validation** filtering',
          '• **Markdown**: **bold**, *italic*, `code` in bot messages',
          '• **i18n**: bot messages use {{t:welcome}} template syntax',
          '• **Scheduler**: a tip appears after 10s',
          '• Press **F2** to open the **devtools** overlay',
        ],
        quickReplies: [
          { label: '📝 Fill a Form', value: 'form', next: 'form_step' },
          { label: '💬 Chat Freely', value: 'chat', next: 'chat_step' },
          { label: '🌍 i18n Demo', value: 'i18n', next: 'i18n_step' },
        ],
      },
      {
        id: 'form_step',
        message: 'Submit your info (data is persisted + sent to lead/CRM plugins):',
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
          'Got it! Your data was captured by **lead**, **CRM**, and **persistence** plugins.',
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
      {
        id: 'i18n_step',
        messages: [
          '{{t:welcome}}',
          '{{t:help}}',
          'Switch locale by emitting `i18n:setLocale` event.',
        ],
        quickReplies: [
          { label: '◀ Back', value: 'back', next: 'welcome' },
        ],
      },
    ],
  },
  greetingResponse: 'Hello! 👋 This demo showcases all 30 plugins.',
  fallbackMessage: (text) => `Echo: "${text}" — try sending rapidly to test rate limiting!`,
  typingDelay: 300,
  plugins: [
    // ─── Core ────────────────────────────────────
    analyticsPlugin({ onTrack: (event, data) => console.log('[Analytics]', event, data) }),
    webhookPlugin({ url: MOCK_API, events: ['submit', 'flowEnd'] }),
    persistencePlugin({ storageKey: 'plugin_demo_chat', storage: 'local' }),
    loggerPlugin({ level: 'debug', prefix: '[PluginDemo]' }),

    // ─── Communication ───────────────────────────
    crmPlugin({ endpoint: MOCK_API }),
    emailPlugin({ endpoint: MOCK_API, triggers: ['submit'] }),
    syncPlugin({ endpoint: MOCK_API, syncInterval: 0 }),

    // ─── Intelligence ────────────────────────────
    aiPlugin({ provider: 'custom', endpoint: MOCK_API }),
    intentPlugin({
      rules: [
        { intent: 'greeting', patterns: ['hello', 'hi', 'hey'], matchType: 'contains' },
        { intent: 'help', patterns: ['help', 'support'], matchType: 'contains' },
      ],
      onIntentDetected: (intent, text) => console.log('[Intent]', intent, text),
    }),
    validationPlugin({ profanityList: ['badword', 'spam'], sanitize: true, blockProfanity: true }),
    markdownPlugin(),
    mediaPlugin(),
    i18nPlugin({
      defaultLocale: 'en',
      translations: {
        en: { welcome: 'Welcome to the i18n demo!', help: 'Type /help for commands.' },
        es: { welcome: '¡Bienvenido a la demo i18n!', help: 'Escribe /help para comandos.' },
      },
    }),

    // ─── UX ──────────────────────────────────────
    typingPlugin({ delay: 400 }),
    autoReplyPlugin({ timeout: 60000, message: 'Still there? Let me know if you need help!', maxReplies: 1 }),
    soundPlugin({ volume: 0.3, onlyWhenHidden: true }),
    pushPlugin({ title: 'ChatBot Demo', onlyWhenHidden: true }),
    themePlugin({ defaultMode: 'dark' }),
    componentPlugin(),

    // ─── Security ────────────────────────────────
    authPlugin({ type: 'session', tokenKey: 'demo_token', storage: 'session' }),
    rateLimitPlugin({ limit: 5, window: 30000, warningMessage: '⚠️ Slow down! Max 5 messages per 30 seconds.' }),

    // ─── Agent ───────────────────────────────────
    agentPlugin({ connectMessage: 'Connecting to agent...', disconnectMessage: 'Agent disconnected.' }),
    transferPlugin({ endpoint: MOCK_API, departments: ['sales', 'support'] }),

    // ─── Marketing ───────────────────────────────
    leadPlugin({ endpoint: MOCK_API, fields: ['name', 'email'] }),
    campaignPlugin({ campaigns: [{ trigger: 'idle', delay: 45000, message: '💡 Need help? Just ask!' }] }),

    // ─── Scheduling ──────────────────────────────
    schedulerPlugin({ messages: [{ delay: 10000, message: '💡 Tip: try typing /help for available commands!' }] }),
    reminderPlugin({ reminders: [{ message: 'Don\'t forget to check the console for debug output!', delay: 30000 }] }),

    // ─── File ────────────────────────────────────
    uploadPlugin({ endpoint: MOCK_API, maxSize: 5 * 1024 * 1024, allowedTypes: ['image/*', '.pdf'] }),

    // ─── Dev ─────────────────────────────────────
    debugPlugin({ logState: true, logEvents: true, logMessages: true }),
    devtoolsPlugin({ shortcutKey: 'F2', position: 'bottom-right' }),
  ],
};

export default demo;

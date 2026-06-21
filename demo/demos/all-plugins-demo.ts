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
  id: 'all-plugins-demo',
  title: 'All 31 Plugins Demo',
  description: 'The ultimate kitchen-sink demo — all 31 plugins active with full interactive flow, forms, validation, markdown, i18n, scheduling, rate-limiting, and more.',
  icon: '🏆',
  category: 'plugins',
  markdown: true,
  enableEmoji: true,
  fileUpload: { enabled: true, accept: 'image/*,.pdf,.doc,.txt', multiple: true, maxSize: 5 * 1024 * 1024, maxFiles: 3 },
  typingDelay: 400,
  greetingResponse: '👋 Hello! Welcome back! Try exploring the menu below.',
  fallbackMessage: (text) => {
    if (/help|support/i.test(text)) return '🆘 **Help Topics:**\n• Type "pricing" for plans\n• Type "contact" to reach us\n• Submit the form for lead capture';
    if (/pricing|plans?/i.test(text)) return '💰 **Pricing:**\n• **Free** — 100 msgs/month\n• **Pro** — $19/mo unlimited\n• **Enterprise** — Custom pricing\n\nVisit [our site](https://example.com) for details.';
    if (/contact/i.test(text)) return '📧 Email us at **hello@example.com** or type `/transfer sales` to talk to an agent.';
    return `🤖 Echo: "${text}"\n\n_Try sending 5+ messages quickly to trigger rate limiting!_`;
  },
  keywords: [
    { patterns: ['pricing', 'price', 'cost', 'plans'], response: '💰 **Our Plans:**\n\n• **Free** — 100 messages/month\n• **Pro** — $19/mo (unlimited)\n• **Enterprise** — Custom pricing\n\n~~Hidden fees~~ — none!' },
    { patterns: ['features', 'what can you do'], response: '⚡ **Features active right now:**\n\n- `analyticsPlugin` — tracking events\n- `persistencePlugin` — saving chat history\n- `rateLimitPlugin` — 5 msgs / 30s limit\n- `validationPlugin` — blocks profanity\n- `markdownPlugin` — renders **bold**, *italic*, `code`\n- `i18nPlugin` — multi-language support\n- `schedulerPlugin` — timed messages\n- ...and **25 more plugins**!' },
    { patterns: ['badword', 'spam', 'profanity'], response: '🚫 That message was blocked by the **validation plugin**!' },
  ],
  flow: {
    startStep: 'welcome',
    steps: [
      {
        id: 'welcome',
        messages: [
          '# 🏆 All 31 Plugins — Kitchen Sink Demo\n\nWelcome! This demo runs **every single plugin** simultaneously.',
          '**Active right now:**\n\n• 📊 Analytics & Logger — check console\n• 💾 Persistence — survives page reload\n• ⚡ Rate Limit — 5 msgs per 30s\n• 🛡️ Validation — blocks "badword"\n• 📝 Markdown — renders **bold**, *italic*, ~~strike~~, `code`\n• 🌍 i18n — multi-language\n• ⏰ Scheduler — tip in 10s, reminder in 30s\n• 🔔 Sound & Push — when tab hidden\n• 🎨 Theme — dark mode auto\n• 🐛 Debug — press **F2** for devtools\n• ...and more!',
        ],
        quickReplies: [
          { label: '📝 Fill a Form', value: 'form', next: 'lead_form' },
          { label: '📂 Upload Files', value: 'upload', next: 'upload_step' },
          { label: '🌍 i18n Demo', value: 'i18n', next: 'i18n_step' },
          { label: '💰 See Pricing', value: 'pricing', next: 'pricing_step' },
          { label: '⚡ Test Rate Limit', value: 'rate', next: 'rate_step' },
          { label: '🛡️ Test Validation', value: 'validate', next: 'validate_step' },
        ],
      },

      // ─── Lead Form ─────────────────────────────
      {
        id: 'lead_form',
        message: '📝 Submit your contact info below.\n\nThis data flows through:\n- `leadPlugin` → captures lead\n- `crmPlugin` → syncs to CRM\n- `emailPlugin` → sends notification\n- `webhookPlugin` → POSTs to endpoint\n- `persistencePlugin` → saved locally',
        form: {
          id: 'lead-capture',
          title: 'Contact Information',
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe' },
            { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'john@example.com' },
            { name: 'company', type: 'text', label: 'Company', placeholder: 'Acme Inc.' },
            { name: 'plan', type: 'select', label: 'Interested In', options: [{ label: 'Free', value: 'free' }, { label: 'Pro', value: 'pro' }, { label: 'Enterprise', value: 'enterprise' }] },
            { name: 'message', type: 'textarea', label: 'Message', placeholder: 'Tell us about your needs...' },
          ],
          submitLabel: '🚀 Submit',
        },
        next: 'form_success',
      },
      {
        id: 'form_success',
        messages: [
          '✅ **Submitted!** Here\'s what happened behind the scenes:\n\n1. `leadPlugin` → captured your info\n2. `crmPlugin` → synced to CRM endpoint\n3. `emailPlugin` → triggered email notification\n4. `webhookPlugin` → sent POST request\n5. `analyticsPlugin` → tracked "submit" event\n6. `persistencePlugin` → saved to localStorage\n\nCheck the **browser console** for detailed logs!',
        ],
        quickReplies: [
          { label: '◀ Main Menu', value: 'back', next: 'welcome' },
          { label: '📂 Upload Files', value: 'upload', next: 'upload_step' },
        ],
      },

      // ─── File Upload ───────────────────────────
      {
        id: 'upload_step',
        messages: [
          '📂 **File Upload Demo**\n\nClick the 📎 attachment icon in the input bar to upload files.\n\n**Active plugins:**\n- `uploadPlugin` — handles upload to endpoint\n- `validationPlugin` — checks file types\n- `mediaPlugin` — renders image/video previews\n\n*Allowed:* images, PDF, DOC, TXT (max 5MB, up to 3 files)',
        ],
        quickReplies: [
          { label: '◀ Main Menu', value: 'back', next: 'welcome' },
        ],
      },

      // ─── i18n ──────────────────────────────────
      {
        id: 'i18n_step',
        messages: [
          '🌍 **Internationalization (i18n) Demo**\n\nThe `i18nPlugin` supports multiple locales:\n\n**English:** Welcome to our chatbot!\n**Spanish:** ¡Bienvenido a nuestro chatbot!\n**French:** Bienvenue sur notre chatbot!\n\nTemplate syntax: `{{t:key}}` in messages is replaced with locale-specific text.',
          '**Current translations loaded:**\n- `welcome` → "Welcome to our chatbot!"\n- `help` → "Type /help for available commands"\n- `goodbye` → "Thanks for chatting!"',
        ],
        quickReplies: [
          { label: '🇪🇸 Spanish', value: 'es', next: 'i18n_es' },
          { label: '🇫🇷 French', value: 'fr', next: 'i18n_fr' },
          { label: '◀ Main Menu', value: 'back', next: 'welcome' },
        ],
      },
      {
        id: 'i18n_es',
        message: '🇪🇸 **Español:**\n\n- ¡Bienvenido a nuestro chatbot!\n- Escribe /ayuda para comandos disponibles\n- ¡Gracias por chatear!',
        quickReplies: [
          { label: '🇫🇷 French', value: 'fr', next: 'i18n_fr' },
          { label: '◀ Main Menu', value: 'back', next: 'welcome' },
        ],
      },
      {
        id: 'i18n_fr',
        message: '🇫🇷 **Français:**\n\n- Bienvenue sur notre chatbot!\n- Tapez /aide pour les commandes disponibles\n- Merci d\'avoir discuté!',
        quickReplies: [
          { label: '🇪🇸 Spanish', value: 'es', next: 'i18n_es' },
          { label: '◀ Main Menu', value: 'back', next: 'welcome' },
        ],
      },

      // ─── Pricing (markdown showcase) ───────────
      {
        id: 'pricing_step',
        messages: [
          '## 💰 Pricing Plans\n\nChoose the plan that fits your needs:\n\n• **Free** — 100 messages/month\n  - Basic analytics\n  - Community support\n  - ~~Custom branding~~\n\n• **Pro** — $19/month\n  - *Unlimited* messages\n  - Priority support\n  - Custom branding\n  - `API access`\n\n• **Enterprise** — Custom pricing\n  - **Everything** in Pro\n  - Dedicated account manager\n  - SLA guarantee\n  - SSO/SAML integration\n\n---\n\nGet started: [Sign up free](https://example.com/signup)',
        ],
        quickReplies: [
          { label: '📝 Contact Sales', value: 'contact', next: 'lead_form' },
          { label: '◀ Main Menu', value: 'back', next: 'welcome' },
        ],
      },

      // ─── Rate Limit ────────────────────────────
      {
        id: 'rate_step',
        messages: [
          '⚡ **Rate Limit Test**\n\nThe `rateLimitPlugin` is configured:\n- **Limit:** 5 messages per 30 seconds\n- **Warning:** Shows ⚠️ message when exceeded\n\n**Try it:** Send 5+ messages quickly in the free chat below!\n\n_Your remaining quota resets every 30 seconds._',
        ],
        quickReplies: [
          { label: '💬 Start Chatting', value: 'chat', next: 'chat_free' },
          { label: '◀ Main Menu', value: 'back', next: 'welcome' },
        ],
      },

      // ─── Validation ────────────────────────────
      {
        id: 'validate_step',
        messages: [
          '🛡️ **Validation Plugin Demo**\n\nThe `validationPlugin` is configured to:\n\n- ✅ **Sanitize** input (strip HTML)\n- 🚫 **Block profanity** — try typing "badword" or "spam"\n- 📏 **Custom validators** can check format\n\nType something with the word "badword" to see it blocked!',
        ],
        quickReplies: [
          { label: '💬 Try It', value: 'try', next: 'chat_free' },
          { label: '◀ Main Menu', value: 'back', next: 'welcome' },
        ],
      },

      // ─── Free Chat (no flow) ───────────────────
      {
        id: 'chat_free',
        message: '💬 **Free Chat Mode**\n\nThe flow has ended — now every message you send goes through:\n\n- `rateLimitPlugin` — rate limiting\n- `validationPlugin` — content filtering\n- `intentPlugin` — detects "hello", "help"\n- `analyticsPlugin` — event tracking\n- `loggerPlugin` — console output\n\nType anything! Try:\n- "hello" or "hi" → intent detection\n- "pricing" → keyword match\n- "features" → see plugin list\n- "badword" → validation block\n- Rapid fire 5+ msgs → rate limit',
      },
    ],
  },
  plugins: [
    // ─── Core ────────────────────────────────────
    analyticsPlugin({
      onTrack: (event, data) => console.log(`%c[Analytics] ${event}`, 'color: #6C5CE7; font-weight: bold', data),
    }),
    loggerPlugin({ level: 'debug', prefix: '[AllPlugins]' }),
    webhookPlugin({ url: MOCK_API, events: ['submit', 'flowEnd', 'login'] }),
    persistencePlugin({ storageKey: 'all_plugins_demo', storage: 'local', maxMessages: 50 }),

    // ─── Communication ───────────────────────────
    crmPlugin({ endpoint: MOCK_API, provider: 'demo' }),
    emailPlugin({ endpoint: MOCK_API, triggers: ['submit', 'flowEnd'] }),
    syncPlugin({ endpoint: MOCK_API, syncInterval: 0 }),

    // ─── Intelligence ────────────────────────────
    aiPlugin({ provider: 'custom', endpoint: MOCK_API, shouldRespond: () => false }),
    intentPlugin({
      rules: [
        { intent: 'greeting', patterns: ['hello', 'hi', 'hey', 'good morning'], matchType: 'contains' },
        { intent: 'help', patterns: ['help', 'support', 'assist'], matchType: 'contains' },
        { intent: 'bye', patterns: ['bye', 'goodbye', 'see you'], matchType: 'contains' },
      ],
      onIntentDetected: (intent, text) => console.log(`%c[Intent] "${intent}" detected in: "${text}"`, 'color: #00B894'),
    }),
    validationPlugin({
      sanitize: true,
      blockProfanity: true,
      profanityList: ['badword', 'spam', 'profanity', 'offensive'],
      onValidationFail: (_text, error) => console.warn('[Validation]', error),
    }),
    markdownPlugin(),
    mediaPlugin({ allowedTypes: ['image', 'video', 'audio', 'card'] }),
    i18nPlugin({
      defaultLocale: 'en',
      translations: {
        en: { welcome: 'Welcome to our chatbot!', help: 'Type /help for available commands.', goodbye: 'Thanks for chatting!' },
        es: { welcome: '¡Bienvenido a nuestro chatbot!', help: 'Escribe /ayuda para comandos.', goodbye: '¡Gracias por chatear!' },
        fr: { welcome: 'Bienvenue sur notre chatbot!', help: 'Tapez /aide pour les commandes.', goodbye: 'Merci d\'avoir discuté!' },
      },
    }),

    // ─── UX ──────────────────────────────────────
    typingPlugin({ delay: 400 }),
    autoReplyPlugin({ timeout: 45000, message: '👋 Still there? Let me know if you need help!', maxReplies: 2 }),
    soundPlugin({ volume: 0.2, onlyWhenHidden: true }),
    pushPlugin({ title: 'All Plugins Demo', icon: '🏆', onlyWhenHidden: true }),
    themePlugin({ defaultMode: 'dark', storageKey: 'all_plugins_theme' }),
    componentPlugin(),

    // ─── Security ────────────────────────────────
    authPlugin({ type: 'session', tokenKey: 'all_plugins_token', storage: 'session' }),
    rateLimitPlugin({ limit: 5, window: 30000, warningMessage: '⚠️ **Rate limited!** Max 5 messages per 30 seconds. Please wait...' }),

    // ─── Agent & Transfer ────────────────────────
    agentPlugin({ connectMessage: '🔗 Connecting to a live agent...', disconnectMessage: '📴 Agent has disconnected.' }),
    transferPlugin({ endpoint: MOCK_API, departments: ['sales', 'support', 'billing'], transferMessage: '🔄 Transferring you now...' }),

    // ─── Marketing ───────────────────────────────
    leadPlugin({ endpoint: MOCK_API, fields: ['name', 'email', 'company', 'plan'] }),
    campaignPlugin({
      campaigns: [
        { trigger: 'idle', delay: 60000, message: '💡 **Pro tip:** Check out our pricing plans!', maxShows: 1 },
      ],
    }),

    // ─── Scheduling ──────────────────────────────
    schedulerPlugin({
      messages: [
        { delay: 10000, message: '💡 **Tip:** Type "features" to see all active plugins!' },
        { delay: 25000, message: '⏰ **Did you know?** This chat persists across page reloads thanks to `persistencePlugin`.' },
      ],
    }),
    reminderPlugin({
      reminders: [
        { message: '🐛 **Reminder:** Press **F2** to open the devtools overlay!', delay: 30000 },
      ],
    }),

    // ─── File ────────────────────────────────────
    uploadPlugin({
      endpoint: MOCK_API,
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ['image/*', '.pdf', '.doc', '.txt'],
      onUploadComplete: (file) => console.log(`%c[Upload] ✓ ${file.name}`, 'color: #00B894', file.url),
    }),

    // ─── Dev ─────────────────────────────────────
    debugPlugin({ logState: true, logEvents: true, logMessages: true, groupName: 'AllPluginsDebug' }),
    devtoolsPlugin({ shortcutKey: 'F2', position: 'bottom-right' }),
  ],
};

export default demo;

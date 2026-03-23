# Plugins

Extend the chatbot with 30 built-in plugins — analytics, AI, webhooks, persistence, i18n, and more.

## Quick Start

```tsx
import { ChatBot, analyticsPlugin, persistencePlugin } from '@enjoys/react-chatbot-plugin';

<ChatBot
  flow={flow}
  plugins={[
    analyticsPlugin({ onTrack: (event, data) => console.log(event, data) }),
    persistencePlugin({ storageKey: 'chat' }),
  ]}
/>
```

---

## Plugin Categories

| Category | Plugins |
|----------|---------|
| **Core** | analyticsPlugin, webhookPlugin, persistencePlugin, loggerPlugin |
| **Communication** | crmPlugin, emailPlugin, syncPlugin |
| **Intelligence** | aiPlugin, intentPlugin, validationPlugin, markdownPlugin, mediaPlugin, i18nPlugin |
| **UX** | typingPlugin, autoReplyPlugin, soundPlugin, pushPlugin, themePlugin, componentPlugin |
| **Security** | authPlugin, rateLimitPlugin |
| **Agent** | agentPlugin, transferPlugin |
| **Marketing** | leadPlugin, campaignPlugin |
| **Scheduling** | schedulerPlugin, reminderPlugin |
| **File** | uploadPlugin |
| **Dev** | debugPlugin, devtoolsPlugin |

---

## Core Plugins

### analyticsPlugin

Track all chat events with session analytics.

```tsx
analyticsPlugin({
  onTrack: (event, data) => {
    // event: 'open' | 'close' | 'message' | 'submit' | 'stepChange' | 'flowEnd' | 'quickReply'
    console.log(event, data);
  },
})
```

### webhookPlugin

Send events to a server endpoint.

```tsx
webhookPlugin({
  url: '/api/chatbot-webhook',
  events: ['message', 'submit', 'open', 'close', 'flowEnd', 'stepChange', 'quickReply', 'login'],
  headers: { Authorization: 'Bearer xxx' },
})
```

### persistencePlugin

Save and restore chat state across page loads.

```tsx
persistencePlugin({
  storageKey: 'my_chat',
  storage: 'local',     // 'local' | 'session'
  maxMessages: 100,
  ttl: 86400000,         // 24 hours in ms (0 = no expiry)
})
```

### loggerPlugin

Configurable console logging for debugging.

```tsx
loggerPlugin({
  level: 'debug',        // 'debug' | 'info' | 'warn' | 'error'
  prefix: '[ChatBot]',
  logger: console,       // custom logger (optional)
})
```

---

## Communication Plugins

### crmPlugin

Push form/message data to a CRM endpoint.

```tsx
crmPlugin({
  endpoint: 'https://api.crm.com/leads',
  headers: { 'X-API-Key': 'xxx' },
  mapFields: (data) => ({ fullName: data.name, emailAddress: data.email }),
  events: ['submit', 'flowEnd'],
})
```

### emailPlugin

Trigger emails via API on configurable events.

```tsx
emailPlugin({
  endpoint: 'https://api.example.com/send-email',
  headers: { Authorization: 'Bearer xxx' },
  triggers: ['submit', 'flowEnd'],
  template: 'contact-form',
})
```

### syncPlugin

Bidirectional sync with a backend endpoint.

```tsx
syncPlugin({
  endpoint: 'https://api.example.com/chat-sync',
  headers: { Authorization: 'Bearer xxx' },
  syncInterval: 30000,   // periodic push every 30s (0 = disabled)
  sessionKey: 'user_123',
})
```

---

## Intelligence Plugins

### aiPlugin

AI-powered responses via OpenAI, Anthropic, or custom endpoints.

```tsx
aiPlugin({
  provider: 'openai',   // 'openai' | 'anthropic' | 'custom'
  apiKey: 'sk-...',
  model: 'gpt-4',
  systemPrompt: 'You are a helpful assistant.',
  endpoint: 'https://custom-ai.example.com/chat', // for 'custom' provider
  timeout: 30000,
})
```

### intentPlugin

Rule-based intent detection with pattern matching.

```tsx
intentPlugin({
  rules: [
    { intent: 'greeting', patterns: ['hello', 'hi', 'hey'], matchType: 'contains' },
    { intent: 'pricing', patterns: ['price', 'pricing', 'cost'], matchType: 'contains' },
    { intent: 'bye', patterns: ['goodbye', 'bye'], matchType: 'exact' },
  ],
  fallbackIntent: 'unknown',
  onIntentDetected: (intent, text, ctx) => console.log('Intent:', intent),
})
```

### validationPlugin

Profanity filter, HTML sanitizer, and custom validators.

```tsx
validationPlugin({
  profanityList: ['badword1', 'badword2'],
  sanitize: true,
  blockProfanity: true,
  validators: {
    maxLength: (text) => text.length > 500 ? 'Message too long (max 500 chars)' : null,
  },
  onValidationFail: (text, error) => console.log('Blocked:', error),
})
```

### markdownPlugin

Lightweight markdown-to-HTML conversion for bot messages.

```tsx
markdownPlugin()
// Supports: **bold**, *italic*, `code`, [links](url), - lists
```

### mediaPlugin

Process rich media tags in bot messages.

```tsx
mediaPlugin()
// Use in bot messages: [image:url], [video:url], [audio:url]
```

### i18nPlugin

Multi-language support with template syntax.

```tsx
i18nPlugin({
  defaultLocale: 'en',
  translations: {
    en: { welcome: 'Welcome!', help: 'How can I help?' },
    es: { welcome: '¡Bienvenido!', help: '¿Cómo puedo ayudar?' },
  },
  persist: true,
})
// Use in bot messages: {{t:welcome}}
```

---

## UX Plugins

### typingPlugin

Configurable typing delay for realistic bot messages.

```tsx
typingPlugin({
  delay: 1500,           // ms before bot message appears
  onTypingStart: () => {},
  onTypingEnd: () => {},
})
```

### autoReplyPlugin

Send a message when user goes idle.

```tsx
autoReplyPlugin({
  timeout: 30000,         // 30s of inactivity
  message: 'Are you still there? Let me know if you need help!',
  maxReplies: 1,
  onlyWhenOpen: true,
})
```

### soundPlugin

Audio alerts for bot messages.

```tsx
soundPlugin({
  src: '/notification.mp3',
  volume: 0.5,
  onlyWhenHidden: true,  // only play when tab is not visible
})
```

### pushPlugin

Browser push notifications for bot messages.

```tsx
pushPlugin({
  title: 'New Message',
  icon: '/chat-icon.png',
  onlyWhenHidden: true,  // only notify when tab is not visible
})
```

### themePlugin

Dynamic theme switching with persistence.

```tsx
themePlugin({
  defaultMode: 'light',  // 'light' | 'dark'
  storageKey: 'chatbot_theme',
  onThemeChange: (mode, ctx) => console.log('Theme:', mode),
})
```

### componentPlugin

Programmatic component injection via events.

```tsx
componentPlugin({
  components: { banner: 'BannerWidget' },
  onRender: (componentKey, ctx) => console.log('Rendering:', componentKey),
})
```

---

## Security Plugins

### authPlugin

JWT/session token auth with expiry detection.

```tsx
authPlugin({
  type: 'jwt',
  tokenKey: 'chat_token',
  storage: 'local',
  validateToken: (token) => !!token,
  onAuthExpired: (ctx) => console.log('Token expired'),
})
```

### rateLimitPlugin

Sliding window rate limiting.

```tsx
rateLimitPlugin({
  limit: 10,
  window: 60000,           // 10 messages per minute
  warningMessage: 'Slow down! Too many messages.',
  onLimited: (remaining) => console.log('Rate limited, retry in', remaining),
})
```

---

## Agent Plugins

### agentPlugin

WebSocket-based live agent handoff.

```tsx
agentPlugin({
  socketUrl: 'wss://agents.example.com/chat',
  connectMessage: 'Connecting you to a live agent...',
  disconnectMessage: 'Agent has disconnected.',
  onAgentConnect: (ctx) => console.log('Connected to agent'),
  onAgentDisconnect: (ctx) => console.log('Agent disconnected'),
})
```

### transferPlugin

Department-based transfer via API.

```tsx
transferPlugin({
  endpoint: 'https://api.example.com/transfer',
  departments: ['sales', 'support', 'billing'],
  headers: { Authorization: 'Bearer xxx' },
  transferMessage: 'Transferring you now...',
})
```

---

## Marketing Plugins

### leadPlugin

Capture lead data from forms and flows.

```tsx
leadPlugin({
  endpoint: 'https://api.example.com/leads',
  headers: { 'X-API-Key': 'xxx' },
  fields: ['name', 'email', 'phone'],
  events: ['submit', 'flowEnd'],
})
```

### campaignPlugin

Behavioral triggers for marketing campaigns.

```tsx
campaignPlugin({
  campaigns: [
    { type: 'idle', delay: 15000, message: "Don't miss our special offer!" },
    { type: 'pageLoad', delay: 5000, message: 'Welcome! Need help?' },
  ],
})
```

---

## Scheduling Plugins

### schedulerPlugin

Timed or recurring bot messages.

```tsx
schedulerPlugin({
  messages: [
    { delay: 5000, message: 'Quick tip: try typing /help!' },
    { delay: 60000, message: 'Remember, I am here to help!', repeat: true, interval: 60000 },
  ],
})
```

### reminderPlugin

Delayed reminder messages with dynamic scheduling.

```tsx
reminderPlugin({
  reminders: [
    { delay: 300000, message: 'Don\'t forget to complete your form!' },
  ],
})
// Dynamic: ctx.emit('schedule-reminder', { delay: 60000, message: 'Follow up!' })
```

---

## File Plugin

### uploadPlugin

File upload to external storage with validation.

```tsx
uploadPlugin({
  endpoint: 'https://api.example.com/upload',
  headers: { Authorization: 'Bearer xxx' },
  maxSize: 5 * 1024 * 1024,  // 5 MB
  allowedTypes: ['image/png', 'image/jpeg', 'application/pdf'],
  onUpload: (result) => console.log('Uploaded:', result),
})
```

---

## Dev Plugins

### debugPlugin

Exposes chatbot state on `window.__chatbotDebug`.

```tsx
debugPlugin({
  logState: true,
  logEvents: true,
  logMessages: true,
  groupName: 'ChatBot',
})
```

### devtoolsPlugin

Visual overlay panel toggled by keyboard shortcut.

```tsx
devtoolsPlugin({
  position: 'bottom-right',
  shortcutKey: 'F2',
})
```

---

## Custom Plugin

Create your own plugin using the `ChatPlugin` interface:

```ts
import type { ChatPlugin } from '@enjoys/react-chatbot-plugin';

const myPlugin: ChatPlugin = {
  name: 'my-plugin',
  onInit(ctx) {
    console.log('Chat initialized');
  },
  onMessage(message, ctx) {
    console.log('New message:', message);
    // Return a modified message to transform it
    return { ...message, text: message.text + ' ✨' };
  },
  onSubmit(data, ctx) {
    console.log('Form submitted:', data);
  },
  onEvent(event, ctx) {
    // Receive lifecycle events: open, close, stepChange, flowEnd, quickReply, login
    console.log(event.type, event.payload);
  },
  onDestroy(ctx) {
    console.log('Chat destroyed');
  },
};
```

## Plugin Context

Methods available in the plugin context (`PluginContext`):

| Method | Description |
|--------|-------------|
| `sendMessage(text)` | Send a user message |
| `addBotMessage(text)` | Add a bot message |
| `getMessages()` | Get all messages |
| `getData()` | Get collected data |
| `setData(key, value)` | Set a data value |
| `on(event, handler)` | Subscribe to events |
| `emit(event, ...args)` | Emit custom events |

## Plugin Lifecycle

| Hook | When Called |
|------|------------|
| `onInit` | Chat component mounts |
| `onMessage` | Any message is added (user, bot, quick reply, form) |
| `onSubmit` | Form is submitted or login |
| `onEvent` | Lifecycle events (open, close, stepChange, flowEnd, quickReply, login) |
| `onDestroy` | Chat component unmounts |

## Multiple Plugins

Combine plugins — they all run independently:

```tsx
<ChatBot
  plugins={[
    analyticsPlugin({ onTrack: console.log }),
    webhookPlugin({ url: '/api/webhook', events: ['submit'] }),
    persistencePlugin({ storageKey: 'chat' }),
    loggerPlugin({ level: 'info' }),
    rateLimitPlugin({ limit: 10, window: 60000 }),
    i18nPlugin({ defaultLocale: 'en', translations: { en: { welcome: 'Hi!' } } }),
  ]}
/>
```

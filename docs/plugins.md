# Plugins

Extend the chatbot with 53 built-in plugins — analytics, AI, webhooks, persistence, i18n, and more.

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
| **Agent** | agentPlugin, transferPlugin, liveAgentPlugin, whisperPlugin |
| **Marketing** | leadPlugin, campaignPlugin |
| **Scheduling** | schedulerPlugin, reminderPlugin, messageSchedulePlugin |
| **File** | uploadPlugin |
| **Dev** | debugPlugin, devtoolsPlugin |
| **Conversation** | tagsPlugin, ratingPlugin, offlinePlugin, proactivePlugin, personaPlugin, pinPlugin, priorityPlugin |
| **Content** | summaryPlugin, knowledgeBasePlugin, translationPlugin, transcriptExportPlugin, codeHighlightPlugin |
| **Interactive** | pollPlugin, paymentPlugin, bookingPlugin, locationPlugin |
| **Engagement** | confettiPlugin, notificationBadgePlugin, themeTogglePlugin |
| **Voice** | voiceCallPlugin |

**53 plugins** in total. Every one is a plain function returning a `ChatPlugin`,
so you can read any of them in `src/plugins/` as a template for your own.

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
  mask: '@#$%',        // replacement (default)
  maskScope: 'word',   // 'word' (default) or 'message'
  validators: {
    maxLength: (text) => text.length > 500 ? 'Message too long (max 500 chars)' : null,
  },
  onValidationFail: (text, error) => console.log('Blocked:', error),
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `profanityList` | `string[]` | `[]` | Words to match, case-insensitively, as literal substrings |
| `blockProfanity` | `boolean` | `false` | Enable the profanity filter |
| `mask` | `string` | `'@#$%'` | Replacement for a matched word |
| `maskScope` | `'word' \| 'message'` | `'word'` | Mask matched words, or the entire message |
| `sanitize` | `boolean` | `true` | Escape HTML in user text |
| `validators` | `Record<string, (text) => string \| null>` | `{}` | Custom rules; return an error string to fail |

Matched words are replaced in place, so the message still reads as something
the visitor said:

```
you are a badword honestly   →   you are a @#$% honestly
```

The masked message is rendered **without markdown**, so an asterisk mask such
as `'****'` displays as asterisks instead of being parsed as a horizontal rule.
Masked messages carry `metadata.masked === true` if you need to style or filter
them.

### markdownPlugin

Renders markdown in bot messages, as real React elements.

```tsx
markdownPlugin({
  enableBold: true,
  enableItalic: true,
  enableCode: true,
  enableLinks: true,
  enableLists: true,
  enableStrikethrough: true,
  enableHeadings: true,
})
// **bold**  *italic*  `code`  ```block```  [links](url)
// - lists   ~~strike~~   # headings   *** rules
```

The plugin does not modify `message.text` — it flags the message so the bubble
renders it with the built-in markdown-to-JSX renderer. Plugins running after it
still see the original markdown.

Equivalent to the [`markdown` prop](./theming.md), but scoped to bot messages.
The prop wins where both are set, so don't pass `markdown` **and** expect the
plugin's per-option config to apply.

> `enableLineBreaks` is deprecated and ignored — line breaks are always kept.

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

### liveAgentPlugin

Plugin form of the [`liveAgent` prop](./live-agent.md) — use it when you'd
rather configure the handoff alongside your other plugins. Takes the same
`LiveAgentConfig` (adapter, events, queue and typing wiring).

```ts
import { io } from 'socket.io-client';

liveAgentPlugin({ socket: io('https://support.example.com') })
```

---

### whisperPlugin

Supervisor notes attached to a conversation that only agents see — the visitor
never receives them.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `visibleTo` | `string` | `'agent'` | Role allowed to see whispers |
| `viewerRole` | `'agent' \| 'supervisor' \| 'user'` | — | Who is viewing right now |
| `onWhisper` | `(message: ChatMessage) => void` | — | Fires when a whisper is sent |
| `webhookUrl` | `string` | — | Forward whispers to your backend |

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

### messageSchedulePlugin

Queues messages to fire at a future timestamp, optionally surviving a reload.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `checkInterval` | `number` | `1000` | Polling interval in ms |
| `maxScheduled` | `number` | `20` | Cap on queued messages |
| `persist` | `boolean` | `false` | Keep the queue in `localStorage` |
| `storageKey` | `string` | — | Storage key when persisting |
| `onFire` | `(msg: ScheduledMessage) => void` | — | Fires as each message sends |

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

## Conversation Plugins

### tagsPlugin

Tags a conversation by topic. Tags live in metadata, so they're available for
routing and analytics.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `availableTags` | `string[]` | `[]` | Tags that can be assigned |
| `storageKey` | `string` | — | Persist tags under this key |
| `onTagAdded` | `(tag: string, messageId?: string) => void` | — | Fires on add |
| `onTagRemoved` | `(tag: string) => void` | — | Fires on removal |

---

### ratingPlugin

End-of-conversation satisfaction survey.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scale` | `number` | `5` | Rating scale |
| `prompt` | `string` | — | Prompt shown to the visitor |
| `triggers` | `('flowEnd' \| 'agentDisconnect' \| 'custom')[]` | `['flowEnd']` | When to ask |
| `onRate` | `(rating: number, feedback?: string) => void` | — | Fires on submit |
| `endpoint` / `headers` | `string` / `Record<string, string>` | — | POST the rating to your API |

---

### offlinePlugin

Queues what the visitor sends while the device is offline and flushes it on
reconnect.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storageKey` | `string` | `'cb_offline_queue'` | Queue storage key |
| `showOfflineIndicator` | `boolean` | `false` | Show an offline notice |
| `onFlush` | `(count: number) => void` | — | Fires with how many were sent |

---

### proactivePlugin

Opens the conversation based on what the visitor does — idle time, scroll depth,
exit intent, page load, or your own event.

| Option | Type | Description |
|--------|------|-------------|
| `rules` | `ProactiveRule[]` | **Required.** The triggers to watch |
| `onTrigger` | `(rule: ProactiveRule) => void` | Fires when a rule matches |

```ts
proactivePlugin({
  rules: [
    { trigger: 'exitIntent', message: 'Before you go — need a hand?' },
    { trigger: 'idle', message: 'Still there?', delay: 30000, maxShows: 1 },
    { trigger: 'scroll', message: 'Questions about pricing?', flowStep: 'pricing' },
  ],
})
```

A rule takes `trigger`, `message`, and optionally `delay` (ms), `maxShows`
(default `1`) and `flowStep` to jump the flow instead of just talking.

---

### personaPlugin

Switches the bot's identity — name, avatar, greeting, accent colour and flow —
inside one widget.

| Option | Type | Description |
|--------|------|-------------|
| `personas` | `BotPersona[]` | **Required.** `{ id, name, avatar?, greeting?, theme?, flowId? }` |
| `defaultPersona` | `string` | Persona active on load |
| `storageKey` | `string` | Remember the last choice |
| `onSwitch` | `(persona: BotPersona) => void` | Fires on switch |

---

### pinPlugin

Pins important messages so they stay reachable.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxPins` | `number` | `10` | Cap on pinned messages |
| `persist` | `boolean` | `false` | Keep pins in `localStorage` |
| `storageKey` | `string` | — | Storage key when persisting |
| `onPin` / `onUnpin` | `(messageId: string) => void` | — | Pin state changed |

---

### priorityPlugin

Marks a conversation's urgency and attaches free-form labels, for routing to
the right queue.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultPriority` | `ConversationPriority` | `'medium'` | Starting priority |
| `maxLabels` | `number` | `5` | Cap on labels |
| `persist` / `storageKey` | `boolean` / `string` | `false` | Persist across reloads |
| `onPriorityChange` | `(priority: ConversationPriority) => void` | — | Priority changed |
| `onLabelsChange` | `(labels: string[]) => void` | — | Labels changed |
| `webhookUrl` | `string` | — | Forward changes to your backend |

---

## Content Plugins

### summaryPlugin

Recaps the conversation — via your AI endpoint, or locally by extracting key
points when no endpoint is reachable.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `endpoint` | `string` | — | POST `{ messages }` for a summary |
| `headers` | `Record<string, string>` | — | Request headers |
| `localFallback` | `boolean` | `true` | Summarise locally if the call fails |
| `maxMessages` | `number` | `50` | Messages sent for summarising |
| `onSummary` | `(summary: string) => void` | — | Fires with the result |

---

### knowledgeBasePlugin

Answers from your FAQ or docs inline — fuzzy-matching local articles, a remote
search endpoint, or both.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `articles` | `KBArticle[]` | `[]` | Local articles: `{ id, title, content, tags?, url? }` |
| `endpoint` | `string` | — | Remote search (GET `?q=`) |
| `autoSearch` | `boolean` | — | Search every unhandled message |
| `threshold` | `number` | — | Minimum match score to answer |
| `maxResults` | `number` | — | Cap on surfaced articles |
| `onResult` | `(articles: KBArticle[]) => void` | — | Fires with matches |

---

### translationPlugin

Translates messages in either direction through your translation API.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `endpoint` | `string` | — | **Required.** POST `{ text, from, to }` |
| `headers` | `Record<string, string>` | — | Request headers (API key) |
| `sourceLang` | `string` | `'auto'` | Source language |
| `targetLang` | `string` | `'en'` | Target language |
| `translateIncoming` / `translateOutgoing` | `boolean` | — | Which direction to translate |
| `showOriginal` | `boolean` | — | Keep the original text alongside |
| `onTranslate` | `(original, translated, lang) => void` | — | Fires per translation |

---

### transcriptExportPlugin

Downloads the conversation as text, JSON, CSV or HTML.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `TranscriptFormat` | `'text'` | Output format |
| `filename` | `string` | `'chat-transcript'` | Filename prefix |
| `includeTimestamps` | `boolean` | `true` | Include message times |
| `header` | `string` | — | Text prepended to the export |
| `onExport` | `(content: string, format: TranscriptFormat) => void` | — | Fires with the content |

---

### codeHighlightPlugin

Renders fenced code blocks as syntax-highlighted panels with a copy button.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `'dark' \| 'light'` | `'dark'` | Highlight theme |
| `copyButton` | `boolean` | `true` | Show the copy button |
| `maxHeight` | `number` | `300` | Max block height in px |
| `languages` | `string[]` | — | Languages to auto-detect |

---

## Interactive Plugins

### pollPlugin

Inline polls with voting and a result bar.

| Option | Type | Description |
|--------|------|-------------|
| `onVote` | `(pollId: string, value: string) => void` | Fires per vote |
| `onClose` | `(result: PollResult) => void` | Fires when the poll closes |
| `webhookUrl` | `string` | Forward votes to your backend |

---

### paymentPlugin

Collects a payment in the conversation via Stripe, Razorpay or your own gateway.

| Option | Type | Description |
|--------|------|-------------|
| `gateway` | `'stripe' \| 'razorpay' \| 'custom'` | **Required.** Which gateway |
| `endpoint` | `string` | **Required.** Your server endpoint |
| `stripeKey` / `razorpayKey` | `string` | Publishable key for the chosen gateway |
| `headers` | `Record<string, string>` | Request headers |
| `onSuccess` | `(result: PaymentResult) => void` | Fires on success |
| `onError` | `(error: string) => void` | Fires on failure |
| `successStep` | `string` | Flow step to route to once paid |

> Keep secret keys on your server — the plugin only ever needs the publishable key.

---

### bookingPlugin

Calendar slot booking with confirmation.

| Option | Type | Description |
|--------|------|-------------|
| `slotsEndpoint` | `string` | **Required.** GET `?date=YYYY-MM-DD` for availability |
| `bookEndpoint` | `string` | **Required.** POST to reserve a slot |
| `headers` | `Record<string, string>` | Request headers |
| `onBooked` | `(confirmation: BookingConfirmation) => void` | Fires once booked |
| `onCancelled` | `(bookingId: string) => void` | Fires on cancellation |
| `successStep` | `string` | Flow step to route to after booking |
| `slotsMessage` | `(slots: TimeSlot[]) => string` | Custom slot-list message |

---

### locationPlugin

Shares the visitor's GPS position as a map link.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mapProvider` | `'google' \| 'openstreetmap' \| 'apple'` | `'google'` | Link provider |
| `highAccuracy` | `boolean` | `false` | Request high-accuracy GPS |
| `timeout` | `number` | `10000` | Lookup timeout in ms |
| `onLocation` | `(lat: number, lng: number) => void` | — | Fires with coordinates |
| `messageFormat` | `(lat, lng, url) => string` | — | Custom message text |

---

## Engagement Plugins

### confettiPlugin

Celebration burst on flow completion or any event you name.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `triggers` | `string[]` | `['flowEnd']` | Events that fire it |
| `duration` | `number` | `3000` | Duration in ms |
| `particleCount` | `number` | `50` | Particle count |
| `colors` | `string[]` | — | Custom colours |
| `onFire` | `() => void` | — | Fires with the burst |

---

### notificationBadgePlugin

Unread count on the launcher, optionally with sound, a browser notification and
a tab-title count.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `playSound` | `boolean` | `false` | Play a sound on arrival |
| `soundUrl` | `string` | — | Sound to play |
| `browserNotification` | `boolean` | `false` | Show an OS notification |
| `updateTitle` | `boolean` | `false` | Put the count in `document.title` |
| `originalTitle` | `string` | — | Title to restore when read |

> The widget already shows an unread badge on its launcher; this plugin adds the
> out-of-page signals (sound, OS notification, tab title).

---

### themeTogglePlugin

In-chat light/dark switch that remembers the choice.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultMode` | `'light' \| 'dark'` | `'light'` | Starting mode |
| `persist` | `boolean` | `false` | Remember across reloads |
| `storageKey` | `string` | — | Storage key when persisting |
| `onToggle` | `(mode: 'light' \| 'dark') => void` | — | Fires on toggle |

> For following the OS instead of asking, use `theme={{ mode: 'auto' }}` — see
> [Theming](./theming.md).

---

## Voice Plugin

### voiceCallPlugin

Starts a real browser voice call from the chat, via `@enjoys/voice-widget`
(an optional peer dependency).

| Option | Type | Description |
|--------|------|-------------|
| `publicKey` | `string` | Publishable key (`pk_…`) bound to your origins |
| `apiBase` | `string` | Voice API origin |
| `accentColor` | `string` | Accent forwarded to the widget |
| `title` | `string` | Panel heading |
| `triggerValue` | `string` | Quick-reply value that starts a call |
| `announce` | `boolean` | Post a system message when the call starts |
| `onState` | `(state: string) => void` | Call state changes |
| `onError` | `(error: Error) => void` | Call errors |

```ts
voiceCallPlugin({
  publicKey: 'pk_live_…',
  title: 'Talk to Support',
  triggerValue: 'start_call',
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
| `onInit` | Chat component mounts (all plugins init **in parallel**) |
| `onMessage` | Any message is added (user, bot, quick reply, form) |
| `onSubmit` | Form is submitted or login |
| `onEvent` | Lifecycle events (open, close, stepChange, flowEnd, quickReply, login) |
| `onDestroy` | Chat component unmounts (listeners are cleaned up) |

> **Note:** Plugin `onInit` hooks run in parallel via `Promise.allSettled`, so a slow-initializing plugin (e.g., one that fetches remote config) won't block others from starting.

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

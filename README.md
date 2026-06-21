<p align="center">
  <img src="./image.png" alt="React ChatBot Plugin — Customizable Chat Widget for React" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/enjoys-in/react-chatbot-plugin">
    <img src="https://opengraph.githubassets.com/1/enjoys-in/react-chatbot-plugin" alt="GitHub Social Preview" width="100%" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@enjoys/react-chatbot-plugin?color=6C5CE7&style=for-the-badge" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/@enjoys/react-chatbot-plugin?color=A29BFE&style=for-the-badge" alt="npm downloads" />
  <img src="https://img.shields.io/bundlephobia/minzip/@enjoys/react-chatbot-plugin?color=00b894&style=for-the-badge" alt="bundle size" />
  <img src="https://img.shields.io/npm/l/@enjoys/react-chatbot-plugin?color=fd79a8&style=for-the-badge" alt="license" />
  <img src="https://img.shields.io/github/stars/enjoys-in/react-chatbot-plugin?color=fdcb6e&style=for-the-badge" alt="stars" />
</p>

<h1 align="center">@enjoys/react-chatbot-plugin</h1>

<p align="center">
  <strong>A fully customizable, plugin-based chatbot widget for React.</strong><br/>
  Like tawk.to — but open-source and fully programmable.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@enjoys/react-chatbot-plugin"><b>npm</b></a> ·
  <a href="#quick-start"><b>Quick Start</b></a> ·
  <a href="#documentation"><b>Docs</b></a> ·
  <a href="https://github.com/enjoys-in/react-chatbot-plugin/issues">Report Bug</a> ·
  <a href="https://github.com/enjoys-in/react-chatbot-plugin/issues">Request Feature</a>
</p>

---


## Features

- **JSON-driven flows** — Build conversational UIs with step-based JSON configuration
- **Keyword matching** — Route user text to responses or flow steps via pattern matching
- **Greeting detection** — Auto-respond to common greetings (hi, hello, hey, etc.)
- **Fallback responses** — Catch-all reply when no keyword or flow matches
- **Input validation** — Validate free-text input inside flow steps with transforms
- **Async actions** — Run API calls on step entry with real-time loading/progress/error states
- **Custom step components** — Render your own React widgets inside flow steps
- **Dynamic routing** — Route to different steps based on API results, status codes, or custom logic
- **Plugin architecture** — 35+ built-in plugins: analytics, AI, webhooks, persistence, i18n, CRM, rate limiting, live agent, tags, rating, offline, proactive, persona, and more
- **Slash commands** — `/help`, `/back`, `/cancel`, `/restart` built-in
- **`customizeChat` slot map** — All UI customization in one prop: component overrides (bubble, quick replies, typing indicator, header, input, launcher, branding, welcome/login screen) + config (header, branding, welcome screen content)
- **Custom header/input** — Swap the header or input with your own React components
- **Forms** — Text, select, radio, checkbox, file upload, with validation
- **Custom form fields** — Replace any form field type with your own React component
- **Theming** — Light/dark mode, CSS variables, glassmorphism design
- **File uploads** — Drag & drop, preview, size/count limits
- **Emoji picker** — Built-in emoji selector
- **Welcome & login screens** — Optional onboarding flow
- **Branding** — Customizable footer and header
- **Typing delay** — Realistic typing pause before bot replies
- **onUnhandledMessage** — Callback when nothing handles user text
- **Live Agent (WebSocket / Socket.IO)** — Real-time handoff to human agents with session persistence, queue updates, typing indicators, and "agent joined/left" system messages
- **Message Reactions** — 👍👎 emoji reactions on messages with analytics events
- **Message Search** — Full-text search through chat history with highlighted matches
- **Voice Input** — Speech-to-text via Web Speech API with language support
- **Typing Preview** — Real-time "User is typing..." indicator for live agent/flow mode
- **Rich Cards / Carousels** — Horizontal scrollable cards with images, titles, buttons
- **Date/Time Picker** — Native date/time/datetime form field type
- **Conversation Tags** — Group and tag conversations by topic
- **Conditional Rendering** — Show/hide steps with `visibleIf` rules based on collected data
- **Flow Composition** — Reusable sub-flows via `subFlow` field
- **Middleware Pipeline** — Pre-process, transform, or block messages before dispatch
- **Event Bus** — Standalone pub/sub system via `createEventBus()`
- **Headless Mode** — Run engine + plugins without UI via `createHeadlessBot()`
- **Message Edit/Delete** — Users can edit or delete their sent messages
- **Read Receipts** — ✓ sent, ✓✓ delivered, ✓✓ read status indicators
- **Rating Plugin** — End-of-chat satisfaction survey (1-5 stars)
- **Offline Queue** — Queue messages offline, auto-send on reconnect
- **Proactive Messages** — Trigger bot messages based on page behavior (idle, scroll, exit intent)
- **Persona Switching** — Switch between bot personalities in one widget
- **Message Pinning** — Pin/unpin important messages for quick reference
- **Theme Toggle** — In-chat dark/light mode switch with persistence
- **Confetti/Animations** — Celebration effects on flow completion or custom events
- **Priority & Labels** — Set conversation urgency and custom tags
- **Whisper Mode** — Supervisor notes visible only to agents
- **Message Scheduling** — Send messages at a future time
- **Conversation Summary** — AI-powered or keyword-based conversation recap
- **Knowledge Base** — Search FAQ/docs inline and surface answers
- **Auto-Translation** — Real-time message translation between languages
- **Transcript Export** — Download chat as text, JSON, CSV, or HTML
- **Notification Badge** — Unread count on launcher + browser notifications
- **Location Sharing** — Share GPS coordinates with map links
- **Code Snippets** — Syntax-highlighted code blocks with copy button
- **Inline Polls** — Create polls with voting and result visualization
- **Payment Widget** — Stripe/Razorpay/custom payment collection inline
- **Appointment Booking** — Calendar-based slot booking with confirmation

---

## Release History

| Version | Features | Type | Description |
|---------|----------|------|-------------|
| **v1.23.0** | Badge, Poll, Payment, Booking, Location | Plugin | Unread badge, inline polls, payment gateway, calendar booking, GPS sharing |
| **v1.22.0** | Summary, KB, Translation, Export, Code | Plugin | AI summary, FAQ search, auto-translate, transcript download, syntax highlight |
| **v1.21.0** | Pin, Theme Toggle, Confetti, Priority, Whisper, Schedule | Plugin | Pin messages, dark/light toggle, celebrations, priority labels, agent whisper, delayed send |
| **v1.20.0** | Headless Mode | Prop + Utility | `createHeadlessBot()` + `headless` prop — run engine without UI |
| **v1.19.0** | Event Bus | Utility | `createEventBus()` standalone pub/sub utility |
| **v1.18.0** | Middleware Pipeline | Prop | `middleware` prop — intercept/transform/block messages |
| **v1.17.0** | Conditional Rendering, Flow Composition | Engine | `visibleIf` on steps + `subFlow` for reusable flows |
| **v1.16.0** | Tags, Rating, Offline, Proactive, Persona | Plugin | 5 conversation plugins |
| **v1.15.0** | Date/Time Picker | Prop (form field) | Native `date`, `time`, `datetime` form field types |
| **v1.14.0** | Rich Cards / Carousels | Prop (message) | `CarouselCards` component + `cards` message field |
| **v1.13.0** | Typing, Edit/Delete, Read Receipts | Prop | User typing indicator, message edit/delete, delivery status |
| **v1.12.0** | Voice Input | Prop | Speech-to-text via Web Speech API |
| **v1.11.0** | Message Search | Prop | Full-text search with header search bar |
| **v1.10.0** | Message Reactions | Prop | Emoji reactions on messages |
| **v1.9.0** | Live Agent | Prop + Plugin | WebSocket / Socket.IO real-time agent chat |
| **v1.8.0** | Custom Icons | Prop | `icons` prop — override any built-in icon |
| **v1.7.0** | Markdown Rendering | Prop | `markdown` prop — bold, italic, code, links, lists |
| **v1.6.0** | Keywords & Fallback | Prop | Pattern matching, greeting detection, typing delay |
| **v1.5.0** | Custom Form Fields | Prop | `renderFormField` prop — replace any form field renderer |
| **v1.4.0** | customizeChat Slot Map | Prop | 9-slot UI customization system |
| **v1.3.0** | Async Actions + Dynamic Routing | Prop | Step-entry API calls with status-based routing |
| **v1.2.0** | File Upload + Emoji Picker | Prop | Drag & drop uploads, emoji selector |
| **v1.1.0** | Plugin System | Architecture | 30 built-in plugins + custom plugin API |
| **v1.0.0** | Initial Release | Core | Flow engine, forms, theming, slash commands |

## Installation

```bash
npm install @enjoys/react-chatbot-plugin
# or
yarn add @enjoys/react-chatbot-plugin
# or
pnpm add @enjoys/react-chatbot-plugin
# or
bun add @enjoys/react-chatbot-plugin
```

**Peer dependencies:** `react >= 18.0.0`, `react-dom >= 18.0.0`

## Quick Start

```tsx
import { ChatBot } from '@enjoys/react-chatbot-plugin';
import type { FlowConfig } from '@enjoys/react-chatbot-plugin';

const flow: FlowConfig = {
  startStep: 'greeting',
  steps: [
    {
      id: 'greeting',
      message: 'Hi! How can I help you?',
      quickReplies: [
        { label: 'Sales', value: 'sales', next: 'sales' },
        { label: 'Support', value: 'support', next: 'support' },
      ],
    },
    { id: 'sales', message: 'Our plans start at $29/month.' },
    { id: 'support', message: 'Please describe your issue and we will get back to you.' },
  ],
};

function App() {
  return (
    <ChatBot
      flow={flow}
      customizeChat={{
        header: { config: { title: 'Acme Support', subtitle: 'Online', showRestart: true } },
      }}
    />
  );
}
```

## Documentation

Full documentation is available in the [`docs/`](./docs/) folder:

| # | Guide | Description |
|---|-------|-------------|
| 1 | [Getting Started](./docs/getting-started.md) | Installation, quick start, minimal example |
| 2 | [Basic Flows](./docs/basic-flows.md) | Steps, messages, quick replies, delays |
| 3 | [Forms & Validation](./docs/forms.md) | All 15 field types, validation rules, login forms |
| 4 | [Conditional Branching](./docs/conditional-branching.md) | If/else routing based on collected data |
| 5 | [Async Actions](./docs/async-actions.md) | API calls, progress messages, error handling |
| 6 | [Custom Components](./docs/custom-components.md) | React widgets inside flow steps |
| 7 | [Dynamic Routing](./docs/dynamic-routing.md) | Route based on API response status |
| 8 | [Theming & Styling](./docs/theming.md) | Colors, CSS variables, dark mode |
| 9 | [Plugins](./docs/plugins.md) | 30 built-in & custom plugins |
| 10 | [Slash Commands](./docs/slash-commands.md) | /help, /back, /restart, /cancel |
| 11 | [File Upload](./docs/file-upload.md) | Drag & drop, restrictions, previews |
| 12 | [Custom Header & Input](./docs/custom-header-input.md) | Replace header/input with React components |
| 13 | [Advanced Patterns](./docs/advanced-patterns.md) | E-commerce bot, onboarding wizard, full examples |
| 14 | [Keywords & Fallback](./docs/keywords-fallback.md) | Keyword routes, greeting detection, fallback, typing delay |
| 15 | [API Reference](./docs/api-reference.md) | All types, props, and exports |
| 16 | [Live Agent](./docs/live-agent.md) | WebSocket / Socket.IO real-time agent chat |

## Props

| Prop | Type | Description |
|------|------|-------------|
| `flow` | `FlowConfig` | JSON conversation flow |
| `theme` | `ChatTheme` | Colors, fonts, border radius, light/dark mode |
| `style` | `ChatStyle` | CSS overrides for launcher, window, header, etc. |
| `loginForm` | `FormConfig` | Pre-chat login/identification form |
| `callbacks` | `ChatCallbacks` | Event handlers (onOpen, onClose, onMessageSend, etc.) |
| `plugins` | `ChatPlugin[]` | Array of plugins |
| `initialMessages` | `ChatMessage[]` | Pre-populated messages |
| `inputPlaceholder` | `string` | Input placeholder text |
| `position` | `'bottom-right' \| 'bottom-left'` | Widget position |
| `enableEmoji` | `boolean` | Show emoji picker |
| `enableReactions` | `boolean \| string[]` | Emoji reactions on messages |
| `enableSearch` | `boolean` | Message search in header |
| `enableVoice` | `boolean \| { lang?, continuous? }` | Speech-to-text input |
| `showUserTyping` | `boolean` | Show typing indicator to agents |
| `allowMessageEdit` | `boolean` | Let users edit/delete sent messages |
| `showReadReceipts` | `boolean` | Show ✓/✓✓ delivery status |
| `markdown` | `boolean \| MarkdownOptions` | Render markdown in messages |
| `fileUpload` | `FileUploadConfig` | File upload settings |
| `components` | `Record<string, ComponentType<StepComponentProps>>` | Custom React components for flow steps |
| `actionHandlers` | `Record<string, (data, ctx) => Promise<FlowActionResult>>` | Async action handlers for flow steps |
| `middleware` | `FlowMiddleware[]` | Message middleware pipeline |
| `headless` | `boolean` | Hide UI, run only engine + plugins |
| `icons` | `Partial<ChatIconMap>` | Override built-in icons |
| `defaultOpen` | `boolean` | Start with chat open |
| `showLauncher` | `boolean` | Show/hide launcher button |
| `launcherIcon` | `ReactNode` | Custom launcher icon |
| `closeIcon` | `ReactNode` | Custom close icon |
| `zIndex` | `number` | CSS z-index |
| `renderFormField` | `FormFieldRenderMap` | Custom renderers for form field types |
| `customizeChat` | `ChatCustomizeChat` | All UI customization — slot configs + component overrides |
| `liveAgent` | `LiveAgentConfig` | WebSocket / Socket.IO real-time agent chat |
| `className` | `string` | Root element class name |

### `customizeChat` Slots

Each key is a partial of its slot props — provide config, content, or a custom `component`. Only provided keys are used; missing keys use defaults. Forms (`DynamicForm` / `renderFormField`) are never affected.

| Key | Slot Props | Configurable Fields |
|-----|-----------|---------------------|
| `header` | `HeaderSlotProps` | `config: HeaderConfig`, `component` |
| `input` | `InputSlotProps` | `component` |
| `branding` | `BrandingSlotProps` | `config: BrandingConfig`, `component` |
| `welcomeScreen` | `WelcomeScreenSlotProps` | `content: ReactNode`, `component` |
| `loginScreen` | `LoginScreenSlotProps` | `config: FormConfig`, `component` |
| `launcher` | `LauncherSlotProps` | `component` |
| `messageBubble` | `MessageBubbleSlotProps` | `component: ComponentType` |
| `quickReplies` | `QuickRepliesSlotProps` | `component: ComponentType` |
| `typingIndicator` | `TypingIndicatorSlotProps` | `component: ComponentType` |

```tsx
<ChatBot
  flow={flow}
  customizeChat={{
    header: {
      config: { title: 'Acme Support', subtitle: 'Online', showRestart: true },
    },
    branding: {
      config: { poweredBy: 'Acme Inc', showBranding: true },
    },
    messageBubble: { component: MyCustomBubble },
    quickReplies: { component: MyCustomQuickReplies },
  }}
/>
```

### `liveAgent` — Real-time Agent Chat

Connect your chatbot to a real human agent via **WebSocket** or **Socket.IO**. Messages are relayed in real-time, with system notifications for agent join/leave, queue position, and typing indicators. Sessions persist across page refreshes.

**With Socket.IO:**

```tsx
import { io } from 'socket.io-client';

const socket = io('https://support.example.com');

<ChatBot
  flow={botFlow}
  liveAgent={{
    type: 'socketio',
    instance: socket,
    sessionId: 'user_123',
    persistSession: true,
    onAgentJoined: (agent) => console.log(`${agent.name} joined`),
  }}
/>
```

**With native WebSocket:**

```tsx
const ws = new WebSocket('wss://support.example.com/chat');

<ChatBot
  flow={botFlow}
  liveAgent={{
    type: 'ws',
    instance: ws,
    sessionId: 'user_456',
  }}
/>
```

**Or as a plugin:**

```tsx
import { liveAgentPlugin } from '@enjoys/react-chatbot-plugin';

<ChatBot
  flow={botFlow}
  plugins={[
    liveAgentPlugin({ type: 'socketio', instance: socket, sessionId: 'user_123' }),
  ]}
/>
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `'ws' \| 'socketio'` | — | Transport protocol |
| `instance` | `WebSocket \| Socket` | — | Pre-created connection instance |
| `sessionId` | `string` | auto | Session ID for persistence |
| `events` | `LiveAgentEvents` | defaults | Custom event name overrides |
| `persistSession` | `boolean` | `true` | Store messages in localStorage |
| `onAgentJoined` | `(agent) => void` | — | Agent joined callback |
| `onAgentLeft` | `(agent) => void` | — | Agent left callback |
| `onQueueUpdate` | `(pos, wait?) => void` | — | Queue position callback |

## Exported Components

All internal components are exported for advanced use cases:

**UI:** `ChatBot`, `ChatHeader`, `ChatInput`, `ChatWindow`, `Launcher`, `MessageBubble`, `MessageList`, `QuickReplies`, `TypingIndicator`, `WelcomeScreen`, `LoginScreen`, `Branding`, `EmojiPicker`, `FileUploadButton`, `FilePreviewList`, `DynamicForm`

**Forms:** `TextField`, `SelectField`, `RadioField`, `CheckboxField`, `FileUploadField`

**Icons:** `SendIcon`, `ChatBubbleIcon`, `CloseIcon`, `MinimizeIcon`, `EmojiIcon`, `AttachmentIcon`, `FileIcon`, `ImageIcon`, `RemoveIcon`, `RestartIcon`, `SearchIcon`, `MicIcon`, `StarIcon`, `EditIcon`, `TrashIcon`

**Engine & Core:** `FlowEngine`, `PluginManager`, `createEventBus`, `createHeadlessBot`, `LiveAgentAdapter`, `useChat`, `useLiveAgent`, `ChatContext`, `useChatContext`

**Theme utilities:** `resolveTheme`, `buildStyles`, `buildCSSVariables`, `renderMarkdown`

**Built-in plugins (51):** `analyticsPlugin`, `webhookPlugin`, `persistencePlugin`, `loggerPlugin`, `crmPlugin`, `emailPlugin`, `syncPlugin`, `aiPlugin`, `intentPlugin`, `typingPlugin`, `autoReplyPlugin`, `validationPlugin`, `uploadPlugin`, `authPlugin`, `rateLimitPlugin`, `pushPlugin`, `soundPlugin`, `agentPlugin`, `transferPlugin`, `themePlugin`, `componentPlugin`, `leadPlugin`, `campaignPlugin`, `schedulerPlugin`, `reminderPlugin`, `i18nPlugin`, `debugPlugin`, `devtoolsPlugin`, `mediaPlugin`, `markdownPlugin`, `liveAgentPlugin`, `tagsPlugin`, `ratingPlugin`, `offlinePlugin`, `proactivePlugin`, `personaPlugin`, `pinPlugin`, `themeTogglePlugin`, `confettiPlugin`, `priorityPlugin`, `whisperPlugin`, `messageSchedulePlugin`, `notificationBadgePlugin`, `summaryPlugin`, `knowledgeBasePlugin`, `translationPlugin`, `transcriptExportPlugin`, `codeHighlightPlugin`, `pollPlugin`, `paymentPlugin`, `bookingPlugin`, `locationPlugin`

## Development

```bash
# Install dependencies
bun install

# Run demo (17 interactive demos)
bun run dev

# Build library
bun run build
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Enjoys](https://github.com/enjoys-in)

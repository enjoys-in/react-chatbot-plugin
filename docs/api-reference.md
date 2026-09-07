# API Reference

All exported types, components, and utilities.

## Components

| Export | Description |
|--------|-------------|
| `ChatBot` | Main chatbot widget component |
| `ChatHeader` | Header component |
| `ChatInput` | Input area with send button |
| `ChatWindow` | Chat window container |
| `Launcher` | Floating launch button |
| `MessageBubble` | Individual message |
| `MessageList` | Scrollable message list |
| `QuickReplies` | Quick reply buttons |
| `TypingIndicator` | Typing animation |
| `HomeScreen` | Default screen: icon actions + component shells |
| `BottomNav` | Bottom tab bar for the multi-screen shell |
| `LauncherNotification` | Proactive bubble above the launcher |
| `SlashCommandMenu` | `/command` autocomplete list |
| `WelcomeScreen` | Welcome overlay |
| `LoginScreen` | Pre-chat login form |
| `Branding` | "Powered by" footer |
| `EmojiPicker` | Emoji selector popup |
| `FileUploadButton` | File attachment button |
| `FilePreviewList` | File preview thumbnails |
| `DynamicForm` | Dynamic form renderer |
| `TextField` | Text input field |
| `SelectField` | Dropdown select |
| `RadioField` | Radio buttons |
| `CheckboxField` | Checkbox group |
| `FileUploadField` | File upload input |

## Icons

| Export | Description |
|--------|-------------|
| `SendIcon` | Send button icon |
| `ChatBubbleIcon` | Launcher icon |
| `CloseIcon` | Close button icon |
| `MinimizeIcon` | Minimize icon |
| `EmojiIcon` | Emoji picker toggle |
| `AttachmentIcon` | File attachment icon |
| `FileIcon` | Generic file icon |
| `ImageIcon` | Image file icon |
| `RemoveIcon` | Remove/delete icon |
| `RestartIcon` | Restart button icon |

## Core

| Export | Description |
|--------|-------------|
| `FlowEngine` | Flow step engine class |
| `PluginManager` | Plugin lifecycle manager |
| `useChat` | Main chat logic hook |
| `ChatContext` | React context |
| `useChatContext` | Context hook |
| `useColorScheme` | Resolve `'auto'` against the OS and re-render on change |
| `useLiveAgent` | Live-agent connection state and actions |
| `createHeadlessBot` | Run the engine and plugins with no UI |
| `createEventBus` | Standalone pub/sub bus |
| `renderMarkdown` | Render the supported markdown subset to React nodes |

## Theme Utilities

| Export | Description |
|--------|-------------|
| `resolveTheme` | Merge user theme with defaults; collapses `mode: 'auto'` |
| `buildStyles` | Generate component styles from theme |
| `buildCSSVariables` | Generate CSS variables from theme |
| `typography` | Type-scale tokens (`title`, `body`, `meta`, …) |
| `motion` | Motion tokens (`panel`, `enter`, `surface`, `control`, `icon`) |
| `neutrals` | Ink, hairline and surface values for a mode |
| `headerInk` | Subtitle/icon/hover ink for the header surface |
| `contrastInk` | Highest-contrast ink for a given background |
| `inkLayers` | Full ink set (primary/muted/border/plate) for any surface |
| `resolveColorMode` | Collapse `'auto'` to `'light' \| 'dark'` |
| `prefersDarkScheme` | Read `prefers-color-scheme` (SSR-safe) |
| `onColorSchemeChange` | Subscribe to scheme changes; returns unsubscribe |

## Plugins

| Export | Description |
|--------|-------------|
| `analyticsPlugin` | Event tracking with session analytics |
| `webhookPlugin` | Server webhook for all event types |
| `persistencePlugin` | Local/session storage with TTL |
| `loggerPlugin` | Configurable console logging |
| `crmPlugin` | CRM endpoint integration |
| `emailPlugin` | Email triggers via API |
| `syncPlugin` | Bidirectional backend sync |
| `aiPlugin` | AI responses (OpenAI/Anthropic/custom) |
| `intentPlugin` | Rule-based intent detection |
| `validationPlugin` | Profanity filter, HTML sanitizer |
| `markdownPlugin` | Markdown-to-HTML for bot messages |
| `mediaPlugin` | Rich media tags (`[image:url]`, etc.) |
| `i18nPlugin` | Multi-language with `{{t:key}}` syntax |
| `typingPlugin` | Configurable typing delay |
| `autoReplyPlugin` | Idle user auto-reply |
| `soundPlugin` | Audio alerts |
| `pushPlugin` | Browser push notifications |
| `themePlugin` | Dynamic theme switching |
| `componentPlugin` | Programmatic component injection |
| `authPlugin` | JWT/session token auth |
| `rateLimitPlugin` | Sliding window rate limiting |
| `agentPlugin` | WebSocket live agent handoff |
| `transferPlugin` | Department transfer via API |
| `leadPlugin` | Lead capture from forms/flows |
| `campaignPlugin` | Behavioral triggers (exit intent, idle, scroll) |
| `schedulerPlugin` | Timed/recurring bot messages |
| `reminderPlugin` | Delayed reminder messages |
| `uploadPlugin` | File upload to external storage |
| `debugPlugin` | Debug state on `window.__chatbotDebug` |
| `devtoolsPlugin` | Visual overlay panel (F2) |
| `liveAgentPlugin` | Plugin form of the `liveAgent` prop |
| `whisperPlugin` | Agent-only supervisor notes |
| `messageSchedulePlugin` | Send messages at a future timestamp |
| `tagsPlugin` | Tag conversations by topic |
| `ratingPlugin` | End-of-chat satisfaction survey |
| `offlinePlugin` | Queue messages offline, flush on reconnect |
| `proactivePlugin` | Trigger on idle, scroll, exit intent, page load |
| `personaPlugin` | Switch bot identity, avatar, greeting and flow |
| `pinPlugin` | Pin important messages |
| `priorityPlugin` | Conversation urgency and labels |
| `summaryPlugin` | AI or local conversation recap |
| `knowledgeBasePlugin` | Inline FAQ/doc search |
| `translationPlugin` | Real-time message translation |
| `transcriptExportPlugin` | Download transcript as text/JSON/CSV/HTML |
| `codeHighlightPlugin` | Syntax-highlighted code blocks with copy |
| `pollPlugin` | Inline polls with results |
| `paymentPlugin` | Stripe/Razorpay/custom payment inline |
| `bookingPlugin` | Calendar slot booking |
| `locationPlugin` | Share GPS position as a map link |
| `confettiPlugin` | Celebration burst on an event |
| `notificationBadgePlugin` | Unread count, sound, OS notification, tab title |
| `themeTogglePlugin` | In-chat light/dark switch |
| `voiceCallPlugin` | Real browser voice call via `@enjoys/voice-widget` |

See [Plugins](./plugins.md) for each plugin's options.

## Types

### ChatBotProps

Main component props. See [Getting Started](./getting-started.md).

```ts
interface ChatBotProps {
  flow?: FlowConfig;
  theme?: ChatTheme;
  style?: ChatStyle;
  loginForm?: FormConfig;
  homeScreen?: HomeScreenConfig;
  slashCommands?: SlashCommand[];
  enableSlashCommandMenu?: boolean;
  callbacks?: ChatCallbacks;
  plugins?: ChatPlugin[];
  initialMessages?: ChatMessage[];
  inputPlaceholder?: string;
  position?: 'bottom-right' | 'bottom-left';
  showLauncher?: boolean;
  launcherIcon?: ReactNode;
  closeIcon?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  zIndex?: number;
  enableEmoji?: boolean;
  fileUpload?: FileUploadConfig;
  components?: Record<string, ComponentType<StepComponentProps>>;
  actionHandlers?: Record<string, (data: Record<string, unknown>, ctx: ActionContext) => Promise<FlowActionResult>>;
  renderFormField?: FormFieldRenderMap;
  fallbackMessage?: string | ((text: string) => string | null);
  keywords?: KeywordRoute[];
  greetingResponse?: string;
  typingDelay?: number;
  /** All UI customization — slot configs + component overrides */
  customizeChat?: ChatCustomizeChat;
}
```

### ChatCustomizeChat

Single prop for all UI customization. Each key is a `Partial` of its slot props.

```ts
type ChatCustomizeChat = {
  [K in keyof ChatCustomizeSlotMap]?: Partial<ChatCustomizeSlotMap[K]>;
};

interface ChatCustomizeSlotMap {
  header: HeaderSlotProps;         // config, component, ctx
  input: InputSlotProps;           // component, ctx
  branding: BrandingSlotProps;     // config, component
  homeScreen: HomeScreenSlotProps;       // config, ctx, component
  welcomeScreen: WelcomeScreenSlotProps; // content, component
  loginScreen: LoginScreenSlotProps;     // config, component
  launcher: LauncherSlotProps;     // component
  messageBubble: MessageBubbleSlotProps; // component (ComponentType)
  quickReplies: QuickRepliesSlotProps;   // component (ComponentType)
  typingIndicator: TypingIndicatorSlotProps; // component (ComponentType)
}
```

### FlowConfig

```ts
interface FlowConfig {
  startStep: string;
  steps: FlowStep[];
}
```

### FlowStep

```ts
interface FlowStep {
  id: string;
  message?: string;
  messages?: string[];
  delay?: number;
  quickReplies?: FlowQuickReply[];
  form?: FormConfig;
  next?: string;
  action?: string;
  condition?: FlowCondition;
  component?: string;
  asyncAction?: FlowAsyncAction;
  input?: FlowStepInput;
}
```

### FlowAsyncAction

```ts
interface FlowAsyncAction {
  handler: string;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: string;
  onError?: string;
  routes?: Record<string, string>;
}
```

### FlowActionResult

```ts
interface FlowActionResult {
  status: string;
  data?: Record<string, unknown>;
  message?: string;
  next?: string;
}
```

### ActionContext

```ts
interface ActionContext {
  updateMessage: (text: string) => void;
}
```

### StepComponentProps

```ts
interface StepComponentProps {
  stepId: string;
  data: Record<string, unknown>;
  onComplete: (result?: FlowActionResult) => void;
}
```

### ChatMessage

```ts
interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text?: string;
  timestamp: number;
  quickReplies?: FlowQuickReply[];
  form?: FormConfig;
  formData?: Record<string, unknown>;
  attachments?: MessageAttachment[];
  metadata?: Record<string, unknown>;
  component?: string;
}
```

### FlowQuickReply

```ts
interface FlowQuickReply {
  label: string;
  value: string;
  next?: string;
  icon?: string;
}
```

### FlowCondition

```ts
interface FlowCondition {
  field: string;
  operator: 'eq' | 'neq' | 'contains' | 'gt' | 'lt';
  value: string | number;
  then: string;
  else: string;
}
```

### ChatCallbacks

```ts
interface ChatCallbacks {
  onOpen?: () => void;
  onClose?: () => void;
  onMessageSend?: (message: ChatMessage) => void;
  onMessageReceive?: (message: ChatMessage) => void;
  onSubmit?: (data: Record<string, unknown>, formId?: string) => void | Promise<void>;
  onLogin?: (data: Record<string, unknown>) => void | Promise<void>;
  onFormSubmit?: (formId: string, data: Record<string, unknown>) => void | Promise<void>;
  onQuickReply?: (value: string, label: string) => void;
  onFileUpload?: (files: File[]) => void | Promise<void>;
  onFlowEnd?: (collectedData: Record<string, unknown>) => void;
  onError?: (error: Error) => void;
  onEvent?: (event: string, payload?: unknown) => void;
  onUnhandledMessage?: (text: string, context: { currentStepId: string | null }) => void;
  onHomeAction?: (actionId: string) => void;
}
```

### ChatRenderContext

```ts
interface ChatRenderContext {
  currentStepId: string | null;
  isOpen: boolean;
  messages: ChatMessage[];
  collectedData: Record<string, unknown>;
  toggleChat: () => void;
  restartSession: () => void;
  sendMessage: (text: string) => void;
}
```

### HomeScreenConfig

```ts
interface HomeScreenConfig {
  enabled?: boolean;              // default true
  greeting?: ReactNode;
  tagline?: ReactNode;
  avatar?: string;
  actions?: HomeScreenAction[];
  sections?: HomeScreenSection[];
  cta?: HomeScreenCta | null;     // null removes the button
  masthead?: boolean;             // paint the greeting with theme.headerBg
}
```

### HomeScreenAction

```ts
interface HomeScreenAction {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  iconBackground?: string;
  accessory?: ReactNode | null;   // null removes the chevron
  disabled?: boolean;
  // Behaviour, in order of precedence:
  onSelect?: (ctx: HomeScreenContext) => void;
  message?: string;               // send as the visitor
  stepId?: string;                // jump the flow to this step
  href?: string;                  // render an <a target="_blank">
}
```

### HomeScreenSection

```ts
interface HomeScreenSection {
  id: string;
  title?: string;
  /** Element, or a component that receives HomeScreenContext as props. */
  component: ReactNode | ComponentType<HomeScreenContext>;
  shell?: boolean;                // default true — wrap in a card
  placement?: 'above' | 'below';  // default 'below'
}
```

### HomeScreenContext

```ts
interface HomeScreenContext {
  openChat: () => void;
  sendMessage: (text: string) => void;
  goToStep: (stepId: string) => void;
  data: Record<string, unknown>;
  close: () => void;
}
```

### NavigationConfig

```ts
interface NavigationConfig {
  tabs: NavTab[];
  enabled?: boolean;                      // default true
  defaultTab?: string;                    // default: first tab, else 'home'
  onTabChange?: (tabId: string) => void;
  // Appearance — each falls back to a theme value
  activeColor?: string;                   // default theme.primaryColor
  inactiveColor?: string;                 // default muted ink
  activeBackground?: string;              // default subtle hover plate
  indicator?: boolean;                    // default false
  background?: string;                    // default theme surface
}
```

### NavTab

```ts
interface NavTab {
  id: string;                             // 'home' and 'messages' are built in
  label: string;
  icon?: ReactNode;
  activeIcon?: ReactNode;                 // defaults to `icon`
  badge?: number | boolean;               // number = count, true = dot
  component?: ReactNode | ComponentType<HomeScreenContext>;
}
```

See [Navigation](./navigation.md) for the shell's behaviour.

### MessageAttachment

```ts
interface MessageAttachment {
  name: string;
  url: string;
  type: string;
  size?: number;
  preview?: string;
  /** Field label this file came from, e.g. 'ID Document'. */
  label?: string;
}
```

### Value helpers

| Export | Description |
|--------|-------------|
| `formatFieldValue(value, optionMap?)` | Readable text for a collected value — handles `FileList`, arrays (with option labels), booleans, dates |
| `filesFromValue(value)` | `File[]` from a `FileList`, `File`, or `File[]`; empty otherwise |
| `truncateMiddle(text, max?)` | Shorten from the middle, keeping the extension |

### SlashCommand

```ts
interface SlashCommand {
  name: string;                 // without the leading slash
  description?: string;
  icon?: ReactNode;
  aliases?: string[];           // extra filter terms
  hidden?: boolean;             // typeable but not listed
  handler?: (ctx: SlashCommandContext) => void | Promise<void>;
}
```

A custom command whose `name` matches a built-in replaces it.

### SlashCommandContext

```ts
interface SlashCommandContext {
  addBotMessage: (text: string) => void;
  addSystemMessage: (text: string) => void;
  sendMessage: (text: string) => void;
  goToStep: (stepId: string) => void;
  goBack: () => void;
  restart: () => void;
  data: Record<string, unknown>;
  args: string;                 // text after the command name
}
```

### Command helpers

| Export | Description |
|--------|-------------|
| `BUILT_IN_COMMANDS` | The four built-ins as `SlashCommand[]` |
| `resolveCommands(custom?)` | Built-ins merged with custom (custom wins on name) |
| `parseCommand(text)` | `'/echo hi'` → `{ name: 'echo', args: 'hi' }`, else `null` |
| `commandMenuQuery(text)` | Menu query for the current value, or `null` when closed |
| `filterCommands(commands, query)` | Ranked matches: name prefix, alias, then substring |

### ChatTheme (mode)

```ts
type ChatColorMode = 'light' | 'dark';

interface ChatTheme {
  // …
  /** 'auto' follows prefers-color-scheme and switches live. */
  mode?: ChatColorMode | 'auto';
}
```

### FormConfig

```ts
interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  submitLabel?: string;
}
```

### FormFieldConfig

```ts
interface FormFieldConfig {
  name: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
  accept?: string;
  defaultValue?: string;
}
```

### ChatPlugin

```ts
interface ChatPlugin {
  name: string;
  onInit?: (ctx: PluginContext) => void | Promise<void>;
  onMessage?: (message: ChatMessage, ctx: PluginContext) => void | ChatMessage | Promise<void | ChatMessage>;
  onSubmit?: (data: Record<string, unknown>, ctx: PluginContext) => void | Promise<void>;
  onEvent?: (event: ChatPluginEvent, ctx: PluginContext) => void;
  onDestroy?: (ctx: PluginContext) => void | Promise<void>;
}

interface ChatPluginEvent {
  type: string;       // 'open' | 'close' | 'stepChange' | 'flowEnd' | 'quickReply' | 'login'
  payload?: unknown;
  timestamp: number;
}
```

### FormFieldRenderMap

```ts
type FormFieldRenderMap = Partial<{
  text: (props: TextFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  email: (props: TextFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  password: (props: TextFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  number: (props: TextFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  tel: (props: TextFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  url: (props: TextFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  textarea: (props: TextFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  date: (props: TextFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  time: (props: TextFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  select: (props: SelectFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  multiselect: (props: SelectFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  radio: (props: RadioFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  checkbox: (props: CheckboxFieldRenderProps, defaultElement: ReactNode) => ReactNode;
  file: (props: FileFieldRenderProps, defaultElement: ReactNode) => ReactNode;
}>;
```

### TextFieldRenderProps

```ts
interface TextFieldRenderProps {
  field: FormFieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}
```

### SelectFieldRenderProps

```ts
interface SelectFieldRenderProps {
  field: FormFieldConfig;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
}
```

### RadioFieldRenderProps

```ts
interface RadioFieldRenderProps {
  field: FormFieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}
```

### CheckboxFieldRenderProps

```ts
interface CheckboxFieldRenderProps {
  field: FormFieldConfig;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}
```

### FileFieldRenderProps

```ts
interface FileFieldRenderProps {
  field: FormFieldConfig;
  files: File[];
  onFileSelect: (files: File[]) => void;
  error?: string;
}
```

### KeywordRoute

```ts
interface KeywordRoute {
  patterns: string[];
  response?: string;
  next?: string;
  caseSensitive?: boolean;
  matchType?: 'exact' | 'contains' | 'startsWith' | 'regex';
  priority?: number;
}
```

### FlowStepInput

```ts
interface FlowStepInput {
  placeholder?: string;
  validation?: FormFieldValidation;
  transform?: 'lowercase' | 'uppercase' | 'trim' | 'email';
}
```

### FormFieldValidation

```ts
interface FormFieldValidation {
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  message?: string;
}
```

---

## Other exported types

| Type | Description |
|------|-------------|
| `ChatStyles` | The resolved style map slot components receive as `styles` |
| `ChatColorMode` | `'light' \| 'dark'` — what `'auto'` collapses to |
| `ChatIconMap` | Icon overrides for the `icons` prop |
| `HeaderConfig` | `customizeChat.header.config` shape |
| `BrandingConfig` | `customizeChat.branding.config` shape |
| `LauncherNotificationConfig` | Proactive launcher bubble config |
| `LauncherNotificationSlotProps` | Props for a custom launcher-notification slot |
| `LiveAgentConfig` | Live agent adapter, events and queue wiring |
| `LiveAgentAdapter` | Transport contract for a custom live-agent backend |
| `LiveAgentEvents` / `ResolvedLiveAgentEvents` | Event-name map, and the same with defaults applied |
| `DEFAULT_LIVE_AGENT_EVENTS` | The default event names |
| `AgentInfo` | Connected agent's identity |
| `MessageSender` | `'bot' \| 'user' \| 'agent' \| 'system'` |
| `MarkdownOptions` | Which markdown features are enabled |
| `FlowMiddleware` | Message interceptor for the `middleware` prop |
| `FormFieldRenderProps` | Base props shared by every field renderer |
| `EventBus` / `EventHandler` | `createEventBus()` return type and handler signature |
| `HeadlessBot` / `HeadlessBotOptions` | `createHeadlessBot()` return type and options |
| `VoiceCallPluginOptions` | `voiceCallPlugin()` options |

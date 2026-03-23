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

## Theme Utilities

| Export | Description |
|--------|-------------|
| `resolveTheme` | Merge user theme with defaults |
| `buildStyles` | Generate component styles from theme |
| `buildCSSVariables` | Generate CSS variables from theme |

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

## Types

### ChatBotProps

Main component props. See [Getting Started](./getting-started.md).

```ts
interface ChatBotProps {
  flow?: FlowConfig;
  theme?: ChatTheme;
  style?: ChatStyle;
  header?: HeaderConfig;
  branding?: BrandingConfig;
  welcomeScreen?: ReactNode;
  loginForm?: FormConfig;
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
  renderHeader?: (ctx: ChatRenderContext, defaultHeader: ReactNode) => ReactNode;
  renderInput?: (ctx: ChatRenderContext, defaultInput: ReactNode) => ReactNode;
  components?: Record<string, ComponentType<StepComponentProps>>;
  actionHandlers?: Record<string, (data: Record<string, unknown>, ctx: ActionContext) => Promise<FlowActionResult>>;
  renderFormField?: FormFieldRenderMap;
  fallbackMessage?: string | ((text: string) => string | null);
  keywords?: KeywordRoute[];
  greetingResponse?: string;
  typingDelay?: number;
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

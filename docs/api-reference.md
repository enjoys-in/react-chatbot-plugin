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
| `analyticsPlugin` | Event tracking plugin |
| `webhookPlugin` | Server webhook plugin |
| `persistencePlugin` | Local/session storage plugin |

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
  onInit?: (ctx: PluginContext) => void;
  onMessage?: (message: ChatMessage, ctx: PluginContext) => void;
  onSubmit?: (data: Record<string, unknown>, ctx: PluginContext) => void;
  onDestroy?: (ctx: PluginContext) => void;
}
```

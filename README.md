# @enjoys/react-chatbot-plugin

A customizable, plugin-based chatbot widget for React — like tawk.to but fully programmable.

[![npm](https://img.shields.io/npm/v/@enjoys/react-chatbot-plugin)](https://www.npmjs.com/package/@enjoys/react-chatbot-plugin)

## Features

- **JSON-driven flows** — Build conversational UIs with step-based JSON configuration
- **Async actions** — Run API calls on step entry with real-time loading/progress/error states
- **Custom step components** — Render your own React widgets inside flow steps
- **Dynamic routing** — Route to different steps based on API results, status codes, or custom logic
- **Plugin architecture** — Extend with analytics, webhooks, persistence, or custom plugins
- **Slash commands** — `/help`, `/back`, `/cancel`, `/restart` built-in
- **Custom header/input** — Swap the header or input with your own React components
- **Forms** — Text, select, radio, checkbox, file upload, with validation
- **Theming** — Light/dark mode, CSS variables, glassmorphism design
- **File uploads** — Drag & drop, preview, size/count limits
- **Emoji picker** — Built-in emoji selector
- **Welcome & login screens** — Optional onboarding flow
- **Branding** — Customizable footer and header

## Installation

```bash
npm install @enjoys/react-chatbot-plugin
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
      header={{ title: 'Acme Support', subtitle: 'Online', showRestart: true }}
      callbacks={{
        onFlowEnd: (data) => console.log('Flow ended:', data),
      }}
    />
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `flow` | `FlowConfig` | JSON conversation flow |
| `theme` | `ChatTheme` | Colors, fonts, border radius, light/dark mode |
| `style` | `ChatStyle` | CSS overrides for launcher, window, header, etc. |
| `header` | `HeaderConfig` | Title, subtitle, avatar, showClose, showMinimize, showRestart |
| `branding` | `BrandingConfig` | "Powered by" footer, logo |
| `welcomeScreen` | `ReactNode` | Custom welcome screen content |
| `loginForm` | `FormConfig` | Pre-chat login/identification form |
| `callbacks` | `ChatCallbacks` | Event handlers (onOpen, onClose, onMessageSend, etc.) |
| `plugins` | `ChatPlugin[]` | Array of plugins |
| `initialMessages` | `ChatMessage[]` | Pre-populated messages |
| `inputPlaceholder` | `string` | Input placeholder text |
| `position` | `'bottom-right' \| 'bottom-left'` | Widget position |
| `enableEmoji` | `boolean` | Show emoji picker |
| `fileUpload` | `FileUploadConfig` | File upload settings |
| `renderHeader` | `(ctx, defaultHeader) => ReactNode` | Custom header renderer |
| `renderInput` | `(ctx, defaultInput) => ReactNode` | Custom input renderer |
| `components` | `Record<string, ComponentType<StepComponentProps>>` | Custom React components for flow steps |
| `actionHandlers` | `Record<string, (data, ctx) => Promise<FlowActionResult>>` | Async action handlers for flow steps |
| `defaultOpen` | `boolean` | Start with chat open |
| `showLauncher` | `boolean` | Show/hide launcher button |
| `launcherIcon` | `ReactNode` | Custom launcher icon |
| `closeIcon` | `ReactNode` | Custom close icon |
| `zIndex` | `number` | CSS z-index |
| `className` | `string` | Root element class name |

## Conversation Flows

Flows are JSON objects with steps. Each step can have messages, quick replies, forms, conditional branching, and delays.

```ts
const flow: FlowConfig = {
  startStep: 'welcome',
  steps: [
    {
      id: 'welcome',
      message: 'Welcome! What brings you here?',
      quickReplies: [
        { label: 'Buy', value: 'buy', next: 'purchase' },
        { label: 'Help', value: 'help', next: 'support' },
      ],
    },
    {
      id: 'purchase',
      message: 'Great choice!',
      form: {
        id: 'order',
        title: 'Order Details',
        fields: [
          { name: 'email', type: 'email', label: 'Email', required: true },
          { name: 'quantity', type: 'number', label: 'Quantity', required: true },
        ],
        submitLabel: 'Place Order',
      },
      next: 'thanks',
    },
    {
      id: 'support',
      message: 'Please describe your issue.',
    },
    {
      id: 'thanks',
      message: 'Order placed! We will email you shortly.',
    },
  ],
};
```

### Step Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique step identifier |
| `message` | `string` | Single bot message |
| `messages` | `string[]` | Multiple bot messages |
| `quickReplies` | `FlowQuickReply[]` | Clickable option buttons |
| `form` | `FormConfig` | Inline form |
| `next` | `string` | Next step ID (auto-advance) |
| `delay` | `number` | Typing delay in ms (default: 500) |
| `condition` | `FlowCondition` | Conditional branching |
| `component` | `string` | Key into `components` map — renders a custom React widget |
| `asyncAction` | `FlowAsyncAction` | Async action to run when the step is entered |

### Conditional Branching

```ts
{
  id: 'check_age',
  message: 'Checking your age...',
  condition: {
    field: 'age',
    operator: 'gt',  // eq, neq, contains, gt, lt
    value: 18,
    then: 'adult_flow',
    else: 'minor_flow',
  },
}
```

## Async Actions

Run API calls, validations, or any async work when a step is entered. The chat shows real-time progress messages and routes based on the result.

```tsx
import type { FlowConfig, FlowActionResult, ActionContext } from '@enjoys/react-chatbot-plugin';

const flow: FlowConfig = {
  startStep: 'collect_email',
  steps: [
    {
      id: 'collect_email',
      message: 'Enter your email to verify:',
      form: {
        id: 'email-form',
        title: 'Email Verification',
        fields: [{ name: 'email', type: 'email', label: 'Email', required: true }],
        submitLabel: 'Verify',
      },
      next: 'verify',
    },
    {
      id: 'verify',
      message: 'Starting verification...',
      asyncAction: {
        handler: 'verify-email',        // key into actionHandlers
        loadingMessage: '🔄 Verifying...', // shown while running
        successMessage: '✅ Verified!',    // shown on success
        errorMessage: '❌ Failed.',        // shown on error/throw
        onSuccess: 'done',                // next step on success
        onError: 'retry',                 // next step on error
      },
    },
    { id: 'done', message: 'Your email is verified! 🎉' },
    {
      id: 'retry',
      message: 'Verification failed. Try again?',
      quickReplies: [
        { label: 'Retry', value: 'retry', next: 'collect_email' },
      ],
    },
  ],
};

<ChatBot
  flow={flow}
  actionHandlers={{
    'verify-email': async (data, ctx) => {
      ctx.updateMessage('📡 Contacting server...');   // update status message in real-time
      await fetch('/api/verify', { method: 'POST', body: JSON.stringify(data) });
      ctx.updateMessage('🔐 Validating...');
      // return result — status determines routing
      return { status: 'success', data: { verified: true } };
    },
  }}
/>
```

### FlowAsyncAction Properties

| Property | Type | Description |
|----------|------|-------------|
| `handler` | `string` | Key into `actionHandlers` prop |
| `loadingMessage` | `string` | Message shown while running (default: "Processing...") |
| `successMessage` | `string` | Message shown on success |
| `errorMessage` | `string` | Message shown on error or exception |
| `onSuccess` | `string` | Next step ID on success |
| `onError` | `string` | Next step ID on error |
| `routes` | `Record<string, string>` | Map of `result.status` → step ID for custom routing |

### ActionContext

| Method | Description |
|--------|-------------|
| `updateMessage(text)` | Update the loading/status message text in real-time |

### FlowActionResult

Returned by action handlers to control routing and data:

| Property | Type | Description |
|----------|------|-------------|
| `status` | `string` | `'success'`, `'error'`, or any custom string for route matching |
| `data` | `Record<string, unknown>` | Data to merge into collected data |
| `message` | `string` | Override the success/error message |
| `next` | `string` | Override all routing — go directly to this step |

**Routing priority:** `result.next` → `routes[status]` → `onSuccess/onError` → `step.next`

## Custom Step Components

Render your own interactive React widgets inside flow steps. Components receive collected data and an `onComplete` callback to continue the flow.

```tsx
import type { StepComponentProps } from '@enjoys/react-chatbot-plugin';

const PlanSelector: React.FC<StepComponentProps> = ({ data, onComplete }) => (
  <div>
    <p>Hi {data.name as string}! Choose a plan:</p>
    <button onClick={() => onComplete({ status: 'success', data: { plan: 'basic' }, next: 'basic_info' })}>
      Basic — $9/mo
    </button>
    <button onClick={() => onComplete({ status: 'success', data: { plan: 'pro' }, next: 'pro_info' })}>
      Pro — $29/mo
    </button>
  </div>
);

const flow: FlowConfig = {
  startStep: 'choose_plan',
  steps: [
    {
      id: 'choose_plan',
      message: 'Select your plan:',
      component: 'PlanSelector',   // key into components map
    },
    { id: 'basic_info', message: 'Basic plan selected!' },
    { id: 'pro_info', message: 'Pro plan selected!' },
  ],
};

<ChatBot
  flow={flow}
  components={{ PlanSelector }}   // register your components here
/>
```

### StepComponentProps

| Property | Type | Description |
|----------|------|-------------|
| `stepId` | `string` | The step ID that owns this component |
| `data` | `Record<string, unknown>` | All collected flow/form data |
| `onComplete` | `(result?: FlowActionResult) => void` | Call to complete the step and route to the next |

## Dynamic Routing

Use `asyncAction.routes` to map API result statuses to different steps:

```tsx
{
  id: 'check_account',
  message: 'Looking up your account...',
  asyncAction: {
    handler: 'check-account',
    loadingMessage: '🔍 Searching...',
    routes: {
      admin: 'admin_panel',    // result.status === 'admin'
      vip: 'vip_welcome',      // result.status === 'vip'
      active: 'dashboard',     // result.status === 'active'
      not_found: 'register',   // result.status === 'not_found'
    },
  },
}
```

The action handler returns the status that determines which route to take:

```ts
'check-account': async (data, ctx) => {
  const user = await api.lookup(data.username);
  if (!user) return { status: 'not_found' };
  return { status: user.role, data: { userId: user.id } };
}
```

## Slash Commands

Users can type these commands in the chat input:

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/back` | Go back to the previous step |
| `/cancel` | Same as /back — cancel current step |
| `/restart` | Restart the conversation from the beginning |

## Custom Header & Input

Use `renderHeader` and `renderInput` to replace the default header or input with your own components. Both receive a `ChatRenderContext` object and the default element:

```tsx
<ChatBot
  flow={flow}
  renderHeader={(ctx, defaultHeader) => (
    <div style={{ padding: 16, background: '#333', color: '#fff' }}>
      <h3>My Custom Header</h3>
      <p>Step: {ctx.currentStepId ?? 'none'}</p>
      <button onClick={ctx.restartSession}>Restart</button>
      <button onClick={ctx.toggleChat}>Close</button>
    </div>
  )}
  renderInput={(ctx, defaultInput) => {
    // Use the default input but wrap it
    return (
      <div>
        {defaultInput}
        <small>Step: {ctx.currentStepId}</small>
      </div>
    );
  }}
/>
```

### ChatRenderContext

| Property | Type | Description |
|----------|------|-------------|
| `currentStepId` | `string \| null` | Current flow step ID |
| `isOpen` | `boolean` | Whether the chat window is open |
| `messages` | `ChatMessage[]` | All messages |
| `collectedData` | `Record<string, unknown>` | Collected form/flow data |
| `toggleChat` | `() => void` | Open/close the chat |
| `restartSession` | `() => void` | Restart from beginning |
| `sendMessage` | `(text: string) => void` | Send a message programmatically |

## Theming

```tsx
<ChatBot
  theme={{
    primaryColor: '#6C5CE7',
    headerBg: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
    borderRadius: '20px',
    mode: 'dark', // or 'light'
    fontFamily: '"Inter", sans-serif',
    windowWidth: '400px',
    windowHeight: '600px',
  }}
/>
```

All theme values are also exposed as CSS variables (`--cb-primary`, `--cb-header-bg`, etc.).

## Plugins

### Built-in Plugins

```tsx
import { analyticsPlugin, webhookPlugin, persistencePlugin } from '@enjoys/react-chatbot-plugin';

<ChatBot
  plugins={[
    analyticsPlugin({
      onTrack: (event, data) => console.log(event, data),
    }),
    webhookPlugin({
      url: '/api/chatbot-webhook',
      events: ['message', 'submit'],
    }),
    persistencePlugin({
      storageKey: 'my_chat',
      storage: 'local', // or 'session'
    }),
  ]}
/>
```

### Custom Plugin

```ts
import type { ChatPlugin } from '@enjoys/react-chatbot-plugin';

const myPlugin: ChatPlugin = {
  name: 'my-plugin',
  onInit(ctx) {
    console.log('Chat initialized');
  },
  onMessage(message, ctx) {
    console.log('Message:', message);
  },
  onSubmit(data, ctx) {
    console.log('Form submitted:', data);
  },
  onDestroy(ctx) {
    console.log('Chat destroyed');
  },
};
```

### Plugin Context

| Method | Description |
|--------|-------------|
| `sendMessage(text)` | Send a user message |
| `addBotMessage(text)` | Add a bot message |
| `getMessages()` | Get all messages |
| `getData()` | Get collected data |
| `setData(key, value)` | Set data |
| `on(event, handler)` | Subscribe to events |
| `emit(event, ...args)` | Emit events |

## Forms

Forms can be used in flows or as a login screen:

```ts
const form: FormConfig = {
  id: 'contact',
  title: 'Contact Us',
  description: 'Fill out the form below',
  fields: [
    { name: 'name', type: 'text', label: 'Name', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true,
      validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Invalid email' } },
    { name: 'priority', type: 'select', label: 'Priority', options: [
      { label: 'Low', value: 'low' },
      { label: 'High', value: 'high' },
    ]},
    { name: 'message', type: 'textarea', label: 'Message' },
    { name: 'file', type: 'file', label: 'Attachment', accept: 'image/*,.pdf' },
  ],
  submitLabel: 'Send',
};
```

**Supported field types:** `text`, `email`, `password`, `number`, `tel`, `url`, `textarea`, `select`, `multiselect`, `radio`, `checkbox`, `file`, `date`, `time`, `hidden`

## Callbacks

```tsx
<ChatBot
  callbacks={{
    onOpen: () => {},
    onClose: () => {},
    onMessageSend: (msg) => {},
    onMessageReceive: (msg) => {},
    onSubmit: (data) => {},
    onLogin: (data) => {},
    onFormSubmit: (formId, data) => {},
    onQuickReply: (value, label) => {},
    onFileUpload: (files) => {},
    onFlowEnd: (collectedData) => {},
    onError: (error) => {},
    onEvent: (event, payload) => {},
  }}
/>
```

## File Upload

```tsx
<ChatBot
  fileUpload={{
    enabled: true,
    accept: 'image/*,.pdf,.doc,.docx',
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3,
  }}
/>
```

## Exported Components

All internal components are exported for advanced use cases:

`ChatBot`, `ChatHeader`, `ChatInput`, `ChatWindow`, `Launcher`, `MessageBubble`, `MessageList`, `QuickReplies`, `TypingIndicator`, `WelcomeScreen`, `LoginScreen`, `Branding`, `EmojiPicker`, `FileUploadButton`, `FilePreviewList`, `DynamicForm`, `TextField`, `SelectField`, `RadioField`, `CheckboxField`, `FileUploadField`

**Icons:** `SendIcon`, `ChatBubbleIcon`, `CloseIcon`, `MinimizeIcon`, `EmojiIcon`, `AttachmentIcon`, `FileIcon`, `ImageIcon`, `RemoveIcon`, `RestartIcon`

**Engine & Core:** `FlowEngine`, `PluginManager`, `useChat`, `ChatContext`, `useChatContext`

**Theme utilities:** `resolveTheme`, `buildStyles`, `buildCSSVariables`

## Development

```bash
# Install dependencies
bun install

# Run demo
bun run dev

# Build library
bun run build
```

## License

MIT

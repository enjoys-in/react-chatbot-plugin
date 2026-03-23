# Custom Header & Input

Replace the default header or input via the `customizeChat` slot map.

## Custom Header

Pass a custom `component` (ReactNode) to the `header` slot:

```tsx
const MyHeader = (
  <div style={{ padding: 16, background: '#333', color: '#fff' }}>
    <h3>My Custom Header</h3>
  </div>
);

<ChatBot
  flow={flow}
  customizeChat={{
    header: {
      config: { title: 'Support Bot', showRestart: true },
      component: MyHeader,
    },
  }}
/>
```

When `component` is provided it replaces the default header entirely. If omitted, the default header renders using `config`.

## Custom Input

Pass a custom `component` (ReactNode) to the `input` slot:

```tsx
const MyInput = (
  <div style={{ padding: 12 }}>
    <input type="text" placeholder="Type here..." />
  </div>
);

<ChatBot
  flow={flow}
  customizeChat={{
    input: { component: MyInput },
  }}
/>
```

## HeaderSlotProps

All fields available inside `customizeChat.header`:

| Property | Type | Description |
|----------|------|-------------|
| `config` | `HeaderConfig` | Title, subtitle, avatar, showClose, showMinimize, showRestart |
| `component` | `ReactNode` | Custom header element — replaces default when provided |
| `ctx` | `ChatRenderContext` | Current state, toggleChat, restartSession, sendMessage |
| `styles` | `ChatStyles` | Resolved theme styles |
| `onClose` | `() => void` | Close the chat window |
| `onRestart` | `() => void` | Restart the conversation |
| `logo` | `string` | Logo URL from branding config |
| `logoWidth` | `string` | Logo width |

## InputSlotProps

All fields available inside `customizeChat.input`:

| Property | Type | Description |
|----------|------|-------------|
| `component` | `ReactNode` | Custom input element — replaces default when provided |
| `ctx` | `ChatRenderContext` | Current state, toggleChat, restartSession, sendMessage |
| `onSend` | `(text, files?) => void` | Send handler |
| `placeholder` | `string` | Input placeholder text |
| `primaryColor` | `string` | Theme primary color |
| `isDark` | `boolean` | Whether dark mode is active |
| `enableEmoji` | `boolean` | Whether emoji picker is enabled |
| `fileUpload` | `FileUploadConfig` | File upload settings |
| `onFileUpload` | `(files) => void` | File upload callback |

## ChatRenderContext

Available via `customizeChat.header.ctx` and `customizeChat.input.ctx`:

| Property | Type | Description |
|----------|------|-------------|
| `currentStepId` | `string \| null` | Current flow step ID |
| `isOpen` | `boolean` | Whether the chat window is open |
| `messages` | `ChatMessage[]` | All messages in the chat |
| `collectedData` | `Record<string, unknown>` | All collected form/flow data |
| `toggleChat` | `() => void` | Open or close the chat window |
| `restartSession` | `() => void` | Restart the conversation |
| `sendMessage` | `(text: string) => void` | Send a message programmatically |

## Configuring Header Without Replacing

Just pass `config` — no `component` needed:

```tsx
<ChatBot
  flow={flow}
  customizeChat={{
    header: {
      config: {
        title: 'Acme Support',
        subtitle: 'Online',
        showRestart: true,
        showMinimize: true,
      },
    },
  }}
/>
```

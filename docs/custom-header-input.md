# Custom Header & Input

Replace the default header or input with your own React components.

## renderHeader

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
/>
```

## renderInput

```tsx
<ChatBot
  flow={flow}
  renderInput={(ctx, defaultInput) => (
    <div>
      {defaultInput}
      <small>Current step: {ctx.currentStepId}</small>
    </div>
  )}
/>
```

## ChatRenderContext

Both `renderHeader` and `renderInput` receive a `ChatRenderContext` object:

| Property | Type | Description |
|----------|------|-------------|
| `currentStepId` | `string \| null` | Current flow step ID |
| `isOpen` | `boolean` | Whether the chat window is open |
| `messages` | `ChatMessage[]` | All messages in the chat |
| `collectedData` | `Record<string, unknown>` | All collected form/flow data |
| `toggleChat` | `() => void` | Open or close the chat window |
| `restartSession` | `() => void` | Restart the conversation |
| `sendMessage` | `(text: string) => void` | Send a message programmatically |

## Wrapping the Default

The second argument is the default element. You can wrap it:

```tsx
renderHeader={(ctx, defaultHeader) => (
  <div>
    {defaultHeader}
    <div style={{ padding: '4px 16px', background: '#f0ebff', fontSize: 12 }}>
      Step: {ctx.currentStepId ?? 'Start'}
    </div>
  </div>
)}
```

## Replacing Completely

Or replace it entirely:

```tsx
renderInput={(ctx) => (
  <div style={{ padding: 12 }}>
    <input
      type="text"
      placeholder="Type here..."
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.currentTarget.value) {
          ctx.sendMessage(e.currentTarget.value);
          e.currentTarget.value = '';
        }
      }}
    />
  </div>
)}
```

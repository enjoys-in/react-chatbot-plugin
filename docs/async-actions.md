# Async Actions

Run API calls, validations, or any async work when a flow step is entered. Show real-time progress and route based on results.

## Basic Usage

Add `asyncAction` to a flow step:

```ts
{
  id: 'verify',
  message: 'Starting verification...',
  asyncAction: {
    handler: 'verify-email',           // Key into actionHandlers
    loadingMessage: '🔄 Verifying...', // Shown while running
    successMessage: '✅ Verified!',     // Shown on success
    errorMessage: '❌ Failed.',         // Shown on error/throw
    onSuccess: 'success_step',         // Next step on success
    onError: 'error_step',             // Next step on error
  },
}
```

Register the handler via the `actionHandlers` prop:

```tsx
<ChatBot
  flow={flow}
  actionHandlers={{
    'verify-email': async (data, ctx) => {
      // data = all collected form/flow data
      // ctx = ActionContext with updateMessage()
      const res = await fetch('/api/verify', {
        method: 'POST',
        body: JSON.stringify({ email: data.email }),
      });
      if (!res.ok) return { status: 'error' };
      return { status: 'success', data: { verified: true } };
    },
  }}
/>
```

## Real-Time Progress Messages

Use `ctx.updateMessage()` to update the status message while the action is running:

```ts
'verify-email': async (data, ctx) => {
  ctx.updateMessage('🔍 Checking email format...');
  await delay(800);

  ctx.updateMessage('📡 Contacting server...');
  const res = await fetch('/api/verify', { method: 'POST', body: JSON.stringify(data) });

  ctx.updateMessage('🔐 Validating response...');
  const result = await res.json();

  return { status: 'success', data: result };
}
```

The user sees the message update in real-time as each step completes.

## FlowAsyncAction Properties

| Property | Type | Description |
|----------|------|-------------|
| `handler` | `string` | Key into `actionHandlers` prop (required) |
| `loadingMessage` | `string` | Initial message while running (default: "Processing...") |
| `successMessage` | `string` | Message shown on `status: 'success'` |
| `errorMessage` | `string` | Message shown on `status: 'error'` or exception |
| `onSuccess` | `string` | Next step ID on success |
| `onError` | `string` | Next step ID on error/exception |
| `routes` | `Record<string, string>` | Map `result.status` → step ID (see [Dynamic Routing](./dynamic-routing.md)) |

## FlowActionResult

Returned by action handlers:

```ts
interface FlowActionResult {
  status: string;                    // 'success', 'error', or custom
  data?: Record<string, unknown>;    // Merged into collectedData
  message?: string;                  // Override success/error message
  next?: string;                     // Override all routing
}
```

## ActionContext

```ts
interface ActionContext {
  updateMessage: (text: string) => void;  // Update the status message
}
```

## Routing Priority

When the action completes, the next step is determined in this order:

1. `result.next` — Explicit from the handler (highest priority)
2. `routes[result.status]` — Status-based routing
3. `onSuccess` / `onError` — Success/error defaults
4. `step.next` — Fallback

## Error Handling

If the handler **throws an exception**, it's treated as an error:
- The `errorMessage` is shown
- The `onError` step is navigated to (if set)

```ts
'failing-api': async (data, ctx) => {
  ctx.updateMessage('🔗 Connecting...');
  await fetch('/api/process');  // This throws!
  // Never reaches here — caught automatically
}
```

## Blocking User Input

During an async action, user text input is blocked with a helpful message. Users can still type `/back` to go back.

## Full Example

```ts
const flow: FlowConfig = {
  startStep: 'collect',
  steps: [
    {
      id: 'collect',
      message: 'Enter your email:',
      form: {
        id: 'email',
        fields: [{ name: 'email', type: 'email', label: 'Email', required: true }],
        submitLabel: 'Verify',
      },
      next: 'verify',
    },
    {
      id: 'verify',
      message: 'Verifying...',
      asyncAction: {
        handler: 'verify',
        loadingMessage: '🔄 Checking...',
        successMessage: '✅ Verified!',
        errorMessage: '❌ Failed.',
        onSuccess: 'done',
        onError: 'retry',
      },
    },
    { id: 'done', message: 'All set! 🎉' },
    {
      id: 'retry',
      message: 'Try again?',
      quickReplies: [{ label: 'Retry', value: 'retry', next: 'collect' }],
    },
  ],
};
```

## Demo

See **Async Actions / API Calls** demo for email verification, payment processing, and order lookup examples.

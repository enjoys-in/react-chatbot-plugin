# Basic Flows

Flows are JSON objects that define a conversation tree. Each step has an ID, messages, and routing logic.

## FlowConfig Structure

```ts
import type { FlowConfig } from '@enjoys/react-chatbot-plugin';

const flow: FlowConfig = {
  startStep: 'greeting',  // ID of the first step
  steps: [
    { id: 'greeting', message: 'Hello!', next: 'step2' },
    { id: 'step2', message: 'How can I help?' },
  ],
};
```

## Step Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique step identifier (required) |
| `message` | `string` | Single bot message |
| `messages` | `string[]` | Multiple bot messages (sent sequentially) |
| `quickReplies` | `FlowQuickReply[]` | Clickable option buttons |
| `form` | `FormConfig` | Inline form (see [Forms](./forms.md)) |
| `next` | `string` | Auto-advance to this step ID |
| `delay` | `number` | Typing delay in ms (default: 500) |
| `condition` | `FlowCondition` | Conditional branching |
| `component` | `string` | Key into `components` map |
| `asyncAction` | `FlowAsyncAction` | Async action config |

## Single Message

```ts
{ id: 'welcome', message: 'Welcome to our chat! 👋' }
```

## Multiple Messages

Messages are sent sequentially with a typing indicator between each:

```ts
{
  id: 'intro',
  messages: [
    'Welcome to TechCorp! 🚀',
    'I can help you with products, pricing, or support.',
    'What would you like to know?',
  ],
}
```

## Quick Replies

Clickable buttons that let users choose an option:

```ts
{
  id: 'menu',
  message: 'What would you like to do?',
  quickReplies: [
    { label: '💬 Sales', value: 'sales', next: 'sales' },
    { label: '🛠 Support', value: 'support', next: 'support' },
    { label: '📋 Feedback', value: 'feedback', next: 'feedback' },
  ],
}
```

Each quick reply has:
- `label` — Text shown on the button
- `value` — Value stored in collected data
- `next` — Step ID to navigate to when clicked
- `icon` — Optional icon/emoji

## Auto-Advance

Use `next` to automatically move to the next step (no user input required):

```ts
{ id: 'step1', message: 'Processing...', next: 'step2' },
{ id: 'step2', message: 'Done! Here are your results.' },
```

## Custom Delays

Control the typing indicator duration:

```ts
{
  id: 'slow_step',
  message: 'Let me think about that...',
  delay: 2000,  // Show typing for 2 seconds
  next: 'answer',
}
```

## Looping Back

Steps can loop back to any previous step:

```ts
{
  id: 'goodbye',
  message: 'Anything else?',
  quickReplies: [
    { label: 'Yes', value: 'yes', next: 'menu' },  // Back to menu
    { label: 'No', value: 'no', next: 'bye' },
  ],
}
```

## Demo

See **Basic Greeting** and **Multi-Step Flow** demos in the demo app for interactive examples.

## Next

- [Forms & Validation](./forms.md) — Add forms to your steps
- [Conditional Branching](./conditional-branching.md) — Route based on data

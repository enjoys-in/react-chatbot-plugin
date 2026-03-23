# Getting Started

## Installation

```bash
npm install @enjoys/react-chatbot-plugin
# or
bun add @enjoys/react-chatbot-plugin
# or
yarn add @enjoys/react-chatbot-plugin
```

**Peer dependencies:** `react >= 18.0.0`, `react-dom >= 18.0.0`

## Minimal Example

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
    { id: 'support', message: 'Please describe your issue.' },
  ],
};

function App() {
  return <ChatBot flow={flow} />;
}
```

This renders a chat launcher in the bottom-right corner. Click it to open the chat window and interact with the flow.

## Adding Customization

```tsx
<ChatBot
  flow={flow}
  theme={{
    primaryColor: '#6C5CE7',
    headerBg: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
    borderRadius: '20px',
  }}
  header={{
    title: 'My Bot',
    subtitle: 'Online',
    showClose: true,
    showRestart: true,
  }}
  callbacks={{
    onFlowEnd: (data) => console.log('Collected:', data),
  }}
/>
```

## What's Included

| Feature | Description |
|---------|-------------|
| Flow engine | JSON-driven conversation steps |
| Forms | 15+ field types with validation |
| Quick replies | Clickable option buttons |
| Async actions | API calls with progress updates |
| Custom components | React widgets in steps |
| Dynamic routing | Route based on API results |
| Slash commands | /help, /back, /restart |
| Theming | Light/dark, CSS variables |
| Plugins | 30 built-in plugins (analytics, AI, i18n, CRM, etc.) |
| File upload | Drag & drop with preview |

## Next Steps

- [Basic Flows](./basic-flows.md) — Learn how to build conversation flows
- [Forms](./forms.md) — Add inline forms to your steps
- [Async Actions](./async-actions.md) — Connect to APIs

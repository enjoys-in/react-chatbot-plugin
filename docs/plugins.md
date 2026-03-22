# Plugins

Extend the chatbot with analytics, webhooks, persistence, or your own custom plugins.

## Built-in Plugins

### Analytics Plugin

Track all chat events:

```tsx
import { analyticsPlugin } from '@enjoys/react-chatbot-plugin';

<ChatBot
  plugins={[
    analyticsPlugin({
      onTrack: (event, data) => {
        console.log(event, data);
        // Send to your analytics service
      },
    }),
  ]}
/>
```

### Webhook Plugin

Send events to a server endpoint:

```tsx
import { webhookPlugin } from '@enjoys/react-chatbot-plugin';

<ChatBot
  plugins={[
    webhookPlugin({
      url: '/api/chatbot-webhook',
      events: ['message', 'submit', 'open', 'close'],
    }),
  ]}
/>
```

### Persistence Plugin

Save and restore chat state across page loads:

```tsx
import { persistencePlugin } from '@enjoys/react-chatbot-plugin';

<ChatBot
  plugins={[
    persistencePlugin({
      storageKey: 'my_chat',
      storage: 'local',  // 'local' or 'session'
    }),
  ]}
/>
```

## Custom Plugin

```ts
import type { ChatPlugin } from '@enjoys/react-chatbot-plugin';

const myPlugin: ChatPlugin = {
  name: 'my-plugin',
  onInit(ctx) {
    console.log('Chat initialized');
  },
  onMessage(message, ctx) {
    console.log('New message:', message);
  },
  onSubmit(data, ctx) {
    console.log('Form submitted:', data);
  },
  onDestroy(ctx) {
    console.log('Chat destroyed');
  },
};
```

## Plugin Context

Methods available in the plugin context:

| Method | Description |
|--------|-------------|
| `sendMessage(text)` | Send a user message |
| `addBotMessage(text)` | Add a bot message |
| `getMessages()` | Get all messages |
| `getData()` | Get collected data |
| `setData(key, value)` | Set a data value |
| `on(event, handler)` | Subscribe to events |
| `emit(event, ...args)` | Emit custom events |

## Plugin Lifecycle

| Hook | When Called |
|------|------------|
| `onInit` | Chat component mounts |
| `onMessage` | Any message is added |
| `onSubmit` | Form is submitted |
| `onDestroy` | Chat component unmounts |

## Multiple Plugins

Combine plugins — they all run independently:

```tsx
<ChatBot
  plugins={[
    analyticsPlugin({ onTrack: console.log }),
    webhookPlugin({ url: '/api/webhook', events: ['submit'] }),
    persistencePlugin({ storageKey: 'chat' }),
    myCustomPlugin,
  ]}
/>
```

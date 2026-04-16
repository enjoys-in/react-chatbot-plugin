# Live Agent — WebSocket / Socket.IO Support

Connect your chatbot to **real human agents** via WebSocket or Socket.IO. The bot flow runs normally, and at any point the conversation can be handed off to a live agent. Messages are relayed in real-time with system notifications, typing indicators, queue updates, and session persistence across page refreshes.

---

## Quick Start

### Socket.IO

```tsx
import { ChatBot } from '@enjoys/react-chatbot-plugin';
import { io } from 'socket.io-client';

const socket = io('https://support.example.com');

function App() {
  return (
    <ChatBot
      flow={botFlow}
      liveAgent={{
        type: 'socketio',
        instance: socket,
        sessionId: 'user_123',
        persistSession: true,
        onAgentJoined: (agent) => console.log(`${agent.name} joined`),
        onAgentLeft: (agent) => console.log(`${agent.name} left`),
      }}
    />
  );
}
```

### Native WebSocket

```tsx
const ws = new WebSocket('wss://support.example.com/chat');

<ChatBot
  flow={botFlow}
  liveAgent={{
    type: 'ws',
    instance: ws,
    sessionId: 'user_456',
  }}
/>
```

---

## How It Works

1. **Bot flow runs normally** — The user interacts with JSON-driven flows, forms, keywords, etc.
2. **Handoff trigger** — When the user clicks "Talk to Agent" (or any trigger you define), the system emits `transfer:request` to the server.
3. **Queue** — Server can send `queue:update` events with queue position.
4. **Agent joins** — Server emits `agent:joined` → system message "Rahul joined the chat".
5. **Real-time chat** — User messages are forwarded to the server; agent messages appear in the chat.
6. **Agent leaves** — Server emits `agent:left` → system message "Rahul left the chat". Can revert to bot mode.
7. **Session persistence** — Messages are saved to `localStorage` and restored on page refresh.

---

## Configuration

### `LiveAgentConfig`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'ws' \| 'socketio'` | **required** | Transport protocol |
| `instance` | `WebSocket \| Socket` | **required** | Pre-created connection instance |
| `sessionId` | `string` | auto-generated | Unique session ID (persists across refreshes) |
| `events` | `LiveAgentEvents` | see below | Customize server event names |
| `persistSession` | `boolean` | `true` | Persist messages to `localStorage` |
| `storageKey` | `string` | `'chatbot_live_'` | `localStorage` key prefix |
| `onAgentJoined` | `(agent: AgentInfo) => void` | — | Called when an agent joins |
| `onAgentLeft` | `(agent: AgentInfo) => void` | — | Called when an agent leaves |
| `onQueueUpdate` | `(position: number, estimatedWait?: number) => void` | — | Queue position update |
| `onSessionRestored` | `(messageCount: number) => void` | — | Called when session is restored from storage |
| `onConnect` | `() => void` | — | Called when adapter initializes |
| `onDisconnect` | `() => void` | — | Called when adapter is destroyed |
| `onError` | `(error: Error) => void` | — | Error callback |

### `AgentInfo`

```ts
interface AgentInfo {
  name: string;
  avatar?: string;
  department?: string;
}
```

---

## Event Names

Default event names can be customized via `events`:

| Event | Default | Direction | Description |
|-------|---------|-----------|-------------|
| `agentMessage` | `'agent:message'` | Server → Client | Agent sends a message |
| `userMessage` | `'user:message'` | Client → Server | User sends a message |
| `agentJoined` | `'agent:joined'` | Server → Client | Agent joined the chat |
| `agentLeft` | `'agent:left'` | Server → Client | Agent left the chat |
| `agentTyping` | `'agent:typing'` | Server → Client | Agent is typing |
| `userTyping` | `'user:typing'` | Client → Server | User is typing |
| `sessionInit` | `'session:init'` | Client → Server | Initialize/restore session |
| `sessionHistory` | `'session:history'` | Server → Client | Restore previous messages |
| `transferRequest` | `'transfer:request'` | Client → Server | Request live agent |
| `transferAccepted` | `'transfer:accepted'` | Server → Client | Transfer accepted |
| `queueUpdate` | `'queue:update'` | Server → Client | Queue position update |

### Custom Events

```tsx
liveAgent={{
  type: 'socketio',
  instance: socket,
  events: {
    agentMessage: 'chat.agent.message',
    userMessage: 'chat.user.message',
    agentJoined: 'chat.agent.join',
  },
}}
```

---

## Protocol Differences

### WebSocket

Messages are JSON-encoded with an `{ event, data }` envelope:

```json
// Client → Server
{ "event": "user:message", "data": { "text": "Hello", "sessionId": "abc", "timestamp": 123 } }

// Server → Client
{ "event": "agent:message", "data": { "text": "Hi!", "agent": { "name": "Rahul" } } }
```

### Socket.IO

Uses native `.emit()` / `.on()`:

```js
// Client → Server
socket.emit('user:message', { text: 'Hello', sessionId: 'abc', timestamp: 123 });

// Server → Client
socket.emit('agent:message', { text: 'Hi!', agent: { name: 'Rahul' } });
```

---

## Plugin Alternative

If you prefer the plugin API over the `liveAgent` prop:

```tsx
import { liveAgentPlugin } from '@enjoys/react-chatbot-plugin';
import { io } from 'socket.io-client';

const socket = io('https://support.example.com');

<ChatBot
  flow={botFlow}
  plugins={[
    liveAgentPlugin({
      type: 'socketio',
      instance: socket,
      sessionId: 'user_123',
    }),
  ]}
/>
```

The plugin version uses the same `LiveAgentConfig` and provides the same features. It additionally emits/listens on the plugin event bus (`liveAgent:transfer`, `liveAgent:send`).

---

## Message Flow

```
User types "I need help"
  → sendMessage() detects isLiveAgent=true
  → adapter.send('user:message', { text, sessionId, timestamp })
  → server relays to agent dashboard

Agent types "Hi, I'm Rahul"
  → server emits 'agent:message' { text, agent: { name: 'Rahul' } }
  → useLiveAgent dispatches ADD_MESSAGE with sender='agent'
  → MessageBubble renders with agent name label
```

---

## Server Implementation (Example)

A minimal Node.js + Socket.IO server:

```js
const { Server } = require('socket.io');
const io = new Server(3001, { cors: { origin: '*' } });

const agents = new Map();
const sessions = new Map();

io.on('connection', (socket) => {
  socket.on('session:init', ({ sessionId }) => {
    sessions.set(sessionId, socket);

    // Restore history if available
    const history = getHistory(sessionId);
    if (history.length) {
      socket.emit('session:history', { messages: history });
    }

    // Notify agent dashboard
    io.to('agents').emit('new_session', { sessionId });
  });

  socket.on('user:message', ({ text, sessionId }) => {
    // Forward to assigned agent
    const agent = agents.get(sessionId);
    if (agent) {
      agent.emit('user_message', { text, sessionId });
    }
    saveMessage(sessionId, { sender: 'user', text });
  });

  socket.on('transfer:request', ({ sessionId, department }) => {
    // Assign agent logic...
    const agent = assignAgent(department);
    agents.set(sessionId, agent);

    socket.emit('transfer:accepted', {
      agent: { name: agent.name, department },
    });
    socket.emit('agent:joined', { name: agent.name });
  });
});
```

---

## Exported Types

```ts
import type {
  LiveAgentConfig,
  LiveAgentEvents,
  AgentInfo,
  ResolvedLiveAgentEvents,
} from '@enjoys/react-chatbot-plugin';

import { DEFAULT_LIVE_AGENT_EVENTS } from '@enjoys/react-chatbot-plugin';
```

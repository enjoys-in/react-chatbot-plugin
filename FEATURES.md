# Feature Roadmap — @enjoys/react-chatbot-plugin

> Suggested features for upcoming releases. Organized by priority and impact.

---

## High Impact — User-Facing

### 1. Message Reactions
- 👍👎 reaction buttons on bot/agent messages
- Useful for AI feedback loops and satisfaction tracking
- Store reactions in message metadata
- Emit `reaction` event for analytics/plugins
- Suggested prop: `enableReactions?: boolean | { emojis: string[] }`

### 2. Message Search
- Search/filter through chat history
- Highlight matching text in message bubbles
- Accessible via a search icon in the header
- Works with `persistencePlugin` for searching saved history
- Suggested prop: `enableSearch?: boolean`

### 3. Voice Input (Speech-to-Text)
- Microphone button in chat input using Web Speech API
- Real-time transcription shown in textarea
- Language-aware via `i18nPlugin` locale
- Fallback gracefully when browser doesn't support it
- Suggested prop: `enableVoice?: boolean | { lang?: string; continuous?: boolean }`

### 4. Typing Preview
- Show "User is typing..." indicator to the bot/agent side
- Emit typing events via WebSocket for live agent mode
- Configurable debounce interval
- Already partially supported by `useLiveAgent.sendTyping()` — extend to flow mode
- Suggested prop: `showUserTyping?: boolean`

### 5. Rich Cards / Carousels
- Horizontal scrollable cards with image, title, description, buttons
- New message type: `type: 'carousel'` with `cards[]` array
- Each card has: `image`, `title`, `subtitle`, `buttons[]`
- Button actions: quick reply, open URL, trigger flow step
- Great for product listings, FAQs, onboarding options
- Suggested message field: `cards?: CarouselCard[]`

### 6. Date/Time Picker
- Native date/time input as a flow step input type
- Renders browser-native `<input type="date">` or custom calendar UI
- Min/max date constraints, disabled dates
- Perfect for booking/scheduling flows
- Suggested field type: `type: 'date' | 'time' | 'datetime'`

### 7. Conversation Tags / Topics
- Group conversations by topic for multi-flow bots
- Tag messages with topic labels
- Allow switching between conversation threads
- Useful for support bots handling multiple issues
- Suggested prop: `enableTopics?: boolean | { maxTopics?: number }`

---

## High Impact — Developer-Facing

### 8. Conditional Rendering (Visibility Rules)
- Show/hide flow steps based on collected data or user segment
- `visible?: (data: Record<string, unknown>) => boolean` on steps
- Skip invisible steps automatically in the flow engine
- Use for A/B testing, user-role gating, progressive disclosure
- Suggested step field: `condition?: (ctx: FlowContext) => boolean`

### 9. Flow Composition (Sub-flows)
- Import and compose reusable flow snippets
- `subFlow?: string` reference on a step — jumps into another flow config
- Return to parent flow on sub-flow completion
- Enables DRY patterns: shared "collect email" sub-flow used in multiple bots
- Suggested step field: `subFlow?: FlowConfig | string`

### 10. Middleware Pipeline
- Pre/post message processing hooks (like Express middleware)
- `onBeforeSend`, `onAfterReceive` middleware arrays
- Each middleware can transform, block, or enrich messages
- Cleaner than plugin events for simple transformations
- Suggested prop: `middleware?: MessageMiddleware[]`

### 11. Event Bus (Pub/Sub)
- External `chatbot.on('event', handler)` API
- Allow parent app to listen to internal events without plugins
- Emit: `message`, `open`, `close`, `flowEnd`, `stepChange`, `reaction`, etc.
- Return unsubscribe function for cleanup
- Suggested: expose via `ref` or `useChat()` return value

### 12. Headless Mode
- Use the flow engine and plugin system without any UI
- For: unit testing flows, Node.js server-side bots, custom UIs
- Export `createHeadlessChat(config)` that returns engine + state
- Renders nothing — purely programmatic
- Suggested export: `createHeadlessBot(props: ChatBotProps)`

---

## Nice-to-Have

### 13. Message Edit / Delete
- Let users edit or delete their sent messages
- Show "edited" indicator on modified messages
- Emit `messageEdited` / `messageDeleted` events
- Respect `allowEdit?: boolean` and `editWindow?: number` (ms)
- Suggested prop: `allowMessageEdit?: boolean | { window?: number }`

### 14. Read Receipts
- ✓ sent, ✓✓ delivered, ✓✓ (blue) read indicators
- Works in live agent mode via WebSocket events
- Store receipt status in message metadata
- Suggested message field: `status?: 'sent' | 'delivered' | 'read'`

### 15. Conversation Rating
- End-of-chat satisfaction survey (⭐ 1-5 stars)
- Triggered on flow end or agent disconnect
- Customizable prompt text and scale
- Emit `rating` event for analytics
- Suggested prop: `enableRating?: boolean | { scale?: number; prompt?: string }`

### 16. Offline Queue
- Queue messages when device is offline
- Auto-send on reconnect (via `navigator.onLine` + event listeners)
- Show "queued" status on pending messages
- Works with both flow mode and live agent mode
- Suggested prop: `enableOfflineQueue?: boolean`

### 17. Proactive Messages
- Trigger bot messages based on page behavior
- Triggers: scroll depth, time on page, exit intent, custom events
- Configurable delay, max shows, and targeting rules
- Already partially supported by `campaignPlugin` — promote to core
- Suggested prop: `proactiveMessages?: ProactiveRule[]`

### 18. Multi-Bot / Persona Switching
- Switch between different bot personalities in one widget
- Each persona has: name, avatar, greeting, flow, theme
- Toggle via command, quick reply, or programmatic API
- Use case: "Sales Bot" vs "Support Bot" vs "Fun Bot"
- Suggested prop: `personas?: BotPersona[]`

---

## Implementation Priority (Suggested)

| Phase | Features | Version |
|-------|----------|---------|
| **v2.0** | #5 Rich Cards, #1 Reactions, #6 Date Picker | Next major |
| **v2.1** | #3 Voice Input, #11 Event Bus, #8 Conditional Rendering | |
| **v2.2** | #9 Sub-flows, #10 Middleware, #12 Headless Mode | |
| **v2.3** | #2 Search, #14 Read Receipts, #15 Rating | |
| **v2.4** | #16 Offline Queue, #17 Proactive Messages, #4 Typing Preview | |
| **v2.5** | #13 Edit/Delete, #7 Topics, #18 Multi-Persona | |

---

## Current State (v1.9.0)

- ✅ 31 plugins
- ✅ 21 demos
- ✅ Markdown rendering
- ✅ Live agent (WS + Socket.IO)
- ✅ Custom icons
- ✅ Custom slot components
- ✅ File upload
- ✅ Forms & validation
- ✅ Keyword routing
- ✅ Async actions
- ✅ Dark/light theming

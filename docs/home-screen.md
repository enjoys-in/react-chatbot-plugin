# Home Screen

The default screen the widget opens on: a greeting, a list of icon actions, and
any components you supply. It replaces the older `welcomeScreen` slot — that
still works, but `homeScreen` wins when both are set.

```tsx
<ChatBot
  flow={flow}
  homeScreen={{
    greeting: 'Hi there 👋',
    tagline: 'How can we help?',
    actions: [
      { id: 'chat',    label: 'Start a conversation', icon: <ChatIcon />, message: 'Hello!' },
      { id: 'call',    label: 'Call us',              icon: <PhoneIcon />, href: 'tel:+15550123' },
      { id: 'order',   label: 'Track an order',       icon: <BoxIcon />,   stepId: 'order' },
      { id: 'billing', label: 'Billing question',     icon: <CardIcon />,  stepId: 'billing' },
      { id: 'help',    label: 'Browse help',          icon: <HelpIcon />,  onSelect: (ctx) => ctx.sendMessage('Help') },
    ],
    cta: { label: 'Ask a question' },
  }}
/>
```

## Config

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Set `false` to keep the config but skip the screen |
| `greeting` | `ReactNode` | — | Muted line above the tagline |
| `tagline` | `ReactNode` | — | The prominent line |
| `avatar` | `string` | — | Square avatar above the greeting |
| `actions` | `HomeScreenAction[]` | `[]` | Icon rows — see below |
| `sections` | `HomeScreenSection[]` | `[]` | Your own components |
| `cta` | `HomeScreenCta \| null` | `Ask a question` | Primary button; `null` removes it |
| `masthead` | `boolean` | `false` | Paint the greeting area with `theme.headerBg` |

## Actions

Each row takes an `icon` as a `ReactNode`, so bring whatever icon set you already
use — Phosphor, Lucide, an `<img>`, or an emoji. Five rows read comfortably
before the list starts scrolling.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Stable key, also reported to `callbacks.onHomeAction` |
| `label` | `string` | Row title |
| `description` | `string` | Optional muted second line |
| `icon` | `ReactNode` | Leading glyph, on a tinted plate |
| `iconBackground` | `string` | Plate tint (defaults to the theme accent) |
| `accessory` | `ReactNode \| null` | Trailing element; defaults to a chevron, `null` for none |
| `disabled` | `boolean` | Dims the row and blocks interaction |

**What a row does**, in order of precedence:

| Field | Behaviour |
|-------|-----------|
| `onSelect` | Runs your handler with `HomeScreenContext` |
| `message` | Sends the text as the visitor, then opens the conversation |
| `stepId` | Jumps the flow to that step, then opens the conversation |
| `href` | Renders an `<a target="_blank">` instead of a button |
| *(none)* | Just opens the conversation |

A row that jumps to a `stepId` shows only that step — the flow's start step is
not also injected.

## Sections — the component shell

A section is your component dropped into the home screen. By default it's
wrapped in a card that matches the action list, so it sits flush with the
built-in furniture. Set `shell: false` to render it bare and own the whole box.

```tsx
const StatusPanel: React.FC<HomeScreenContext> = ({ sendMessage }) => (
  <button onClick={() => sendMessage('What is affecting webhooks?')}>
    Webhooks degraded — ask about it
  </button>
);

homeScreen={{
  sections: [
    // Bare: your component owns its own box
    { id: 'promo',  component: <PromoBanner />, shell: false, placement: 'above' },
    // Shelled: wrapped in a card, with an optional heading
    { id: 'status', title: 'System status', component: StatusPanel },
  ],
}}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | — | Stable key |
| `title` | `string` | — | Heading inside the shell |
| `component` | `ReactNode \| ComponentType<HomeScreenContext>` | — | Element, or a component given the context as props |
| `shell` | `boolean` | `true` | Wrap in the card |
| `placement` | `'above' \| 'below'` | `'below'` | Position relative to the action list |

Pass a **component** (not an element) and it receives `HomeScreenContext` as its
props, so your UI can drive the chat without touching context directly.

## HomeScreenContext

Handed to every `onSelect` and to every section component:

| Member | Type | Description |
|--------|------|-------------|
| `openChat` | `() => void` | Leave home, show the conversation |
| `sendMessage` | `(text: string) => void` | Send as the visitor and open the conversation |
| `goToStep` | `(stepId: string) => void` | Jump the flow to a step and open the conversation |
| `data` | `Record<string, unknown>` | Everything the flow and its forms have collected |
| `close` | `() => void` | Close the widget |

## Replacing the whole screen

```tsx
customizeChat={{
  homeScreen: {
    component: ({ config, ctx }) => <MyHome {...config} onStart={ctx.openChat} />,
  },
}}
```

The slot takes an element or a render function receiving `{ config, ctx }`. When
set, it replaces the built-in screen entirely — `actions` and `sections` are
yours to render.

## Tracking taps

```tsx
callbacks={{ onHomeAction: (id) => analytics.track('home_action', { id }) }}
```

Fires with the action's `id` before its own handler runs.

## Demo

`bun run dev`, then open the **Home Screen** demo under *Components*.

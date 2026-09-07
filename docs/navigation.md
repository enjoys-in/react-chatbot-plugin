# Navigation

> The `navigation` prop turns the widget into a multi-screen shell with a
> persistent bottom tab bar — Home, Messages, and any tabs of your own.

Without `navigation` the widget is a single conversation (optionally behind a
[home screen](./home-screen.md)). With it, the panel gains a tab bar and the
conversation becomes one screen among several, the way Intercom's Messenger
works.

---

## Quick Start

```tsx
import { ChatBot } from '@enjoys/react-chatbot-plugin';

<ChatBot
  homeScreen={{ greeting: 'Hi there 👋', tagline: 'How can we help?' }}
  navigation={{
    tabs: [
      { id: 'home', label: 'Home', icon: <HomeIcon /> },
      { id: 'messages', label: 'Messages', icon: <ChatIcon />, badge: 1 },
      { id: 'help', label: 'Help', icon: <HelpIcon />, component: HelpPanel },
      { id: 'news', label: 'News', icon: <NewsIcon />, badge: true, component: <NewsPanel /> },
    ],
  }}
  flow={flow}
/>
```

`home` and `messages` are built in — they render the home screen and the
conversation. Any other `id` renders whatever you pass as `component`.

---

## Config

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `tabs` | `NavTab[]` | — | Tabs, left to right. Up to five read comfortably |
| `enabled` | `boolean` | `true` | `false` keeps the config but hides the bar |
| `defaultTab` | `string` | first tab, else `'home'` | Tab shown when the widget opens |
| `onTabChange` | `(tabId: string) => void` | — | Fires on every tab change, including the header back button |
| `activeColor` | `string` | `theme.primaryColor` | Icon + label colour of the selected tab |
| `inactiveColor` | `string` | muted ink | Icon + label colour of unselected tabs |
| `activeBackground` | `string` | subtle hover plate | Highlight behind the selected tab |
| `indicator` | `boolean` | `false` | Small highlight bar on top of the selected tab |
| `background` | `string` | theme surface | Background of the bar itself |

Every appearance key is optional and defaults to a theme value, so the bar
follows light/dark/auto mode on its own. Set them only to go off-theme.

---

## Tabs

```ts
interface NavTab {
  id: string;          // 'home' and 'messages' are built in
  label: string;
  icon?: ReactNode;
  activeIcon?: ReactNode;              // defaults to `icon`
  badge?: number | boolean;            // number = count, true = plain dot
  component?: ReactNode | ComponentType<HomeScreenContext>;
}
```

`icon` is a `ReactNode`, so use whatever icon set you already have — Phosphor,
Lucide, an `<img>`, or an emoji.

### Badges

- `badge: 3` renders a count.
- `badge: true` renders a dot, for "something changed" without a number.
- `badge: false` (or omitted) renders nothing.

### Custom tabs

Pass a **component** and it receives [`HomeScreenContext`](./home-screen.md#homescreencontext)
as its props, so it can drive the conversation from inside a tab:

```tsx
const HelpPanel: React.FC<HomeScreenContext> = ({ sendMessage, goToStep }) => (
  <div style={{ padding: 16 }}>
    <h3>Help centre</h3>
    <button onClick={() => sendMessage('I need help with billing')}>
      Ask about billing
    </button>
    <button onClick={() => goToStep('order_lookup')}>Track an order</button>
  </div>
);
```

Because it's a component and not an element, hooks work normally inside it.
Pass an **element** (`component: <NewsPanel />`) instead and it's rendered in a
scrollable container as-is.

---

## How the screens behave

The shell is not just a switcher — a few behaviours are wired in:

- **The tab bar hides inside a conversation.** On the `messages` tab the bar is
  replaced by a back button in the header, which returns to the last non-Messages
  tab you were on. This keeps the composer at the bottom edge where it belongs.
- **The composer only renders on `messages`.** Other tabs get the full height.
- **Opening `messages` starts the flow.** Landing there dismisses the home screen
  and begins the flow, so `defaultTab: 'messages'` opens straight into a
  conversation.
- **A `loginForm` blocks every tab** until the visitor logs in.
- **Branding sits under the bar**, as a persistent footer rather than inside the
  thread.

---

## Without a home screen

`navigation` and `homeScreen` are independent. A shell with no `home` tab is
fine — start on your own tab and let the visitor move to the conversation:

```tsx
<ChatBot
  navigation={{
    defaultTab: 'help',
    tabs: [
      { id: 'help', label: 'Help', icon: <HelpIcon />, component: HelpPanel },
      { id: 'messages', label: 'Chat', icon: <ChatIcon /> },
    ],
  }}
  flow={flow}
/>
```

---

## Demo

See the **Messenger Shell** demo (`demo/demos/messenger-nav.tsx`) for a working
four-tab shell with badges, a custom active colour and two custom tab panels.

```bash
bun run dev
```

---

## Related

- [Home Screen](./home-screen.md) — the `home` tab's content
- [Theming & Styling](./theming.md) — the tokens the bar defaults to
- [API Reference](./api-reference.md) — `NavigationConfig`, `NavTab`

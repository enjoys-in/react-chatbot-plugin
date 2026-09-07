# Intercom "Fin" Messenger — UI Observations

> Captured from https://www.intercom.com/ (bottom-right chat widget) via the browser.

## Flow
1. Load the site → the widget sits **bottom-right**.
2. **Closed state**: a black circular **launcher** button with a chat/speech icon; a small badge dot appears when there's a new message.
3. First click → a **notification bubble** slides up: _"Hi there 👋 You are now speaking with Fin. How can I help?"_ with the Fin avatar.
4. Second click on the launcher → the **full messenger panel** expands.

## Overall Panel
- **Theme**: dark, near-black background (~`#1C1C1C`–`#212121`), light text.
- **Shape**: rounded corners (~16–20px), fixed to bottom-right, ~400px wide, drop shadow.
- **Structure** (top → bottom): Header → Message area → Composer → Footer.

## Header (top bar)
- **Left**: back chevron `‹` (light gray).
- **Avatar**: "Fin" mark — a **petal/dot-grid** icon (8 rounded dots arranged in a circle) on dark.
- **Title**: `Fin` (bold, white).
- **Subtitle**: `The team can also help` (muted gray, smaller).
- **Right**: `⋯` conversation options + `✕` close button.

## Message Area
- Bot message in a **dark gray rounded bubble** (~`#2B2B2B`), corners rounded (top-left tighter, "tail" style).
  - Line 1: `Hi there 👋`
  - Line 2: `You are now speaking with Fin. How can I help?`
- **Meta line** beneath the bubble: `Fin • AI Agent • Just now` (muted gray, ~11px).
- Typing state shows an animated **"Typing…"** indicator.

## Composer (input bar)
- Rounded input container with subtle border.
- **Placeholder**: `Ask a question…`
- **Inline action icons**: 📎 attachment (paperclip) · 🙂 emoji · GIF · 🎤 microphone (voice).
- **Send button**: circular, **up-arrow ↑**, right-aligned; **disabled/gray** when the field is empty, becomes active (accent) when text is entered.

## Footer
- Small centered text: `By chatting with us, you agree to our Privacy Policy` — with **Privacy Policy** as an underlined link.

## Launcher (collapsed)
- Black circular FAB, chat icon centered; unread **count badge** when a new message arrives.
- When open, the icon flips to a **down-chevron** (collapse).

---

## Audit — additional views (follow-up screenshots)

### A. Conversation view (confirmed)
Matches the panel above. Confirmed details from the live capture:
- Header meta line reads `Fin • AI Agent • Just now` under the bubble.
- Composer order: 📎 attach · 🙂 emoji · `GIF` · 🎤 mic … then the circular ↑ send on the far right (disabled/gray until text is entered).
- Footer link: `By chatting with us, you agree to our Privacy Policy`.

### B. Messages "home" / inbox list view (NEW)
A second top-level screen (reached from the Home tab / the down-chevron collapse), distinct from a single conversation:
- **Header**: centered title `Messages` + `✕` close (top-right). No back arrow here.
- **Conversation list**: stacked rows, each with
  - dot-grid **avatar** (Fin),
  - **name** (`Fin`) + right-aligned **relative time** (`2m`),
  - one-line **snippet** (`Hi there 👋 You are now speaking with Fi…`, truncated),
  - **unread dot** (red) on the right.
- **"Ask a question" CTA**: a pill button floating near the bottom of the list, white on dark, with a small help/`?` glyph on the right — starts a new conversation.
- **Bottom tab bar** (fixed, 4 tabs, icon + label, active tab highlighted):
  | Tab | Icon | Badge |
  |-----|------|-------|
  | Home | house/envelope | — |
  | Messages | chat bubble | count **1** |
  | Help | `?` life-ring | — |
  | News | megaphone | small dot |
- **Launcher** at bottom-right shows the **down-chevron** (panel is open).

### Navigation model
`Home ↔ Messages(list) ↔ Conversation` — the back `‹` in the conversation header returns to the Messages list; the tab bar switches top-level sections. This is a **multi-screen** shell (home / inbox list / thread), broader than the single-thread widget.

---

## Component map (for rebuilding)
| Region | Elements |
|--------|----------|
| Launcher | black circle FAB, chat icon, unread badge, open→down-chevron toggle |
| Header (thread) | back `‹`, Fin dot-grid avatar, `Fin` title, `The team can also help` subtitle, `⋯`, `✕` |
| Header (list) | centered `Messages` title, `✕` |
| Messages | dark bot bubble, tail corner, `Fin • AI Agent • Just now` meta, typing indicator |
| Conversation list | row = avatar + name + time + snippet + unread dot; "Ask a question" CTA pill |
| Bottom nav | Home · Messages (badge) · Help · News (icon + label, active highlight) |
| Composer | `Ask a question…` input, paperclip / emoji / GIF / mic, circular ↑ send (disabled-when-empty) |
| Footer | "By chatting with us, you agree to our Privacy Policy" (link) |

---

## Mapping to this repo (`@enjoys/react-chatbot-plugin`)
Achievable via `ChatBot` + `customizeChat` slots + a dark `theme` (no core changes required):

| UI region | Slot | Slot props |
|-----------|------|-----------|
| Collapsed FAB | `customizeChat.launcher` | `LauncherSlotProps` (`onClick`, `isOpen`, `position`, `styles`) |
| Top bar | `customizeChat.header` | `HeaderSlotProps` (`config`, `onClose`, `onRestart`, `ctx`) |
| Bot bubble + meta | `customizeChat.messageBubble` | `MessageBubbleSlotProps` (`message`, `styles`) — a `ComponentType` |
| Composer | `customizeChat.input` | `InputSlotProps` (`onSend`, `placeholder`, `enableEmoji`, `fileUpload`, `ctx`) |
| Footer | `customizeChat.branding` | `BrandingSlotProps` (`config`, `primaryColor`) |

Notes:
- `launcher` / `header` / `input` / `branding` slot `component` = a `ReactNode` (or render function for `header`/`input`); `messageBubble` / `quickReplies` / `typingIndicator` `component` = a `ComponentType`.
- Interactive custom slots should read state via `useChatContext()` — do **not** call `useChat()` inside a slot (it restarts the flow).
- Dark look comes from `theme={{ mode: 'dark' }}` — or `mode: 'auto'` (v1.26.0), which
  follows `prefers-color-scheme` like the live Messenger does. Current dark surfaces are
  the measured ones: panel/header `#14161A`, bubble `#2B2D31`, ink `#F7F7F7`,
  shadow `rgba(9,14,21,0.9) 0 5px 40px`.

## Audit — home screen (implemented)
The **Home screen** is now a first-class feature (`homeScreen` prop + `customizeChat.homeScreen`), covering the Intercom "Home" tab:
- **Default home screen** shown when the widget opens (takes precedence over `welcomeScreen`).
- **Up to ~5 icon actions** (`actions[]`) — each with `icon`, `label`, `description`, and one of `onSelect` / `message` / `stepId` / `href`.
- **Component shell** (`sections[]`) — drop in your **own components**; each is wrapped in a card unless `shell: false`. A component receives `HomeScreenContext` (`openChat`, `sendMessage`, `goToStep`, `data`, `close`).
- **CTA** button (`cta`) pinned under the content (defaults to "Ask a question").
- Full replacement via `customizeChat.homeScreen.component`. Docs: [home-screen.md](./home-screen.md); demo: `demo/demos/home-screen.tsx`.
- Status: compiles + builds; registered in the demo gallery. ✅

**Still not implemented (gap):** the persistent **bottom tab bar** is now built — see below.

## Audit — bottom navigation (implemented)
The persistent **bottom tab bar** is now a first-class feature (`navigation` prop → `NavigationConfig`):
- Up to ~5 **tabs** (`tabs[]`), each `{ id, label, icon, activeIcon?, badge?, component? }`.
- Built-in ids: **`home`** renders the `homeScreen`; **`messages`** renders the conversation. Any other id renders your **own component** (an element, or a `ComponentType<HomeScreenContext>`) — the "component shell".
- `BottomNav` component; integrated in `ChatWindow` (composer + branding show only on the Messages tab; opening Messages starts the flow). Demo: `demo/demos/messenger-nav.tsx`; also wired into the All-Plugins demo. ✅

**Remaining gap:** a true **Messages inbox list** (multiple concurrent threads). The widget is still single-thread — the Messages tab shows one conversation, not a list of past threads.

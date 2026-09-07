# Changelog

All notable changes to `@enjoys/react-chatbot-plugin` are documented here.

> Entries below cover v1.0–v1.8 and v1.26–v1.27.3. For the versions in between, see the
> [Release History table](../README.md#release-history) in the README.

---

## Unreleased

### Features

- **`navigation` prop — the messenger shell.** A persistent bottom tab bar turns
  the widget into a multi-screen panel instead of a single thread
  - `tabs[]` — `id`, `label`, `icon`, `activeIcon`, `badge` (a number for a
    count, `true` for a dot) and `component`
  - `'home'` and `'messages'` are built in and render the home screen and the
    conversation; any other id renders your `component`, which receives
    `HomeScreenContext` as props when passed as a component rather than an element
  - `defaultTab`, `onTabChange`, `enabled`
  - Appearance overrides that each default to a theme value, so the bar follows
    light/dark/auto on its own: `activeColor`, `inactiveColor`,
    `activeBackground`, `indicator`, `background`
  - The bar hides inside a conversation — a header back button returns to the
    last non-Messages tab — and the composer renders only on `messages`, so
    other tabs get the full height
  - Landing on `messages` (including via `defaultTab`) starts the flow; a
    `loginForm` still blocks every tab until the visitor logs in
- **New demo**: Messenger Shell — four tabs with badges, a custom active colour
  and two custom tab panels
- **New guide**: [Navigation](./navigation.md)

### Types

- `NavigationConfig`, `NavTab`; new export: `BottomNav`

### Docs

- Every one of the 53 plugins is now documented in [Plugins](./plugins.md) — the
  reference covered 30, and 23 (including `voiceCallPlugin`, `paymentPlugin`,
  `bookingPlugin`, `pollPlugin` and the conversation plugins) had no entry
- [API Reference](./api-reference.md) covers all 193 barrel exports; 53 were
  missing, among them `BottomNav`, `LauncherNotification`, `useColorScheme`,
  `useLiveAgent`, `createHeadlessBot`, `createEventBus` and `renderMarkdown`
- Corrected counts that had drifted across the README, the docs index, the demo
  hero and the banner: 53 plugins (was "30"/"35+"), 11 `customizeChat` slots
  (was 9), 18 form field types (was 15), 24 demos (was 17/23)
- The demo hero's figures and the page's structured-data version are now derived
  from the library source at build time, so they can't drift again — the JSON-LD
  had been pinned at v1.5.1

---

## v1.27.3 — Profanity Mask Fixes

### Fixes

- **A blocked message rendered as an empty bubble.** `validationPlugin` masked
  the text to `'***'`, which v1.27.2's new horizontal-rule support then parsed
  as an `<hr>` — so the visitor's message disappeared into a divider line. A
  masked message is now rendered without markdown, so the mask always shows as
  written. This applies whatever `mask` is configured, including `'****'`
- **The whole message was replaced, losing the context.** Only the matched words
  are masked now, so the bubble still reads as something the visitor said:

  ```diff
  - you are a badword honestly  →  ***
  + you are a badword honestly  →  you are a @#$% honestly
  ```

- Words containing regex metacharacters (`c++`, `a.b`) are escaped before
  matching, so they can't corrupt the pattern or match more than intended

### Features

- **`mask`** — the replacement string, default `'@#$%'`
- **`maskScope`** — `'word'` (default) masks matched words; `'message'` replaces
  the whole message, the old behaviour
- Masked messages carry `metadata.masked === true` for styling or filtering

### Behaviour

- An explicit per-message `metadata.markdown` now takes precedence over the
  `markdown` prop. Previously the prop always won, which left a plugin unable to
  turn markdown *off* for text it had rewritten. A more specific setting
  beating a global one is also the less surprising rule

---

## v1.27.2 — Markdown Rendering Fixes

### Fixes

- **`markdownPlugin` printed raw HTML tags into the chat.** It rewrote
  `message.text` into an HTML string, but bubbles render text as text — nothing
  parsed it as HTML — so the markup appeared literally:

  ```diff
  - 🤖 Echo: "cool"<br><br><em>Try sending 5 messages quickly!</em>
  + 🤖 Echo: "cool"
  +
  +   Try sending 5 messages quickly!      (rendered italic)
  ```

  The plugin now flags the message instead, and the bubble renders it with the
  built-in markdown-to-JSX renderer, producing real React elements. This also
  keeps the renderer free of `dangerouslySetInnerHTML`, so message text can
  never inject markup.

  It was doubly broken alongside the `markdown` prop: the plugin consumed the
  markdown into HTML first, leaving the prop's renderer nothing to do.

- **Nested emphasis was mangled.** Bold's pattern forbade an inner `*`, so
  italic matched across the boundary:

  ```diff
  - **bold and *nested italic***  →  *<em>bold and </em>nested italic***
  + **bold and *nested italic***  →  <strong>bold and <em>nested italic</em></strong>
  ```

  Bold is now non-greedy and permits inner delimiters, and a third closing
  delimiter closes an emphasis opened inside the run. `***both***` renders as
  bold + italic.

- **Horizontal rules rendered as literal `***`.** `***`, `---` and `___` alone
  on a line now render an `<hr>`. Checked before list parsing, which would
  otherwise leave stray asterisks.

- Two demos wrote `#` headings while passing `markdown: true`, which leaves
  `headings` at its default `false`, so `## Pricing Plans` showed literally.
  They pass `markdown: { headings: true }` now.

### Behaviour

- `markdownPlugin` no longer changes `message.text`. Plugins running after it
  now see the original markdown rather than HTML. Its new
  `enableStrikethrough` and `enableHeadings` options map to the renderer;
  `enableLineBreaks` is deprecated and ignored (line breaks are always kept)
- `MessageBubble` renders markdown when either the `markdown` prop or a
  per-message `metadata.markdown` flag is set. The prop wins where both apply

---

## v1.27.1 — File Upload Fixes

### Fixes

- **A submitted file field rendered as `[object FileList]`.** The form summary
  built each line with `String(value)`, which has no useful output for a
  `FileList`. Uploaded files now appear as attachment rows carrying the real
  file name, labelled with the field they came from:

  ```diff
  - Type: ID Document
  - Upload File: [object FileList]
  + Type: ID Document
  + 📄 Upload File: scan-of-my-nation…   13B
  ```

- **Long file names are truncated with an ellipsis and reveal in full on hover**
  (`title`), in all three places a name is shown: the summary attachment row,
  the composer's file chips, and the form's file picker button. The picker
  button previously let a long name overflow its box
- **`String(value)` also mishandled other field types.** Multi-select and
  checkbox arrays lost their option labels and joined without spaces
  (`"a,b"` rather than `"Apples, Bananas"`), and booleans read as `"true"`.
  A shared `formatFieldValue` now handles files, arrays, booleans and dates
- The file picker button and file chips still used the pre-redesign palette
  (`#FAFAFA`, `#555`, `#999`, `#D1D5DB`) and now read from the theme tokens

### Types

- `MessageAttachment.label` — the field label a file came from, shown as a muted
  prefix so a summary with several file fields stays unambiguous

### Exports

- `formatFieldValue`, `filesFromValue`, `truncateMiddle`

---

## v1.27.0 — Slash Command Menu

### Features

- **Autocomplete menu for `/commands`.** Typing `/` at the start of an empty
  message opens a list above the composer that filters as you type
  - `↑`/`↓` move, `Enter`/`Tab` runs, `Esc` dismisses, click runs
  - Matches are ranked: name prefix, then alias, then substring
  - Closes as soon as you type a space, so it never covers a real message
  - Selecting sends `/name` through the normal pipeline — the same path as
    typing it by hand, so there is no second execution route to keep in sync
  - Disable with `enableSlashCommandMenu={false}`; commands still work typed in full
  - Wired as a `combobox` with `aria-expanded`/`aria-activedescendant`, and the
    highlighted row is scrolled into view during keyboard navigation
- **`slashCommands` prop** — custom commands with `name`, `description`, `icon`,
  `aliases`, `hidden` and a `handler`
  - `handler` receives `SlashCommandContext`: `addBotMessage`, `addSystemMessage`,
    `sendMessage`, `goToStep`, `goBack`, `restart`, `data`, and `args`
  - `args` is the text after the command name — `/echo hi there` gives `'hi there'`
  - A custom command whose `name` matches a built-in replaces it, so `/help`
    can be overridden
- **`/help` now lists custom commands**, not just the four built-ins
- **`SlashCommandMenu` component** and the registry helpers
  (`BUILT_IN_COMMANDS`, `resolveCommands`, `parseCommand`, `commandMenuQuery`,
  `filterCommands`) are exported, so a custom `input` slot can render its own menu

### Fixes

- Commands were matched by exact string against the whole input, so any command
  with arguments fell through to "Unknown command". They are parsed into a name
  and `args` now
- The Slash Commands demo wrote its messages with `**bold**` but never enabled
  `markdown`, so the asterisks rendered literally

### Types

- `SlashCommand`, `SlashCommandContext`
- `ChatBotProps.slashCommands`, `ChatBotProps.enableSlashCommandMenu`

### Demos

- Slash Commands demo now has three custom commands — `/agent`, `/echo`
  (argument handling) and `/status` (reads collected data, with a `data` alias)

---

## v1.26.0 — Home Screen, Auto Colour Mode & UI Redesign

### Features

- **`homeScreen` prop** — the default screen shown when the widget opens
  - `actions[]` — icon rows, each with `label`, `description`, `icon`, `iconBackground`, `accessory`, `disabled`
  - A row routes via `onSelect`, `message`, `stepId`, or `href` (rendered as a real `<a target="_blank">`)
  - `sections[]` — **component shell**: drop your own component into a card that matches the action list, or `shell: false` to render it bare; `placement: 'above' | 'below'`
  - Pass a component (not an element) and it receives `HomeScreenContext` as props, so hooks work normally inside it
  - `greeting`, `tagline`, `avatar`, `cta`, `masthead`, `enabled`
  - Takes precedence over `customizeChat.welcomeScreen`, which keeps working
- **`customizeChat.homeScreen`** — replace the whole screen; receives `{ config, ctx }`
- **`callbacks.onHomeAction`** — fires with an action's `id` when a row is chosen
- **`theme.mode: 'auto'`** — follows the visitor's `prefers-color-scheme` and switches live mid-session, no reload. SSR-safe: renders light on the server and corrects on hydration
- **`useColorScheme(mode)`** hook, plus `prefersDarkScheme()`, `onColorSchemeChange(fn)` and `resolveColorMode(mode)` for non-React code

### UI redesign

Restyled the existing components rather than adding parallel ones. Values were
read from a live Messenger's computed styles, not estimated.

- **Typography** — `typography` tokens with absolute line heights (`title` 14/600/15.4, `body` 14/400/19.6, `meta` 12/400/12, …). Default font stack is now the platform UI face (`system-ui`, …); the bundled Inter webfont import is gone, removing a network round-trip and the flash of unstyled text
- **Motion** — `motion` tokens on one decelerating curve, `cubic-bezier(0.23, 1, 0.32, 1)`: `panel` 320ms, `enter` 200ms, `surface` 150ms, `control` 200ms, `icon` 300ms
- **Window now animates out**, not just in — driven by the `isOpen` transition, so it plays however the chat was closed
- **Launcher** — 48px, docked 20px from the corner; its two marks crossfade with a quarter turn instead of hard-swapping. The infinite pulse is gone
- **Composer** — card layout: autogrowing textarea above a tool row with a round send button
- Bubbles use a uniform 20px radius; header, quick replies, branding, typing indicator and form fields all moved onto shared neutral tokens
- Respects `prefers-reduced-motion: reduce` — animated elements carry `data-cb-animate` and collapse to near-zero duration
- Unread badge on the launcher, counting messages that arrive while it's closed

### Fixes

- **Header ink is derived, not assumed.** Setting a coloured `headerBg` without `headerText` used to keep the mode's ink — a mid-tone brand colour could land at 1.99:1. Both candidates are now scored with the WCAG formula and the better one wins
- **Dark mode launcher was invisible** — a black icon on a black circle, because the accent stayed dark. The accent inverts in dark mode and launcher/send/monogram ink derive from it
- **Launcher notification had no entrance animation.** It referenced a `cb-notif-in` keyframe that was never defined, so the animation silently did nothing
- **Launcher notification ink ignored a custom `backgroundColor`**, staying keyed to `isDark`. A dark brand colour in light mode gave 1.00:1 — invisible text. All layers now derive from the surface via `inkLayers()`
- Notification borders were 0.05–0.06 alpha (1.19:1, effectively absent) and light-mode muted text was 3.95:1, under the 4.5 floor
- **Closing via the header ✕ skipped the exit animation**, since it toggles through `useChat()` and never reached the root handler
- **A `stepId` home action injected the flow's start step on top of the target step.** Stepping the flow explicitly now marks it started
- **The widget inherited the host page's text colour** — anything using `color: inherit`, including user-supplied section components, picked up `body { color }`. `styles.root` now anchors the cascade
- A home-screen slot component was invoked as a plain function instead of rendered, which breaks the hooks contract. It goes through `createElement` now
- Pinned home-screen CTA covered the end of the scrolling content

### Types

- `HomeScreenConfig`, `HomeScreenAction`, `HomeScreenSection`, `HomeScreenCta`, `HomeScreenContext`, `HomeScreenSlotProps`
- `ChatColorMode`; `ChatTheme.mode` accepts `'auto'`
- **`ChatStyles` is now exported** — slot components receive it as `styles`, but it was impossible to import and annotate
- New exports: `typography`, `motion`, `neutrals`, `headerInk`, `contrastInk`, `inkLayers`, `HomeScreen`

### Demos

- **New demo**: Home Screen — five icon actions, a custom accessory, a shelled section using `useState`, and a bare `shell: false` section
- Demo app now follows the OS colour scheme (`mode: 'auto'`) and no longer pins a hardcoded green theme, so it shows the real defaults
- Fixed type errors in the Markdown Rendering demo, which used a `conditions[]` step API that does not exist — quick replies carry `next` directly — and was missing `startStep`
- Fixed the Customize Chat demo's bubble slot typing

---

## v1.8.0 — Live Agent (WebSocket / Socket.IO)

### Features

- **`liveAgent` prop** — real-time handoff to human agents via WebSocket or Socket.IO
  - Pass a pre-created `WebSocket` or `socket.io-client` instance
  - Protocol-agnostic adapter with `WsDriver` and `SioDriver`
  - Customizable event names via `events` config
  - Session persistence across page refreshes via `localStorage`
  - System messages for agent joined/left, queue position, transfer accepted
  - Agent typing indicators with auto-clear
  - `sessionId` auto-generated or user-provided
  - Callbacks: `onAgentJoined`, `onAgentLeft`, `onQueueUpdate`, `onSessionRestored`, `onConnect`, `onDisconnect`
- **`liveAgentPlugin`** — plugin alternative for those who prefer the plugin API
- **`useLiveAgent` hook** — exported for advanced use cases
- **`LiveAgentAdapter`** — exported core class for custom integrations
- **Agent message sender** — `MessageSender` type now includes `'agent'`, rendered with agent name label in `MessageBubble`
- **New demo**: Live Agent Chat with mock WebSocket simulation
- **New doc page**: `docs/live-agent.md` — full guide with server implementation example

### Types

- `LiveAgentConfig`, `LiveAgentEvents`, `AgentInfo`, `ResolvedLiveAgentEvents`
- `DEFAULT_LIVE_AGENT_EVENTS` constant
- `ChatMessage.agentName` field
- `ChatState.isLiveAgent` and `ChatState.agentInfo`

---

## v1.6.0 — customizeChat Slot Map

### Features

- **`customizeChat` prop** — single slot map for all UI customization. Each key is a `Partial<SlotProps>` — provide config, content, or a custom `component`. Only provided keys are used; missing keys use defaults.
  - `header` — configure via `config: HeaderConfig`, replace via `component`
  - `input` — replace via `component`
  - `branding` — configure via `config: BrandingConfig`, replace via `component`
  - `welcomeScreen` — provide `content: ReactNode`, replace via `component`
  - `loginScreen` — configure via `config: FormConfig`, replace via `component`
  - `launcher` — replace via `component`
  - `messageBubble` — replace via `component: ComponentType`
  - `quickReplies` — replace via `component: ComponentType`
  - `typingIndicator` — replace via `component: ComponentType`
- **Strongly-typed slot props** — each slot has a dedicated props interface (`MessageBubbleSlotProps`, `HeaderSlotProps`, etc.) exported from the package.
- **`header`, `branding`, `welcomeScreen`** config moved into `customizeChat` — no longer direct props on `ChatBotProps`.
- Forms (`DynamicForm` / `renderFormField`) are architecturally separate and never affected by `customizeChat` overrides.

### Breaking Changes

- `header`, `branding`, `welcomeScreen` removed from `ChatBotProps`. Use `customizeChat.header.config`, `customizeChat.branding.config`, `customizeChat.welcomeScreen.content` instead.
- `renderHeader` and `renderInput` removed from `ChatBotProps`. Use `customizeChat.header.component` and `customizeChat.input.component` instead.

---

## v1.5.1 — Bug Fixes & Form Label Display

### Bug Fixes

- `437c3d9` **Duplicate React key collision** — unified all ID generation to a single shared `uid()` counter. Previously, three independent generators (`helpers.ts`, `FlowEngine.idCounter`, `globalIdCounter`) could produce identical IDs in the same millisecond.
- `437c3d9` **Stale pluginManager** in `handleComponentComplete` / `handleQuickReply` dependency arrays — added missing `pluginManager` to `useCallback` deps.
- `437c3d9` **Unawaited `pluginManager.onMessage`** in quick reply and form submit paths — plugin message transformations were silently dropped.
- `437c3d9` **Double typing delay** in keyword/fallback responses — manual `SET_TYPING` dispatch before `addBotMessage` (which does its own typing) caused two delays. Removed the redundant dispatch.
- `437c3d9` **Empty input false-positive** on quick reply matching — `"".includes("")` always returns true, so any empty/whitespace input matched the first quick reply. Added early return for blank input.
- `2a9221d` **Sequential plugin init blocking** — `PluginManager.init()` awaited each plugin's `onInit` one-by-one. A slow plugin (network fetch, permission prompt) blocked all plugins after it. Changed to `Promise.allSettled` for parallel, non-blocking init.
- `2a9221d` **DevTools keydown listener leak** — anonymous keydown handler was never removed on `onDestroy`. Now stores a reference and calls `removeEventListener` on cleanup.
- `72aab3e` **Wrong plugin option names** — ~20 mismatched option names in docs and demo corrected to match actual TypeScript signatures.
- `f1e2202` **AI plugin `[object Object]`** in demo — mock httpbin endpoint returned non-AI JSON; `defaultParse` fell through to `String(data)`. Fixed with `shouldRespond: () => false`.

### Improvements

- `a8e63d6` **Friendly form submission display** — form summaries in the chat now use field labels and option display names instead of raw field names and values. For example, `industry: health` displays as `Industry: Healthcare`. Raw data is preserved in `message.formData`.

### Demo

- `61201c3` Plugin showcase now loads all **30 plugins** with appropriate mock configs.
- `f1e2202` Fixed AI plugin `[object Object]` output in plugin-showcase demo.

### Docs

- `4e8e969` Created changelog, updated plugins.md (parallel init note), forms.md (friendly labels section), demo version bump.
- `72aab3e` Corrected all 30 plugin code examples in docs/plugins.md to match actual TypeScript signatures.
- `45a9020` Updated docs and demo for 30-plugin ecosystem — hero stats, README, getting-started, api-reference.

### Chore

- `2993eed` Bumped to v1.5.1, rebuilt, published to npm.

---

## v1.5.0 — 30-Plugin Ecosystem

- `cd25199` Implemented all **30 plugins** across 9 categories:
  - **Core:** analyticsPlugin, webhookPlugin, persistencePlugin, loggerPlugin
  - **Communication:** crmPlugin, emailPlugin, syncPlugin
  - **Intelligence:** aiPlugin, intentPlugin, validationPlugin, markdownPlugin, mediaPlugin, i18nPlugin
  - **UX:** typingPlugin, autoReplyPlugin, soundPlugin, pushPlugin, themePlugin, componentPlugin
  - **Security:** authPlugin, rateLimitPlugin
  - **Agent:** agentPlugin, transferPlugin
  - **Marketing:** leadPlugin, campaignPlugin
  - **Scheduling:** schedulerPlugin, reminderPlugin
  - **File:** uploadPlugin
  - **Dev:** debugPlugin, devtoolsPlugin
- `cd25199` Shared plugin utilities: `http` (postJSON/getJSON), `storage` (get/set/remove), `timer` (TimerManager).
- `cd25199` Fixed 6 core bugs found during plugin audit.
- `45a9020` Updated all docs and demo for 30-plugin ecosystem.
- Published at 72.71 kB ESM, 75.49 kB CJS, 65 modules.

---

## v1.4.0 — Keyword Matching, Greeting Detection & Fallback

- `edfc487` **Keyword routes** — match user input to bot responses or flow steps via `keywordRoutes` config.
- `edfc487` **Greeting auto-detection** — recognizes common greetings (hi, hello, hey, etc.) and responds with `greetingResponse`.
- `edfc487` **Fallback messages** — `fallbackMessage` as string or function for unmatched input.
- `edfc487` **Input validation** — `FlowStepInput` with regex pattern, min/max length, and transform (lowercase, uppercase, trim, email).
- `edfc487` **Typing delay** — configurable `typingDelay` for bot responses.
- `edfc487` **Plugin `onMessage` hook** — plugins can now intercept and transform messages.
- `edfc487` **`onUnhandledMessage` callback** — fires when no keyword, greeting, or flow step handles user input.
- `070fb3e` Redesigned demo landing with dark SaaS product-launch UI.

---

## v1.3.0 — Custom Form Field Renderers

- `e3ae922` `renderFormField` prop — replace any built-in form field with custom React components.
- `e3ae922` Strongly-typed render props per field type (`TextFieldRenderProps`, `SelectFieldRenderProps`, etc.).
- `e3ae922` Default element passthrough for selective overrides.
- `3b27fbb` Added vercel.json for demo deployment.
- `c00c5b6` Updated banner with Raleway font, SaaS launch style.
- `a30794d` Updated README header with banner and social preview.

---

## v1.2.0 — Async Actions, Custom Components & Docs

- `7e2c906` **Async action system** — `asyncAction` in flow steps for API calls with loading/success/error states and progress updates via `ctx.updateMessage`.
- `7e2c906` **Custom component rendering** — `component` field in flow steps renders React components with `StepComponentProps`.
- `7e2c906` **Dynamic routing** — `condition` field for data-driven flow branching.
- `25f7b07` Comprehensive demo scenarios for async actions, custom components, and error handling.
- `f16d02e` Added async actions, custom step components, and dynamic routing to README.
- `6adaedb` Split demos into 13 separate files with card-based UI + 15 comprehensive doc pages.
- `f386161` Updated README with docs links, package.json with repo/bugs/homepage, demo SEO. Removed all comments and console.logs from source.
- `08b84bd` Restored source comments, strip via build config (dropConsole, dropDebugger, comments:false).

---

## v1.1.0 — Plugin Architecture & Slash Commands

- `0879705` **Plugin system** — `ChatPlugin` interface with `onInit`, `onMessage`, `onSubmit`, `onEvent`, `onDestroy` lifecycle hooks.
- `0879705` **PluginManager** — registers, initializes, and dispatches events to plugins.
- `0879705` **Slash commands** — `/help`, `/cancel`, `/back`, `/restart` built-in commands.
- `0879705` **Custom components** in flow steps.
- `0879705` **Restart flow** support.
- `0879705` **Glassmorphism UI** theme option.
- `0879705` Full 12-bug audit with fixes (SOLID refactor, duplicate message prevention, scroll behavior, theme consistency, etc.).

---

## v1.0.0 — Initial Release

- `f901c8f` `<ChatBot />` React component with flow-based conversation engine.
- Multi-step forms with 15 field types (text, email, password, number, tel, url, textarea, select, multiselect, radio, checkbox, file, date, time, hidden).
- Quick replies and conditional branching.
- Login form pre-chat gate.
- Theming via CSS variables and `primaryColor` prop.
- TypeScript-first with full type exports.
- FlowEngine with step navigation, data collection, and form handling.

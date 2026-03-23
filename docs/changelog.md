# Changelog

All notable changes to `@enjoys/react-chatbot-plugin` are documented here.

---

## v1.5.1 — Bug Fixes & Form Label Display

**Bug Fixes**

- **Duplicate React key collision** — unified all ID generation to a single shared `uid()` counter. Previously, three independent generators (`helpers.ts`, `FlowEngine.idCounter`, `globalIdCounter`) could produce identical IDs in the same millisecond.
- **Stale pluginManager** in `handleComponentComplete` / `handleQuickReply` dependency arrays — added missing `pluginManager` to `useCallback` deps.
- **Unawaited `pluginManager.onMessage`** in quick reply and form submit paths — plugin message transformations were silently dropped.
- **Double typing delay** in keyword/fallback responses — manual `SET_TYPING` dispatch before `addBotMessage` (which does its own typing) caused two delays. Removed the redundant dispatch.
- **Empty input false-positive** on quick reply matching — `"".includes("")` always returns true, so any empty/whitespace input matched the first quick reply. Added early return for blank input.
- **Sequential plugin init blocking** — `PluginManager.init()` awaited each plugin's `onInit` one-by-one. A slow plugin (network fetch, permission prompt) blocked all plugins after it. Changed to `Promise.allSettled` for parallel, non-blocking init.
- **DevTools keydown listener leak** — anonymous keydown handler was never removed on `onDestroy`. Now stores a reference and calls `removeEventListener` on cleanup.

**Improvements**

- **Friendly form submission display** — form summaries in the chat now use field labels and option display names instead of raw field names and values. For example, `industry: health` displays as `Industry: Healthcare`. Raw data is preserved in `message.formData`.

**Demo**

- Plugin showcase now loads all **30 plugins** with appropriate mock configs.
- Fixed AI plugin `[object Object]` output by adding `shouldRespond: () => false` for the mock endpoint.

---

## v1.5.0 — 30-Plugin Ecosystem

- Implemented all **30 plugins** across 9 categories: Core, Communication, Intelligence, UX, Security, Agent, Marketing, Scheduling, File, and Dev.
- Shared plugin utilities: `http` (postJSON/getJSON), `storage` (get/set/remove), `timer` (TimerManager).
- Fixed 6 core bugs found during plugin audit.
- Published at 72.71 kB ESM.

---

## v1.4.0 — Keyword Matching, Greeting Detection & Fallback

- **Keyword routes** — match user input to bot responses or flow steps via `keywordRoutes` config.
- **Greeting auto-detection** — recognizes common greetings (hi, hello, hey, etc.) and responds with `greetingResponse`.
- **Fallback messages** — `fallbackMessage` as string or function for unmatched input.
- **Input validation** — `FlowStepInput` with regex pattern, min/max length, and transform (lowercase, uppercase, trim, email).
- **Typing delay** — configurable `typingDelay` for bot responses.
- **Plugin `onMessage` hook** — plugins can now intercept and transform messages.
- **`onUnhandledMessage` callback** — fires when no keyword, greeting, or flow step handles user input.

---

## v1.3.0 — Custom Form Field Renderers

- `renderFormField` prop — replace any built-in form field with custom React components.
- Strongly-typed render props per field type (`TextFieldRenderProps`, `SelectFieldRenderProps`, etc.).
- Default element passthrough for selective overrides.

---

## v1.2.0 — Async Actions & Custom Components

- **Async action system** — `asyncAction` in flow steps for API calls with loading/success/error states and progress updates.
- **Custom component rendering** — `component` field in flow steps renders React components with `StepComponentProps`.
- **Dynamic routing** — `condition` field for data-driven flow branching.

---

## v1.1.0 — Plugin Architecture & Slash Commands

- **Plugin system** — `ChatPlugin` interface with `onInit`, `onMessage`, `onSubmit`, `onEvent`, `onDestroy` lifecycle hooks.
- **PluginManager** — registers, initializes, and dispatches events to plugins.
- **Slash commands** — `/help`, `/cancel`, `/back`, `/restart` built-in commands.
- **Custom components** in flow steps.
- **Restart flow** support.
- **Glassmorphism UI** theme option.
- Full audit with multiple bug fixes.

---

## v1.0.0 — Initial Release

- `<ChatBot />` React component with flow-based conversation engine.
- Multi-step forms with 15 field types.
- Quick replies and conditional branching.
- Login form pre-chat gate.
- Theming via CSS variables and `primaryColor` prop.
- TypeScript-first with full type exports.

# Changelog

All notable changes to `@enjoys/react-chatbot-plugin` are documented here.

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

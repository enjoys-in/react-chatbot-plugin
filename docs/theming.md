# Theming & Styling

Customize colors, fonts, border radius, and light/dark mode.

## ChatTheme

The defaults are a calm neutral set: a white surface, near-black ink and a
single black accent. Colour is reserved for meaning — unread, error — never
decoration. Override only what you need.

```tsx
<ChatBot
  theme={{
    primaryColor: '#000000',
    mode: 'light',  // 'light' or 'dark'
    fontFamily: '"Inter", sans-serif',
    windowWidth: '400px',
    windowHeight: '704px',
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `primaryColor` | `string` | `'#000000'` (dark mode: `'#F2F3F5'`) | Accent: launcher, send button, quick-reply hover |
| `headerBg` | `string` | `'#FFFFFF'` (dark: `'#1B1C1F'`) | Header background (can be a gradient) |
| `headerText` | `string` | Derived from `headerBg` | Header ink — see note below |
| `bubbleBg` | `string` | `'#F5F5F5'` (dark: `'#26272B'`) | Bot bubble fill |
| `bubbleText` | `string` | `'#14161A'` (dark: `'#E9EAEC'`) | Bot bubble ink |
| `userBubbleBg` | `string` | `'#000000'` (dark: `'#F2F3F5'`) | User bubble fill |
| `userBubbleText` | `string` | Derived from `userBubbleBg` | User bubble ink |
| `borderRadius` | `string` | `'24px'` | Window border radius |
| `mode` | `'light' \| 'dark' \| 'auto'` | `'light'` | Color mode — `'auto'` follows the OS |
| `fontFamily` | `string` | Inter, then system fonts | Font stack |
| `windowWidth` | `string` | `'400px'` | Chat window width |
| `windowHeight` | `string` | `'704px'` | Chat window height |

### Following the OS

`mode: 'auto'` reads the visitor's `prefers-color-scheme` and switches live when
they change it mid-session — no reload, no prop change. This is what Intercom's
own Messenger does, which is why the same page can look light to one visitor and
dark to another.

```tsx
<ChatBot theme={{ mode: 'auto' }} />
```

`'auto'` never reaches your components: `resolveTheme` collapses it to a concrete
`'light'` or `'dark'` first, so every `theme.mode === 'dark'` check keeps working.
The mode is resolved once at the top of the tree and pinned onto context, so a
custom header and the panel can't disagree during a switch.

On the server there is no preference to read, so `'auto'` renders light and
corrects itself on hydration. Nothing throws where `window` or `matchMedia` is
absent.

Need the mode yourself — in a custom slot, say:

```tsx
import { useColorScheme } from '@enjoys/react-chatbot-plugin';

const mode = useColorScheme('auto');   // 'light' | 'dark', re-renders on change
```

For non-React code there are `prefersDarkScheme()`, `onColorSchemeChange(fn)`
(returns an unsubscribe), and `resolveColorMode(mode)`.

### Ink is derived, not guessed

Set `headerBg` (or `userBubbleBg`) without its matching text colour and the ink
is computed for you: both candidates are scored with the WCAG contrast formula
and the higher one wins. So a mid-tone brand colour gets dark ink rather than
the unreadable white a naive light/dark threshold would pick.

```tsx
theme={{ headerBg: '#3FCF8E' }}   // headerText -> #14161A, 9.08:1
theme={{ headerBg: '#6C5CE7' }}   // headerText -> #FFFFFF, 4.86:1
```

Passing `headerText` explicitly always wins. A value that can't be measured —
a gradient, a CSS variable — falls back to the mode default, so set the ink
yourself when the header is a gradient.

The helpers are exported if you need the same logic in custom slots:

```tsx
import { contrastInk, neutrals, headerInk } from '@enjoys/react-chatbot-plugin';

contrastInk('#3FCF8E');        // '#14161A'
neutrals(false).inkMuted;      // '#6C6F74' — secondary text
headerInk(theme).hover;        // hover plate that suits the header surface
```

### Font

The default stack is the platform UI face — `system-ui`, then `-apple-system`,
`Segoe UI`, `Roboto`, with the emoji faces appended. No webfont is loaded, so
there's no round-trip and no flash of unstyled text. Override `fontFamily` to
use your own.

### Type scale

Line heights are absolute rather than ratios, because the steps are irregular
(14/19.6, 13/18.5) and ratio rounding drifts visibly at small sizes. Exported as
`typography` so custom slots can match:

| Token | Size / weight / line-height | Used for |
|-------|------------------------------|----------|
| `titleLg` | 18 / 600 / 18 | Centred screen title |
| `title` | 14 / 600 / 15.4 | Header name |
| `subtitle` | 13 / 400 / 18.5 | Header supporting line |
| `body` | 14 / 400 / 19.6 | Message text, quick replies |
| `input` | 14 / 400 / 21 | Composer |
| `meta` | 12 / 400 / 12, ls 0.072 | Byline under a bubble |
| `footnote` | 12 / 400 / 16, ls 0.01 | Branding / legal footer |

```tsx
import { typography } from '@enjoys/react-chatbot-plugin';

<span style={typography.meta}>Fin • AI Agent • Just now</span>
```

### Motion

One decelerating curve does all the travelling — `cubic-bezier(0.23, 1, 0.32, 1)`
(easeOutQuint): quick to start, long to settle, never a bounce. Hovers and colour
changes use plain `ease` and stay short. Exported as `motion`:

| Token | Value | Used for |
|-------|-------|----------|
| `panel` | `0.32s cubic-bezier(0.23, 1, 0.32, 1)` | Window enter / exit |
| `enter` | `0.2s ease-out` | A message or pill arriving |
| `surface` | `0.15s ease` | Hover plates, surface tints |
| `control` | `0.2s ease` | Buttons: colour, fill, shadow |
| `icon` | `0.3s ease` | Icon fill/stroke crossfades |

The window animates **out** as well as in: on close it stays mounted for 320ms
playing `cb-window-exit`, then unmounts. This is driven by the `isOpen`
transition, so it works however the chat was closed — launcher, header button,
or programmatically.

The launcher's two marks both stay mounted and crossfade with a quarter turn,
so the swap reads as one object turning rather than two icons blinking. Nothing
loops — the old launcher pulse is gone.

Animated elements carry `data-cb-animate`; under
`prefers-reduced-motion: reduce` their durations collapse to near zero, keeping
the state change without the travel.

## CSS Variables

All theme values are exposed as CSS variables on the chat widget:

| Variable | Description |
|----------|-------------|
| `--cb-primary` | Primary color |
| `--cb-header-bg` | Header background |
| `--cb-border-radius` | Border radius |
| `--cb-font-family` | Font family |
| `--cb-window-width` | Window width |
| `--cb-window-height` | Window height |
| `--cb-bg` | Panel surface |
| `--cb-ink` | Primary text |
| `--cb-ink-muted` | Secondary text (timestamps, placeholders) |
| `--cb-ink-faint` | Tertiary text and disabled glyphs |
| `--cb-border` | Hairline |
| `--cb-hover` | Hover plate behind ghost buttons |

## Style Overrides

Use the `style` prop for fine-grained CSS overrides:

```tsx
<ChatBot
  style={{
    launcher: { boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
    window: { border: '2px solid #6C5CE7' },
    header: { borderBottom: 'none' },
    messageBot: { background: '#f0ebff' },
    messageUser: { background: '#6C5CE7' },
    inputArea: { borderTop: '1px solid #eee' },
  }}
/>
```

## Dark Mode

```tsx
<ChatBot
  theme={{
    mode: 'dark',
    primaryColor: '#A29BFE',
  }}
/>
```

## Custom Class Name

Add a class to the root element for CSS targeting:

```tsx
<ChatBot className="my-chatbot" />
```

```css
.my-chatbot .cb-window { /* custom styles */ }
```

## Glassmorphism

The default theme uses a glassmorphism design with backdrop blur and semi-transparent backgrounds. This is built into the component styles.

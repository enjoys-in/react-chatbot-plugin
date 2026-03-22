# Theming & Styling

Customize colors, fonts, border radius, and light/dark mode.

## ChatTheme

```tsx
<ChatBot
  theme={{
    primaryColor: '#6C5CE7',
    headerBg: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
    borderRadius: '20px',
    mode: 'light',  // 'light' or 'dark'
    fontFamily: '"Inter", sans-serif',
    windowWidth: '400px',
    windowHeight: '600px',
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `primaryColor` | `string` | `'#6C5CE7'` | Main accent color |
| `headerBg` | `string` | Uses primaryColor | Header background (can be gradient) |
| `borderRadius` | `string` | `'16px'` | Window border radius |
| `mode` | `'light' \| 'dark'` | `'light'` | Color mode |
| `fontFamily` | `string` | System fonts | Font stack |
| `windowWidth` | `string` | `'380px'` | Chat window width |
| `windowHeight` | `string` | `'550px'` | Chat window height |

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

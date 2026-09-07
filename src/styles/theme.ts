import type { ChatTheme, ChatStyle, ChatColorMode } from '../types';
import type { CSSProperties } from 'react';

// ─── Resolved Style Map ─────────────────────────────────────────

/** Resolved inline styles for each chatbot section. Uses `CSSProperties` by reference
 *  so the emitted `.d.ts` stays compact instead of expanding every CSS property. */
export interface ChatStyles {
  root: CSSProperties;
  launcher: CSSProperties;
  window: CSSProperties;
  header: CSSProperties;
  messageList: CSSProperties;
  inputArea: CSSProperties;
  botBubble: CSSProperties;
  userBubble: CSSProperties;
}

// ─── Light Mode Defaults ─────────────────────────────────────────
// Calm, high-contrast neutrals: a white surface, near-black ink and a single
// black accent. Colour is reserved for meaning (unread, error), never decoration.

const lightDefaults: Required<ChatTheme> = {
  primaryColor: '#000000',
  headerBg: '#FFFFFF',
  headerText: '#14161A',
  bubbleBg: '#F5F5F5',
  bubbleText: '#14161A',
  userBubbleBg: '#000000',
  userBubbleText: '#FAFAFA',
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontSize: '14px',
  borderRadius: '24px',
  windowWidth: '400px',
  windowHeight: '704px',
  mode: 'light',
};

// ─── Dark Mode Overrides ─────────────────────────────────────────
// The same structure inverted — surfaces lift with lightness, not with colour.

const darkOverrides: Partial<ChatTheme> = {
  // The accent has to lift off a dark page, so it inverts with the surface.
  primaryColor: '#F2F3F5',
  headerBg: '#14161A',
  headerText: '#F7F7F7',
  bubbleBg: '#2B2D31',
  bubbleText: '#F7F7F7',
  userBubbleBg: '#F2F3F5',
  userBubbleText: '#14161A',
};

// ─── Contrast ────────────────────────────────────────────────────

/** Relative luminance of a hex or rgb() colour, 0 (black) to 1 (white).
 *  Returns null for values it can't parse (gradients, named colours, vars). */
function luminance(color: string): number | null {
  const c = color.trim();
  let rgb: [number, number, number] | null = null;

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
  if (hex) {
    const h = hex[1];
    const full = h.length === 3 ? h.split('').map((d) => d + d).join('') : h;
    rgb = [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ];
  } else {
    const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(c);
    if (m) rgb = [Number(m[1]), Number(m[2]), Number(m[3])];
  }
  if (!rgb) return null;

  const [r, g, b] = rgb.map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two luminances. */
function contrast(a: number, b: number): number {
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}

/** Ink that stays legible on `bg` — whichever of light/dark actually scores
 *  higher, since a mid-tone surface can fail against both a threshold guess.
 *  Falls back to `fallback` when `bg` is something we can't measure. */
export function contrastInk(bg: string, fallback = '#14161A'): string {
  const l = luminance(bg);
  if (l === null) return fallback;
  const light = luminance('#FFFFFF')!;
  const dark = luminance('#14161A')!;
  return contrast(l, light) >= contrast(l, dark) ? '#FFFFFF' : '#14161A';
}

// ─── Colour Mode ─────────────────────────────────────────────────

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/** True when the visitor's OS/browser asks for a dark UI. Safe on the server
 *  and in browsers without `matchMedia` — both report light. */
export function prefersDarkScheme(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(COLOR_SCHEME_QUERY).matches;
}

/** Subscribe to `prefers-color-scheme` changes. Returns an unsubscribe fn.
 *  No-ops where `matchMedia` is unavailable. */
export function onColorSchemeChange(fn: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(COLOR_SCHEME_QUERY);
  const handler = (e: MediaQueryListEvent) => fn(e.matches);
  // addListener is the Safari < 14 fallback.
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }
  mq.addListener(handler);
  return () => mq.removeListener(handler);
}

/** Collapse `'auto'` into a concrete mode. */
export function resolveColorMode(mode: ChatTheme['mode']): ChatColorMode {
  if (mode === 'auto') return prefersDarkScheme() ? 'dark' : 'light';
  return mode ?? 'light';
}

export function resolveTheme(theme?: ChatTheme): Required<ChatTheme> {
  // `'auto'` never survives past this point, so every `theme.mode === 'dark'`
  // check downstream keeps working unchanged.
  const mode = resolveColorMode(theme?.mode);
  const base = { ...lightDefaults, ...theme, mode };
  const resolved = mode === 'dark'
    ? { ...base, ...darkOverrides, ...theme, mode }
    : base;

  // A caller who sets a coloured `headerBg` but no `headerText` used to get
  // white ink for free. Keep that working by deriving ink from the surface.
  if (theme?.headerBg && !theme.headerText) {
    return { ...resolved, headerText: contrastInk(theme.headerBg, resolved.headerText) };
  }
  // Same courtesy for a custom user-bubble fill.
  if (theme?.userBubbleBg && !theme.userBubbleText) {
    return { ...resolved, userBubbleText: contrastInk(theme.userBubbleBg, resolved.userBubbleText) };
  }
  return resolved;
}

// ─── Motion ──────────────────────────────────────────────────────

/** Timing lifted from the live Messenger. One decelerating curve does the
 *  travelling; hovers and colour changes use plain ease and stay short. */
export const motion = {
  /** Panel enter/exit — easeOutQuint. Fast start, long settle. */
  panel: '0.32s cubic-bezier(0.23, 1, 0.32, 1)',
  /** A message or pill arriving. */
  enter: '0.2s ease-out',
  /** Hover plates and surface tints. */
  surface: '0.15s ease',
  /** Buttons: colour, fill and shadow together. */
  control: '0.2s ease',
  /** Icon fill/stroke crossfades. */
  icon: '0.3s ease',
} as const;

// ─── Typography ──────────────────────────────────────────────────

/** The Messenger's measured type scale. Line heights are absolute because the
 *  ratios are irregular (14/19.6, 13/18.5) and rounding drifts at small sizes. */
export const typography = {
  /** Centred screen title, e.g. "Messages". */
  titleLg: { fontSize: '18px', fontWeight: 600, lineHeight: '18px' },
  /** Header name. */
  title: { fontSize: '14px', fontWeight: 600, lineHeight: '15.4px' },
  /** Header supporting line. */
  subtitle: { fontSize: '13px', fontWeight: 400, lineHeight: '18.5px' },
  /** Message body. */
  body: { fontSize: '14px', fontWeight: 400, lineHeight: '19.6px' },
  /** Composer text and placeholder. */
  input: { fontSize: '14px', fontWeight: 400, lineHeight: '21px' },
  /** Byline under a bubble: "Fin • AI Agent • Just now". */
  meta: { fontSize: '12px', fontWeight: 400, lineHeight: '12px', letterSpacing: '0.072px' },
  /** Legal/branding footer. */
  footnote: { fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '0.01px' },
} satisfies Record<string, CSSProperties>;

/** Ink layers for an arbitrary surface — used where the background is supplied
 *  by config rather than by the theme (launcher notification, custom cards).
 *  Everything is derived from the surface, so a brand colour can't end up with
 *  ink keyed to the wrong mode. */
export function inkLayers(surface: string, fallbackDark = false) {
  const primary = contrastInk(surface, fallbackDark ? '#F7F7F7' : '#14161A');
  const onDark = primary === '#FFFFFF';
  const rgb = onDark ? '255,255,255' : '9,14,21';
  return {
    /** Body and heading text. */
    primary,
    /** Secondary text — holds ≥4.5:1 on either polarity. */
    muted: `rgba(${rgb},0.68)`,
    /** Visible hairline, not the near-invisible 0.05 kind. */
    border: `rgba(${rgb},0.14)`,
    /** Plate behind a ghost control. */
    plate: `rgba(${rgb},0.1)`,
    /** True when the surface is dark enough to need light ink. */
    onDark,
  };
}

// ─── Semantic Neutrals ───────────────────────────────────────────

/** Ink, hairlines and surfaces per mode — kept in one place so every component
 *  reads the same greys instead of hard-coding its own. */
export function neutrals(isDark: boolean) {
  return {
    surface: isDark ? '#14161A' : '#FFFFFF',
    /** Slightly lifted surface for composers and inset panels. */
    surfaceRaised: isDark ? '#14161A' : '#FFFFFF',
    ink: isDark ? '#F7F7F7' : '#14161A',
    /** Secondary text: timestamps, bylines, placeholders. */
    inkMuted: isDark ? '#9A9DA2' : '#6C6F74',
    /** Tertiary text and disabled glyphs. */
    inkFaint: isDark ? '#6E7176' : '#A6A9AD',
    hairline: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(9, 14, 21, 0.08)',
    /** Hover plate behind ghost buttons. */
    hover: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(9, 14, 21, 0.06)',
    /** Resting fill for the disabled send button. */
    inset: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(9, 14, 21, 0.1)',
  };
}

/** Secondary ink and hover plate for the header, derived from the header's own
 *  ink so a coloured `headerBg` keeps its subtitle and controls legible. */
export function headerInk(theme: Required<ChatTheme>) {
  const n = neutrals(theme.mode === 'dark');
  const l = luminance(theme.headerText);
  // Light ink means the header sits on a dark or saturated surface.
  const lightInk = l !== null && l > 0.5;

  return {
    muted: lightInk ? 'rgba(255,255,255,0.72)' : n.inkMuted,
    icon: lightInk ? 'rgba(255,255,255,0.86)' : n.inkMuted,
    hover: lightInk ? 'rgba(255,255,255,0.16)' : n.hover,
  };
}

// ─── CSS Custom Properties ───────────────────────────────────────

export function buildCSSVariables(theme: Required<ChatTheme>): Record<string, string> {
  const isDark = theme.mode === 'dark';
  const n = neutrals(isDark);

  return {
    '--cb-primary': theme.primaryColor,
    // Ink for anything filled with the accent. The accent inverts between modes,
    // so a hard-coded white vanishes on the light fill dark mode uses.
    '--cb-primary-ink': contrastInk(theme.primaryColor, isDark ? '#14161A' : '#FFFFFF'),
    '--cb-header-bg': theme.headerBg,
    '--cb-header-text': theme.headerText,
    '--cb-bubble-bg': theme.bubbleBg,
    '--cb-bubble-text': theme.bubbleText,
    '--cb-user-bubble-bg': theme.userBubbleBg,
    '--cb-user-bubble-text': theme.userBubbleText,
    '--cb-font-family': theme.fontFamily,
    '--cb-font-size': theme.fontSize,
    '--cb-border-radius': theme.borderRadius,
    '--cb-window-width': theme.windowWidth,
    '--cb-window-height': theme.windowHeight,
    '--cb-bg': n.surface,
    '--cb-ink': n.ink,
    '--cb-ink-muted': n.inkMuted,
    '--cb-ink-faint': n.inkFaint,
    '--cb-border': n.hairline,
    '--cb-hover': n.hover,
    '--cb-input-bg': n.surfaceRaised,
    '--cb-input-border': n.hairline,
    '--cb-input-text': n.ink,
    '--cb-branding-bg': n.surface,
    '--cb-scrollbar': isDark ? 'rgba(255,255,255,0.22)' : 'rgba(9,14,21,0.18)',
    '--cb-scrollbar-hover': isDark ? 'rgba(255,255,255,0.36)' : 'rgba(9,14,21,0.30)',
  };
}

// ─── Inline Styles Builder ───────────────────────────────────────

export function buildStyles(
  theme: Required<ChatTheme>,
  overrides?: ChatStyle,
): ChatStyles {
  const isDark = theme.mode === 'dark';
  const n = neutrals(isDark);

  const styles = {
    root: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize,
      lineHeight: '1.5',
      // Anchor the cascade: without this, anything using `color: inherit`
      // picks up the host page's body colour instead of the widget's ink.
      color: n.ink,
    } satisfies CSSProperties,

    launcher: {
      position: 'fixed',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: theme.primaryColor,
      color: contrastInk(theme.primaryColor, isDark ? '#14161A' : '#FFFFFF'),
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 6px rgba(0,0,0,0.06), 0 2px 32px rgba(0,0,0,0.16)',
      transition: `transform ${motion.control}`,
      zIndex: 9998,
      ...overrides?.launcher,
    } satisfies CSSProperties,

    window: {
      position: 'fixed',
      width: theme.windowWidth,
      height: theme.windowHeight,
      maxHeight: 'calc(100vh - 128px)',
      borderRadius: theme.borderRadius,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: isDark
        ? '0 5px 40px rgba(9, 14, 21, 0.9)'
        : '0 5px 40px rgba(9, 14, 21, 0.16)',
      backgroundColor: n.surface,
      zIndex: 9999,
      animation: `cb-window-enter ${motion.panel}`,
      ...overrides?.window,
    } satisfies CSSProperties,

    header: {
      background: theme.headerBg,
      color: theme.headerText,
      padding: '8px 13px',
      minHeight: '54px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      flexShrink: 0,
      position: 'relative',
      borderBottom: `1px solid ${n.hairline}`,
      ...overrides?.header,
    } satisfies CSSProperties,

    messageList: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '24px 16px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      background: n.surface,
      ...overrides?.messageList,
    } satisfies CSSProperties,

    inputArea: {
      padding: '0 16px 8px',
      backgroundColor: n.surface,
      flexShrink: 0,
      ...overrides?.inputArea,
    } satisfies CSSProperties,

    botBubble: {
      background: theme.bubbleBg,
      color: theme.bubbleText,
      padding: '12px 16px',
      borderRadius: '20px',
      maxWidth: '78%',
      alignSelf: 'flex-start',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      ...typography.body,
    } satisfies CSSProperties,

    userBubble: {
      background: theme.userBubbleBg,
      color: theme.userBubbleText,
      padding: '12px 16px',
      borderRadius: '20px',
      maxWidth: '78%',
      alignSelf: 'flex-end',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      ...typography.body,
    } satisfies CSSProperties,
  };

  return styles;
}

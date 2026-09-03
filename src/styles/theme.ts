import type { ChatTheme, ChatStyle } from '../types';
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

const lightDefaults: Required<ChatTheme> = {
  primaryColor: '#6C5CE7',
  headerBg: '#6C5CE7',
  headerText: '#FFFFFF',
  bubbleBg: '#F1F3F9',
  bubbleText: '#2D3436',
  userBubbleBg: '#6C5CE7',
  userBubbleText: '#FFFFFF',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
  borderRadius: '20px',
  windowWidth: '400px',
  windowHeight: '600px',
  mode: 'light',
};

// ─── Dark Mode Overrides ─────────────────────────────────────────
// Flat, modern dark palette — deep neutral surfaces + a single indigo accent.

const darkOverrides: Partial<ChatTheme> = {
  headerBg: '#17171F',
  headerText: '#F5F5FA',
  bubbleBg: '#242430',
  bubbleText: '#E8E8F0',
  userBubbleBg: '#d2d2d3',
  userBubbleText: '#FFFFFF',
};

export function resolveTheme(theme?: ChatTheme): Required<ChatTheme> {
  const base = { ...lightDefaults, ...theme };
  if (base.mode === 'dark') {
    return { ...base, ...darkOverrides, ...theme };
  }
  return base;
}

// ─── CSS Custom Properties ───────────────────────────────────────

export function buildCSSVariables(theme: Required<ChatTheme>): Record<string, string> {
  return {
    '--cb-primary': theme.primaryColor,
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
    '--cb-bg': theme.mode === 'dark' ? '#141414' : '#FFFFFF',
    '--cb-border': theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    '--cb-input-bg': theme.mode === 'dark' ? '#1E1E28' : '#F5F7FC',
    '--cb-input-border': theme.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)',
    '--cb-input-text': theme.mode === 'dark' ? '#E8E8F0' : '#2D3436',
    '--cb-branding-bg': theme.mode === 'dark' ? '#101017' : '#FAFAFF',
  };
}

// ─── Inline Styles Builder ───────────────────────────────────────

export function buildStyles(
  theme: Required<ChatTheme>,
  overrides?: ChatStyle,
): ChatStyles {
  const isDark = theme.mode === 'dark';

  const styles = {
    root: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize,
      lineHeight: '1.5',
    } satisfies CSSProperties,

    launcher: {
      position: 'fixed',
      width: '62px',
      height: '62px',
      borderRadius: '50%',
      background: theme.primaryColor,
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 6px 24px rgba(108, 92, 231, 0.4), 0 2px 8px rgba(0,0,0,0.1)`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 9998,
      ...overrides?.launcher,
    } satisfies CSSProperties,

    window: {
      position: 'fixed',
      width: theme.windowWidth,
      height: theme.windowHeight,
      maxHeight: '85vh',
      borderRadius: theme.borderRadius,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: isDark
        ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
        : '0 20px 60px rgba(108, 92, 231, 0.15), 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
      backgroundColor: isDark ? '#141414' : '#FFFFFF',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
      zIndex: 9999,
      animation: 'cb-window-enter 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      ...overrides?.window,
    } satisfies CSSProperties,

    header: {
      background: theme.headerBg,
      color: theme.headerText,
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      ...overrides?.header,
    } satisfies CSSProperties,

    messageList: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      background: isDark ? '#141414' : '#FFFFFF',
      ...overrides?.messageList,
    } satisfies CSSProperties,

    inputArea: {
      padding: '12px 16px 14px',
      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
      backgroundColor: isDark ? '#101017' : '#FFFFFF',
      flexShrink: 0,
      ...overrides?.inputArea,
    } satisfies CSSProperties,

    botBubble: {
      background: isDark ? '#242430' : '#F1F3F9',
      color: isDark ? '#E8E8F0' : '#2D3436',
      padding: '12px 16px',
      borderRadius: '18px 18px 18px 4px',
      maxWidth: '82%',
      alignSelf: 'flex-start',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
      boxShadow: isDark
        ? '0 2px 8px rgba(0,0,0,0.2)'
        : '0 2px 8px rgba(0,0,0,0.04)',
      fontSize: '14px',
      lineHeight: '1.55',
      letterSpacing: '0.01em',
    } satisfies CSSProperties,

    userBubble: {
      background: theme.userBubbleBg,
      color: theme.userBubbleText,
      padding: '12px 16px',
      borderRadius: '18px 18px 4px 18px',
      maxWidth: '82%',
      alignSelf: 'flex-end',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      boxShadow: '0 4px 14px rgba(108, 92, 231, 0.25)',
      fontSize: '14px',
      lineHeight: '1.55',
      letterSpacing: '0.01em',
    } satisfies CSSProperties,
  };

  return styles;
}



import type { ChatTheme, ChatStyle } from '../types';
import type { CSSProperties } from 'react';


const lightDefaults: Required<ChatTheme> = {
  primaryColor: '#6C5CE7',
  headerBg: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
  headerText: '#FFFFFF',
  bubbleBg: 'rgba(241, 243, 249, 0.85)',
  bubbleText: '#2D3436',
  userBubbleBg: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
  userBubbleText: '#FFFFFF',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
  borderRadius: '20px',
  windowWidth: '400px',
  windowHeight: '600px',
  mode: 'light',
};


const darkOverrides: Partial<ChatTheme> = {
  headerBg: 'linear-gradient(135deg, #2D1B69 0%, #4A3298 100%)',
  headerText: '#F0F0FF',
  bubbleBg: 'rgba(45, 45, 70, 0.85)',
  bubbleText: '#E8E8F0',
  userBubbleBg: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
  userBubbleText: '#FFFFFF',
};

export function resolveTheme(theme?: ChatTheme): Required<ChatTheme> {
  const base = { ...lightDefaults, ...theme };
  if (base.mode === 'dark') {
    return { ...base, ...darkOverrides, ...theme };
  }
  return base;
}


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
    '--cb-bg': theme.mode === 'dark' ? 'rgba(22, 22, 40, 0.95)' : 'rgba(255, 255, 255, 0.92)',
    '--cb-border': theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    '--cb-input-bg': theme.mode === 'dark' ? 'rgba(40, 40, 65, 0.8)' : 'rgba(245, 247, 252, 0.9)',
    '--cb-input-border': theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    '--cb-input-text': theme.mode === 'dark' ? '#E0E0E0' : '#2D3436',
    '--cb-branding-bg': theme.mode === 'dark' ? 'rgba(20, 20, 35, 0.8)' : 'rgba(250, 250, 255, 0.8)',
  };
}


export function buildStyles(
  theme: Required<ChatTheme>,
  overrides?: ChatStyle,
) {
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
      background: theme.headerBg,
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
      backgroundColor: isDark ? 'rgba(22, 22, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
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
      background: isDark
        ? 'linear-gradient(180deg, rgba(22, 22, 40, 0.98) 0%, rgba(30, 30, 50, 0.98) 100%)'
        : 'linear-gradient(180deg, rgba(248, 249, 254, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
      ...overrides?.messageList,
    } satisfies CSSProperties,

    inputArea: {
      padding: '12px 16px 14px',
      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
      backgroundColor: isDark ? 'rgba(20, 20, 38, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      flexShrink: 0,
      ...overrides?.inputArea,
    } satisfies CSSProperties,

    botBubble: {
      background: isDark ? 'rgba(45, 45, 70, 0.7)' : 'rgba(241, 243, 249, 0.9)',
      color: isDark ? '#E8E8F0' : '#2D3436',
      padding: '12px 16px',
      borderRadius: '18px 18px 18px 4px',
      maxWidth: '82%',
      alignSelf: 'flex-start',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
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

export type ChatStyles = ReturnType<typeof buildStyles>;

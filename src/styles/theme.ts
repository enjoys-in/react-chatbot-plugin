import type { ChatTheme, ChatStyle } from '../types';
import type { CSSProperties } from 'react';

const defaults: Required<ChatTheme> = {
  primaryColor: '#0066FF',
  headerBg: '#0066FF',
  headerText: '#FFFFFF',
  bubbleBg: '#F1F1F1',
  bubbleText: '#333333',
  userBubbleBg: '#0066FF',
  userBubbleText: '#FFFFFF',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
  borderRadius: '12px',
  windowWidth: '380px',
  windowHeight: '550px',
};

export function resolveTheme(theme?: ChatTheme): Required<ChatTheme> {
  return { ...defaults, ...theme };
}

export function buildStyles(
  theme: Required<ChatTheme>,
  overrides?: ChatStyle,
) {
  const styles = {
    root: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize,
      lineHeight: '1.5',
    } satisfies CSSProperties,

    launcher: {
      position: 'fixed',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: theme.primaryColor,
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'transform 0.2s ease',
      zIndex: 9998,
      ...overrides?.launcher,
    } satisfies CSSProperties,

    window: {
      position: 'fixed',
      width: theme.windowWidth,
      height: theme.windowHeight,
      maxHeight: '80vh',
      borderRadius: theme.borderRadius,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      backgroundColor: '#FFFFFF',
      zIndex: 9999,
      ...overrides?.window,
    } satisfies CSSProperties,

    header: {
      backgroundColor: theme.headerBg,
      color: theme.headerText,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      flexShrink: 0,
      ...overrides?.header,
    } satisfies CSSProperties,

    messageList: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      ...overrides?.messageList,
    } satisfies CSSProperties,

    inputArea: {
      padding: '12px 16px',
      borderTop: '1px solid #E8E8E8',
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-end',
      flexShrink: 0,
      ...overrides?.inputArea,
    } satisfies CSSProperties,

    botBubble: {
      backgroundColor: theme.bubbleBg,
      color: theme.bubbleText,
      padding: '10px 14px',
      borderRadius: '16px 16px 16px 4px',
      maxWidth: '80%',
      alignSelf: 'flex-start',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
    } satisfies CSSProperties,

    userBubble: {
      backgroundColor: theme.userBubbleBg,
      color: theme.userBubbleText,
      padding: '10px 14px',
      borderRadius: '16px 16px 4px 16px',
      maxWidth: '80%',
      alignSelf: 'flex-end',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
    } satisfies CSSProperties,
  };

  return styles;
}

export type ChatStyles = ReturnType<typeof buildStyles>;

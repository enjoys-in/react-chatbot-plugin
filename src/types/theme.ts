import type { CSSProperties } from 'react';

/** A concrete colour mode, after `'auto'` has been resolved. */
export type ChatColorMode = 'light' | 'dark';

export interface ChatTheme {
  primaryColor?: string;
  headerBg?: string;
  headerText?: string;
  bubbleBg?: string;
  bubbleText?: string;
  userBubbleBg?: string;
  userBubbleText?: string;
  fontFamily?: string;
  fontSize?: string;
  borderRadius?: string;
  windowWidth?: string;
  windowHeight?: string;
  /**
   * Colour mode. `'auto'` follows the visitor's OS/browser setting via
   * `prefers-color-scheme` and switches live when they change it.
   * Defaults to `'light'`.
   */
  mode?: ChatColorMode | 'auto';
}

export interface ChatStyle {
  launcher?: CSSProperties;
  window?: CSSProperties;
  header?: CSSProperties;
  messageList?: CSSProperties;
  inputArea?: CSSProperties;
}

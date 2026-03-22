import type { CSSProperties } from 'react';

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
  mode?: 'light' | 'dark';
}

export interface ChatStyle {
  launcher?: CSSProperties;
  window?: CSSProperties;
  header?: CSSProperties;
  messageList?: CSSProperties;
  inputArea?: CSSProperties;
}

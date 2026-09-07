import type { ComponentType, ReactNode } from 'react';

// ─── Home Screen ─────────────────────────────────────────────────

/** Handed to every home-screen callback and to any component you render in a
 *  section, so your own UI can drive the chat without reaching into context. */
export interface HomeScreenContext {
  /** Leave home and show the conversation. */
  openChat: () => void;
  /** Send `text` as the visitor and open the conversation. */
  sendMessage: (text: string) => void;
  /** Jump the flow to `stepId` and open the conversation. */
  goToStep: (stepId: string) => void;
  /** Everything collected by the flow and its forms so far. */
  data: Record<string, unknown>;
  /** Close the widget entirely. */
  close: () => void;
}

/** One tappable row. `icon` is a `ReactNode`, so bring whatever icon set you
 *  already use — Phosphor, Lucide, an `<img>`, or an emoji. */
export interface HomeScreenAction {
  /** Stable key. Also reported to `onHomeAction`. */
  id: string;
  label: string;
  /** Optional second line, muted. */
  description?: string;
  icon?: ReactNode;
  /** Tint behind the icon. Defaults to the theme accent. */
  iconBackground?: string;
  /** Trailing element. Defaults to a chevron; pass `null` for none. */
  accessory?: ReactNode | null;
  /** Pick one of these three — they run in this order of precedence. */
  onSelect?: (ctx: HomeScreenContext) => void;
  /** Send this text as the visitor. */
  message?: string;
  /** Jump the flow to this step. */
  stepId?: string;
  /** Render as a link instead of a button (opens in a new tab). */
  href?: string;
  disabled?: boolean;
}

/** Your own component, dropped into the home screen. By default it's wrapped
 *  in a card shell that matches the action list; set `shell: false` to render
 *  it bare and own the whole box yourself. */
export interface HomeScreenSection {
  /** Stable key. */
  id: string;
  /** Optional heading rendered above your component. */
  title?: string;
  /** An element, or a component that receives `HomeScreenContext` as props. */
  component: ReactNode | ComponentType<HomeScreenContext>;
  /** Wrap in the card shell (default `true`). */
  shell?: boolean;
  /** Sits before or after the action list (default `'below'`). */
  placement?: 'above' | 'below';
}

/** Primary button pinned under the content. Set `cta: null` to remove it. */
export interface HomeScreenCta {
  label: string;
  icon?: ReactNode;
  /** Defaults to opening the conversation. */
  onSelect?: (ctx: HomeScreenContext) => void;
}

/**
 * The default screen shown when the widget opens.
 *
 * Supplying `homeScreen` takes precedence over `customizeChat.welcomeScreen`.
 * Replace the whole screen with `customizeChat.homeScreen.component`, or keep
 * the shell and fill it with `actions` and `sections`.
 *
 * @example
 * ```tsx
 * <ChatBot
 *   homeScreen={{
 *     greeting: 'Hi there 👋',
 *     tagline: 'How can we help?',
 *     actions: [
 *       { id: 'chat', label: 'Start a chat', icon: <ChatIcon />, message: 'Hello' },
 *       { id: 'order', label: 'Track an order', icon: <BoxIcon />, stepId: 'order' },
 *     ],
 *     sections: [
 *       { id: 'status', title: 'System status', component: StatusWidget },
 *     ],
 *   }}
 * />
 * ```
 */
export interface HomeScreenConfig {
  /** Set `false` to configure the screen but not show it. Default `true`. */
  enabled?: boolean;
  /** Muted line above the tagline. */
  greeting?: ReactNode;
  /** The prominent line. */
  tagline?: ReactNode;
  /** Square avatar shown above the greeting. */
  avatar?: string;
  /** Icon rows. Five reads comfortably before the list starts scrolling. */
  actions?: HomeScreenAction[];
  /** Your components, in card shells unless `shell: false`. */
  sections?: HomeScreenSection[];
  /** Primary button under the content. `null` removes it. */
  cta?: HomeScreenCta | null;
  /** Paint the greeting area with `theme.headerBg`. Default `false`. */
  masthead?: boolean;
}

/** Props for a replacement home screen via `customizeChat.homeScreen`. */
export interface HomeScreenSlotProps {
  config: HomeScreenConfig;
  /** Chat controls, same object your actions receive. */
  ctx: HomeScreenContext;
  component: ReactNode | ComponentType<HomeScreenSlotProps>;
}

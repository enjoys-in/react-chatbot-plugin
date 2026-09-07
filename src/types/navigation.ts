import type { ComponentType, ReactNode } from 'react';
import type { HomeScreenContext } from './home';

// ─── Bottom Navigation ───────────────────────────────────────────

/** One entry in the bottom tab bar. Up to five read comfortably. */
export interface NavTab {
  /** Stable id. `'home'` renders the home screen, `'messages'` renders the
   *  conversation; any other id renders your own `component`. */
  id: string;
  label: string;
  icon?: ReactNode;
  /** Optional icon shown only when the tab is active (defaults to `icon`). */
  activeIcon?: ReactNode;
  /** Count or dot shown on the tab. */
  badge?: number | boolean;
  /** For custom tabs: an element, or a component given `HomeScreenContext`. */
  component?: ReactNode | ComponentType<HomeScreenContext>;
}

/**
 * A persistent bottom tab bar that turns the widget into a multi-screen shell
 * (Home / Messages / your own tabs), like Intercom's Messenger.
 *
 * @example
 * ```tsx
 * <ChatBot
 *   homeScreen={{ greeting: 'Hi 👋', tagline: 'How can we help?' }}
 *   navigation={{
 *     tabs: [
 *       { id: 'home', label: 'Home', icon: <HomeIcon /> },
 *       { id: 'messages', label: 'Messages', icon: <ChatIcon />, badge: 1 },
 *       { id: 'help', label: 'Help', icon: <HelpIcon />, component: HelpPanel },
 *       { id: 'news', label: 'News', icon: <NewsIcon />, component: <NewsPanel /> },
 *     ],
 *   }}
 * />
 * ```
 */
export interface NavigationConfig {
  /** Set `false` to keep the config but hide the bar. Default `true`. */
  enabled?: boolean;
  /** Tabs, left to right. `'home'` and `'messages'` are built in. */
  tabs: NavTab[];
  /** Tab shown when the widget opens (default: first tab, or `'home'`). */
  defaultTab?: string;
  /** Called whenever the active tab changes. */
  onTabChange?: (tabId: string) => void;

  // ─── Appearance (all optional — sensible theme-based defaults) ──
  /** Icon + label color of the selected tab. Default: theme primary. */
  activeColor?: string;
  /** Icon + label color of unselected tabs. Default: muted ink. */
  inactiveColor?: string;
  /** Background highlight behind the selected tab. Default: a subtle tint. */
  activeBackground?: string;
  /** Show a small highlight bar on top of the selected tab. Default: `false`. */
  indicator?: boolean;
  /** Background of the whole nav bar. Default: theme surface. */
  background?: string;
}

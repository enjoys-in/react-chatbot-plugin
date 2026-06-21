// ─── Theme Toggle Plugin ─────────────────────────────────────────
// Allows user to toggle between light/dark mode in-chat.
// Activated via prop `enableThemeToggle: true`.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';

export interface ThemeTogglePluginOptions {
  /** Default mode (default: 'light') */
  defaultMode?: 'light' | 'dark';
  /** Persist preference in localStorage */
  persist?: boolean;
  /** Storage key */
  storageKey?: string;
  /** Callback on toggle */
  onToggle?: (mode: 'light' | 'dark') => void;
}

export function themeTogglePlugin(options: ThemeTogglePluginOptions = {}): ChatPlugin {
  const storageKey = options.storageKey ?? 'chatbot_theme_mode';
  let mode: 'light' | 'dark' = options.defaultMode ?? 'light';

  return {
    name: 'themeToggle',

    onInit(ctx: PluginContext) {
      if (options.persist !== false) {
        const saved = localStorage.getItem(storageKey);
        if (saved === 'light' || saved === 'dark') mode = saved;
      }
      ctx.setData('__themeMode', mode);
      ctx.emit('theme:mode', mode);
    },

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'theme:toggle') {
        mode = mode === 'light' ? 'dark' : 'light';
        if (options.persist !== false) localStorage.setItem(storageKey, mode);
        ctx.setData('__themeMode', mode);
        options.onToggle?.(mode);
        ctx.emit('theme:mode', mode);
      }

      if (event.type === 'theme:set' && (event.payload === 'light' || event.payload === 'dark')) {
        mode = event.payload;
        if (options.persist !== false) localStorage.setItem(storageKey, mode);
        ctx.setData('__themeMode', mode);
        options.onToggle?.(mode);
        ctx.emit('theme:mode', mode);
      }

      if (event.type === 'theme:get') {
        ctx.emit('theme:mode', mode);
      }
    },
  };
}

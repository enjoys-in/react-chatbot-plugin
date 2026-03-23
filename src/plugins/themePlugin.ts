import type { ChatPlugin, PluginContext } from '../types/plugin';
import { createStorageAdapter } from './utils/storage';

/**
 * Theme Plugin — switches themes dynamically and persists preference
 */
export function themePlugin(options?: {
  defaultMode?: 'light' | 'dark';
  storageKey?: string;
  onThemeChange?: (mode: string, ctx: PluginContext) => void;
  cssVariable?: string;
}): ChatPlugin {
  const storageKey = options?.storageKey ?? 'chatbot_theme';
  const store = createStorageAdapter('local');
  const cssVar = options?.cssVariable ?? '--cb-theme-mode';

  const applyTheme = (mode: string) => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(cssVar, mode);
      document.documentElement.setAttribute('data-chatbot-theme', mode);
    }
  };

  return {
    name: 'theme',

    onInit(ctx) {
      const saved = store.get(storageKey) ?? options?.defaultMode ?? 'light';
      applyTheme(saved);
      ctx.setData('theme', saved);

      ctx.on('theme:set', (...args: unknown[]) => {
        const mode = args[0] as string;
        if (mode) {
          store.set(storageKey, mode);
          applyTheme(mode);
          ctx.setData('theme', mode);
          options?.onThemeChange?.(mode, ctx);
          ctx.emit('theme:changed', { mode });
        }
      });

      ctx.on('theme:toggle', () => {
        const current = store.get(storageKey) ?? 'light';
        const next = current === 'light' ? 'dark' : 'light';
        ctx.emit('theme:set', next);
      });
    },
  };
}

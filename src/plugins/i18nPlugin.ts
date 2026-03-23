import type { ChatPlugin, PluginContext } from '../types/plugin';
import { createStorageAdapter } from './utils/storage';

type Translations = Record<string, Record<string, string>>;

/**
 * i18n Plugin — supports multiple languages with dynamic switching
 */
export function i18nPlugin(options: {
  defaultLocale?: string;
  translations: Translations;
  storageKey?: string;
  onLocaleChange?: (locale: string, ctx: PluginContext) => void;
}): ChatPlugin {
  const store = createStorageAdapter('local');
  const storageKey = options.storageKey ?? 'chatbot_locale';
  let currentLocale = options.defaultLocale ?? 'en';

  const t = (key: string): string => {
    return options.translations[currentLocale]?.[key]
      ?? options.translations[options.defaultLocale ?? 'en']?.[key]
      ?? key;
  };

  return {
    name: 'i18n',

    onInit(ctx) {
      const saved = store.get(storageKey);
      if (saved && options.translations[saved]) {
        currentLocale = saved;
      }
      ctx.setData('locale', currentLocale);
      ctx.setData('t', t);

      ctx.on('i18n:setLocale', (...args: unknown[]) => {
        const locale = args[0] as string;
        if (locale && options.translations[locale]) {
          currentLocale = locale;
          store.set(storageKey, locale);
          ctx.setData('locale', locale);
          options.onLocaleChange?.(locale, ctx);
          ctx.emit('i18n:localeChanged', { locale });
        }
      });

      ctx.on('i18n:translate', (...args: unknown[]) => {
        const key = args[0] as string;
        if (key) ctx.emit('i18n:translated', { key, value: t(key) });
      });
    },

    onMessage(message) {
      if (message.sender === 'bot' && message.text) {
        // Auto-translate bot messages that look like translation keys
        const translated = message.text.replace(/\{\{t:([^}]+)\}\}/g, (_, key: string) => t(key));
        if (translated !== message.text) {
          return { ...message, text: translated };
        }
      }
    },
  };
}

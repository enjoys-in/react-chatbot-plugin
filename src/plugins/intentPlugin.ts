import type { ChatPlugin, PluginContext } from '../types/plugin';

interface IntentRule {
  intent: string;
  patterns: string[];
  matchType?: 'contains' | 'exact' | 'regex';
}

/**
 * Intent Plugin — detects user intent from text and emits intent events for dynamic routing
 */
export function intentPlugin(options?: {
  rules?: IntentRule[];
  onIntentDetected?: (intent: string, text: string, ctx: PluginContext) => void;
  fallbackIntent?: string;
}): ChatPlugin {
  const rules = options?.rules ?? [];
  const fallback = options?.fallbackIntent ?? 'unknown';

  const detectIntent = (text: string): string => {
    const lower = text.toLowerCase().trim();
    for (const rule of rules) {
      for (const pattern of rule.patterns) {
        const pat = pattern.toLowerCase();
        switch (rule.matchType ?? 'contains') {
          case 'exact':
            if (lower === pat) return rule.intent;
            break;
          case 'regex':
            try { if (new RegExp(pat, 'i').test(text)) return rule.intent; } catch { /* skip */ }
            break;
          case 'contains':
          default:
            if (lower.includes(pat)) return rule.intent;
            break;
        }
      }
    }
    return fallback;
  };

  return {
    name: 'intent',

    onMessage(message, ctx) {
      if (message.sender !== 'user' || !message.text) return;
      const intent = detectIntent(message.text);
      ctx.emit('intent:detected', { intent, text: message.text });
      options?.onIntentDetected?.(intent, message.text, ctx);
    },
  };
}

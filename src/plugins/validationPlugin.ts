import type { ChatPlugin, PluginContext } from '../types/plugin';
import type { ChatMessage } from '../types/message';

type Validator = (text: string) => string | null;

/**
 * Validation Plugin — adds advanced validation rules for user inputs
 */
export function validationPlugin(options?: {
  validators?: Record<string, Validator>;
  sanitize?: boolean;
  blockProfanity?: boolean;
  profanityList?: string[];
  onValidationFail?: (text: string, error: string) => void;
}): ChatPlugin {
  const validators = options?.validators ?? {};
  const sanitize = options?.sanitize ?? true;
  const profanityList = options?.profanityList ?? [];

  const sanitizeHtml = (text: string): string => {
    return text.replace(/[<>&"']/g, (c) => {
      const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
      return map[c] ?? c;
    });
  };

  const checkProfanity = (text: string): string | null => {
    if (!options?.blockProfanity || !profanityList.length) return null;
    const lower = text.toLowerCase();
    for (const word of profanityList) {
      if (lower.includes(word.toLowerCase())) return 'Message contains inappropriate content.';
    }
    return null;
  };

  return {
    name: 'validation',

    onMessage(message: ChatMessage, ctx: PluginContext) {
      if (message.sender !== 'user' || !message.text) return;

      // Profanity check
      const profanityError = checkProfanity(message.text);
      if (profanityError) {
        options?.onValidationFail?.(message.text, profanityError);
        ctx.emit('validation:fail', { text: message.text, error: profanityError });
        return { ...message, text: '***' };
      }

      // Custom validators
      for (const [name, validate] of Object.entries(validators)) {
        const error = validate(message.text);
        if (error) {
          options?.onValidationFail?.(message.text, error);
          ctx.emit('validation:fail', { text: message.text, validator: name, error });
        }
      }

      // Sanitize
      if (sanitize) {
        return { ...message, text: sanitizeHtml(message.text) };
      }
    },
  };
}

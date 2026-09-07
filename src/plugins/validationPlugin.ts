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
  /**
   * Replacement for a matched word (default `'@#$%'`). The masked message is
   * rendered without markdown, so an asterisk mask like `'****'` shows as
   * asterisks rather than turning into a horizontal rule.
   */
  mask?: string;
  /** Mask just the matched words (default) or the whole message. */
  maskScope?: 'word' | 'message';
  onValidationFail?: (text: string, error: string) => void;
}): ChatPlugin {
  const validators = options?.validators ?? {};
  const sanitize = options?.sanitize ?? true;
  const profanityList = options?.profanityList ?? [];
  const mask = options?.mask ?? '@#$%';
  const maskScope = options?.maskScope ?? 'word';

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

  /** Replace matched words with the mask, keeping the rest of the message so
   *  the bubble still reads as something the visitor said. */
  const maskProfanity = (text: string): string => {
    if (maskScope === 'message') return mask;
    let masked = text;
    for (const word of profanityList) {
      if (!word) continue;
      const pattern = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      masked = masked.replace(pattern, mask);
    }
    return masked;
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
        return {
          ...message,
          text: maskProfanity(message.text),
          // Render the mask literally — otherwise `***` or `****` would be
          // parsed as a horizontal rule and the bubble would look empty.
          metadata: { ...message.metadata, markdown: false, masked: true },
        };
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

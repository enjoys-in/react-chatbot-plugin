import type { ChatPlugin } from '../types/plugin';

export interface BotPersona {
  /** Unique persona identifier */
  id: string;
  /** Display name */
  name: string;
  /** Avatar URL */
  avatar?: string;
  /** Greeting message when switching to this persona */
  greeting?: string;
  /** Theme overrides */
  theme?: { primaryColor?: string; headerBg?: string };
  /** Flow config ID to activate */
  flowId?: string;
}

/**
 * Persona Plugin — switch between different bot personalities in one widget.
 * Each persona has a name, avatar, greeting, and optionally a different theme/flow.
 */
export function personaPlugin(options: {
  personas: BotPersona[];
  /** Default persona ID (defaults to first) */
  defaultPersona?: string;
  /** Storage key for current persona (default: 'cb_persona') */
  storageKey?: string;
  /** Called when persona switches */
  onSwitch?: (persona: BotPersona) => void;
}): ChatPlugin {
  const storageKey = options.storageKey ?? 'cb_persona';
  let currentPersona: BotPersona = options.personas.find((p) => p.id === options.defaultPersona) ?? options.personas[0];

  return {
    name: 'persona',

    onInit(ctx) {
      // Restore saved persona
      try {
        const savedId = localStorage.getItem(storageKey);
        if (savedId) {
          const found = options.personas.find((p) => p.id === savedId);
          if (found) currentPersona = found;
        }
      } catch { /* ignore */ }

      ctx.emit('persona:current', currentPersona);
    },

    onEvent(event, ctx) {
      if (event.type === 'persona:switch' && typeof event.payload === 'string') {
        const persona = options.personas.find((p) => p.id === event.payload);
        if (persona) {
          currentPersona = persona;
          localStorage.setItem(storageKey, persona.id);
          options.onSwitch?.(persona);
          ctx.emit('persona:current', persona);

          if (persona.greeting) {
            ctx.addBotMessage(persona.greeting);
          }
          if (persona.flowId) {
            ctx.emit('flow:goto', persona.flowId);
          }
        }
      }

      if (event.type === 'persona:get') {
        ctx.emit('persona:current', currentPersona);
      }

      if (event.type === 'persona:list') {
        ctx.emit('persona:all', options.personas);
      }
    },

    onMessage(message) {
      // Tag bot messages with current persona info
      if (message.sender === 'bot') {
        return {
          ...message,
          metadata: {
            ...message.metadata,
            persona: currentPersona.id,
            personaName: currentPersona.name,
            personaAvatar: currentPersona.avatar,
          },
        };
      }
    },
  };
}

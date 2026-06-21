// ─── Whisper Plugin ──────────────────────────────────────────────
// Supervisor whisper mode — internal notes visible only to agents.
// Messages with `metadata.whisper: true` are filtered from user view.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';
import type { ChatMessage } from '../types/message';

export interface WhisperPluginOptions {
  /** Role that can see whispers (default: 'agent') */
  visibleTo?: string;
  /** Current viewer role — set to 'agent' for agents, 'user' for end-users */
  viewerRole?: 'agent' | 'supervisor' | 'user';
  /** Callback when whisper is sent */
  onWhisper?: (message: ChatMessage) => void;
  /** Webhook to forward whispers to */
  webhookUrl?: string;
}

export function whisperPlugin(options: WhisperPluginOptions = {}): ChatPlugin {
  const viewerRole = options.viewerRole ?? 'user';

  return {
    name: 'whisper',

    onMessage(message: ChatMessage, ctx: PluginContext) {
      // If message is a whisper and viewer is user, hide it
      const meta = message.metadata as Record<string, unknown> | undefined;
      if (meta?.whisper === true && viewerRole === 'user') {
        return undefined; // Block message from display
      }
      return message;
    },

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'whisper:send' && typeof event.payload === 'string') {
        const whisperMsg: Partial<ChatMessage> = {
          sender: 'bot',
          text: event.payload,
          metadata: { whisper: true, from: 'supervisor' },
        };

        // Only show to agents
        if (viewerRole !== 'user') {
          ctx.addBotMessage(`🔇 ${event.payload}`);
        }

        options.onWhisper?.(whisperMsg as ChatMessage);

        if (options.webhookUrl) {
          fetch(options.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'whisper', text: event.payload, timestamp: Date.now() }),
          }).catch(() => { /* silent */ });
        }

        ctx.emit('whisper:sent', whisperMsg);
      }
    },
  };
}

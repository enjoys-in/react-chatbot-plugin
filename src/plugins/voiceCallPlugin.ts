// ─── Voice Call Plugin ───────────────────────────────────────────
// Bridges the chatbot to @enjoys/voice-widget so a visitor can place a
// real browser WebRTC call from inside the chat — triggered by a header
// button, a composer icon, or a quick-reply "Call" option.
//
// A call starts when a `voice:call` event is emitted on the plugin
// manager (`pluginManager.emitEvent('voice:call')`) or when a quick reply
// whose value equals `triggerValue` is selected. `voice:hangup` ends it.
// @enjoys/voice-widget is an optional dependency, loaded on demand.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';

/** Minimal shape of the @enjoys/voice-widget runtime this plugin relies on. */
interface VoiceCallWidget {
  ready: Promise<unknown>;
  startCall: () => void | Promise<void>;
  hangup?: () => void;
  destroy?: () => void;
}

interface VoiceWidgetInitOptions {
  publicKey: string;
  apiBase?: string;
  autoButton?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  accentColor?: string;
  title?: string;
  onState?: (state: string) => void;
  onError?: (error: Error) => void;
}

interface VoiceWidgetModule {
  CallWidget: { init: (options: VoiceWidgetInitOptions) => VoiceCallWidget };
}

export interface VoiceCallPluginOptions {
  /** Publishable key (pk_…) bound to your allowed origins. */
  publicKey?: string;
  /** Voice API origin, e.g. https://voice.yourdomain.com. */
  apiBase?: string;
  /** Button / action accent color forwarded to the widget. */
  accentColor?: string;
  /** Panel heading shown by the widget. */
  title?: string;
  /** Quick-reply value that starts a call when selected (default: '__voice_call__'). */
  triggerValue?: string;
  /** Emit a bot message for each call stage (default: true). */
  announce?: boolean;
  /** Called on every widget state transition. */
  onState?: (state: string) => void;
  /** Called on validation / call errors. */
  onError?: (error: Error) => void;
}

// Placeholder credentials — swap for a real pk_… key + API origin in prod.
const DEFAULT_PUBLIC_KEY = 'pk_live_f4cddb9dee02a555d6fe3db8b07d441b';
// apiBase is the ORIGIN only — the widget appends /api/n/widget/* itself.
const DEFAULT_API_BASE = 'https://api.voice.enjoys.in';

export function voiceCallPlugin(options: VoiceCallPluginOptions = {}): ChatPlugin {
  const {
    publicKey = DEFAULT_PUBLIC_KEY,
    apiBase = DEFAULT_API_BASE,
    accentColor,
    title,
    triggerValue = '__voice_call__',
    announce = true,
    onState,
    onError,
  } = options;

  let widget: VoiceCallWidget | null = null;
  let loading: Promise<VoiceCallWidget | null> | null = null;
  let inCall = false;
  let starting = false;

  const say = (ctx: PluginContext, text: string) => {
    if (announce) ctx.addBotMessage(text);
  };

  async function ensureWidget(ctx: PluginContext): Promise<VoiceCallWidget | null> {
    if (widget) return widget;
    if (loading) return loading;

    loading = (async () => {
      try {
        const mod = (await import('@enjoys/voice-widget')) as unknown as VoiceWidgetModule;
        widget = mod.CallWidget.init({
          publicKey,
          apiBase,
          autoButton: false,
          accentColor,
          title,
          onState: (state) => {
            ctx.emit('voice:state', state);
            onState?.(state);
            if (state === 'ringing') {
              say(ctx, '📞 Ringing…');
            } else if (state === 'in-call') {
              starting = false;
              inCall = true;
              say(ctx, '✅ Call connected.');
            } else if (state === 'ended') {
              if (inCall || starting) say(ctx, '📴 Call ended.');
              starting = false;
              inCall = false;
            } else if (state === 'error' || state === 'invalid') {
              starting = false;
              inCall = false;
            }
          },
          onError: (err) => {
            ctx.emit('voice:error', err);
            onError?.(err);
            starting = false;
            inCall = false;
            say(ctx, '⚠️ Sorry, the call could not be connected.');
          },
        });
        await widget.ready;
        return widget;
      } catch (err) {
        onError?.(err as Error);
        ctx.emit('voice:error', err);
        widget = null;
        return null;
      } finally {
        loading = null;
      }
    })();

    return loading;
  }

  async function startCall(ctx: PluginContext) {
    if (inCall || starting) return;
    starting = true;
    say(ctx, '📞 Connecting your call…');
    const w = await ensureWidget(ctx);
    if (!w) {
      starting = false;
      say(ctx, '⚠️ Voice calling is unavailable right now.');
      return;
    }
    try {
      await w.startCall();
    } catch (err) {
      starting = false;
      onError?.(err as Error);
      say(ctx, '⚠️ Sorry, the call could not be started.');
    }
  }

  function hangup() {
    starting = false;
    inCall = false;
    widget?.hangup?.();
  }

  return {
    name: 'voiceCall',

    // No onInit: the widget (and the mic permission prompt) is created lazily
    // on the first call, so nothing is requested until the user starts one.

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      switch (event.type) {
        case 'voice:call':
          void startCall(ctx);
          break;
        case 'voice:hangup':
          hangup();
          break;
        case 'quickReply': {
          const value = (event.payload as { value?: string } | undefined)?.value;
          if (value === triggerValue) void startCall(ctx);
          break;
        }
      }
    },

    onDestroy() {
      hangup();
      widget?.destroy?.();
      widget = null;
    },
  };
}

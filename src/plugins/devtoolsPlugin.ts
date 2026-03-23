import type { ChatPlugin, PluginContext } from '../types/plugin';

interface DevToolsState {
  messages: number;
  events: Array<{ type: string; time: number }>;
  data: Record<string, unknown>;
  currentStep: string | null;
}

/**
 * DevTools Plugin — provides a visual debugging panel overlay
 */
export function devtoolsPlugin(options?: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  shortcutKey?: string;
  onStateUpdate?: (state: DevToolsState) => void;
}): ChatPlugin {
  const pos = options?.position ?? 'top-right';
  const shortcutKey = options?.shortcutKey ?? 'F2';
  let panel: HTMLDivElement | null = null;
  let visible = false;
  let state: DevToolsState = { messages: 0, events: [], data: {}, currentStep: null };

  const createPanel = (): HTMLDivElement => {
    const div = document.createElement('div');
    div.id = 'chatbot-devtools';
    const posStyles: Record<string, string> = {
      'top-left': 'top:8px;left:8px',
      'top-right': 'top:8px;right:8px',
      'bottom-left': 'bottom:80px;left:8px',
      'bottom-right': 'bottom:80px;right:8px',
    };
    div.style.cssText = `
      position:fixed;${posStyles[pos]};z-index:99999;width:320px;max-height:400px;overflow:auto;
      background:#1a1a2e;color:#e0e0e0;font-family:monospace;font-size:11px;
      border-radius:8px;padding:12px;box-shadow:0 4px 20px rgba(0,0,0,0.4);display:none;
    `;
    document.body.appendChild(div);
    return div;
  };

  const renderPanel = () => {
    if (!panel) return;
    panel.innerHTML = `
      <div style="font-size:13px;font-weight:bold;margin-bottom:8px;color:#6c5ce7;">🔧 ChatBot DevTools</div>
      <div style="margin-bottom:6px;"><b>Messages:</b> ${state.messages}</div>
      <div style="margin-bottom:6px;"><b>Step:</b> ${state.currentStep ?? 'none'}</div>
      <div style="margin-bottom:6px;"><b>Data:</b><pre style="margin:4px 0;white-space:pre-wrap;font-size:10px;">${JSON.stringify(state.data, null, 2)}</pre></div>
      <div><b>Recent Events (${state.events.length}):</b></div>
      ${state.events.slice(-10).map(e => `<div style="color:#888;font-size:10px;">${e.type}</div>`).join('')}
    `;
  };

  const toggle = () => {
    if (!panel) panel = createPanel();
    visible = !visible;
    panel.style.display = visible ? 'block' : 'none';
    if (visible) renderPanel();
  };

  return {
    name: 'devtools',

    onInit(ctx) {
      if (typeof document === 'undefined') return;

      document.addEventListener('keydown', (e) => {
        if (e.key === shortcutKey) toggle();
      });

      state.messages = ctx.getMessages().length;
      state.data = ctx.getData();
    },

    onMessage(message, ctx) {
      state.messages = ctx.getMessages().length + 1;
      state.data = ctx.getData();
      options?.onStateUpdate?.(state);
      if (visible) renderPanel();
    },

    onEvent(event, ctx: PluginContext) {
      state.events.push({ type: event.type, time: event.timestamp });
      if (event.type === 'stepChange') {
        state.currentStep = (event.payload as { stepId?: string })?.stepId ?? null;
      }
      state.data = ctx.getData();
      options?.onStateUpdate?.(state);
      if (visible) renderPanel();
    },

    onDestroy() {
      panel?.remove();
      panel = null;
    },
  };
}

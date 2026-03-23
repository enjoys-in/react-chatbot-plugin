import type { ChatPlugin, PluginContext } from '../types/plugin';

/**
 * Agent Plugin — enables live human agent takeover of the chat
 */
export function agentPlugin(options: {
  socketUrl?: string;
  onAgentConnect?: (ctx: PluginContext) => void;
  onAgentDisconnect?: (ctx: PluginContext) => void;
  onAgentMessage?: (text: string, ctx: PluginContext) => void;
  connectMessage?: string;
  disconnectMessage?: string;
}): ChatPlugin {
  let ws: WebSocket | null = null;
  let isAgentMode = false;

  return {
    name: 'agent',

    onInit(ctx) {
      // Listen for agent handoff trigger
      ctx.on('agent:connect', () => {
        if (ws || !options.socketUrl) return;

        ws = new WebSocket(options.socketUrl);
        ws.onopen = () => {
          isAgentMode = true;
          ctx.addBotMessage(options.connectMessage ?? '🧑‍💼 You are now connected to a live agent.');
          options.onAgentConnect?.(ctx);
          ctx.emit('agent:connected', {});
        };

        ws.onmessage = (event) => {
          const text = typeof event.data === 'string' ? event.data : '';
          if (text) {
            ctx.addBotMessage(text);
            options.onAgentMessage?.(text, ctx);
          }
        };

        ws.onclose = () => {
          isAgentMode = false;
          ws = null;
          ctx.addBotMessage(options.disconnectMessage ?? '🧑‍💼 The agent has disconnected.');
          options.onAgentDisconnect?.(ctx);
          ctx.emit('agent:disconnected', {});
        };

        ws.onerror = () => {
          ws?.close();
        };
      });

      ctx.on('agent:disconnect', () => {
        ws?.close();
      });
    },

    onMessage(message) {
      // Forward user messages to agent via websocket
      if (isAgentMode && message.sender === 'user' && ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'message', text: message.text, timestamp: Date.now() }));
      }
    },

    onDestroy() {
      ws?.close();
      ws = null;
      isAgentMode = false;
    },
  };
}

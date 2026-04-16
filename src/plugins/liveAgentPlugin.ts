import type { ChatPlugin, PluginContext } from '../types/plugin';
import type { LiveAgentConfig, AgentInfo } from '../types/liveAgent';
import { LiveAgentAdapter } from '../core/LiveAgentAdapter';
import { WsDriver } from '../core/drivers/WsDriver';
import { SioDriver } from '../core/drivers/SioDriver';
import { DEFAULT_LIVE_AGENT_EVENTS } from '../types/liveAgent';

/**
 * Live Agent Plugin — alternative to the `liveAgent` prop.
 * Use this when you prefer the plugin-based API over the built-in prop.
 *
 * @example
 * ```ts
 * import { io } from 'socket.io-client'
 *
 * const socket = io('https://support.example.com')
 *
 * plugins={[
 *   liveAgentPlugin({
 *     type: 'socketio',
 *     instance: socket,
 *     sessionId: 'user_123',
 *   }),
 * ]}
 * ```
 */
export function liveAgentPlugin(config: LiveAgentConfig): ChatPlugin {
  let adapter: LiveAgentAdapter | null = null;

  const events = { ...DEFAULT_LIVE_AGENT_EVENTS, ...config.events };
  const sessionId = config.sessionId ?? `live_${Date.now()}`;

  return {
    name: 'liveAgent',

    onInit(ctx: PluginContext) {
      const driver =
        config.type === 'socketio'
          ? new SioDriver(config.instance)
          : new WsDriver(config.instance);

      adapter = new LiveAgentAdapter(driver, events, sessionId);

      // Listen for agent messages
      adapter.on(events.agentMessage, (data) => {
        const d = data as { text?: string; agent?: AgentInfo };
        if (d.text) {
          ctx.addBotMessage(d.text);
        }
      });

      // Listen for agent joined
      adapter.on(events.agentJoined, (data) => {
        const d = data as AgentInfo;
        ctx.addBotMessage(`🟢 ${d.name} joined the chat`);
        config.onAgentJoined?.(d);
      });

      // Listen for agent left
      adapter.on(events.agentLeft, (data) => {
        const d = data as AgentInfo;
        ctx.addBotMessage(`🔴 ${d.name} left the chat`);
        config.onAgentLeft?.(d);
      });

      // Listen for queue update
      adapter.on(events.queueUpdate, (data) => {
        const d = data as { position: number; estimatedWait?: number };
        const waitText = d.estimatedWait ? ` Estimated wait: ~${d.estimatedWait} min.` : '';
        ctx.addBotMessage(`You are #${d.position} in queue.${waitText}`);
        config.onQueueUpdate?.(d.position, d.estimatedWait);
      });

      // Listen for transfer request via plugin event bus
      ctx.on('liveAgent:transfer', (...args: unknown[]) => {
        const department = args[0] as string | undefined;
        adapter?.requestTransfer(department);
      });

      // Listen for send message via plugin event bus
      ctx.on('liveAgent:send', (...args: unknown[]) => {
        const text = args[0] as string;
        if (text) adapter?.sendUserMessage(text);
      });

      adapter.initSession();
      config.onConnect?.();
    },

    onMessage(message, ctx) {
      // Forward user messages to live agent
      if (message.sender === 'user' && adapter?.isConnected()) {
        adapter.sendUserMessage(message.text ?? '');
      }
      return message;
    },

    onDestroy() {
      adapter?.destroy();
      adapter = null;
      config.onDisconnect?.();
    },
  };
}

// ─── Live Agent Types ────────────────────────────────────────────
// WebSocket / Socket.IO real-time agent chat support

export interface AgentInfo {
  name: string;
  avatar?: string;
  department?: string;
}

export interface LiveAgentEvents {
  /** Server → client: new message from agent (default: 'agent:message') */
  agentMessage?: string;
  /** Client → server: user sends message (default: 'user:message') */
  userMessage?: string;
  /** Server → client: agent joined (default: 'agent:joined') */
  agentJoined?: string;
  /** Server → client: agent left / disconnected (default: 'agent:left') */
  agentLeft?: string;
  /** Server → client: agent is typing (default: 'agent:typing') */
  agentTyping?: string;
  /** Client → server: user is typing (default: 'user:typing') */
  userTyping?: string;
  /** Client → server: session init / restore (default: 'session:init') */
  sessionInit?: string;
  /** Server → client: session history restored (default: 'session:history') */
  sessionHistory?: string;
  /** Client → server: request agent transfer (default: 'transfer:request') */
  transferRequest?: string;
  /** Server → client: transfer accepted (default: 'transfer:accepted') */
  transferAccepted?: string;
  /** Server → client: queue position update (default: 'queue:update') */
  queueUpdate?: string;
}

export interface LiveAgentConfig {
  /** Transport type — 'ws' for native WebSocket, 'socketio' for Socket.IO client */
  type: 'ws' | 'socketio';

  /** The pre-created instance — a WebSocket or Socket.IO socket */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: any;

  /** Session ID for persistence across refreshes (auto-generated if omitted) */
  sessionId?: string;

  /** Customize server event names */
  events?: LiveAgentEvents;

  /** Persist session messages to localStorage across refreshes (default: true) */
  persistSession?: boolean;

  /** Storage key prefix (default: 'chatbot_live_') */
  storageKey?: string;

  /** Callbacks */
  onAgentJoined?: (agent: AgentInfo) => void;
  onAgentLeft?: (agent: AgentInfo) => void;
  onQueueUpdate?: (position: number, estimatedWait?: number) => void;
  onSessionRestored?: (messageCount: number) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

/** Resolved event names with defaults applied */
export interface ResolvedLiveAgentEvents {
  agentMessage: string;
  userMessage: string;
  agentJoined: string;
  agentLeft: string;
  agentTyping: string;
  userTyping: string;
  sessionInit: string;
  sessionHistory: string;
  transferRequest: string;
  transferAccepted: string;
  queueUpdate: string;
}

export const DEFAULT_LIVE_AGENT_EVENTS: ResolvedLiveAgentEvents = {
  agentMessage: 'agent:message',
  userMessage: 'user:message',
  agentJoined: 'agent:joined',
  agentLeft: 'agent:left',
  agentTyping: 'agent:typing',
  userTyping: 'user:typing',
  sessionInit: 'session:init',
  sessionHistory: 'session:history',
  transferRequest: 'transfer:request',
  transferAccepted: 'transfer:accepted',
  queueUpdate: 'queue:update',
};

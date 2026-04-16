// ─── useLiveAgent Hook ───────────────────────────────────────────
// Initializes the LiveAgentAdapter, listens for server events,
// dispatches messages, and handles session persistence.

import { useEffect, useRef, useCallback } from 'react';
import { LiveAgentAdapter } from '../core/LiveAgentAdapter';
import { WsDriver } from '../core/drivers/WsDriver';
import { SioDriver } from '../core/drivers/SioDriver';
import { DEFAULT_LIVE_AGENT_EVENTS } from '../types/liveAgent';
import type { LiveAgentConfig, ResolvedLiveAgentEvents, AgentInfo } from '../types/liveAgent';
import type { ChatMessage } from '../types/message';
import type { ChatAction } from '../context/ChatContext';
import { uid } from '../utils/helpers';

interface UseLiveAgentOptions {
  config: LiveAgentConfig | undefined;
  dispatch: React.Dispatch<ChatAction>;
  messages: ChatMessage[];
}

function resolveEvents(custom?: LiveAgentConfig['events']): ResolvedLiveAgentEvents {
  return { ...DEFAULT_LIVE_AGENT_EVENTS, ...custom };
}

function resolveSessionId(config: LiveAgentConfig): string {
  if (config.sessionId) return config.sessionId;
  const storageKey = (config.storageKey ?? 'chatbot_live_') + 'session_id';
  if (typeof localStorage !== 'undefined') {
    const existing = localStorage.getItem(storageKey);
    if (existing) return existing;
    const id = uid();
    localStorage.setItem(storageKey, id);
    return id;
  }
  return uid();
}

export function useLiveAgent({ config, dispatch, messages }: UseLiveAgentOptions) {
  const adapterRef = useRef<LiveAgentAdapter | null>(null);
  const isLiveRef = useRef(false);
  const agentInfoRef = useRef<AgentInfo | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // ── Build adapter on mount ──────────────────────────────────
  useEffect(() => {
    if (!config) return;

    const events = resolveEvents(config.events);
    const sessionId = resolveSessionId(config);

    const driver =
      config.type === 'socketio'
        ? new SioDriver(config.instance)
        : new WsDriver(config.instance);

    const adapter = new LiveAgentAdapter(driver, events, sessionId);
    adapterRef.current = adapter;

    // ── Listen: agent message ───────────────────────────────
    const onAgentMessage = (data: unknown) => {
      const d = data as { text?: string; agent?: AgentInfo; attachments?: ChatMessage['attachments'] };
      if (!d.text && !d.attachments?.length) return;

      const msg: ChatMessage = {
        id: uid(),
        sender: 'agent' as ChatMessage['sender'],
        text: d.text,
        timestamp: Date.now(),
        ...(d.attachments?.length ? { attachments: d.attachments } : {}),
        metadata: d.agent ? { agentName: d.agent.name, agentAvatar: d.agent.avatar } : undefined,
      };
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
      persistMessages([...messagesRef.current, msg], config);
    };

    // ── Listen: agent joined ────────────────────────────────
    const onAgentJoined = (data: unknown) => {
      const d = data as AgentInfo;
      agentInfoRef.current = d;
      isLiveRef.current = true;
      dispatch({ type: 'SET_LIVE_AGENT', payload: true } as ChatAction);
      dispatch({ type: 'SET_AGENT_INFO', payload: d } as ChatAction);

      const sysMsg: ChatMessage = {
        id: uid(),
        sender: 'system',
        text: `${d.name} joined the chat`,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: sysMsg });
      config.onAgentJoined?.(d);
    };

    // ── Listen: agent left ──────────────────────────────────
    const onAgentLeft = (data: unknown) => {
      const d = data as AgentInfo;
      agentInfoRef.current = null;
      isLiveRef.current = false;
      dispatch({ type: 'SET_LIVE_AGENT', payload: false } as ChatAction);
      dispatch({ type: 'SET_AGENT_INFO', payload: null } as ChatAction);

      const sysMsg: ChatMessage = {
        id: uid(),
        sender: 'system',
        text: `${d.name} left the chat`,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: sysMsg });
      config.onAgentLeft?.(d);
    };

    // ── Listen: agent typing ────────────────────────────────
    const onAgentTyping = () => {
      dispatch({ type: 'SET_TYPING', payload: true });
      // Auto-clear after 3s if no new typing event
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        dispatch({ type: 'SET_TYPING', payload: false });
      }, 3000);
    };

    // ── Listen: transfer accepted ───────────────────────────
    const onTransferAccepted = (data: unknown) => {
      const d = data as { agent?: AgentInfo; message?: string };
      if (d.agent) {
        agentInfoRef.current = d.agent;
        isLiveRef.current = true;
        dispatch({ type: 'SET_LIVE_AGENT', payload: true } as ChatAction);
        dispatch({ type: 'SET_AGENT_INFO', payload: d.agent } as ChatAction);
      }
      const sysMsg: ChatMessage = {
        id: uid(),
        sender: 'system',
        text: d.message ?? `Connected to ${d.agent?.name ?? 'an agent'}`,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: sysMsg });
    };

    // ── Listen: queue update ────────────────────────────────
    const onQueueUpdate = (data: unknown) => {
      const d = data as { position: number; estimatedWait?: number };
      const waitText = d.estimatedWait ? ` Estimated wait: ~${d.estimatedWait} min.` : '';
      const sysMsg: ChatMessage = {
        id: uid(),
        sender: 'system',
        text: `You are #${d.position} in queue.${waitText}`,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: sysMsg });
      config.onQueueUpdate?.(d.position, d.estimatedWait);
    };

    // ── Listen: session history ─────────────────────────────
    const onSessionHistory = (data: unknown) => {
      const d = data as { messages?: ChatMessage[] };
      if (d.messages?.length) {
        dispatch({ type: 'ADD_MESSAGES', payload: d.messages });
        config.onSessionRestored?.(d.messages.length);
      }
    };

    // Register all listeners
    adapter.on(events.agentMessage, onAgentMessage);
    adapter.on(events.agentJoined, onAgentJoined);
    adapter.on(events.agentLeft, onAgentLeft);
    adapter.on(events.agentTyping, onAgentTyping);
    adapter.on(events.transferAccepted, onTransferAccepted);
    adapter.on(events.queueUpdate, onQueueUpdate);
    adapter.on(events.sessionHistory, onSessionHistory);

    // Restore from local storage if available
    if (config.persistSession !== false) {
      const stored = loadPersistedMessages(config);
      if (stored.length) {
        dispatch({ type: 'ADD_MESSAGES', payload: stored });
        config.onSessionRestored?.(stored.length);
      }
    }

    // Init session with server
    adapter.initSession();
    config.onConnect?.();

    return () => {
      adapter.off(events.agentMessage, onAgentMessage);
      adapter.off(events.agentJoined, onAgentJoined);
      adapter.off(events.agentLeft, onAgentLeft);
      adapter.off(events.agentTyping, onAgentTyping);
      adapter.off(events.transferAccepted, onTransferAccepted);
      adapter.off(events.queueUpdate, onQueueUpdate);
      adapter.off(events.sessionHistory, onSessionHistory);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      adapter.destroy();
      adapterRef.current = null;
      config.onDisconnect?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, dispatch]);

  // ── Public: send message via adapter ────────────────────────
  const sendLiveMessage = useCallback(
    (text: string, attachments?: unknown[]) => {
      adapterRef.current?.sendUserMessage(text, attachments);
    },
    [],
  );

  // ── Public: send typing indicator (throttled) ──────────────
  const sendTyping = useCallback(() => {
    adapterRef.current?.sendUserTyping();
  }, []);

  // ── Public: request transfer ───────────────────────────────
  const requestTransfer = useCallback(
    (department?: string) => {
      adapterRef.current?.requestTransfer(department);
      const sysMsg: ChatMessage = {
        id: uid(),
        sender: 'system',
        text: department
          ? `Requesting transfer to ${department}…`
          : 'Requesting a live agent…',
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: sysMsg });
    },
    [dispatch],
  );

  return {
    adapter: adapterRef,
    sendLiveMessage,
    sendTyping,
    requestTransfer,
    isLive: isLiveRef,
    agentInfo: agentInfoRef,
  };
}

// ─── Local Storage Persistence Helpers ───────────────────────────

function storageKey(config: LiveAgentConfig): string {
  const prefix = config.storageKey ?? 'chatbot_live_';
  const sid = config.sessionId ?? 'default';
  return `${prefix}${sid}`;
}

function persistMessages(messages: ChatMessage[], config: LiveAgentConfig): void {
  if (config.persistSession === false) return;
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(storageKey(config), JSON.stringify(messages));
  } catch { /* quota exceeded — silent */ }
}

function loadPersistedMessages(config: LiveAgentConfig): ChatMessage[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(config));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

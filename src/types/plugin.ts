// ─── Plugin System Types ─────────────────────────────────────────
// Follows Open/Closed principle: extend via plugins, don't modify core

import type { ChatMessage } from './message';

export interface PluginContext {
  /** Send a message programmatically */
  sendMessage: (text: string) => void;
  /** Add a bot message */
  addBotMessage: (text: string) => void;
  /** Get all messages */
  getMessages: () => ChatMessage[];
  /** Get collected data */
  getData: () => Record<string, unknown>;
  /** Set data */
  setData: (key: string, value: unknown) => void;
  /** Subscribe to events */
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  /** Emit events */
  emit: (event: string, ...args: unknown[]) => void;
}

export interface ChatPlugin {
  /** Unique plugin name */
  name: string;
  /** Called when chatbot initializes */
  onInit?: (ctx: PluginContext) => void | Promise<void>;
  /** Called when a message is sent or received */
  onMessage?: (message: ChatMessage, ctx: PluginContext) => void | ChatMessage | Promise<void | ChatMessage>;
  /** Called when form or data is submitted */
  onSubmit?: (data: Record<string, unknown>, ctx: PluginContext) => void | Promise<void>;
  /** Called before chatbot unmounts */
  onDestroy?: (ctx: PluginContext) => void | Promise<void>;
  /** Called on any event */
  onEvent?: (event: ChatPluginEvent, ctx: PluginContext) => void;
}

export interface ChatPluginEvent {
  type: string;
  payload?: unknown;
  timestamp: number;
}

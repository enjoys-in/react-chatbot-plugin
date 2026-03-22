
import type { ChatMessage } from './message';

export interface PluginContext {
  sendMessage: (text: string) => void;
  addBotMessage: (text: string) => void;
  getMessages: () => ChatMessage[];
  getData: () => Record<string, unknown>;
  setData: (key: string, value: unknown) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  emit: (event: string, ...args: unknown[]) => void;
}

export interface ChatPlugin {
  name: string;
  onInit?: (ctx: PluginContext) => void | Promise<void>;
  onMessage?: (message: ChatMessage, ctx: PluginContext) => void | ChatMessage | Promise<void | ChatMessage>;
  onSubmit?: (data: Record<string, unknown>, ctx: PluginContext) => void | Promise<void>;
  onDestroy?: (ctx: PluginContext) => void | Promise<void>;
  onEvent?: (event: ChatPluginEvent, ctx: PluginContext) => void;
}

export interface ChatPluginEvent {
  type: string;
  payload?: unknown;
  timestamp: number;
}

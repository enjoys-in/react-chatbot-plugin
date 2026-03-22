import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';
import type { ChatMessage } from '../types/message';

export class PluginManager {
  private plugins: ChatPlugin[] = [];
  private context: PluginContext | null = null;
  private eventHandlers = new Map<string, Set<(...args: unknown[]) => void>>();

  register(plugins: ChatPlugin[]): void {
    this.plugins = [...plugins];
  }

  setContext(ctx: Omit<PluginContext, 'on' | 'emit'>): void {
    this.context = {
      ...ctx,
      on: (event, handler) => this.on(event, handler),
      emit: (event, ...args) => this.emit(event, ...args),
    };
  }

  private on(event: string, handler: (...args: unknown[]) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  private emit(event: string, ...args: unknown[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(...args));
    }
  }

  async init(): Promise<void> {
    if (!this.context) return;
    for (const plugin of this.plugins) {
      try {
        await plugin.onInit?.(this.context);
      } catch {
      }
    }
  }

  async onMessage(message: ChatMessage): Promise<ChatMessage> {
    if (!this.context) return message;
    let msg = message;
    for (const plugin of this.plugins) {
      try {
        const result = await plugin.onMessage?.(msg, this.context);
        if (result && typeof result === 'object' && 'id' in result) {
          msg = result;
        }
      } catch {
      }
    }
    this.dispatchEvent({ type: 'message', payload: msg, timestamp: Date.now() });
    return msg;
  }

  async onSubmit(data: Record<string, unknown>): Promise<void> {
    if (!this.context) return;
    for (const plugin of this.plugins) {
      try {
        await plugin.onSubmit?.(data, this.context);
      } catch {
      }
    }
    this.dispatchEvent({ type: 'submit', payload: data, timestamp: Date.now() });
  }

  async destroy(): Promise<void> {
    if (!this.context) return;
    for (const plugin of this.plugins) {
      try {
        await plugin.onDestroy?.(this.context);
      } catch {
      }
    }
    this.eventHandlers.clear();
    this.plugins = [];
  }

  private dispatchEvent(event: ChatPluginEvent): void {
    if (!this.context) return;
    for (const plugin of this.plugins) {
      try {
        plugin.onEvent?.(event, this.context);
      } catch {
      }
    }
  }
}

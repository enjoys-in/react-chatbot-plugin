// ─── WebSocket Driver ────────────────────────────────────────────
// Wraps native WebSocket in the LiveAgentDriver interface.
// Messages are JSON-encoded with { event, data } envelope.

import type { LiveAgentDriver, DriverListener } from '../LiveAgentAdapter';

export class WsDriver implements LiveAgentDriver {
  private ws: WebSocket;
  private listeners = new Map<string, Set<DriverListener>>();
  private boundOnMessage: (e: MessageEvent) => void;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.boundOnMessage = this.handleMessage.bind(this);
    this.ws.addEventListener('message', this.boundOnMessage);
  }

  send(event: string, data: unknown): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    }
  }

  on(event: string, handler: DriverListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off(event: string, handler: DriverListener): void {
    this.listeners.get(event)?.delete(handler);
  }

  isConnected(): boolean {
    return this.ws.readyState === WebSocket.OPEN;
  }

  destroy(): void {
    this.ws.removeEventListener('message', this.boundOnMessage);
    this.listeners.clear();
  }

  private handleMessage(e: MessageEvent): void {
    try {
      const parsed = JSON.parse(String(e.data)) as { event?: string; data?: unknown };
      if (parsed.event) {
        const handlers = this.listeners.get(parsed.event);
        if (handlers) {
          handlers.forEach((h) => h(parsed.data));
        }
      }
    } catch {
      // Non-JSON message — ignore
    }
  }
}

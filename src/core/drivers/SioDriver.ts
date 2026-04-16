// ─── Socket.IO Driver ────────────────────────────────────────────
// Wraps a Socket.IO client socket in the LiveAgentDriver interface.

import type { LiveAgentDriver, DriverListener } from '../LiveAgentAdapter';

/** Minimal Socket.IO client interface (avoids hard dependency) */
interface SioSocket {
  emit(event: string, ...args: unknown[]): void;
  on(event: string, handler: (...args: unknown[]) => void): void;
  off(event: string, handler: (...args: unknown[]) => void): void;
  connected: boolean;
}

export class SioDriver implements LiveAgentDriver {
  private socket: SioSocket;
  private registeredHandlers: Array<{ event: string; handler: DriverListener }> = [];

  constructor(socket: SioSocket) {
    this.socket = socket;
  }

  send(event: string, data: unknown): void {
    this.socket.emit(event, data);
  }

  on(event: string, handler: DriverListener): void {
    this.socket.on(event, handler as (...args: unknown[]) => void);
    this.registeredHandlers.push({ event, handler });
  }

  off(event: string, handler: DriverListener): void {
    this.socket.off(event, handler as (...args: unknown[]) => void);
    this.registeredHandlers = this.registeredHandlers.filter(
      (h) => !(h.event === event && h.handler === handler),
    );
  }

  isConnected(): boolean {
    return this.socket.connected;
  }

  destroy(): void {
    for (const { event, handler } of this.registeredHandlers) {
      this.socket.off(event, handler as (...args: unknown[]) => void);
    }
    this.registeredHandlers = [];
  }
}

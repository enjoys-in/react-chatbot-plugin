// ─── Live Agent Adapter ──────────────────────────────────────────
// Protocol-agnostic wrapper over WebSocket / Socket.IO

import type { ResolvedLiveAgentEvents, LiveAgentConfig, DEFAULT_LIVE_AGENT_EVENTS } from '../types/liveAgent';

export type DriverListener = (data: unknown) => void;

/** Uniform interface implemented by WsDriver and SioDriver */
export interface LiveAgentDriver {
  send(event: string, data: unknown): void;
  on(event: string, handler: DriverListener): void;
  off(event: string, handler: DriverListener): void;
  isConnected(): boolean;
  destroy(): void;
}

export class LiveAgentAdapter {
  private driver: LiveAgentDriver;
  readonly events: ResolvedLiveAgentEvents;
  readonly sessionId: string;

  constructor(
    driver: LiveAgentDriver,
    events: ResolvedLiveAgentEvents,
    sessionId: string,
  ) {
    this.driver = driver;
    this.events = events;
    this.sessionId = sessionId;
  }

  /** Send a user message to the server */
  sendUserMessage(text: string, attachments?: unknown[]): void {
    this.driver.send(this.events.userMessage, {
      text,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      ...(attachments?.length ? { attachments } : {}),
    });
  }

  /** Send user typing indicator */
  sendUserTyping(): void {
    this.driver.send(this.events.userTyping, {
      sessionId: this.sessionId,
      timestamp: Date.now(),
    });
  }

  /** Request transfer to a live agent */
  requestTransfer(department?: string): void {
    this.driver.send(this.events.transferRequest, {
      sessionId: this.sessionId,
      department,
      timestamp: Date.now(),
    });
  }

  /** Initialize or restore a session */
  initSession(): void {
    this.driver.send(this.events.sessionInit, {
      sessionId: this.sessionId,
      timestamp: Date.now(),
    });
  }

  /** Subscribe to a server event */
  on(event: string, handler: DriverListener): void {
    this.driver.on(event, handler);
  }

  /** Unsubscribe from a server event */
  off(event: string, handler: DriverListener): void {
    this.driver.off(event, handler);
  }

  isConnected(): boolean {
    return this.driver.isConnected();
  }

  destroy(): void {
    this.driver.destroy();
  }
}

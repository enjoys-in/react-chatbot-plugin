import type { DemoConfig } from './types';

/**
 * Live Agent Demo — WebSocket / Socket.IO real-time agent chat
 *
 * This demo simulates a live agent handoff scenario.
 * In production, pass a real WebSocket or Socket.IO instance.
 */

// Simulated WebSocket-like object for demo purposes
class MockAgentSocket {
  private listeners = new Map<string, Set<(data: unknown) => void>>();
  readyState = 1; // WebSocket.OPEN
  connected = true;

  addEventListener(event: string, handler: (e: { data: string }) => void) {
    if (event === 'message') {
      if (!this.listeners.has('__raw__')) this.listeners.set('__raw__', new Set());
      this.listeners.get('__raw__')!.add(handler as unknown as (data: unknown) => void);
    }
  }

  removeEventListener() { /* noop for demo */ }

  send(payload: string) {
    try {
      const { event, data } = JSON.parse(payload) as { event: string; data: Record<string, unknown> };

      if (event === 'session:init') {
        // Simulate session acknowledgment
        setTimeout(() => {
          this.emit('__raw__', JSON.stringify({
            event: 'queue:update',
            data: { position: 1, estimatedWait: 1 },
          }));
        }, 500);

        // Simulate agent joining after a delay
        setTimeout(() => {
          this.emit('__raw__', JSON.stringify({
            event: 'agent:joined',
            data: { name: 'Rahul', avatar: '👨‍💼' },
          }));
        }, 2000);
      }

      if (event === 'user:message') {
        // Simulate agent reply
        setTimeout(() => {
          this.emit('__raw__', JSON.stringify({
            event: 'agent:message',
            data: {
              text: `Thanks for your message! I'll look into "${(data as Record<string, unknown>).text}" right away.`,
              agent: { name: 'Rahul', avatar: '👨‍💼' },
            },
          }));
        }, 1500);
      }

      if (event === 'transfer:request') {
        setTimeout(() => {
          this.emit('__raw__', JSON.stringify({
            event: 'transfer:accepted',
            data: {
              agent: { name: 'Priya', department: 'Technical Support', avatar: '👩‍💻' },
              message: 'Connected to Priya from Technical Support',
            },
          }));
        }, 1000);
      }
    } catch { /* ignore */ }
  }

  private emit(channel: string, data: unknown) {
    const handlers = this.listeners.get(channel);
    if (handlers) {
      handlers.forEach((h) => h({ data } as unknown as unknown));
    }
  }
}

const mockSocket = new MockAgentSocket();

const liveAgent: DemoConfig = {
  id: 'live-agent',
  title: 'Live Agent Chat',
  description: 'Real-time WebSocket/Socket.IO agent handoff with session persistence, queue updates, and typing indicators',
  icon: '🎧',
  category: 'advanced',
  flow: {
    start: 'welcome',
    steps: [
      {
        id: 'welcome',
        message: 'Welcome! 👋 I\'m your virtual assistant. How can I help you today?',
        quickReplies: [
          { label: '💬 Talk to Agent', value: 'agent', next: 'transfer' },
          { label: '📖 FAQ', value: 'faq', next: 'faq' },
          { label: '💰 Pricing', value: 'pricing', next: 'pricing' },
        ],
      },
      {
        id: 'transfer',
        message: 'Connecting you with a live agent… Please hold on.',
        next: 'wait',
      },
      {
        id: 'wait',
        message: 'An agent will be with you shortly. You can type your question while you wait.',
      },
      {
        id: 'faq',
        message: 'Here are our most common questions:\n\n• How do I reset my password?\n• What are your business hours?\n• How do I upgrade my plan?\n\nNeed more help?',
        quickReplies: [
          { label: '💬 Talk to Agent', value: 'agent', next: 'transfer' },
          { label: '🏠 Main Menu', value: 'menu', next: 'welcome' },
        ],
      },
      {
        id: 'pricing',
        message: '💰 Our plans start at $9/mo for Starter, $29/mo for Pro, and $99/mo for Enterprise.',
        quickReplies: [
          { label: '💬 Talk to Agent', value: 'agent', next: 'transfer' },
          { label: '🏠 Main Menu', value: 'menu', next: 'welcome' },
        ],
      },
    ],
  },
  liveAgent: {
    type: 'ws',
    instance: mockSocket,
    sessionId: 'demo_session_001',
    persistSession: false,
  },
};

export default liveAgent;

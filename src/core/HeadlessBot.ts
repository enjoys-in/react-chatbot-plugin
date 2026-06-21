// ─── Headless Mode ───────────────────────────────────────────────
// Run the chatbot engine without any UI — useful for testing,
// server-side flows, CLI bots, or custom rendering.

import type { ChatMessage } from '../types/message';
import type { FlowConfig } from '../types/flow';
import type { ChatPlugin, PluginContext } from '../types/plugin';
import { FlowEngine } from '../engine/FlowEngine';
import { createEventBus, type EventBus } from './EventBus';
import { uid } from '../utils/helpers';

export interface HeadlessBotOptions {
  flow?: FlowConfig;
  plugins?: ChatPlugin[];
  initialMessages?: ChatMessage[];
  onMessage?: (message: ChatMessage) => void;
}

export interface HeadlessBot {
  /** Send a user message into the bot */
  sendMessage: (text: string) => Promise<void>;
  /** Programmatically add a bot message */
  addBotMessage: (text: string) => void;
  /** Get all messages in the conversation */
  getMessages: () => ChatMessage[];
  /** Get collected data */
  getData: () => Record<string, unknown>;
  /** Set a data field */
  setData: (key: string, value: unknown) => void;
  /** Get the current step ID (null if no flow) */
  getCurrentStep: () => string | null;
  /** Go to a specific flow step */
  goToStep: (stepId: string) => Promise<void>;
  /** Reset the bot state */
  reset: () => void;
  /** The event bus for this instance */
  bus: EventBus;
  /** Destroy the bot — cleans up plugins */
  destroy: () => Promise<void>;
}

/**
 * Create a headless chatbot instance (no UI).
 *
 * @example
 * ```ts
 * import { createHeadlessBot } from '@enjoys/react-chatbot-plugin';
 *
 * const bot = createHeadlessBot({
 *   flow: myFlow,
 *   plugins: [loggerPlugin()],
 *   onMessage: (msg) => console.log(msg.sender, msg.text),
 * });
 *
 * await bot.sendMessage('hello');
 * console.log(bot.getMessages());
 * ```
 */
export function createHeadlessBot(options: HeadlessBotOptions = {}): HeadlessBot {
  const bus = createEventBus();
  const messages: ChatMessage[] = [...(options.initialMessages ?? [])];
  const data: Record<string, unknown> = {};
  let currentStepId: string | null = null;
  let engine: FlowEngine | null = null;

  if (options.flow) {
    engine = new FlowEngine(options.flow);
  }

  // Build plugin context
  const ctx: PluginContext = {
    sendMessage: (text) => bot.sendMessage(text),
    addBotMessage: (text) => bot.addBotMessage(text),
    getMessages: () => [...messages],
    getData: () => ({ ...data }),
    setData: (key, value) => { data[key] = value; },
    on: (event, handler) => { bus.on(event, handler); },
    emit: (event, ...args) => { bus.emit(event, ...args); },
  };

  // Initialize plugins
  const plugins = options.plugins ?? [];
  const initPlugins = async () => {
    for (const plugin of plugins) {
      await plugin.onInit?.(ctx);
    }
  };

  const addMessage = (msg: ChatMessage) => {
    messages.push(msg);
    options.onMessage?.(msg);
    bus.emit('message', msg);
  };

  const processStep = async (stepId: string) => {
    if (!engine) return;
    const step = engine.getStep(stepId);
    if (!step) return;

    // visibleIf check
    if (!engine.isStepVisible(step)) {
      const nextId = engine.resolveNext(step);
      if (nextId) await processStep(nextId);
      return;
    }

    currentStepId = stepId;
    engine.pushHistory(stepId);
    bus.emit('stepChange', { stepId });

    const botMessages = engine.buildMessages(step);
    for (const m of botMessages) {
      addMessage(m);
    }
  };

  const bot: HeadlessBot = {
    async sendMessage(text: string) {
      const msg: ChatMessage = {
        id: uid(),
        sender: 'user',
        text,
        timestamp: Date.now(),
      };

      // Let plugins transform message
      let finalMsg = msg;
      for (const plugin of plugins) {
        if (plugin.onMessage) {
          const result = await plugin.onMessage(finalMsg, ctx);
          if (result) finalMsg = result;
        }
      }

      addMessage(finalMsg);

      // Process flow
      if (engine && currentStepId) {
        const step = engine.getStep(currentStepId);
        if (step) {
          if (step.input) {
            engine.setData(step.id, text);
          } else if (step.quickReplies) {
            const matched = engine.matchQuickReply(step, text);
            if (matched) engine.setData(step.id, matched.value);
          }
          const nextId = engine.resolveNext(step, text);
          if (nextId) await processStep(nextId);
        }
      }

      // Emit to plugins
      for (const plugin of plugins) {
        plugin.onEvent?.({ type: 'message:sent', payload: finalMsg, timestamp: Date.now() }, ctx);
      }
    },

    addBotMessage(text: string) {
      const msg: ChatMessage = {
        id: uid(),
        sender: 'bot',
        text,
        timestamp: Date.now(),
      };
      addMessage(msg);
    },

    getMessages: () => [...messages],
    getData: () => ({ ...data, ...(engine?.getData() ?? {}) }),
    setData: (key, value) => {
      data[key] = value;
      engine?.setData(key, value);
    },
    getCurrentStep: () => currentStepId,

    async goToStep(stepId: string) {
      await processStep(stepId);
    },

    reset() {
      messages.length = 0;
      Object.keys(data).forEach((k) => delete data[k]);
      currentStepId = null;
      engine?.reset();
    },

    bus,

    async destroy() {
      for (const plugin of plugins) {
        await plugin.onDestroy?.(ctx);
      }
      bus.clear();
    },
  };

  // Start: init plugins and enter first flow step
  initPlugins().then(() => {
    if (engine) {
      processStep(engine.getStartStepId());
    }
  });

  return bot;
}

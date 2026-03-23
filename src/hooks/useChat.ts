import { useCallback, useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import { FlowEngine } from '../engine/FlowEngine';
import { uid, delay } from '../utils/helpers';
import type { ChatMessage } from '../types';
import type { FlowActionResult, ActionContext, KeywordRoute } from '../types/config';
import type { FlowStepInput } from '../types/flow';

/** Slash commands the user can type */
const COMMANDS: Record<string, string> = {
  '/help': 'Show available commands',
  '/cancel': 'Cancel current step and go back',
  '/back': 'Go back to the previous step',
  '/restart': 'Restart the conversation from the beginning',
};

/** Common greeting words for auto-detection */
const GREETING_PATTERNS = ['hi', 'hello', 'hey', 'howdy', 'hola', 'greetings', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'hii', 'hiii'];

/** Match user text against a single keyword route */
function matchesRoute(text: string, route: KeywordRoute): boolean {
  const compare = route.caseSensitive ? text : text.toLowerCase();
  for (const pattern of route.patterns) {
    const pat = route.caseSensitive ? pattern : pattern.toLowerCase();
    switch (route.matchType ?? 'contains') {
      case 'exact':
        if (compare === pat) return true;
        break;
      case 'startsWith':
        if (compare.startsWith(pat)) return true;
        break;
      case 'regex':
        try {
          if (new RegExp(pat, route.caseSensitive ? '' : 'i').test(text)) return true;
        } catch { /* invalid regex — skip */ }
        break;
      case 'contains':
      default:
        if (compare.includes(pat)) return true;
        break;
    }
  }
  return false;
}

/** Find the best matching keyword route (highest priority) */
function findKeywordMatch(text: string, keywords: KeywordRoute[]): KeywordRoute | undefined {
  const sorted = [...keywords].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return sorted.find((r) => matchesRoute(text, r));
}

/** Validate and transform user text for an input step */
function validateInput(text: string, input: FlowStepInput): { valid: boolean; value: string; error?: string } {
  let value = text;
  if (input.transform) {
    switch (input.transform) {
      case 'trim': value = value.trim(); break;
      case 'lowercase': value = value.toLowerCase(); break;
      case 'uppercase': value = value.toUpperCase(); break;
      case 'email': value = value.trim().toLowerCase(); break;
    }
  }
  if (input.validation) {
    const v = input.validation;
    if (v.required && !value.trim()) return { valid: false, value, error: v.message ?? 'This field is required.' };
    if (v.minLength && value.length < v.minLength) return { valid: false, value, error: v.message ?? `Must be at least ${v.minLength} characters.` };
    if (v.maxLength && value.length > v.maxLength) return { valid: false, value, error: v.message ?? `Must be at most ${v.maxLength} characters.` };
    if (v.pattern) {
      try {
        if (!new RegExp(v.pattern).test(value)) return { valid: false, value, error: v.message ?? 'Invalid format.' };
      } catch { /* invalid pattern */ }
    }
  }
  return { valid: true, value };
}

export function useChat() {
  const { state, dispatch, props, pluginManager } = useChatContext();
  const flowRef = useRef<FlowEngine | null>(null);
  const flowStartedRef = useRef(false);

  // Keep fresh references for use inside async callbacks (avoids stale closures)
  const stateRef = useRef(state);
  stateRef.current = state;
  const propsRef = useRef(props);
  propsRef.current = props;

  // Initialize flow engine
  useEffect(() => {
    if (props.flow) {
      flowRef.current = new FlowEngine(props.flow);
      flowStartedRef.current = false;
    }
  }, [props.flow]);

  const addBotMessage = useCallback(
    async (text: string, extras?: Partial<ChatMessage>) => {
      dispatch({ type: 'SET_TYPING', payload: true });
      await delay(400);
      const msg: ChatMessage = {
        id: uid(),
        sender: 'bot',
        text,
        timestamp: Date.now(),
        ...extras,
      };
      // Let plugins see bot messages too
      const finalMsg = pluginManager ? await pluginManager.onMessage(msg) : msg;
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'ADD_MESSAGE', payload: finalMsg });
      propsRef.current.callbacks?.onMessageReceive?.(finalMsg);
    },
    [dispatch, pluginManager],
  );

  const addSystemMessage = useCallback(
    (text: string) => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { id: uid(), sender: 'system', text, timestamp: Date.now() },
      });
    },
    [dispatch],
  );

  // Use a ref so processFlowStep can call itself recursively without stale closure
  const processFlowStepRef = useRef<(stepId: string) => Promise<void>>(async () => {});
  processFlowStepRef.current = async (stepId: string) => {
    const engine = flowRef.current;
    if (!engine) return;

    const step = engine.getStep(stepId);
    if (!step) return;

    // Track step history for /back navigation
    engine.pushHistory(stepId);

    dispatch({ type: 'SET_STEP', payload: stepId });
    pluginManager?.emitEvent('stepChange', { stepId });
    dispatch({ type: 'SET_TYPING', payload: true });
    await delay(step.delay ?? 500);

    const messages = engine.buildMessages(step);
    dispatch({ type: 'SET_TYPING', payload: false });
    dispatch({ type: 'ADD_MESSAGES', payload: messages });

    messages.forEach((m) => propsRef.current.callbacks?.onMessageReceive?.(m));

    // Handle async action (API calls, verification, etc.)
    if (step.asyncAction) {
      const handler = propsRef.current.actionHandlers?.[step.asyncAction.handler];
      if (handler) {
        const statusMsgId = uid();
        // Show loading/status message
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: statusMsgId,
            sender: 'bot',
            text: step.asyncAction.loadingMessage ?? 'Processing...',
            timestamp: Date.now(),
          },
        });

        const ctx: ActionContext = {
          updateMessage: (text: string) => {
            dispatch({ type: 'UPDATE_MESSAGE', payload: { id: statusMsgId, updates: { text } } });
          },
        };

        try {
          const result = await handler(engine.getData(), ctx);

          // Merge result data into collected data
          if (result.data) {
            engine.mergeData(result.data);
            dispatch({ type: 'SET_DATA', payload: result.data });
          }

          // Update status message with final text
          const finalMsg =
            result.message ??
            (result.status === 'success'
              ? (step.asyncAction.successMessage ?? 'Done!')
              : (step.asyncAction.errorMessage ?? 'Something went wrong.'));
          dispatch({ type: 'UPDATE_MESSAGE', payload: { id: statusMsgId, updates: { text: finalMsg } } });

          // Route based on result
          const nextStepId = resolveAsyncRoute(step, result);
          if (nextStepId) {
            await delay(600);
            processFlowStepRef.current(nextStepId);
          }
        } catch {
          dispatch({
            type: 'UPDATE_MESSAGE',
            payload: { id: statusMsgId, updates: { text: step.asyncAction.errorMessage ?? '❌ Something went wrong.' } },
          });
          if (step.asyncAction.onError) {
            await delay(600);
            processFlowStepRef.current(step.asyncAction.onError);
          }
        }
        return; // async action handles routing — don't auto-advance
      }
    }

    // If step has a custom component, wait for onComplete — don't auto-advance
    if (step.component && propsRef.current.components?.[step.component]) {
      return;
    }

    // Auto-advance if no user input required
    if (!step.quickReplies && !step.form && !step.input && step.next) {
      await delay(300);
      processFlowStepRef.current(step.next);
    }
  };

  /** Determine next step from async action result */
  function resolveAsyncRoute(
    step: { asyncAction?: { onSuccess?: string; onError?: string; routes?: Record<string, string> }; next?: string },
    result: FlowActionResult,
  ): string | undefined {
    // 1. Explicit next from result
    if (result.next) return result.next;
    // 2. Routes map
    if (step.asyncAction?.routes?.[result.status]) return step.asyncAction.routes[result.status];
    // 3. Success/error defaults
    if (result.status === 'success' && step.asyncAction?.onSuccess) return step.asyncAction.onSuccess;
    if (result.status === 'error' && step.asyncAction?.onError) return step.asyncAction.onError;
    // 4. Fallback
    return step.next;
  }

  const processFlowStep = useCallback(
    (stepId: string) => processFlowStepRef.current(stepId),
    [],
  );

  /** Go back to the previous step */
  const goBack = useCallback(() => {
    const engine = flowRef.current;
    if (!engine || !engine.canGoBack()) {
      addSystemMessage('There is no previous step to go back to.');
      return;
    }
    dispatch({ type: 'CLEAR_QUICK_REPLIES' });
    const prevStepId = engine.popHistory();
    if (prevStepId) {
      processFlowStep(prevStepId);
    } else {
      addSystemMessage('There is no previous step to go back to.');
    }
  }, [dispatch, processFlowStep, addSystemMessage]);

  /** Restart the entire conversation */
  const restartSession = useCallback(() => {
    const engine = flowRef.current;
    if (engine) {
      engine.reset();
    }
    flowStartedRef.current = false;
    dispatch({ type: 'RESET_CHAT' });
    // Re-start the flow after reset
    if (engine) {
      flowStartedRef.current = true;
      processFlowStep(engine.getStartStepId());
    }
  }, [dispatch, processFlowStep]);

  /** Handle slash commands. Returns true if the text was a command. */
  const handleCommandRef = useRef<(text: string) => boolean>(() => false);
  handleCommandRef.current = (text: string): boolean => {
    const cmd = text.trim().toLowerCase();
    if (!cmd.startsWith('/')) return false;

    switch (cmd) {
      case '/help': {
        const lines = Object.entries(COMMANDS)
          .map(([k, v]) => `**${k}** — ${v}`)
          .join('\n');
        addSystemMessage(`Available commands:\n${lines}`);
        return true;
      }
      case '/cancel':
      case '/back': {
        goBack();
        return true;
      }
      case '/restart': {
        restartSession();
        return true;
      }
      default:
        addSystemMessage(`Unknown command: ${cmd}. Type /help for available commands.`);
        return true;
    }
  };

  /** Handle completion from a custom component rendered in a step */
  const handleComponentComplete = useCallback(
    (result?: FlowActionResult) => {
      const engine = flowRef.current;
      const currentStepId = stateRef.current.currentStepId;
      if (!engine || !currentStepId) return;

      const step = engine.getStep(currentStepId);
      if (!step) return;

      // Merge result data
      if (result?.data) {
        engine.mergeData(result.data);
        dispatch({ type: 'SET_DATA', payload: result.data });
      }

      // Show optional message
      if (result?.message) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { id: uid(), sender: 'bot', text: result.message, timestamp: Date.now() },
        });
      }

      // Determine next step
      const nextStepId = result?.next ?? step.next;
      if (nextStepId) {
        processFlowStep(nextStepId);
      } else {
        pluginManager?.emitEvent('flowEnd', engine.getData());
        propsRef.current.callbacks?.onFlowEnd?.(engine.getData());
        dispatch({ type: 'SET_STEP', payload: null });
      }
    },
    [dispatch, processFlowStep, pluginManager],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      // Check for slash commands first
      if (handleCommandRef.current(text)) return;

      const msg: ChatMessage = {
        id: uid(),
        sender: 'user',
        text,
        timestamp: Date.now(),
      };

      // Let plugins transform the message before dispatching
      const finalMsg = pluginManager ? await pluginManager.onMessage(msg) : msg;
      dispatch({ type: 'ADD_MESSAGE', payload: finalMsg });
      propsRef.current.callbacks?.onMessageSend?.(finalMsg);
      propsRef.current.callbacks?.onSubmit?.({ message: finalMsg.text });

      const currentStepId = stateRef.current.currentStepId;
      const typingMs = propsRef.current.typingDelay ?? 0;

      // ── Active flow step ─────────────────────────────────────
      if (flowRef.current && currentStepId) {
        const step = flowRef.current.getStep(currentStepId);
        if (step) {
          // Block text input during async action or component steps
          if (step.asyncAction || step.component) {
            addBotMessage("Please wait, I'm still processing. You can type /back to go back.");
            return;
          }
          // If this step has quick replies, try to match user text
          if (flowRef.current.stepExpectsQuickReply(step)) {
            const matched = flowRef.current.matchQuickReply(step, text);
            if (matched) {
              dispatch({ type: 'CLEAR_QUICK_REPLIES' });
              flowRef.current.setData(step.id, matched.value);
              const nextId = flowRef.current.resolveNext(step, matched.value);
              if (nextId) {
                processFlowStep(nextId);
              } else {
                pluginManager?.emitEvent('flowEnd', flowRef.current.getData());
                propsRef.current.callbacks?.onFlowEnd?.(flowRef.current.getData());
                dispatch({ type: 'SET_STEP', payload: null });
              }
            } else {
              addBotMessage(
                "I didn't quite get that. Please choose one of the options below:",
                { quickReplies: step.quickReplies },
              );
            }
          } else if (flowRef.current.stepExpectsForm(step)) {
            addBotMessage("Please fill out the form above to continue.");
          } else if (step.input) {
            // ── Input step with validation ──
            const result = validateInput(text, step.input);
            if (!result.valid) {
              addBotMessage(result.error ?? 'Invalid input. Please try again.');
              return;
            }
            flowRef.current.setData(step.id, result.value);
            const nextId = flowRef.current.resolveNext(step, result.value);
            if (nextId) {
              processFlowStep(nextId);
            } else {
              addBotMessage("Thanks for your message! Our team will get back to you soon. \u{1F64C}");
              pluginManager?.emitEvent('flowEnd', flowRef.current.getData());
              propsRef.current.callbacks?.onFlowEnd?.(flowRef.current.getData());
              dispatch({ type: 'SET_STEP', payload: null });
            }
          } else {
            // Normal text input step
            flowRef.current.setData(step.id, text);
            const nextId = flowRef.current.resolveNext(step, text);
            if (nextId) {
              processFlowStep(nextId);
            } else {
              addBotMessage("Thanks for your message! Our team will get back to you soon. \u{1F64C}");
              pluginManager?.emitEvent('flowEnd', flowRef.current.getData());
              propsRef.current.callbacks?.onFlowEnd?.(flowRef.current.getData());
              dispatch({ type: 'SET_STEP', payload: null });
            }
          }
          return;
        }
      }

      // ── No active flow step — try keyword / greeting / fallback ──

      // Build runtime keyword list (user keywords + greeting shortcut)
      const keywords: KeywordRoute[] = [...(propsRef.current.keywords ?? [])];
      if (propsRef.current.greetingResponse) {
        keywords.push({
          patterns: GREETING_PATTERNS,
          response: propsRef.current.greetingResponse,
          matchType: 'exact',
          priority: -1,
        });
      }

      if (keywords.length > 0) {
        const match = findKeywordMatch(text.trim(), keywords);
        if (match) {
          // Jump to flow step if route specifies `next`
          if (match.next && flowRef.current) {
            if (typingMs > 0) await delay(typingMs);
            processFlowStep(match.next);
            return;
          }
          // Send response message
          if (match.response) {
            if (typingMs > 0) {
              await delay(typingMs);
            }
            await addBotMessage(match.response);
            return;
          }
        }
      }

      // Fallback
      const fb = propsRef.current.fallbackMessage;
      if (fb) {
        const fbText = typeof fb === 'function' ? fb(text) : fb;
        if (fbText) {
          if (typingMs > 0) {
            await delay(typingMs);
          }
          await addBotMessage(fbText);
          return;
        }
      }

      // Nothing handled it — fire unhandled callback
      propsRef.current.callbacks?.onUnhandledMessage?.(text, { currentStepId });
    },
    [dispatch, addBotMessage, processFlowStep, pluginManager],
  );

  const startFlow = useCallback(() => {
    const engine = flowRef.current;
    if (!engine || flowStartedRef.current) return;
    flowStartedRef.current = true;
    processFlowStep(engine.getStartStepId());
  }, [processFlowStep]);

  // Auto-start flow when all conditions are met
  useEffect(() => {
    if (
      props.flow &&
      !state.showWelcome &&
      state.isLoggedIn &&
      !flowStartedRef.current
    ) {
      startFlow();
    }
  }, [props.flow, state.showWelcome, state.isLoggedIn, startFlow]);

  const handleQuickReply = useCallback(
    async (value: string, label: string) => {
      dispatch({ type: 'CLEAR_QUICK_REPLIES' });
      // Add user message
      const msg: ChatMessage = {
        id: uid(),
        sender: 'user',
        text: label,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
      await pluginManager?.onMessage(msg);
      pluginManager?.emitEvent('quickReply', { value, label });
      propsRef.current.callbacks?.onQuickReply?.(value, label);

      // Continue flow
      const currentStepId = stateRef.current.currentStepId;
      if (flowRef.current && currentStepId) {
        const step = flowRef.current.getStep(currentStepId);
        if (step) {
          flowRef.current.setData(step.id, value);
          const nextId = flowRef.current.resolveNext(step, value);
          if (nextId) {
            processFlowStep(nextId);
          } else {
            pluginManager?.emitEvent('flowEnd', flowRef.current.getData());
            propsRef.current.callbacks?.onFlowEnd?.(flowRef.current.getData());
            dispatch({ type: 'SET_STEP', payload: null });
          }
        }
      }
    },
    [dispatch, processFlowStep, pluginManager],
  );

  const handleFormSubmit = useCallback(
    async (formId: string, data: Record<string, unknown>) => {
      dispatch({ type: 'SET_DATA', payload: data });
      if (flowRef.current) {
        flowRef.current.mergeData(data);
      }

      // Summary message
      const summaryLines = Object.entries(data)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join('\n');
      const msg: ChatMessage = {
        id: uid(),
        sender: 'user',
        text: summaryLines,
        formData: data,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
      await pluginManager?.onMessage(msg);
      await pluginManager?.onSubmit(data);

      await propsRef.current.callbacks?.onFormSubmit?.(formId, data);

      // Advance flow
      const currentStepId = stateRef.current.currentStepId;
      if (flowRef.current && currentStepId) {
        const step = flowRef.current.getStep(currentStepId);
        if (step) {
          const nextId = flowRef.current.resolveNext(step);
          if (nextId) {
            processFlowStep(nextId);
          } else {
            pluginManager?.emitEvent('flowEnd', flowRef.current.getData());
            propsRef.current.callbacks?.onFlowEnd?.(flowRef.current.getData());
            dispatch({ type: 'SET_STEP', payload: null });
          }
        }
      }
    },
    [dispatch, processFlowStep, pluginManager],
  );

  const handleLogin = useCallback(
    async (data: Record<string, unknown>) => {
      await pluginManager?.onSubmit(data);
      pluginManager?.emitEvent('login', data);
      await propsRef.current.callbacks?.onLogin?.(data);
      dispatch({ type: 'SET_LOGGED_IN', payload: true });
    },
    [dispatch, pluginManager],
  );

  const toggleChat = useCallback(() => {
    const willOpen = !stateRef.current.isOpen;
    dispatch({ type: 'TOGGLE_OPEN' });
    if (willOpen) {
      pluginManager?.emitEvent('open');
      propsRef.current.callbacks?.onOpen?.();
    } else {
      pluginManager?.emitEvent('close');
      propsRef.current.callbacks?.onClose?.();
    }
  }, [dispatch, pluginManager]);

  const dismissWelcome = useCallback(() => {
    dispatch({ type: 'DISMISS_WELCOME' });
  }, [dispatch]);

  return {
    state,
    sendMessage,
    addBotMessage,
    handleQuickReply,
    handleFormSubmit,
    handleLogin,
    toggleChat,
    dismissWelcome,
    startFlow,
    processFlowStep,
    goBack,
    restartSession,
    handleComponentComplete,
  };
}

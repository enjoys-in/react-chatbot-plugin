import { useCallback, useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import { FlowEngine } from '../engine/FlowEngine';
import { uid, delay } from '../utils/helpers';
import type { ChatMessage } from '../types';
import type { FlowActionResult, ActionContext } from '../types/config';

const COMMANDS: Record<string, string> = {
  '/help': 'Show available commands',
  '/cancel': 'Cancel current step and go back',
  '/back': 'Go back to the previous step',
  '/restart': 'Restart the conversation from the beginning',
};

export function useChat() {
  const { state, dispatch, props } = useChatContext();
  const flowRef = useRef<FlowEngine | null>(null);
  const flowStartedRef = useRef(false);

  const stateRef = useRef(state);
  stateRef.current = state;
  const propsRef = useRef(props);
  propsRef.current = props;

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
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
      propsRef.current.callbacks?.onMessageReceive?.(msg);
    },
    [dispatch],
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

  const processFlowStepRef = useRef<(stepId: string) => Promise<void>>(async () => {});
  processFlowStepRef.current = async (stepId: string) => {
    const engine = flowRef.current;
    if (!engine) return;

    const step = engine.getStep(stepId);
    if (!step) return;

    engine.pushHistory(stepId);

    dispatch({ type: 'SET_STEP', payload: stepId });
    dispatch({ type: 'SET_TYPING', payload: true });
    await delay(step.delay ?? 500);

    const messages = engine.buildMessages(step);
    dispatch({ type: 'SET_TYPING', payload: false });
    dispatch({ type: 'ADD_MESSAGES', payload: messages });

    messages.forEach((m) => propsRef.current.callbacks?.onMessageReceive?.(m));

    if (step.asyncAction) {
      const handler = propsRef.current.actionHandlers?.[step.asyncAction.handler];
      if (handler) {
        const statusMsgId = uid();
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

          if (result.data) {
            engine.mergeData(result.data);
            dispatch({ type: 'SET_DATA', payload: result.data });
          }

          const finalMsg =
            result.message ??
            (result.status === 'success'
              ? (step.asyncAction.successMessage ?? 'Done!')
              : (step.asyncAction.errorMessage ?? 'Something went wrong.'));
          dispatch({ type: 'UPDATE_MESSAGE', payload: { id: statusMsgId, updates: { text: finalMsg } } });

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

    if (step.component && propsRef.current.components?.[step.component]) {
      return;
    }

    if (!step.quickReplies && !step.form && step.next) {
      await delay(300);
      processFlowStepRef.current(step.next);
    }
  };

  function resolveAsyncRoute(
    step: { asyncAction?: { onSuccess?: string; onError?: string; routes?: Record<string, string> }; next?: string },
    result: FlowActionResult,
  ): string | undefined {
    if (result.next) return result.next;
    if (step.asyncAction?.routes?.[result.status]) return step.asyncAction.routes[result.status];
    if (result.status === 'success' && step.asyncAction?.onSuccess) return step.asyncAction.onSuccess;
    if (result.status === 'error' && step.asyncAction?.onError) return step.asyncAction.onError;
    return step.next;
  }

  const processFlowStep = useCallback(
    (stepId: string) => processFlowStepRef.current(stepId),
    [],
  );

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

  const restartSession = useCallback(() => {
    const engine = flowRef.current;
    if (engine) {
      engine.reset();
    }
    flowStartedRef.current = false;
    dispatch({ type: 'RESET_CHAT' });
    if (engine) {
      flowStartedRef.current = true;
      processFlowStep(engine.getStartStepId());
    }
  }, [dispatch, processFlowStep]);

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

  const handleComponentComplete = useCallback(
    (result?: FlowActionResult) => {
      const engine = flowRef.current;
      const currentStepId = stateRef.current.currentStepId;
      if (!engine || !currentStepId) return;

      const step = engine.getStep(currentStepId);
      if (!step) return;

      if (result?.data) {
        engine.mergeData(result.data);
        dispatch({ type: 'SET_DATA', payload: result.data });
      }

      if (result?.message) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { id: uid(), sender: 'bot', text: result.message, timestamp: Date.now() },
        });
      }

      const nextStepId = result?.next ?? step.next;
      if (nextStepId) {
        processFlowStep(nextStepId);
      } else {
        propsRef.current.callbacks?.onFlowEnd?.(engine.getData());
        dispatch({ type: 'SET_STEP', payload: null });
      }
    },
    [dispatch, processFlowStep],
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (handleCommandRef.current(text)) return;

      const msg: ChatMessage = {
        id: uid(),
        sender: 'user',
        text,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
      propsRef.current.callbacks?.onMessageSend?.(msg);
      propsRef.current.callbacks?.onSubmit?.({ message: text });

      const currentStepId = stateRef.current.currentStepId;
      if (flowRef.current && currentStepId) {
        const step = flowRef.current.getStep(currentStepId);
        if (step) {
          if (step.asyncAction || step.component) {
            addBotMessage("Please wait, I'm still processing. You can type /back to go back.");
            return;
          }
          if (flowRef.current.stepExpectsQuickReply(step)) {
            const matched = flowRef.current.matchQuickReply(step, text);
            if (matched) {
              dispatch({ type: 'CLEAR_QUICK_REPLIES' });
              flowRef.current.setData(step.id, matched.value);
              const nextId = flowRef.current.resolveNext(step, matched.value);
              if (nextId) {
                processFlowStep(nextId);
              } else {
                propsRef.current.callbacks?.onFlowEnd?.(flowRef.current.getData());
                dispatch({ type: 'SET_STEP', payload: null });
              }
            } else {
              addBotMessage(
                "I didn't quite get that. Please choose one of the options below:",
                {
                  quickReplies: step.quickReplies,
                },
              );
            }
          } else if (flowRef.current.stepExpectsForm(step)) {
            addBotMessage("Please fill out the form above to continue.");
          } else {
            flowRef.current.setData(step.id, text);
            const nextId = flowRef.current.resolveNext(step, text);
            if (nextId) {
              processFlowStep(nextId);
            } else {
              addBotMessage("Thanks for your message! Our team will get back to you soon. 🙌");
              propsRef.current.callbacks?.onFlowEnd?.(flowRef.current.getData());
              dispatch({ type: 'SET_STEP', payload: null });
            }
          }
        }
      }
    },
    [dispatch, addBotMessage, processFlowStep],
  );

  const startFlow = useCallback(() => {
    const engine = flowRef.current;
    if (!engine || flowStartedRef.current) return;
    flowStartedRef.current = true;
    processFlowStep(engine.getStartStepId());
  }, [processFlowStep]);

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
    (value: string, label: string) => {
      dispatch({ type: 'CLEAR_QUICK_REPLIES' });
      const msg: ChatMessage = {
        id: uid(),
        sender: 'user',
        text: label,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
      propsRef.current.callbacks?.onQuickReply?.(value, label);

      const currentStepId = stateRef.current.currentStepId;
      if (flowRef.current && currentStepId) {
        const step = flowRef.current.getStep(currentStepId);
        if (step) {
          flowRef.current.setData(step.id, value);
          const nextId = flowRef.current.resolveNext(step, value);
          if (nextId) {
            processFlowStep(nextId);
          } else {
            propsRef.current.callbacks?.onFlowEnd?.(flowRef.current.getData());
            dispatch({ type: 'SET_STEP', payload: null });
          }
        }
      }
    },
    [dispatch, processFlowStep],
  );

  const handleFormSubmit = useCallback(
    async (formId: string, data: Record<string, unknown>) => {
      dispatch({ type: 'SET_DATA', payload: data });
      if (flowRef.current) {
        flowRef.current.mergeData(data);
      }

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

      await propsRef.current.callbacks?.onFormSubmit?.(formId, data);

      const currentStepId = stateRef.current.currentStepId;
      if (flowRef.current && currentStepId) {
        const step = flowRef.current.getStep(currentStepId);
        if (step) {
          const nextId = flowRef.current.resolveNext(step);
          if (nextId) {
            processFlowStep(nextId);
          } else {
            propsRef.current.callbacks?.onFlowEnd?.(flowRef.current.getData());
            dispatch({ type: 'SET_STEP', payload: null });
          }
        }
      }
    },
    [dispatch, processFlowStep],
  );

  const handleLogin = useCallback(
    async (data: Record<string, unknown>) => {
      await propsRef.current.callbacks?.onLogin?.(data);
      dispatch({ type: 'SET_LOGGED_IN', payload: true });
    },
    [dispatch],
  );

  const toggleChat = useCallback(() => {
    const willOpen = !stateRef.current.isOpen;
    dispatch({ type: 'TOGGLE_OPEN' });
    if (willOpen) {
      propsRef.current.callbacks?.onOpen?.();
    } else {
      propsRef.current.callbacks?.onClose?.();
    }
  }, [dispatch]);

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

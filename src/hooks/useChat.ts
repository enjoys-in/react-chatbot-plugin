import { useCallback, useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import { FlowEngine } from '../engine/FlowEngine';
import { uid, delay } from '../utils/helpers';
import type { ChatMessage, FormConfig } from '../types';

export function useChat() {
  const { state, dispatch, props } = useChatContext();
  const flowRef = useRef<FlowEngine | null>(null);
  const flowStartedRef = useRef(false);

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
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
      props.callbacks?.onMessageReceive?.(msg);
    },
    [dispatch, props.callbacks],
  );

  const sendMessage = useCallback(
    (text: string) => {
      const msg: ChatMessage = {
        id: uid(),
        sender: 'user',
        text,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
      props.callbacks?.onMessageSend?.(msg);
      props.callbacks?.onSubmit?.({ message: text });

      // Process flow
      if (flowRef.current && state.currentStepId) {
        const step = flowRef.current.getStep(state.currentStepId);
        if (step) {
          flowRef.current.setData(step.id, text);
          const nextId = flowRef.current.resolveNext(step, text);
          if (nextId) {
            processFlowStep(nextId);
          } else {
            props.callbacks?.onFlowEnd?.(flowRef.current.getData());
            dispatch({ type: 'SET_STEP', payload: null });
          }
        }
      }
    },
    [dispatch, props.callbacks, state.currentStepId],
  );

  const processFlowStep = useCallback(
    async (stepId: string) => {
      const engine = flowRef.current;
      if (!engine) return;

      const step = engine.getStep(stepId);
      if (!step) return;

      dispatch({ type: 'SET_STEP', payload: stepId });
      dispatch({ type: 'SET_TYPING', payload: true });
      await delay(step.delay ?? 500);

      const messages = engine.buildMessages(step);
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'ADD_MESSAGES', payload: messages });

      messages.forEach((m) => props.callbacks?.onMessageReceive?.(m));

      // Auto-advance if no user input required
      if (!step.quickReplies && !step.form && step.next) {
        await delay(300);
        processFlowStep(step.next);
      }
    },
    [dispatch, props.callbacks],
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
    (value: string, label: string) => {
      dispatch({ type: 'CLEAR_QUICK_REPLIES' });
      // Add user message
      const msg: ChatMessage = {
        id: uid(),
        sender: 'user',
        text: label,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
      props.callbacks?.onQuickReply?.(value, label);

      // Continue flow
      if (flowRef.current && state.currentStepId) {
        const step = flowRef.current.getStep(state.currentStepId);
        if (step) {
          flowRef.current.setData(step.id, value);
          const nextId = flowRef.current.resolveNext(step, value);
          if (nextId) {
            processFlowStep(nextId);
          } else {
            props.callbacks?.onFlowEnd?.(flowRef.current.getData());
            dispatch({ type: 'SET_STEP', payload: null });
          }
        }
      }
    },
    [dispatch, props.callbacks, state.currentStepId, processFlowStep],
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

      await props.callbacks?.onFormSubmit?.(formId, data);

      // Advance flow
      if (flowRef.current && state.currentStepId) {
        const step = flowRef.current.getStep(state.currentStepId);
        if (step) {
          const nextId = flowRef.current.resolveNext(step);
          if (nextId) {
            processFlowStep(nextId);
          } else {
            props.callbacks?.onFlowEnd?.(flowRef.current.getData());
            dispatch({ type: 'SET_STEP', payload: null });
          }
        }
      }
    },
    [dispatch, props.callbacks, state.currentStepId, processFlowStep],
  );

  const handleLogin = useCallback(
    async (data: Record<string, unknown>) => {
      await props.callbacks?.onLogin?.(data);
      dispatch({ type: 'SET_LOGGED_IN', payload: true });
    },
    [dispatch, props.callbacks],
  );

  const toggleChat = useCallback(() => {
    const willOpen = !state.isOpen;
    dispatch({ type: 'TOGGLE_OPEN' });
    if (willOpen) {
      props.callbacks?.onOpen?.();
    } else {
      props.callbacks?.onClose?.();
    }
  }, [dispatch, state.isOpen, props.callbacks]);

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
  };
}

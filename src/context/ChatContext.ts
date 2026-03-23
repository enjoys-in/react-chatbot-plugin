import { createContext, useContext } from 'react';
import type { ChatMessage, ChatBotProps } from '../types';
import type { PluginManager } from '../core/PluginManager';

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  showWelcome: boolean;
  currentStepId: string | null;
  collectedData: Record<string, unknown>;
  isLoggedIn: boolean;
}

export type ChatAction =
  | { type: 'TOGGLE_OPEN' }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_MESSAGES'; payload: ChatMessage[] }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'DISMISS_WELCOME' }
  | { type: 'SET_STEP'; payload: string | null }
  | { type: 'SET_DATA'; payload: Record<string, unknown> }
  | { type: 'SET_LOGGED_IN'; payload: boolean }
  | { type: 'CLEAR_QUICK_REPLIES' }
  | { type: 'RESET_CHAT' }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<ChatMessage> } };

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'TOGGLE_OPEN':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_OPEN':
      return { ...state, isOpen: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'ADD_MESSAGES':
      return { ...state, messages: [...state.messages, ...action.payload] };
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    case 'DISMISS_WELCOME':
      return { ...state, showWelcome: false };
    case 'SET_STEP':
      return { ...state, currentStepId: action.payload };
    case 'SET_DATA':
      return { ...state, collectedData: { ...state.collectedData, ...action.payload } };
    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload };
    case 'CLEAR_QUICK_REPLIES': {
      // Only clear quick replies from the last message that has them
      let lastIdx = -1;
      for (let i = state.messages.length - 1; i >= 0; i--) {
        if (state.messages[i].quickReplies) { lastIdx = i; break; }
      }
      if (lastIdx === -1) return state;
      const updated = [...state.messages];
      updated[lastIdx] = { ...updated[lastIdx], quickReplies: undefined };
      return { ...state, messages: updated };
    }
    case 'RESET_CHAT':
      return {
        ...state,
        messages: [],
        isTyping: false,
        currentStepId: null,
        collectedData: {},
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m,
        ),
      };
    default:
      return state;
  }
}

export const initialState = (props: ChatBotProps): ChatState => ({
  isOpen: props.defaultOpen ?? false,
  messages: props.initialMessages ?? [],
  isTyping: false,
  showWelcome: !!props.customizeChat?.welcomeScreen?.content,
  currentStepId: null,
  collectedData: {},
  isLoggedIn: !props.loginForm,
});

interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  props: ChatBotProps;
  pluginManager?: PluginManager | null;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}

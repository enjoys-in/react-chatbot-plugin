// Main component
export { ChatBot } from './components/ChatBot';

// Sub-components (for advanced usage)
export { ChatHeader } from './components/ChatHeader';
export { ChatInput } from './components/ChatInput';
export { ChatWindow } from './components/ChatWindow';
export { Launcher } from './components/Launcher';
export { MessageBubble } from './components/MessageBubble';
export { MessageList } from './components/MessageList';
export { QuickReplies } from './components/QuickReplies';
export { TypingIndicator } from './components/TypingIndicator';
export { WelcomeScreen } from './components/WelcomeScreen';
export { LoginScreen } from './components/LoginScreen';

// Forms
export { DynamicForm, TextField, SelectField, RadioField, CheckboxField, FileUploadField } from './components/forms';

// Engine
export { FlowEngine } from './engine/FlowEngine';

// Hooks
export { useChat } from './hooks/useChat';

// Context
export { ChatContext, useChatContext } from './context/ChatContext';

// Types
export type {
  ChatBotProps,
  ChatTheme,
  ChatStyle,
  ChatCallbacks,
  ChatMessage,
  MessageSender,
  HeaderConfig,
  FlowConfig,
  FlowStep,
  FlowQuickReply,
  FormConfig,
  FormFieldConfig,
  FormFieldType,
  FormFieldOption,
} from './types';

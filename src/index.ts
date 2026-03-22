export { ChatBot } from './components/ChatBot';

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
export { Branding } from './components/Branding';
export { EmojiPicker } from './components/EmojiPicker';
export { FileUploadButton, FilePreviewList } from './components/FileUpload';

export {
  SendIcon,
  ChatBubbleIcon,
  CloseIcon,
  MinimizeIcon,
  EmojiIcon,
  AttachmentIcon,
  FileIcon,
  ImageIcon,
  RemoveIcon,
  RestartIcon,
} from './components/icons';

export { DynamicForm, TextField, SelectField, RadioField, CheckboxField, FileUploadField } from './components/forms';

export { FlowEngine } from './engine/FlowEngine';
export { PluginManager } from './core/PluginManager';

export { analyticsPlugin } from './plugins/analyticsPlugin';
export { webhookPlugin } from './plugins/webhookPlugin';
export { persistencePlugin } from './plugins/persistencePlugin';

export { useChat } from './hooks/useChat';

export { ChatContext, useChatContext } from './context/ChatContext';

export { resolveTheme, buildStyles, buildCSSVariables } from './styles/theme';

export type {
  ChatBotProps,
  ChatCallbacks,
  HeaderConfig,
  BrandingConfig,
  FileUploadConfig,
  ChatRenderContext,
  StepComponentProps,
  FlowActionResult,
  ActionContext,
  ChatTheme,
  ChatStyle,
  ChatMessage,
  MessageSender,
  MessageAttachment,
  FlowQuickReply,
  FlowConfig,
  FlowStep,
  FlowCondition,
  FlowAsyncAction,
  FormConfig,
  FormFieldConfig,
  FormFieldType,
  FormFieldOption,
  FormFieldValidation,
  ChatPlugin,
  PluginContext,
  ChatPluginEvent,
} from './types';

// ─── Main Component ──────────────────────────────────────────────
export { ChatBot } from './components/ChatBot';

// ─── UI Components ───────────────────────────────────────────────
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

// ─── Icons ───────────────────────────────────────────────────────
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

// ─── Forms ───────────────────────────────────────────────────────
export { DynamicForm, TextField, SelectField, RadioField, CheckboxField, FileUploadField } from './components/forms';

// ─── Core Engine ─────────────────────────────────────────────────
export { FlowEngine } from './engine/FlowEngine';
export { PluginManager } from './core/PluginManager';

// ─── Plugins (built-in) ─────────────────────────────────────────
export {
  analyticsPlugin,
  loggerPlugin,
  webhookPlugin,
  crmPlugin,
  emailPlugin,
  aiPlugin,
  intentPlugin,
  typingPlugin,
  autoReplyPlugin,
  validationPlugin,
  uploadPlugin,
  persistencePlugin,
  syncPlugin,
  authPlugin,
  rateLimitPlugin,
  pushPlugin,
  soundPlugin,
  agentPlugin,
  transferPlugin,
  themePlugin,
  componentPlugin,
  leadPlugin,
  campaignPlugin,
  schedulerPlugin,
  reminderPlugin,
  i18nPlugin,
  debugPlugin,
  devtoolsPlugin,
  mediaPlugin,
  markdownPlugin,
} from './plugins';

// ─── Hooks ───────────────────────────────────────────────────────
export { useChat } from './hooks/useChat';

// ─── Context ─────────────────────────────────────────────────────
export { ChatContext, useChatContext } from './context/ChatContext';

// ─── Theme Utilities ─────────────────────────────────────────────
export { resolveTheme, buildStyles, buildCSSVariables } from './styles/theme';

// ─── Types ───────────────────────────────────────────────────────
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
  FlowStepInput,
  FlowCondition,
  FlowAsyncAction,
  KeywordRoute,
  ChatCustomizeChat,
  ChatCustomizeSlotMap,
  MessageBubbleSlotProps,
  QuickRepliesSlotProps,
  TypingIndicatorSlotProps,
  HeaderSlotProps,
  InputSlotProps,
  BrandingSlotProps,
  WelcomeScreenSlotProps,
  LoginScreenSlotProps,
  LauncherSlotProps,
  FormConfig,
  FormFieldConfig,
  FormFieldType,
  FormFieldOption,
  FormFieldValidation,
  FormFieldRenderProps,
  TextFieldRenderProps,
  SelectFieldRenderProps,
  RadioFieldRenderProps,
  CheckboxFieldRenderProps,
  FileFieldRenderProps,
  FormFieldRenderMap,
  ChatPlugin,
  PluginContext,
  ChatPluginEvent,
} from './types';

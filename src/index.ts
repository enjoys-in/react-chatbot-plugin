// ─── Main Component ──────────────────────────────────────────────
export { ChatBot } from './components/ChatBot';

// ─── UI Components ───────────────────────────────────────────────
export { ChatHeader } from './components/ChatHeader';
export { ChatInput } from './components/ChatInput';
export { ChatWindow } from './components/ChatWindow';
export { Launcher } from './components/Launcher';
export { LauncherNotification } from './components/LauncherNotification';
export { MessageBubble } from './components/MessageBubble';
export { MessageList } from './components/MessageList';
export { QuickReplies } from './components/QuickReplies';
export { TypingIndicator } from './components/TypingIndicator';
export { WelcomeScreen } from './components/WelcomeScreen';
export { HomeScreen } from './components/HomeScreen';
export { BottomNav } from './components/BottomNav';
export { SlashCommandMenu } from './components/SlashCommandMenu';
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
export { LiveAgentAdapter } from './core/LiveAgentAdapter';
export { BUILT_IN_COMMANDS, resolveCommands, parseCommand, filterCommands, commandMenuQuery } from './core/commands';
export { createEventBus } from './core/EventBus';
export type { EventBus, EventHandler } from './core/EventBus';
export { createHeadlessBot } from './core/HeadlessBot';
export type { HeadlessBot, HeadlessBotOptions } from './core/HeadlessBot';

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
  liveAgentPlugin,
  tagsPlugin,
  ratingPlugin,
  offlinePlugin,
  proactivePlugin,
  personaPlugin,
  pinPlugin,
  themeTogglePlugin,
  confettiPlugin,
  priorityPlugin,
  whisperPlugin,
  messageSchedulePlugin,
  notificationBadgePlugin,
  summaryPlugin,
  knowledgeBasePlugin,
  translationPlugin,
  transcriptExportPlugin,
  codeHighlightPlugin,
  pollPlugin,
  paymentPlugin,
  bookingPlugin,
  locationPlugin,
  voiceCallPlugin,
} from './plugins';
export type { VoiceCallPluginOptions } from './plugins';

// ─── Hooks ───────────────────────────────────────────────────────
export { useChat } from './hooks/useChat';
export { useLiveAgent } from './hooks/useLiveAgent';
export { useColorScheme } from './hooks/useColorScheme';

// ─── Context ─────────────────────────────────────────────────────
export { ChatContext, useChatContext } from './context/ChatContext';

// ─── Theme Utilities ─────────────────────────────────────────────
export {
  resolveTheme,
  buildStyles,
  buildCSSVariables,
  neutrals,
  headerInk,
  contrastInk,
  inkLayers,
  motion,
  typography,
  resolveColorMode,
  prefersDarkScheme,
  onColorSchemeChange,
} from './styles/theme';

// ─── Utilities ───────────────────────────────────────────────────
export { renderMarkdown } from './utils/markdown';
export { formatFieldValue, filesFromValue, truncateMiddle } from './utils/helpers';

// ─── Types ───────────────────────────────────────────────────────
/** Resolved inline style map handed to slot components (e.g. `messageBubble`). */
export type { ChatStyles } from './styles/theme';
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
  ChatColorMode,
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
  FlowMiddleware,
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
  HomeScreenConfig,
  HomeScreenAction,
  HomeScreenSection,
  HomeScreenContext,
  HomeScreenCta,
  HomeScreenSlotProps,
  NavTab,
  NavigationConfig,
  SlashCommand,
  SlashCommandContext,
  LauncherNotificationConfig,
  LauncherNotificationSlotProps,
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
  ChatIconMap,
  MarkdownOptions,
  LiveAgentConfig,
  LiveAgentEvents,
  AgentInfo,
  ResolvedLiveAgentEvents,
} from './types';
export { DEFAULT_LIVE_AGENT_EVENTS } from './types';

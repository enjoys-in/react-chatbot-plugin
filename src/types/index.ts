// ─── Domain Type Modules ─────────────────────────────────────────
// Each domain has its own type file (Single Responsibility Principle)

export type { ChatMessage, MessageSender, MessageAttachment, FlowQuickReply, MessageReaction, MessageStatus, CarouselCard, CardButton } from './message';
export type { FormConfig, FormFieldConfig, FormFieldType, FormFieldOption, FormFieldValidation, FormFieldRenderProps, TextFieldRenderProps, SelectFieldRenderProps, RadioFieldRenderProps, CheckboxFieldRenderProps, FileFieldRenderProps, FormFieldRenderMap } from './form';
export type { FlowConfig, FlowStep, FlowStepInput, FlowCondition, FlowAsyncAction, FlowMiddleware } from './flow';
export type { ChatTheme, ChatStyle, ChatColorMode } from './theme';
export type { ChatPlugin, PluginContext, ChatPluginEvent } from './plugin';
export type {
  ChatBotProps,
  ChatCallbacks,
  KeywordRoute,
  HeaderConfig,
  BrandingConfig,
  FileUploadConfig,
  ChatRenderContext,
  StepComponentProps,
  FlowActionResult,
  ActionContext,
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
  LauncherNotificationConfig,
  LauncherNotificationSlotProps,
  ChatIconMap,
  MarkdownOptions,
} from './config';
export type { LiveAgentConfig, LiveAgentEvents, AgentInfo, ResolvedLiveAgentEvents } from './liveAgent';
export { DEFAULT_LIVE_AGENT_EVENTS } from './liveAgent';

export type {
  HomeScreenConfig,
  HomeScreenAction,
  HomeScreenSection,
  HomeScreenContext,
  HomeScreenCta,
  HomeScreenSlotProps,
} from './home';

export type { NavTab, NavigationConfig } from './navigation';

export type { SlashCommand, SlashCommandContext } from './command';

// ─── Domain Type Modules ─────────────────────────────────────────
// Each domain has its own type file (Single Responsibility Principle)

export type { ChatMessage, MessageSender, MessageAttachment, FlowQuickReply } from './message';
export type { FormConfig, FormFieldConfig, FormFieldType, FormFieldOption, FormFieldValidation } from './form';
export type { FlowConfig, FlowStep, FlowCondition, FlowAsyncAction } from './flow';
export type { ChatTheme, ChatStyle } from './theme';
export type { ChatPlugin, PluginContext, ChatPluginEvent } from './plugin';
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
} from './config';


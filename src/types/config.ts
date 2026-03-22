import type { ComponentType, ReactNode } from 'react';
import type { ChatTheme, ChatStyle } from './theme';
import type { ChatMessage } from './message';
import type { FlowConfig } from './flow';
import type { FormConfig } from './form';
import type { ChatPlugin } from './plugin';


export interface BrandingConfig {
  poweredBy?: string;
  poweredByUrl?: string;
  logo?: string;
  logoWidth?: string;
  showBranding?: boolean;
}


export interface HeaderConfig {
  title?: string;
  subtitle?: string;
  avatar?: string;
  showClose?: boolean;
  showMinimize?: boolean;
  showRestart?: boolean;
}


export interface FileUploadConfig {
  enabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
}


export interface ChatRenderContext {
  currentStepId: string | null;
  isOpen: boolean;
  messages: ChatMessage[];
  collectedData: Record<string, unknown>;
  toggleChat: () => void;
  restartSession: () => void;
  sendMessage: (text: string) => void;
}


export interface ChatCallbacks {
  onOpen?: () => void;
  onClose?: () => void;
  onMessageSend?: (message: ChatMessage) => void;
  onMessageReceive?: (message: ChatMessage) => void;
  onSubmit?: (data: Record<string, unknown>, formId?: string) => void | Promise<void>;
  onLogin?: (data: Record<string, unknown>) => void | Promise<void>;
  onFormSubmit?: (formId: string, data: Record<string, unknown>) => void | Promise<void>;
  onQuickReply?: (value: string, label: string) => void;
  onFileUpload?: (files: File[]) => void | Promise<void>;
  onFlowEnd?: (collectedData: Record<string, unknown>) => void;
  onError?: (error: Error) => void;
  onEvent?: (event: string, payload?: unknown) => void;
}


export interface ChatBotProps {
  theme?: ChatTheme;
  style?: ChatStyle;
  header?: HeaderConfig;
  branding?: BrandingConfig;
  welcomeScreen?: ReactNode;
  flow?: FlowConfig;
  loginForm?: FormConfig;
  callbacks?: ChatCallbacks;
  plugins?: ChatPlugin[];
  initialMessages?: ChatMessage[];
  inputPlaceholder?: string;
  position?: 'bottom-right' | 'bottom-left';
  showLauncher?: boolean;
  launcherIcon?: ReactNode;
  closeIcon?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  zIndex?: number;
  enableEmoji?: boolean;
  fileUpload?: FileUploadConfig;
  renderHeader?: (ctx: ChatRenderContext, defaultHeader: ReactNode) => ReactNode;
  renderInput?: (ctx: ChatRenderContext, defaultInput: ReactNode) => ReactNode;
  components?: Record<string, ComponentType<StepComponentProps>>;
  actionHandlers?: Record<string, (data: Record<string, unknown>, ctx: ActionContext) => Promise<FlowActionResult>>;
}


export interface StepComponentProps {
  stepId: string;
  data: Record<string, unknown>;
  onComplete: (result?: FlowActionResult) => void;
}


export interface FlowActionResult {
  status: string;
  data?: Record<string, unknown>;
  message?: string;
  next?: string;
}

export interface ActionContext {
  updateMessage: (text: string) => void;
}

import type { ComponentType, ReactNode } from 'react';
import type { ChatTheme, ChatStyle } from './theme';
import type { ChatMessage } from './message';
import type { FlowConfig } from './flow';
import type { FormConfig, FormFieldRenderMap } from './form';
import type { ChatPlugin } from './plugin';

// ─── Branding ────────────────────────────────────────────────────

export interface BrandingConfig {
  /** Company/product name shown in footer */
  poweredBy?: string;
  /** URL when clicking branding */
  poweredByUrl?: string;
  /** Logo URL for header or welcome screen */
  logo?: string;
  /** Logo width */
  logoWidth?: string;
  /** Show "Powered by" branding footer */
  showBranding?: boolean;
}

// ─── Header ──────────────────────────────────────────────────────

export interface HeaderConfig {
  title?: string;
  subtitle?: string;
  avatar?: string;
  showClose?: boolean;
  showMinimize?: boolean;
  /** Show a restart button in the header */
  showRestart?: boolean;
}

// ─── File Upload Options ─────────────────────────────────────────

export interface FileUploadConfig {
  /** Enable file upload in chat input */
  enabled?: boolean;
  /** Accepted mime types */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Max file size in bytes */
  maxSize?: number;
  /** Max number of files */
  maxFiles?: number;
}

// ─── Context passed to custom component renderers ────────────────

export interface ChatRenderContext {
  /** Current step ID in the flow (null if no active step) */
  currentStepId: string | null;
  /** Whether the chat is open */
  isOpen: boolean;
  /** All current messages */
  messages: ChatMessage[];
  /** Collected form/flow data */
  collectedData: Record<string, unknown>;
  /** Toggle/close the chat window */
  toggleChat: () => void;
  /** Restart the conversation */
  restartSession: () => void;
  /** Send a message programmatically */
  sendMessage: (text: string) => void;
}

// ─── Events / Callbacks ─────────────────────────────────────────

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

// ─── Main Props ──────────────────────────────────────────────────

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
  /** Enable emoji picker */
  enableEmoji?: boolean;
  /** File upload configuration */
  fileUpload?: FileUploadConfig;
  /** Custom header component — receives ChatRenderContext as props */
  renderHeader?: (ctx: ChatRenderContext, defaultHeader: ReactNode) => ReactNode;
  /** Custom input component — receives ChatRenderContext as props */
  renderInput?: (ctx: ChatRenderContext, defaultInput: ReactNode) => ReactNode;
  /** Map of custom components that can be rendered in flow steps (key = step.component) */
  components?: Record<string, ComponentType<StepComponentProps>>;
  /** Map of async action handlers (key = step.asyncAction.handler) */
  actionHandlers?: Record<string, (data: Record<string, unknown>, ctx: ActionContext) => Promise<FlowActionResult>>;
  /** Override built-in form field renderers per field type. Each renderer receives strongly-typed props + the default element. */
  renderFormField?: FormFieldRenderMap;
}

// ─── Custom Step Component Props ─────────────────────────────────

/** Props passed to custom components rendered in flow steps */
export interface StepComponentProps {
  /** The step ID that owns this component */
  stepId: string;
  /** All collected flow/form data */
  data: Record<string, unknown>;
  /** Call when the component interaction is complete — routes to next step */
  onComplete: (result?: FlowActionResult) => void;
}

// ─── Async Action Types ──────────────────────────────────────────

/** Result returned by an async action handler */
export interface FlowActionResult {
  /** Status key — 'success', 'error', or any custom string for route matching */
  status: string;
  /** Additional data to merge into collected data */
  data?: Record<string, unknown>;
  /** Optional message to display (overrides successMessage/errorMessage) */
  message?: string;
  /** Optional explicit next step ID (overrides all routing) */
  next?: string;
}

/** Context object passed to async action handlers */
export interface ActionContext {
  /** Update the loading/status message text in real-time */
  updateMessage: (text: string) => void;
}

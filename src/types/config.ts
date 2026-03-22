import type { ReactNode } from 'react';
import type { ChatTheme, ChatStyle } from './theme';
import type { ChatMessage } from './message';
import type { FlowConfig } from './flow';
import type { FormConfig } from './form';
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
}

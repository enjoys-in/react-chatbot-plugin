import type { ComponentType, ReactNode } from 'react';
import type { ChatTheme, ChatStyle } from './theme';
import type { ChatMessage, FlowQuickReply } from './message';
import type { FlowConfig } from './flow';
import type { FormConfig, FormFieldRenderMap } from './form';
import type { ChatPlugin } from './plugin';
import type { ChatStyles } from '../styles/theme';

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
  /** Called when user types text the bot couldn't handle */
  onUnhandledMessage?: (text: string, context: { currentStepId: string | null }) => void;
}

// ─── Main Props ──────────────────────────────────────────────────

export interface ChatBotProps {
  theme?: ChatTheme;
  style?: ChatStyle;
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
  /** Map of custom components that can be rendered in flow steps (key = step.component) */
  components?: Record<string, ComponentType<StepComponentProps>>;
  /** Map of async action handlers (key = step.asyncAction.handler) */
  actionHandlers?: Record<string, (data: Record<string, unknown>, ctx: ActionContext) => Promise<FlowActionResult>>;
  /** Override built-in form field renderers per field type. Each renderer receives strongly-typed props + the default element. */
  renderFormField?: FormFieldRenderMap;
  /** Fallback message when user types text with no active flow or unmatched input */
  fallbackMessage?: string | ((text: string) => string | null);
  /** Keyword routes — match user text to responses or flow steps */
  keywords?: KeywordRoute[];
  /** Convenience: auto-respond to common greetings (hello, hi, hey, etc.) */
  greetingResponse?: string;
  /** Typing delay in ms before bot sends keyword/fallback replies (default: 0) */
  typingDelay?: number;
  /** Slot map — override individual UI components. Only provided keys are replaced; rest use defaults. */
  customizeChat?: ChatCustomizeChat;
}

// ─── Keyword / Intent Matching ───────────────────────────────────

/** Route configuration for keyword-based text matching */
export interface KeywordRoute {
  /** Patterns to match against user text */
  patterns: string[];
  /** Bot response message when matched */
  response?: string;
  /** Jump to this flow step when matched */
  next?: string;
  /** Case-sensitive matching (default: false) */
  caseSensitive?: boolean;
  /** Matching strategy (default: 'contains') */
  matchType?: 'exact' | 'contains' | 'startsWith' | 'regex';
  /** Priority — higher wins when multiple routes match (default: 0) */
  priority?: number;
}

// ─── Customize Chat — Slot Map ───────────────────────────────────

/** Props passed to a custom message bubble component */
export interface MessageBubbleSlotProps {
  message: ChatMessage;
  styles: ChatStyles;
  /** Custom component to replace the default bubble */
  component?: ComponentType<{ message: ChatMessage; styles: ChatStyles }>;
}

/** Props passed to a custom quick replies component */
export interface QuickRepliesSlotProps {
  replies: FlowQuickReply[];
  onSelect: (value: string, label: string) => void;
  primaryColor: string;
  /** Custom component to replace the default quick replies */
  component?: ComponentType<{ replies: FlowQuickReply[]; onSelect: (value: string, label: string) => void; primaryColor: string }>;
}

/** Props passed to a custom typing indicator component */
export interface TypingIndicatorSlotProps {
  color: string;
  /** Custom component to replace the default typing indicator */
  component?: ComponentType<{ color: string }>;
}

/** Props passed to a custom header slot component */
export interface HeaderSlotProps {
  config: HeaderConfig;
  styles: ChatStyles;
  onClose: () => void;
  onRestart?: () => void;
  logo?: string;
  logoWidth?: string;
  /** Chat render context — current state, toggleChat, restartSession, sendMessage */
  ctx: ChatRenderContext;
  /** Custom header element — replaces the default header when provided */
  component?: ReactNode;
}

/** Props passed to a custom input slot component */
export interface InputSlotProps {
  onSend: (text: string, files?: File[]) => void;
  placeholder?: string;
  primaryColor: string;
  isDark?: boolean;
  enableEmoji?: boolean;
  fileUpload?: FileUploadConfig;
  onFileUpload?: (files: File[]) => void | Promise<void>;
  /** Chat render context — current state, toggleChat, restartSession, sendMessage */
  ctx: ChatRenderContext;
  /** Custom input element — replaces the default input when provided */
  component?: ReactNode;
}

/** Props passed to a custom branding slot component */
export interface BrandingSlotProps {
  config: BrandingConfig;
  primaryColor: string;
  /** Custom branding element — replaces the default footer when provided */
  component?: ReactNode;
}

/** Props passed to a custom welcome screen slot component */
export interface WelcomeScreenSlotProps {
  content: ReactNode;
  onDismiss: () => void;
  primaryColor: string;
  /** Custom welcome screen element — replaces the default when provided */
  component?: ReactNode;
}

/** Props passed to a custom login screen slot component */
export interface LoginScreenSlotProps {
  config: FormConfig;
  onLogin: (data: Record<string, unknown>) => void;
  primaryColor: string;
  renderFormField?: FormFieldRenderMap;
  /** Custom login screen element — replaces the default when provided */
  component?: ReactNode;
}

/** Props passed to a custom launcher slot component */
export interface LauncherSlotProps {
  onClick: () => void;
  isOpen: boolean;
  position: 'bottom-right' | 'bottom-left';
  styles: ChatStyles;
  icon?: ReactNode;
  closeIcon?: ReactNode;
  zIndex?: number;
  /** Custom launcher element — replaces the default when provided */
  component?: ReactNode;
}

/**
 * Strict slot-to-props mapping. Defines every allowed key and its exact props interface.
 * No extra keys allowed — TypeScript will error on unknown slot names.
 */
export interface ChatCustomizeSlotMap {
  messageBubble: MessageBubbleSlotProps;
  quickReplies: QuickRepliesSlotProps;
  typingIndicator: TypingIndicatorSlotProps;
  header: HeaderSlotProps;
  input: InputSlotProps;
  branding: BrandingSlotProps;
  welcomeScreen: WelcomeScreenSlotProps;
  loginScreen: LoginScreenSlotProps;
  launcher: LauncherSlotProps;
}

/**
 * Slot map for customizing individual chat UI components.
 * Each key accepts a partial of its slot props — provide config, content, or a custom component.
 * Only the 9 defined slot keys are allowed — unknown keys cause a compile error.
 * Form rendering (DynamicForm / renderFormField) is never affected.
 *
 * @example
 * ```tsx
 * customizeChat={{
 *   header: { config: { title: 'Support', showRestart: true } },
 *   branding: { config: { poweredBy: 'Acme', showBranding: true } },
 *   messageBubble: { component: MyCustomBubble },
 * }}
 * ```
 */
export type ChatCustomizeChat = {
  [K in keyof ChatCustomizeSlotMap]?: Partial<ChatCustomizeSlotMap[K]>;
};

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

import type { ReactNode, CSSProperties } from 'react';

// ─── Style & Theme ───────────────────────────────────────────────

export interface ChatTheme {
  primaryColor?: string;
  headerBg?: string;
  headerText?: string;
  bubbleBg?: string;
  bubbleText?: string;
  userBubbleBg?: string;
  userBubbleText?: string;
  fontFamily?: string;
  fontSize?: string;
  borderRadius?: string;
  windowWidth?: string;
  windowHeight?: string;
}

export interface ChatStyle {
  launcher?: CSSProperties;
  window?: CSSProperties;
  header?: CSSProperties;
  messageList?: CSSProperties;
  inputArea?: CSSProperties;
}

// ─── Form System ─────────────────────────────────────────────────

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'date'
  | 'time'
  | 'hidden';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldConfig {
  name: string;
  type: FormFieldType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  accept?: string;        // for file type
  multiple?: boolean;     // for file/multiselect
  defaultValue?: string | string[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    message?: string;
  };
}

export interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  submitLabel?: string;
}

// ─── Flow System ─────────────────────────────────────────────────

export interface FlowQuickReply {
  label: string;
  value: string;
  next?: string;
}

export interface FlowStep {
  id: string;
  message?: string;
  messages?: string[];
  delay?: number;
  quickReplies?: FlowQuickReply[];
  form?: FormConfig;
  next?: string;
  action?: string;
  condition?: {
    field: string;
    operator: 'eq' | 'neq' | 'contains' | 'gt' | 'lt';
    value: string | number;
    then: string;
    else: string;
  };
}

export interface FlowConfig {
  startStep: string;
  steps: FlowStep[];
}

// ─── Messages ────────────────────────────────────────────────────

export type MessageSender = 'bot' | 'user';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text?: string;
  timestamp: number;
  quickReplies?: FlowQuickReply[];
  form?: FormConfig;
  formData?: Record<string, unknown>;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
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
  onFileUpload?: (files: FileList) => void | Promise<void>;
  onFlowEnd?: (collectedData: Record<string, unknown>) => void;
  onError?: (error: Error) => void;
}

// ─── Header Config ───────────────────────────────────────────────

export interface HeaderConfig {
  title?: string;
  subtitle?: string;
  avatar?: string;
  showClose?: boolean;
}

// ─── Main Props ──────────────────────────────────────────────────

export interface ChatBotProps {
  /** Theme colors and sizing */
  theme?: ChatTheme;
  /** CSS overrides per section */
  style?: ChatStyle;
  /** Header configuration */
  header?: HeaderConfig;
  /** Custom welcome screen — pass JSX or a React component */
  welcomeScreen?: ReactNode;
  /** JSON-based conversation flow */
  flow?: FlowConfig;
  /** Custom login form shown before chat */
  loginForm?: FormConfig;
  /** All event callbacks */
  callbacks?: ChatCallbacks;
  /** Initial messages to displays */
  initialMessages?: ChatMessage[];
  /** Placeholder text for input */
  inputPlaceholder?: string;
  /** Position of the launcher */
  position?: 'bottom-right' | 'bottom-left';
  /** Whether to show the launcher bubble */
  showLauncher?: boolean;
  /** Custom launcher icon */
  launcherIcon?: ReactNode;
  /** Custom close icon */
  closeIcon?: ReactNode;
  /** Open by default */
  defaultOpen?: boolean;
  /** Custom CSS class for the root element  */
  className?: string;
  /** z-index */
  zIndex?: number;
}

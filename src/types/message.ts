export type MessageSender = 'bot' | 'user' | 'system';

export interface MessageAttachment {
  name: string;
  url: string;
  type: string;
  size?: number;
  preview?: string;
}

export interface FlowQuickReply {
  label: string;
  value: string;
  next?: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text?: string;
  timestamp: number;
  quickReplies?: FlowQuickReply[];
  form?: import('./form').FormConfig;
  formData?: Record<string, unknown>;
  attachments?: MessageAttachment[];
  metadata?: Record<string, unknown>;
  component?: string;
}

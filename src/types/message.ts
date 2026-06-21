export type MessageSender = 'bot' | 'user' | 'system' | 'agent';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface MessageReaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface MessageAttachment {
  name: string;
  url: string;
  type: string;
  size?: number;
  preview?: string;
}

export interface CarouselCard {
  title: string;
  subtitle?: string;
  image?: string;
  buttons?: CardButton[];
}

export interface CardButton {
  label: string;
  /** Quick reply value — triggers onQuickReply */
  value?: string;
  /** URL to open in a new tab */
  url?: string;
  /** Flow step to jump to */
  next?: string;
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
  /** Key into components map — renders a custom component for this message */
  component?: string;
  /** Agent name for live agent messages */
  agentName?: string;
  /** Carousel cards — renders horizontally scrollable rich cards */
  cards?: CarouselCard[];
  /** Reactions on this message */
  reactions?: MessageReaction[];
  /** Message delivery status */
  status?: MessageStatus;
}

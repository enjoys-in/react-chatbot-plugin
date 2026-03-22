import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import type { ChatStyles } from '../styles/theme';
import { MessageBubble } from './MessageBubble';
import { QuickReplies } from './QuickReplies';
import { TypingIndicator } from './TypingIndicator';
import { DynamicForm } from './forms/DynamicForm';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  styles: ChatStyles;
  primaryColor: string;
  onQuickReply: (value: string, label: string) => void;
  onFormSubmit: (formId: string, data: Record<string, unknown>) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  styles,
  primaryColor,
  onQuickReply,
  onFormSubmit,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div style={styles.messageList}>
      {messages.map((msg) => (
        <React.Fragment key={msg.id}>
          <MessageBubble message={msg} styles={styles} />
          {msg.quickReplies && msg.quickReplies.length > 0 && (
            <QuickReplies
              replies={msg.quickReplies}
              onSelect={onQuickReply}
              primaryColor={primaryColor}
            />
          )}
          {msg.form && (
            <div style={{ alignSelf: 'flex-start', width: '90%' }}>
              <DynamicForm
                config={msg.form}
                onSubmit={(data) => onFormSubmit(msg.form!.id, data)}
                primaryColor={primaryColor}
              />
            </div>
          )}
        </React.Fragment>
      ))}
      {isTyping && <TypingIndicator color={primaryColor} />}
      <div ref={bottomRef} />
    </div>
  );
};

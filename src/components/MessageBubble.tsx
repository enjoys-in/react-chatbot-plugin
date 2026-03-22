import React from 'react';
import type { ChatMessage } from '../types';
import type { ChatStyles } from '../styles/theme';

interface MessageBubbleProps {
  message: ChatMessage;
  styles: ChatStyles;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, styles }) => {
  const isBot = message.sender === 'bot';
  const bubbleStyle = isBot ? styles.botBubble : styles.userBubble;

  if (!message.text && !message.attachment) return null;

  return (
    <div style={bubbleStyle}>
      {message.text && <span>{message.text}</span>}
      {message.attachment && (
        <div style={{ marginTop: message.text ? '6px' : 0 }}>
          <a
            href={message.attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline', fontSize: '13px' }}
          >
            📎 {message.attachment.name}
          </a>
        </div>
      )}
    </div>
  );
};

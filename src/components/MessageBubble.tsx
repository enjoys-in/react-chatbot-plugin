import React from 'react';
import type { ChatMessage, MessageAttachment } from '../types';
import type { ChatStyles } from '../styles/theme';
import { FileIcon } from './icons';

interface MessageBubbleProps {
  message: ChatMessage;
  styles: ChatStyles;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, styles }) => {
  const isBot = message.sender === 'bot';
  const isSystem = message.sender === 'system';
  const bubbleStyle = isBot || isSystem ? styles.botBubble : styles.userBubble;

  const hasContent = message.text || (message.attachments && message.attachments.length > 0);
  if (!hasContent) return null;

  const systemStyle: React.CSSProperties = isSystem
    ? {
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        color: '#999',
        fontSize: '12px',
        alignSelf: 'center',
        padding: '6px 12px',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      }
    : {};

  return (
    <div
      style={{
        ...bubbleStyle,
        ...systemStyle,
        animation: 'cb-fade-in 0.3s ease-out',
      }}
    >
      {message.text && (
        <span style={{ display: 'block' }}>{message.text}</span>
      )}
      {message.attachments && message.attachments.length > 0 && (
        <div style={{ marginTop: message.text ? '10px' : 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {message.attachments.map((attachment, i) => (
            <AttachmentPreview key={i} attachment={attachment} isBot={isBot} />
          ))}
        </div>
      )}
    </div>
  );
};


interface AttachmentPreviewProps {
  attachment: MessageAttachment;
  isBot: boolean;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachment, isBot }) => {
  const isImage = attachment.type.startsWith('image/');

  if (isImage && attachment.url) {
    return (
      <div style={{ borderRadius: '12px', overflow: 'hidden', maxWidth: '220px' }}>
        <img
          src={attachment.url}
          alt={attachment.name}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '12px',
          }}
        />
        <div style={{ fontSize: '11px', padding: '4px 0', opacity: 0.6 }}>{attachment.name}</div>
      </div>
    );
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: isBot ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.15)',
        borderRadius: '10px',
        textDecoration: 'none',
        color: 'inherit',
        fontSize: '13px',
        border: isBot ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.15)',
        transition: 'background 0.2s ease',
      }}
    >
      <FileIcon size={16} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
        {attachment.name}
      </span>
      {attachment.size && (
        <span style={{ fontSize: '11px', opacity: 0.5, flexShrink: 0 }}>
          {formatFileSize(attachment.size)}
        </span>
      )}
    </a>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

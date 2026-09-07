import React, { useState } from 'react';
import type { ChatMessage, MessageAttachment, MarkdownOptions } from '../types';
import type { ChatStyles } from '../styles/theme';
import { FileIcon, EditIcon, TrashIcon } from './icons';
import { useChatContext } from '../context/ChatContext';
import { renderMarkdown } from '../utils/markdown';
import { motion, typography } from '../styles/theme';

interface MessageBubbleProps {
  message: ChatMessage;
  styles: ChatStyles;
}

/** Small round avatar rendered to the left of bot/agent messages. */
const BotMessageAvatar: React.FC<{ avatar: React.ReactNode }> = ({ avatar }) => (
  <div
    aria-hidden="true"
    style={{
      width: 28,
      height: 28,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: typeof avatar === 'string' ? 'transparent' : 'var(--cb-primary, #000000)',
      color: 'var(--cb-primary-ink, #FFFFFF)',
      fontSize: 15,
    }}
  >
    {typeof avatar === 'string'
      ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : avatar}
  </div>
);

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, styles }) => {
  const { props: chatProps } = useChatContext();
  const isBot = message.sender === 'bot';
  const isAgent = message.sender === 'agent';
  const isSystem = message.sender === 'system';
  const bubbleStyle = isBot || isSystem || isAgent ? styles.botBubble : styles.userBubble;

  const hasContent = message.text || (message.attachments && message.attachments.length > 0);
  if (!hasContent) return null;

  const agentName = message.agentName ?? (message.metadata?.agentName as string | undefined);

  // The `markdown` prop applies to every message; a per-message flag is more
  // specific and wins where present — including `false`, which lets a plugin
  // force markdown off for text it has rewritten (e.g. a profanity mask that
  // would otherwise be read as a horizontal rule).
  const perMessageMarkdown = message.metadata?.markdown as
    | boolean
    | MarkdownOptions
    | undefined;
  const markdownOpts =
    perMessageMarkdown !== undefined ? perMessageMarkdown : chatProps.markdown;
  const botAvatar = chatProps.botAvatar;
  const showAvatar = (isBot || isAgent) && !isSystem && botAvatar != null;

  const systemStyle: React.CSSProperties = isSystem
    ? {
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        color: 'var(--cb-ink-muted, #6C6F74)',
        ...typography.meta,
        alignSelf: 'center',
        padding: '6px 12px',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      }
    : {};

  const bubble = (
    <div
      style={{
        ...bubbleStyle,
        ...systemStyle,
        ...(showAvatar ? { maxWidth: '100%', alignSelf: 'auto' } : {}),
        animation: `cb-fade-in ${motion.enter}`,
      }}
      data-cb-animate
    >
      {isAgent && agentName && (
        <div style={{ ...typography.meta, fontWeight: 600, opacity: 0.65, marginBottom: '6px' }}>
          {agentName}
        </div>
      )}
      {message.text && (
        <span style={{ display: 'block' }}>
          {markdownOpts
            ? renderMarkdown(message.text, markdownOpts === true ? {} : markdownOpts)
            : message.text}
        </span>
      )}
      {message.attachments && message.attachments.length > 0 && (
        <div style={{ marginTop: message.text ? '10px' : 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {message.attachments.map((attachment, i) => (
            <AttachmentPreview key={i} attachment={attachment} isBot={isBot} />
          ))}
        </div>
      )}
      {/* Reactions */}
      {chatProps.enableReactions && (isBot || isAgent) && !isSystem && (
        <MessageReactions message={message} />
      )}
      {/* Read receipts */}
      {chatProps.showReadReceipts && message.sender === 'user' && message.status && (
        <div style={{ fontSize: '10px', opacity: 0.5, textAlign: 'right', marginTop: '2px' }}>
          {message.status === 'sent' && '✓'}
          {message.status === 'delivered' && '✓✓'}
          {message.status === 'read' && <span style={{ color: '#3B82F6' }}>✓✓</span>}
        </div>
      )}
      {/* Edit/Delete */}
      {chatProps.allowMessageEdit && message.sender === 'user' && !isSystem && (
        <MessageActions message={message} />
      )}
    </div>
  );

  if (!showAvatar) return bubble;

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-end',
        alignSelf: 'flex-start',
        maxWidth: '90%',
        animation: `cb-fade-in ${motion.enter}`,
      }}
    >
      <BotMessageAvatar avatar={botAvatar} />
      {bubble}
    </div>
  );
};

// ─── Attachment Preview ──────────────────────────────────────────

interface AttachmentPreviewProps {
  attachment: MessageAttachment;
  isBot: boolean;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachment, isBot }) => {
  const { props: chatProps } = useChatContext();
  const icons = chatProps.icons;
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
        <div
          title={attachment.name}
          style={{
            fontSize: '11px',
            padding: '4px 0',
            opacity: 0.6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {attachment.label ? `${attachment.label}: ${attachment.name}` : attachment.name}
        </div>
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
      {icons?.file ?? <FileIcon size={16} />}
      <span style={{ display: 'flex', minWidth: 0, flex: 1, gap: '6px', alignItems: 'baseline' }}>
        {attachment.label && (
          <span style={{ opacity: 0.6, flexShrink: 0 }}>{attachment.label}:</span>
        )}
        {/* Truncates with an ellipsis; the title reveals the full name. */}
        <span
          title={attachment.name}
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}
        >
          {attachment.name}
        </span>
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

// ─── Message Reactions ───────────────────────────────────────────

const DEFAULT_REACTIONS = ['👍', '👎', '❤️', '😂', '😮'];

const MessageReactions: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const { props: chatProps, dispatch } = useChatContext();
  const [showPicker, setShowPicker] = useState(false);

  const emojis = Array.isArray(chatProps.enableReactions)
    ? chatProps.enableReactions
    : DEFAULT_REACTIONS;

  const reactions = message.reactions ?? [];

  const handleReact = (emoji: string) => {
    const existing = reactions.find((r) => r.emoji === emoji);
    const reacted = !existing?.reacted;
    const updated = existing
      ? reactions.map((r) => r.emoji === emoji ? { ...r, count: reacted ? r.count + 1 : Math.max(0, r.count - 1), reacted } : r)
      : [...reactions, { emoji, count: 1, reacted: true }];

    dispatch({ type: 'UPDATE_MESSAGE', payload: { id: message.id, updates: { reactions: updated.filter((r) => r.count > 0) } } });
    chatProps.callbacks?.onReaction?.(message.id, emoji, reacted);
    setShowPicker(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
      {reactions.map((r) => (
        <button
          key={r.emoji}
          onClick={() => handleReact(r.emoji)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            padding: '2px 6px', borderRadius: '12px', border: `1px solid ${r.reacted ? 'rgba(9,14,21,0.24)' : 'rgba(9,14,21,0.1)'}`,
            background: r.reacted ? 'rgba(9,14,21,0.08)' : 'rgba(9,14,21,0.03)',
            cursor: 'pointer', fontSize: '12px', transition: `background-color ${motion.surface}, border-color ${motion.surface}`,
          }}
        >
          <span>{r.emoji}</span>
          {r.count > 0 && <span style={{ fontSize: '11px', opacity: 0.7 }}>{r.count}</span>}
        </button>
      ))}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          style={{
            width: '22px', height: '22px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)',
            background: 'rgba(0,0,0,0.03)', cursor: 'pointer', fontSize: '11px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
          }}
          aria-label="React"
        >
          +
        </button>
        {showPicker && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 0, marginBottom: '4px',
            display: 'flex', gap: '2px', padding: '4px 6px', borderRadius: '16px',
            background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.08)',
            zIndex: 10,
          }}>
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px', borderRadius: '4px', transition: 'transform 0.1s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Message Edit/Delete Actions ─────────────────────────────────

const MessageActions: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const { dispatch, props: chatProps } = useChatContext();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.text ?? '');
  const icons = chatProps.icons;

  const handleSaveEdit = () => {
    if (editText.trim()) {
      dispatch({ type: 'UPDATE_MESSAGE', payload: { id: message.id, updates: { text: editText.trim(), metadata: { ...message.metadata, edited: true } } } });
    }
    setEditing(false);
  };

  const handleDelete = () => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { id: message.id, updates: { text: undefined, metadata: { ...message.metadata, deleted: true } } } });
  };

  if (editing) {
    return (
      <div style={{ marginTop: '4px', display: 'flex', gap: '4px' }}>
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
          autoFocus
          style={{ flex: 1, padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '13px', outline: 'none' }}
        />
        <button onClick={handleSaveEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#10B981' }}>✓</button>
        <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#999' }}>✕</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', opacity: 0.4, transition: 'opacity 0.15s' }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
    >
      <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '2px' }} aria-label="Edit">
        {icons?.edit ?? <EditIcon size={12} />}
      </button>
      <button onClick={handleDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '2px', color: '#EF4444' }} aria-label="Delete">
        {icons?.trash ?? <TrashIcon size={12} />}
      </button>
      {!!message.metadata?.edited && <span style={{ fontSize: '10px', opacity: 0.5 }}>(edited)</span>}
    </div>
  );
};

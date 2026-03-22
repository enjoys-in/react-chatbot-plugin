import React, { useState, useRef, useCallback } from 'react';
import type { CSSProperties } from 'react';
import type { FileUploadConfig } from '../types/config';
import { SendIcon, EmojiIcon } from './icons';
import { EmojiPicker } from './EmojiPicker';
import { FileUploadButton, FilePreviewList } from './FileUpload';

interface ChatInputProps {
  onSend: (text: string, files?: File[]) => void;
  placeholder?: string;
  primaryColor: string;
  isDark?: boolean;
  disabled?: boolean;
  styleOverride?: CSSProperties;
  enableEmoji?: boolean;
  fileUpload?: FileUploadConfig;
  onFileUpload?: (files: File[]) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = 'Type a message...',
  primaryColor,
  isDark = false,
  disabled,
  styleOverride,
  enableEmoji = false,
  fileUpload,
  onFileUpload,
}) => {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed && attachedFiles.length === 0) return;
    onSend(trimmed, attachedFiles.length > 0 ? attachedFiles : undefined);
    setText('');
    setAttachedFiles([]);
    inputRef.current?.focus();
  }, [text, attachedFiles, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleFiles = (files: File[]) => {
    setAttachedFiles((prev) => [...prev, ...files]);
    onFileUpload?.(files);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const hasContent = text.trim() || attachedFiles.length > 0;

  return (
    <div style={{ position: 'relative', ...styleOverride }}>
      {/* File preview above input */}
      {attachedFiles.length > 0 && (
        <FilePreviewList
          files={attachedFiles}
          onRemove={handleRemoveFile}
          primaryColor={primaryColor}
        />
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <EmojiPicker
          onSelect={handleEmojiSelect}
          onClose={() => setShowEmoji(false)}
          primaryColor={primaryColor}
        />
      )}

      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          background: isDark ? 'rgba(40, 40, 65, 0.5)' : 'rgba(245, 247, 252, 0.7)',
          borderRadius: '16px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '6px 6px 6px 12px',
        }}
      >
        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0, paddingBottom: '2px' }}>
          {enableEmoji && (
            <button
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              aria-label="Emoji"
              title="Emoji"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                color: showEmoji ? primaryColor : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'),
                borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <EmojiIcon size={20} />
            </button>
          )}

          {fileUpload?.enabled && (
            <FileUploadButton
              config={fileUpload}
              onFiles={handleFiles}
              selectedFiles={attachedFiles}
              onRemoveFile={handleRemoveFile}
              primaryColor={primaryColor}
            />
          )}
        </div>

        {/* Text Input */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            padding: '8px 2px',
            border: 'none',
            borderRadius: '12px',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            fontSize: '14px',
            lineHeight: '1.45',
            maxHeight: '100px',
            overflowY: 'auto',
            backgroundColor: 'transparent',
            color: isDark ? '#E0E0E0' : '#2D3436',
            letterSpacing: '0.01em',
          }}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || !hasContent}
          aria-label="Send message"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: hasContent
              ? `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, 30)} 100%)`
              : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
            color: hasContent ? '#fff' : (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'),
            border: 'none',
            cursor: hasContent ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: hasContent ? `0 4px 12px ${primaryColor}44` : 'none',
          }}
        >
          <SendIcon size={16} />
        </button>
      </div>
    </div>
  );
};

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

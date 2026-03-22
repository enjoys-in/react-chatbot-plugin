import React, { useState, useRef } from 'react';
import type { CSSProperties } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  primaryColor: string;
  disabled?: boolean;
  styleOverride?: CSSProperties;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = 'Type a message...',
  primaryColor,
  disabled,
  styleOverride,
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', ...styleOverride }}>
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
          padding: '10px 14px',
          border: '1px solid #E0E0E0',
          borderRadius: '20px',
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit',
          fontSize: '14px',
          lineHeight: '1.4',
          maxHeight: '100px',
          overflowY: 'auto',
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: text.trim() ? primaryColor : '#CCC',
          color: '#fff',
          border: 'none',
          cursor: text.trim() ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.15s ease',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};

import React from 'react';
import type { HeaderConfig } from '../types';
import type { ChatStyles as ThemeStyles } from '../styles/theme';

interface ChatHeaderProps {
  config: HeaderConfig;
  styles: ThemeStyles;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ config, styles, onClose }) => {
  return (
    <div style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
        {config.avatar && (
          <img
            src={config.avatar}
            alt=""
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>
            {config.title ?? 'Chat with us'}
          </div>
          {config.subtitle && (
            <div style={{ fontSize: '12px', opacity: 0.85 }}>{config.subtitle}</div>
          )}
        </div>
      </div>
      {config.showClose !== false && (
        <button
          onClick={onClose}
          aria-label="Close chat"
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

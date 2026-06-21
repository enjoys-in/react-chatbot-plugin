import React, { useState } from 'react';
import type { HeaderConfig } from '../types';
import type { ChatStyles as ThemeStyles } from '../styles/theme';
import { CloseIcon, MinimizeIcon, RestartIcon, SearchIcon } from './icons';
import { useChatContext } from '../context/ChatContext';

interface ChatHeaderProps {
  config: HeaderConfig;
  styles: ThemeStyles;
  onClose: () => void;
  onRestart?: () => void;
  logo?: string;
  logoWidth?: string;
  onSearchChange?: (query: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ config, styles, onClose, onRestart, logo, logoWidth, onSearchChange }) => {
  const { props: chatProps } = useChatContext();
  const icons = chatProps.icons;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSearch = () => {
    const next = !searchOpen;
    setSearchOpen(next);
    if (!next) { setSearchQuery(''); onSearchChange?.(''); }
  };

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    onSearchChange?.(val);
  };

  return (
    <div style={styles.header}>
      {/* Decorative glow overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, position: 'relative', zIndex: 1 }}>
        {config.avatar && (
          <div style={{ position: 'relative' }}>
            <img
              src={config.avatar}
              alt=""
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '10px',
                height: '10px',
                backgroundColor: '#2ECC71',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.8)',
              }}
            />
          </div>
        )}
        {logo && !config.avatar && (
          <img
            src={logo}
            alt=""
            style={{ width: logoWidth ?? '36px', height: 'auto', objectFit: 'contain', filter: 'brightness(1.1)' }}
          />
        )}
        {!config.avatar && !logo && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {(config.title ?? 'C').charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '-0.01em' }}>
            {config.title ?? 'Chat with us'}
          </div>
          {config.subtitle && (
            <div style={{
              fontSize: '12px',
              opacity: 0.8,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '1px',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#2ECC71',
                display: 'inline-block',
              }} />
              {config.subtitle}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', position: 'relative', zIndex: 1 }}>
        {chatProps.enableSearch && (
          <button
            onClick={toggleSearch}
            aria-label="Search messages"
            title="Search messages"
            style={{
              background: searchOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = searchOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)')}
          >
            {icons?.search ?? <SearchIcon size={15} />}
          </button>
        )}
        {config.showRestart && onRestart && (
          <button
            onClick={onRestart}
            aria-label="Restart conversation"
            title="Restart conversation"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            {icons?.restart ?? <RestartIcon size={16} />}
          </button>
        )}
        {config.showMinimize && (
          <button
            onClick={onClose}
            aria-label="Minimize chat"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            {icons?.minimize ?? <MinimizeIcon size={16} />}
          </button>
        )}
        {config.showClose !== false && (
          <button
            onClick={onClose}
            aria-label="Close chat"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            {icons?.close ?? <CloseIcon size={18} />}
          </button>
        )}
      </div>
      {/* Search bar */}
      {searchOpen && (
        <div style={{ position: 'absolute', bottom: '-40px', left: 0, right: 0, padding: '6px 12px', background: 'inherit', zIndex: 5 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Search messages..."
            autoFocus
            style={{
              width: '100%', padding: '6px 10px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.15)',
              color: 'inherit', fontSize: '13px', outline: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
};

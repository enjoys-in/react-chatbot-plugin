import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import type { HeaderConfig } from '../types';
import type { ChatStyles as ThemeStyles } from '../styles/theme';
import { contrastInk, headerInk, motion, neutrals, resolveTheme, typography } from '../styles/theme';
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
  /** When set, a back chevron appears on the left (used by the nav shell in a conversation). */
  onBack?: () => void;
}

/** Left-pointing chevron for the header back button. */
const BackChevron: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 36px ghost button with a hover plate — the only affordance in the header. */
const GhostButton: React.FC<{
  label: string;
  onClick: () => void;
  active?: boolean;
  hoverBg: string;
  color: string;
  children: React.ReactNode;
}> = ({ label, onClick, active, hoverBg, color, children }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '36px',
        height: '36px',
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        border: 'none',
        borderRadius: '10px',
        background: active || hover ? hoverBg : 'transparent',
        color,
        cursor: 'pointer',
        transition: `background-color ${motion.surface}`,
      }}
    >
      {children}
    </button>
  );
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({ config, styles, onClose, onRestart, logo, logoWidth, onSearchChange, onBack }) => {
  const { props: chatProps } = useChatContext();
  const icons = chatProps.icons;
  const theme = resolveTheme(chatProps.theme);
  const n = neutrals(theme.mode === 'dark');
  const hn = headerInk(theme);
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

  /** Intercom uses a squircle for team avatars, not a circle. */
  const avatarStyle: CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '16.7%',
    objectFit: 'cover',
    flex: '0 0 auto',
    display: 'block',
  };

  return (
    <div style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        {onBack && (
          <GhostButton label="Back" onClick={onBack} hoverBg={hn.hover} color={hn.icon}>
            <BackChevron />
          </GhostButton>
        )}
        {config.avatar && (
          <div style={{ position: 'relative', flex: '0 0 auto' }}>
            <img src={config.avatar} alt="" style={avatarStyle} />
            <span
              style={{
                position: 'absolute',
                bottom: '-1px',
                right: '-1px',
                width: '9px',
                height: '9px',
                backgroundColor: '#1FAD66',
                borderRadius: '50%',
                border: `2px solid ${theme.headerBg}`,
              }}
            />
          </div>
        )}
        {logo && !config.avatar && (
          <img
            src={logo}
            alt=""
            style={{ width: logoWidth ?? '32px', height: 'auto', objectFit: 'contain', flex: '0 0 auto' }}
          />
        )}
        {!config.avatar && !logo && (
          <div
            style={{
              ...avatarStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.primaryColor,
              color: contrastInk(theme.primaryColor, '#FFFFFF'),
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {(config.title ?? 'C').charAt(0).toUpperCase()}
          </div>
        )}

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              ...typography.title,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {config.title ?? 'Chat with us'}
          </div>
          {config.subtitle && (
            <div style={{
              ...typography.subtitle,
              marginTop: '2px',
              color: hn.muted,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {config.subtitle}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: '0 0 auto' }}>
        {chatProps.enableSearch && (
          <GhostButton
            label="Search messages"
            onClick={toggleSearch}
            active={searchOpen}
            hoverBg={hn.hover}
            color={hn.icon}
          >
            {icons?.search ?? <SearchIcon size={17} />}
          </GhostButton>
        )}
        {config.showRestart && onRestart && (
          <GhostButton label="Restart conversation" onClick={onRestart} hoverBg={hn.hover} color={hn.icon}>
            {icons?.restart ?? <RestartIcon size={17} />}
          </GhostButton>
        )}
        {config.showMinimize && (
          <GhostButton label="Minimize chat" onClick={onClose} hoverBg={hn.hover} color={hn.icon}>
            {icons?.minimize ?? <MinimizeIcon size={17} />}
          </GhostButton>
        )}
        {config.showClose !== false && (
          <GhostButton label="Close chat" onClick={onClose} hoverBg={hn.hover} color={hn.icon}>
            {icons?.close ?? <CloseIcon size={18} />}
          </GhostButton>
        )}
      </div>

      {/* Search bar — drops below the header, sharing its surface */}
      {searchOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '8px 16px',
            background: theme.headerBg,
            borderBottom: `1px solid ${n.hairline}`,
            zIndex: 5,
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Search messages"
            autoFocus
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '12px',
              border: 'none',
              background: theme.bubbleBg,
              color: n.ink,
              fontFamily: 'inherit',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}
    </div>
  );
};

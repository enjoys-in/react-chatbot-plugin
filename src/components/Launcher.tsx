import React from 'react';
import type { CSSProperties } from 'react';
import type { ChatStyles } from '../styles/theme';

interface LauncherProps {
  onClick: () => void;
  isOpen: boolean;
  position: 'bottom-right' | 'bottom-left';
  styles: ChatStyles;
  icon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  zIndex?: number;
}

export const Launcher: React.FC<LauncherProps> = ({
  onClick,
  isOpen,
  position,
  styles,
  icon,
  closeIcon,
  zIndex,
}) => {
  const posStyle: CSSProperties =
    position === 'bottom-left'
      ? { bottom: '20px', left: '20px' }
      : { bottom: '20px', right: '20px' };

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      style={{
        ...styles.launcher,
        ...posStyle,
        ...(zIndex != null ? { zIndex } : {}),
        transform: isOpen ? 'scale(0.9)' : 'scale(1)',
      }}
    >
      {isOpen
        ? closeIcon ?? <CloseIcon />
        : icon ?? <ChatIcon />}
    </button>
  );
};

const ChatIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

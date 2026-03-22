import React from 'react';
import type { CSSProperties } from 'react';
import type { ChatStyles } from '../styles/theme';
import { ChatBubbleIcon, CloseIcon } from './icons';

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
      ? { bottom: '24px', left: '24px' }
      : { bottom: '24px', right: '24px' };

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      style={{
        ...styles.launcher,
        ...posStyle,
        ...(zIndex != null ? { zIndex } : {}),
        transform: isOpen ? 'scale(0.92) rotate(90deg)' : 'scale(1)',
        animation: isOpen ? 'none' : 'cb-launcher-pulse 3s ease-in-out infinite',
      }}
    >
      {isOpen
        ? closeIcon ?? <CloseIcon size={22} />
        : icon ?? <ChatBubbleIcon size={26} />}
    </button>
  );
};

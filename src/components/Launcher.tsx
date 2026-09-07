import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import type { ChatStyles } from '../styles/theme';
import { ChatBubbleIcon, ChevronDownIcon } from './icons';
import { useChatContext } from '../context/ChatContext';

interface LauncherProps {
  onClick: () => void;
  isOpen: boolean;
  position: 'bottom-right' | 'bottom-left';
  styles: ChatStyles;
  icon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  zIndex?: number;
  /** Unread count shown as a badge while the window is closed. */
  unreadCount?: number;
}

export const Launcher: React.FC<LauncherProps> = ({
  onClick,
  isOpen,
  position,
  styles,
  icon,
  closeIcon,
  zIndex,
  unreadCount = 0,
}) => {
  const { props: chatProps } = useChatContext();
  const icons = chatProps.icons;
  const [hover, setHover] = useState(false);

  const posStyle: CSSProperties =
    position === 'bottom-left'
      ? { bottom: '20px', left: '20px' }
      : { bottom: '20px', right: '20px' };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      style={{
        ...styles.launcher,
        ...posStyle,
        ...(zIndex != null ? { zIndex } : {}),
        transform: hover ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Both marks stay mounted and crossfade, so the swap reads as one
          object turning rather than two icons blinking. */}
      <span className="cb-launcher-icon" data-state={isOpen ? 'hidden' : 'shown'} aria-hidden={isOpen}>
        {icon ?? icons?.chatBubble ?? <ChatBubbleIcon size={22} />}
      </span>
      <span className="cb-launcher-icon" data-state={isOpen ? 'shown' : 'hidden'} aria-hidden={!isOpen}>
        {closeIcon ?? icons?.close ?? <ChevronDownIcon size={24} />}
      </span>

      {!isOpen && unreadCount > 0 && (
        <span
          aria-label={`${unreadCount} unread`}
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            minWidth: '20px',
            height: '20px',
            padding: '0 5px',
            borderRadius: '10px',
            background: '#DF2020',
            color: '#FAFAFA',
            fontSize: '11px',
            fontWeight: 700,
            lineHeight: '20px',
            textAlign: 'center',
            boxShadow: '0 0 0 2px var(--cb-bg, #FFFFFF)',
            boxSizing: 'border-box',
          }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

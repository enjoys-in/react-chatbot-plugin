import React from 'react';
import type { CSSProperties } from 'react';
import type { LauncherNotificationConfig } from '../types/config';
import { CloseIcon } from './icons';
import { inkLayers, motion, typography } from '../styles/theme';

interface LauncherNotificationProps {
  config: LauncherNotificationConfig;
  onClick: () => void;
  onDismiss: () => void;
  isDark: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
  zIndex?: number;
}

/** Default avatar — a rounded dot-grid mark shown when no avatar is provided. */
const DefaultAvatar: React.FC<{ color: string }> = ({ color }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {[6, 12, 18].map((cy) =>
      [6, 12, 18].map((cx) =>
        (cx === 12 && cy === 12) ? null : (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2} fill={color} />
        ),
      ),
    )}
  </svg>
);

export const LauncherNotification: React.FC<LauncherNotificationProps> = ({
  config,
  onClick,
  onDismiss,
  isDark,
  primaryColor,
  position,
  zIndex,
}) => {
  const {
    heading,
    message,
    avatar,
    sender,
    timestamp = 'Just now',
    showClose = true,
    openOnClick = true,
    backgroundColor,
    textColor,
    maxWidth = '340px',
    style,
  } = config;

  const bg = backgroundColor ?? (isDark ? '#14161A' : '#FFFFFF');
  // Derived from `bg`, not from `isDark` — otherwise a custom backgroundColor
  // keeps the mode's ink and you get dark text on a dark brand colour.
  const layers = inkLayers(bg, isDark);
  const fg = textColor ?? layers.primary;
  const mutedFg = layers.muted;

  const posStyle: CSSProperties =
    position === 'bottom-left' ? { left: '24px' } : { right: '24px' };

  const cardStyle: CSSProperties = {
    position: 'fixed',
    bottom: '100px',
    ...posStyle,
    ...(zIndex != null ? { zIndex } : { zIndex: 9997 }),
    width: `min(${maxWidth}, calc(100vw - 48px))`,
    display: 'flex',
    gap: '12px',
    padding: '16px 16px 14px',
    borderRadius: '16px',
    background: bg,
    color: fg,
    border: `1px solid ${layers.border}`,
    boxShadow: layers.onDark
      ? '0 5px 40px rgba(9, 14, 21, 0.6)'
      : '0 5px 40px rgba(9, 14, 21, 0.16)',
    cursor: openOnClick ? 'pointer' : 'default',
    animation: `cb-notif-in ${motion.panel}`,
    ...style,
  };

  const renderAvatar = () => {
    if (typeof avatar === 'string') {
      return (
        <img
          src={avatar}
          alt={sender ?? 'avatar'}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />
      );
    }
    if (avatar) return <div style={{ flexShrink: 0 }}>{avatar}</div>;
    return (
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '16.7%',
          background: primaryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <DefaultAvatar color={inkLayers(primaryColor).primary} />
      </div>
    );
  };

  return (
    <div
      role={openOnClick ? 'button' : undefined}
      tabIndex={openOnClick ? 0 : undefined}
      onClick={() => openOnClick && onClick()}
      onKeyDown={(e) => {
        if (openOnClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      style={cardStyle}
    >
      {renderAvatar()}

      <div style={{ minWidth: 0, flex: 1 }}>
        {heading != null && (
          <div style={{ ...typography.title, marginBottom: 4 }}>{heading}</div>
        )}
        {message != null && (
          <div style={{ ...typography.body, color: mutedFg }}>{message}</div>
        )}
        {(sender || timestamp) && (
          <div style={{ ...typography.meta, color: mutedFg, marginTop: 8 }}>
            {sender ? `${sender} • ${timestamp}` : timestamp}
          </div>
        )}
      </div>

      {showClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="Dismiss notification"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 26,
            height: 26,
            borderRadius: '50%',
            border: 'none',
            background: layers.plate,
            color: fg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            transition: `background-color ${motion.surface}`,
          }}
        >
          <CloseIcon size={13} />
        </button>
      )}
    </div>
  );
};

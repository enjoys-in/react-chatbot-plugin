import React from 'react';
import type { CSSProperties } from 'react';
import type { NavTab, NavigationConfig } from '../types/navigation';
import type { ChatTheme } from '../types';
import { neutrals, typography } from '../styles/theme';

interface BottomNavProps {
  tabs: NavTab[];
  activeId: string;
  onChange: (id: string) => void;
  theme: Required<ChatTheme>;
  /** Appearance overrides from the navigation config. */
  config?: NavigationConfig;
}

const Badge: React.FC<{ value: number | boolean; color: string }> = ({ value, color }) => {
  if (value === false) return null;
  const dotOnly = value === true;
  return (
    <span
      style={{
        position: 'absolute',
        top: dotOnly ? 2 : -2,
        right: dotOnly ? 8 : 2,
        minWidth: dotOnly ? 8 : 16,
        height: dotOnly ? 8 : 16,
        padding: dotOnly ? 0 : '0 4px',
        borderRadius: 999,
        background: color,
        color: '#fff',
        fontSize: 10,
        fontWeight: 700,
        lineHeight: '16px',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      {dotOnly ? '' : value}
    </span>
  );
};

export const BottomNav: React.FC<BottomNavProps> = ({ tabs, activeId, onChange, theme, config }) => {
  const n = neutrals(theme.mode === 'dark');
  const activeColor = config?.activeColor ?? theme.primaryColor;
  const inactiveColor = config?.inactiveColor ?? n.inkMuted;
  const activeBg = config?.activeBackground ?? n.hover;
  const showIndicator = config?.indicator ?? false;

  return (
    <nav
      style={{
        display: 'flex',
        gap: 4,
        padding: 6,
        borderTop: `1px solid ${n.hairline}`,
        background: config?.background ?? n.surface,
        flexShrink: 0,
      }}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        const icon = active ? tab.activeIcon ?? tab.icon : tab.icon;
        const shared: CSSProperties = {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          padding: '8px 4px',
          border: 'none',
          borderRadius: 12,
          background: active ? activeBg : 'transparent',
          cursor: 'pointer',
          position: 'relative',
          color: active ? activeColor : inactiveColor,
          font: 'inherit',
          transition: 'background-color .15s, color .15s',
        };
        return (
          <button
            key={tab.id}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => onChange(tab.id)}
            style={shared}
          >
            {showIndicator && active && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 22,
                  height: 3,
                  borderRadius: 999,
                  background: activeColor,
                }}
              />
            )}
            {icon != null && (
              <span style={{ position: 'relative', display: 'flex', fontSize: 20, lineHeight: 1 }}>
                {icon}
                {tab.badge != null && <Badge value={tab.badge} color={theme.primaryColor} />}
              </span>
            )}
            <span style={{ ...typography.meta, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

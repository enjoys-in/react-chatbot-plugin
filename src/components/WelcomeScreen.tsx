import React from 'react';
import type { ReactNode } from 'react';

interface WelcomeScreenProps {
  content: ReactNode;
  onDismiss: () => void;
  primaryColor: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ content, onDismiss, primaryColor }) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        background: 'linear-gradient(180deg, rgba(248, 249, 254, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
      }}
    >
      <div style={{ flex: 1, padding: '28px 24px', overflow: 'auto' }}>
        {content}
      </div>
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onDismiss}
          style={{
            width: '100%',
            padding: '14px',
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, 30)} 100%)`,
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
            boxShadow: `0 6px 20px ${primaryColor}44`,
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 8px 28px ${primaryColor}55`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${primaryColor}44`;
          }}
        >
          Start Chat
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

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
      }}
    >
      <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
        {content}
      </div>
      <div style={{ padding: '12px 16px', borderTop: '1px solid #E8E8E8', flexShrink: 0 }}>
        <button
          onClick={onDismiss}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: primaryColor,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

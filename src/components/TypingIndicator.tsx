import React from 'react';

interface TypingIndicatorProps {
  color: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ color }) => {
  const dotStyle: React.CSSProperties = {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: color,
    opacity: 0.35,
    animation: 'cb-typing-bounce 1.4s infinite ease-in-out',
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '5px',
        padding: '14px 18px',
        background: 'rgba(241, 243, 249, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '18px 18px 18px 4px',
        alignSelf: 'flex-start',
        alignItems: 'center',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        animation: 'cb-fade-in 0.3s ease-out',
      }}
    >
      <span style={{ ...dotStyle, animationDelay: '0s' }} />
      <span style={{ ...dotStyle, animationDelay: '0.2s' }} />
      <span style={{ ...dotStyle, animationDelay: '0.4s' }} />
    </div>
  );
};

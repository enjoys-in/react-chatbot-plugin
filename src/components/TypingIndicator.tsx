import React from 'react';

interface TypingIndicatorProps {
  color: string;
  /** Bubble fill — defaults to the themed bot bubble. */
  background?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ color, background }) => {
  const dotStyle: React.CSSProperties = {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: color,
    opacity: 0.3,
    animation: 'cb-typing-bounce 1.2s infinite ease-in-out',
  };

  return (
    <div
      data-cb-animate
      style={{
        display: 'flex',
        gap: '4px',
        padding: '15px 16px',
        background: background ?? 'var(--cb-bubble-bg, #F5F5F5)',
        borderRadius: '20px',
        alignSelf: 'flex-start',
        alignItems: 'center',
        animation: 'cb-fade-in 0.2s ease-out',
      }}
    >
      <span style={{ ...dotStyle, animationDelay: '0s' }} />
      <span style={{ ...dotStyle, animationDelay: '0.16s' }} />
      <span style={{ ...dotStyle, animationDelay: '0.32s' }} />
    </div>
  );
};

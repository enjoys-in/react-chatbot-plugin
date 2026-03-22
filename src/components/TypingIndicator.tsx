import React from 'react';

interface TypingIndicatorProps {
  color: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ color }) => {
  const dotStyle: React.CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: color,
    opacity: 0.4,
    animation: 'chatbot-typing-bounce 1.4s infinite ease-in-out',
  };

  return (
    <>
      <style>{`
        @keyframes chatbot-typing-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '12px 16px',
          backgroundColor: '#F1F1F1',
          borderRadius: '16px 16px 16px 4px',
          alignSelf: 'flex-start',
          alignItems: 'center',
        }}
      >
        <span style={{ ...dotStyle, animationDelay: '0s' }} />
        <span style={{ ...dotStyle, animationDelay: '0.2s' }} />
        <span style={{ ...dotStyle, animationDelay: '0.4s' }} />
      </div>
    </>
  );
};

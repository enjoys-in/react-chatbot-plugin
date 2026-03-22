import React from 'react';
import type { FlowQuickReply } from '../types';

interface QuickRepliesProps {
  replies: FlowQuickReply[];
  onSelect: (value: string, label: string) => void;
  primaryColor: string;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onSelect, primaryColor }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignSelf: 'flex-start',
        maxWidth: '90%',
        animation: 'cb-slide-up 0.35s ease-out',
        padding: '4px 0',
      }}
    >
      {replies.map((reply) => (
        <button
          key={reply.value}
          onClick={() => onSelect(reply.value, reply.label)}
          style={{
            padding: '8px 18px',
            borderRadius: '22px',
            border: `1.5px solid ${primaryColor}`,
            backgroundColor: 'rgba(108, 92, 231, 0.06)',
            color: primaryColor,
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'inherit',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primaryColor;
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 4px 14px ${primaryColor}44`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(108, 92, 231, 0.06)';
            e.currentTarget.style.color = primaryColor;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
};

import React from 'react';
import type { FlowQuickReply } from '../types';

interface QuickRepliesProps {
  replies: FlowQuickReply[];
  onSelect: (value: string, label: string) => void;
  primaryColor: string;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onSelect, primaryColor }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignSelf: 'flex-start', maxWidth: '90%' }}>
      {replies.map((reply) => (
        <button
          key={reply.value}
          onClick={() => onSelect(reply.value, reply.label)}
          style={{
            padding: '6px 14px',
            borderRadius: '18px',
            border: `1px solid ${primaryColor}`,
            backgroundColor: 'transparent',
            color: primaryColor,
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primaryColor;
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = primaryColor;
          }}
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
};

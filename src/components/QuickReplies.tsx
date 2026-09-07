import React from 'react';
import type { FlowQuickReply } from '../types';
import { motion, typography } from '../styles/theme';

interface QuickRepliesProps {
  replies: FlowQuickReply[];
  onSelect: (value: string, label: string) => void;
  primaryColor: string;
}

/** Outlined pills that fill on hover — the suggestion, not the answer, so they
 *  stay quieter than a sent message. */
export const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onSelect, primaryColor }) => {
  return (
    <div
      data-cb-animate
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignSelf: 'flex-start',
        maxWidth: '90%',
        animation: `cb-slide-up ${motion.enter}`,
      }}
    >
      {replies.map((reply) => (
        <button
          key={reply.value}
          onClick={() => onSelect(reply.value, reply.label)}
          style={{
            padding: '9px 16px',
            borderRadius: '10px',
            border: '1px solid var(--cb-border, rgba(9, 14, 21, 0.14))',
            backgroundColor: 'transparent',
            color: 'var(--cb-ink, #14161A)',
            cursor: 'pointer',
            ...typography.body,
            fontWeight: 500,
            fontFamily: 'inherit',
            transition: `background-color ${motion.control}, color ${motion.control}, border-color ${motion.control}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primaryColor;
            e.currentTarget.style.borderColor = primaryColor;
            e.currentTarget.style.color = 'var(--cb-user-bubble-text, #FAFAFA)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--cb-border, rgba(9, 14, 21, 0.14))';
            e.currentTarget.style.color = 'var(--cb-ink, #14161A)';
          }}
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
};

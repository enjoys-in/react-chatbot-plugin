import React from 'react';
import type { ChatMessage, FlowQuickReply } from '@enjoys/react-chatbot-plugin';
import type { DemoConfig } from './types';

// ─── Custom Bubble — adds avatars + timestamps ──────────────────

const CustomBubble: React.FC<{ message: ChatMessage; styles: Record<string, React.CSSProperties> }> = ({ message }) => {
    const isBot = message.sender === 'bot';
    const isSystem = message.sender === 'system';
    if (!message.text) return null;

    if (isSystem) {
        return (
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#999', padding: '4px 0' }}>
                {message.text}
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-end',
                flexDirection: isBot ? 'row' : 'row-reverse',
                animation: 'cb-fade-in 0.3s ease-out',
            }}
        >
            {/* Avatar */}
            <div
                style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isBot
                        ? 'linear-gradient(135deg, #6C5CE7, #A29BFE)'
                        : 'linear-gradient(135deg, #00b894, #55efc4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0,
                }}
            >
                {isBot ? '🤖' : '👤'}
            </div>

            {/* Bubble */}
            <div
                style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    background: isBot
                        ? 'rgba(108, 92, 231, 0.08)'
                        : 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
                    color: isBot ? '#2D3436' : '#fff',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    border: isBot ? '1px solid rgba(108,92,231,0.12)' : 'none',
                    boxShadow: isBot ? 'none' : '0 2px 8px rgba(108,92,231,0.25)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}
            >
                <span>{message.text}</span>
                <div
                    style={{
                        fontSize: '10px',
                        opacity: 0.5,
                        marginTop: '4px',
                        textAlign: isBot ? 'left' : 'right',
                    }}
                >
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

// ─── Custom Quick Replies — pill-shaped with gradient hover ──────

const CustomQuickReplies: React.FC<{ replies: FlowQuickReply[]; onSelect: (v: string, l: string) => void }> = ({ replies, onSelect }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                padding: '6px 0 2px 36px',
                animation: 'cb-slide-up 0.35s ease-out',
            }}
        >
            {replies.map((r) => (
                <button
                    key={r.value}
                    onClick={() => onSelect(r.value, r.label)}
                    style={{
                        padding: '6px 16px',
                        borderRadius: '20px',
                        border: '2px solid #6C5CE7',
                        background: 'transparent',
                        color: '#6C5CE7',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #6C5CE7, #A29BFE)';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(108,92,231,0.35)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6C5CE7';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {r.label}
                </button>
            ))}
        </div>
    );
};

// ─── Custom Typing Indicator — pulsing bar ───────────────────────

const CustomTypingIndicator: React.FC<{ color: string }> = ({ color }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 0 8px 36px',
                animation: 'cb-fade-in 0.3s ease-out',
            }}
        >
            <div
                style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${color}, #A29BFE)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                }}
            >
                🤖
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: '4px',
                    padding: '10px 16px',
                    background: 'rgba(108,92,231,0.08)',
                    borderRadius: '16px 16px 16px 4px',
                    border: '1px solid rgba(108,92,231,0.12)',
                }}
            >
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: color,
                            opacity: 0.4,
                            animation: `cb-typing-bounce 1.4s infinite ease-in-out ${i * 0.2}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// ─── Demo Config ─────────────────────────────────────────────────

const demo: DemoConfig = {

    id: 'customize-chat',
    title: 'Customize Chat Slots',
    description: 'Override message bubbles, quick replies, and typing indicator with custom React components via customizeChat.',
    icon: '🎨',
    category: 'components',
    customizeChat: {
        messageBubble: { component: CustomBubble },
        quickReplies: { component: CustomQuickReplies },
        typingIndicator: { component: CustomTypingIndicator },
    },
    flow: {
        startStep: 'welcome',
        steps: [
            {
                id: 'welcome',
                message: 'Hey! 👋 Notice the custom bubbles with avatars and timestamps.',
                quickReplies: [
                    { label: '🎨 Cool design!', value: 'cool', next: 'thanks' },
                    { label: '📦 How does it work?', value: 'how', next: 'explain' },
                    { label: '🛠 Show more', value: 'more', next: 'more' },
                ],
            },
            {
                id: 'thanks',
                message: 'Thanks! The customizeChat prop lets you swap any UI component. Forms and step components stay untouched.',
                next: 'try_input',
            },
            {
                id: 'explain',
                message: 'Just pass a customizeChat object with component keys:\n\n• messageBubble — replaces all bubbles\n• quickReplies — replaces reply buttons\n• typingIndicator — replaces the dots',
                next: 'try_input',
            },
            {
                id: 'more',
                message: 'You can also override: header, input, branding, launcher, welcomeScreen, and loginScreen — all via the same customizeChat prop!',
                next: 'try_input',
            },
            {
                id: 'try_input',
                message: 'Try typing something — your message will use the custom user bubble too!',
                quickReplies: [
                    { label: '🔁 Restart', value: 'restart', next: 'welcome' },
                ],
            },
        ],
    },
    fallbackMessage: 'Nice message! Notice how both bot and user bubbles are custom. Type /restart to try again.',
    typingDelay: 500,
};

export default demo;

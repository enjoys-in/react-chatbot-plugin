import React from 'react';
import { Robot } from '@phosphor-icons/react';
import type { DemoConfig } from './types';
import type { HomeScreenContext } from '@enjoys/react-chatbot-plugin';

// ─── Inline glyphs (no deps) ─────────────────────────────────────

const Glyph: React.FC<{ d: string }> = ({ d }) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HomeGlyph = () => <Glyph d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9.5Z" />;
const ChatGlyph = () => <Glyph d="M21 12a8 8 0 0 1-8 8H8l-5 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" />;
const HelpGlyph = () => <Glyph d="M9.6 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2-2.5 3.6M12 17.6h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />;
const NewsGlyph = () => <Glyph d="M4 5h13v14H5a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Zm13 3h2a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2M7 9h7M7 13h7" />;

// ─── Custom tab panels — each receives HomeScreenContext ─────────

const panelWrap: React.CSSProperties = { padding: 16, display: 'grid', gap: 12, overflowY: 'auto' };
const card: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  border: '1px solid var(--cb-border, rgba(9,14,21,0.12))',
  background: 'var(--cb-branding-bg, #fafaff)',
};

const HelpPanel: React.FC<HomeScreenContext> = ({ sendMessage }) => (
  <div style={panelWrap}>
    <h3 style={{ margin: 0, fontSize: 15 }}>Help center</h3>
    {['How do I reset my password?', 'Where is my invoice?', 'How do refunds work?'].map((q) => (
      <button
        key={q}
        type="button"
        onClick={() => sendMessage(q)}
        style={{ ...card, textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit' }}
      >
        {q}
      </button>
    ))}
  </div>
);

const NewsPanel: React.FC<HomeScreenContext> = () => (
  <div style={panelWrap}>
    <h3 style={{ margin: 0, fontSize: 15 }}>What's new</h3>
    <div style={card}>
      <strong>🎉 Voice calling</strong>
      <p style={{ margin: '6px 0 0', fontSize: 13, opacity: 0.75 }}>Start a call with us right from the chat.</p>
    </div>
    <div style={card}>
      <strong>🏠 New Home screen</strong>
      <p style={{ margin: '6px 0 0', fontSize: 13, opacity: 0.75 }}>Jump to what you need with the tabs below.</p>
    </div>
  </div>
);

// ─── Demo config ─────────────────────────────────────────────────

export const messengerNavDemo: DemoConfig = {
  id: 'messenger-nav',
  title: 'Messenger Shell',
  description:
    'A multi-screen shell with a bottom tab bar — Home, Messages, and your own custom tabs (Help, News). Powered by the navigation prop.',
  icon: 'house',
  category: 'components',

  botAvatar: <Robot size={16} weight="fill" color="#fff" />,

  homeScreen: {
    greeting: 'Hi there 👋',
    tagline: 'How can we help?',
    actions: [
      { id: 'chat', label: 'Send us a message', description: 'We usually reply in a few minutes', icon: <ChatGlyph />, message: 'Hello!' },
      { id: 'order', label: 'Track an order', icon: <HomeGlyph />, stepId: 'order' },
    ],
    cta: { label: 'Ask a question' },
  },

  navigation: {
    defaultTab: 'home',
    // Fully customizable selected-tab look:
    activeColor: '#6C5CE7',
    activeBackground: 'rgba(108,92,231,0.12)',
    indicator: true,
    tabs: [
      { id: 'home', label: 'Home', icon: <HomeGlyph /> },
      { id: 'messages', label: 'Messages', icon: <ChatGlyph />, badge: 1 },
      { id: 'help', label: 'Help', icon: <HelpGlyph />, component: HelpPanel },
      { id: 'news', label: 'News', icon: <NewsGlyph />, badge: true, component: NewsPanel },
    ],
  },

  flow: {
    startStep: 'root',
    steps: [
      {
        id: 'root',
        message: 'What can I help with?',
        quickReplies: [
          { label: 'Track an order', value: 'order', next: 'order' },
          { label: 'Talk to sales', value: 'sales', next: 'sales' },
        ],
      },
      { id: 'order', message: 'Sure — what is your order number?', next: 'orderDone' },
      { id: 'orderDone', message: 'Thanks! It is out for delivery and arrives tomorrow.' },
      { id: 'sales', message: 'Our team will reach out shortly. 🎉' },
    ],
  },
};

export default messengerNavDemo;

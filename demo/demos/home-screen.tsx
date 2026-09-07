import React, { useState } from 'react';
import type { DemoConfig } from './types';
import type { HomeScreenContext } from '@enjoys/react-chatbot-plugin';

// ─── Icons for the action rows ───────────────────────────────────
// Any ReactNode works — these are inline SVGs so the demo pulls no deps.

const Glyph: React.FC<{ d: string }> = ({ d }) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChatGlyph = () => <Glyph d="M21 12a8 8 0 0 1-8 8H8l-5 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" />;
const PhoneGlyph = () => <Glyph d="M15.5 20.5A13 13 0 0 1 3.5 8.5 3 3 0 0 1 6.4 5l1.7 3.4-2 1.6a9.6 9.6 0 0 0 4.9 4.9l1.6-2 3.4 1.7a3 3 0 0 1-.5 3.4Z" />;
const BoxGlyph = () => <Glyph d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Zm0 0L12 12m0 0 8.5-4.5M12 12v9" />;
const CardGlyph = () => <Glyph d="M2.5 9.5h19M4.5 5.5h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />;
const HelpGlyph = () => <Glyph d="M9.6 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2-2.5 3.6M12 17.6h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />;

// ─── A component the host app supplies, dropped into a shell ─────

const SERVICES = [
  ['API', 'Operational', '#1FAD66'],
  ['Dashboard', 'Operational', '#1FAD66'],
  ['Webhooks', 'Degraded', '#D98A00'],
  ['Search', 'Operational', '#1FAD66'],
] as const;

/** Uses `useState`, which is the point: sections are rendered as real
 *  components, so hooks work normally inside them. */
const StatusPanel: React.FC<HomeScreenContext> = ({ sendMessage }) => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? SERVICES : SERVICES.slice(0, 2);

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {shown.map(([name, state, color]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flex: '0 0 auto' }} />
          <span style={{ flex: 1 }}>{name}</span>
          <span style={{ color: 'var(--cb-ink-muted, #6C6F74)', fontSize: 13 }}>{state}</span>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
        <button type="button" onClick={() => setExpanded((v) => !v)} style={ghostBtn}>
          {expanded ? 'Show less' : `Show all ${SERVICES.length}`}
        </button>
        <button type="button" onClick={() => sendMessage('What is affecting webhooks?')} style={ghostBtn}>
          Ask about webhooks
        </button>
      </div>
    </div>
  );
};

const ghostBtn: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid var(--cb-border, rgba(9,14,21,0.14))',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  fontSize: 13,
  cursor: 'pointer',
};

// A bare section — no shell, the component owns its whole box.
const OfferBanner: React.FC<HomeScreenContext> = ({ goToStep }) => (
  <button
    type="button"
    onClick={() => goToStep('billing')}
    style={{
      width: '100%',
      textAlign: 'left',
      padding: 14,
      borderRadius: 16,
      border: '1px dashed var(--cb-border, rgba(9,14,21,0.14))',
      background: 'transparent',
      color: 'inherit',
      font: 'inherit',
      cursor: 'pointer',
    }}
  >
    <strong style={{ fontSize: 14 }}>Annual billing saves two months</strong>
    <div style={{ fontSize: 13, color: 'var(--cb-ink-muted, #6C6F74)', marginTop: 2 }}>
      Tap to talk to billing →
    </div>
  </button>
);

export const homeScreenDemo: DemoConfig = {
  id: 'home-screen',
  title: 'Home Screen',
  description:
    'The default screen: five icon actions, a custom accessory, and your own components in card shells (one shelled, one bare).',
  icon: 'house',
  category: 'components',

  homeScreen: {
    greeting: 'Hi there 👋',
    tagline: 'How can we help?',
    actions: [
      { id: 'chat', label: 'Start a conversation', description: 'We usually reply in a few minutes', icon: <ChatGlyph />, message: 'Hello!' },
      { id: 'call', label: 'Call us', description: 'Mon–Fri, 9am–6pm', icon: <PhoneGlyph />, href: 'tel:+15550123' },
      { id: 'order', label: 'Track an order', icon: <BoxGlyph />, stepId: 'order' },
      { id: 'billing', label: 'Billing question', icon: <CardGlyph />, stepId: 'billing' },
      {
        id: 'help',
        label: 'Browse help articles',
        icon: <HelpGlyph />,
        // A custom trailing accessory instead of the default chevron.
        accessory: <span style={{ fontSize: 12, color: 'var(--cb-ink-muted, #6C6F74)' }}>48 articles</span>,
        onSelect: (ctx) => ctx.sendMessage('Show me the help centre'),
      },
    ],
    sections: [
      { id: 'offer', component: OfferBanner, shell: false, placement: 'above' },
      { id: 'status', title: 'System status', component: StatusPanel },
    ],
    cta: { label: 'Ask a question' },
  },

  flow: {
    startStep: 'root',
    steps: [
      {
        id: 'root',
        message: 'What can I help with?',
        quickReplies: [
          { label: 'Track an order', value: 'order', next: 'order' },
          { label: 'Billing', value: 'billing', next: 'billing' },
        ],
      },
      {
        id: 'order',
        message: 'Sure — what is your order number?',
        input: { placeholder: 'e.g. AC-10293' },
        next: 'orderDone',
      },
      {
        id: 'orderDone',
        message: 'Thanks! Order {{order}} is out for delivery and arrives tomorrow.',
      },
      {
        id: 'billing',
        message: 'Happy to help with billing. Switch to annual, or see an invoice?',
        quickReplies: [
          { label: 'Switch to annual', value: 'annual', next: 'annual' },
          { label: 'See an invoice', value: 'invoice', next: 'invoice' },
        ],
      },
      { id: 'annual', message: 'Done — annual billing saves you two months. Want me to apply it?' },
      { id: 'invoice', message: 'Your latest invoice is dated 1 September. Shall I email it?' },
    ],
  },
};

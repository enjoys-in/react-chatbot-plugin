import React from 'react';
import type { StepComponentProps } from '@enjoys/react-chatbot-plugin';
import type { DemoConfig } from './types';

// ─── Custom Component: Plan Selector ─────────────────────────────

const PlanSelector: React.FC<StepComponentProps> = ({ data, onComplete }) => {
  const plans = [
    { id: 'basic', name: 'Basic', price: '$9/mo', color: '#00b894', features: ['5 Projects', '1 GB Storage', 'Email Support'] },
    { id: 'pro', name: 'Pro', price: '$29/mo', color: '#6C5CE7', features: ['Unlimited Projects', '50 GB Storage', 'Priority Support'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', color: '#e17055', features: ['Everything in Pro', 'SSO & SAML', 'Dedicated Manager'] },
  ];

  return (
    <div style={{ padding: '12px', background: 'rgba(108,92,231,0.05)', borderRadius: '16px', border: '1px solid rgba(108,92,231,0.12)' }}>
      <p style={{ fontWeight: 600, marginBottom: '10px', fontSize: '14px', color: '#2D3436' }}>
        Hi {(data?.name as string) || 'there'}! Choose a plan:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => onComplete({ status: 'success', data: { plan: plan.id, planName: plan.name }, next: `plan_${plan.id}` })}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', background: '#fff', border: `2px solid ${plan.color}22`,
              borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px',
            }}
          >
            <span><strong>{plan.name}</strong> — {plan.features[0]}</span>
            <span style={{ fontWeight: 700, color: plan.color }}>{plan.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Custom Component: Star Rating ───────────────────────────────

const StarRating: React.FC<StepComponentProps> = ({ onComplete }) => {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);

  return (
    <div style={{ background: 'rgba(108,92,231,0.05)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(108,92,231,0.12)', textAlign: 'center' }}>
      <p style={{ fontWeight: 600, marginBottom: '8px', color: '#2D3436', fontSize: '14px' }}>Rate your experience</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{ fontSize: '32px', cursor: 'pointer', transition: 'transform 0.15s', transform: (hover || rating) >= star ? 'scale(1.1)' : 'scale(0.9)', opacity: (hover || rating) >= star ? 1 : 0.25 }}
          >
            ⭐
          </span>
        ))}
      </div>
      <p style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
        {rating === 0 ? 'Click a star' : `You selected ${rating} star${rating > 1 ? 's' : ''}`}
      </p>
      <button
        disabled={!rating}
        onClick={() => onComplete({
          status: rating >= 4 ? 'positive' : rating >= 2 ? 'neutral' : 'negative',
          data: { rating },
          next: rating >= 4 ? 'review_good' : rating >= 2 ? 'review_ok' : 'review_bad',
        })}
        style={{
          padding: '8px 24px', borderRadius: '20px', border: 'none',
          background: rating ? 'linear-gradient(135deg, #6C5CE7, #A29BFE)' : '#ddd',
          color: '#fff', fontWeight: 600, fontSize: '13px', cursor: rating ? 'pointer' : 'default',
        }}
      >
        Submit
      </button>
    </div>
  );
};

// ─── Custom Component: Color Picker ──────────────────────────────

const ColorPicker: React.FC<StepComponentProps> = ({ onComplete }) => {
  const colors = [
    { name: 'Purple', hex: '#6C5CE7' }, { name: 'Blue', hex: '#0984e3' },
    { name: 'Green', hex: '#00b894' }, { name: 'Orange', hex: '#e17055' },
    { name: 'Pink', hex: '#fd79a8' }, { name: 'Teal', hex: '#00cec9' },
  ];

  return (
    <div style={{ background: 'rgba(108,92,231,0.05)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(108,92,231,0.12)' }}>
      <p style={{ fontWeight: 600, marginBottom: '10px', fontSize: '14px', color: '#2D3436' }}>Pick your favorite color:</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {colors.map((c) => (
          <button
            key={c.hex}
            onClick={() => onComplete({ status: 'success', data: { color: c.hex, colorName: c.name } })}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              padding: '12px 8px', background: '#fff', border: '1px solid #eee',
              borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.hex }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#666' }}>{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const demo: DemoConfig = {
  id: 'custom-components',
  title: 'Custom Step Components',
  description: 'Render interactive React widgets inside flow steps: plan selector, star rating, color picker.',
  icon: '🧩',
  category: 'components',
  flow: {
    startStep: 'start',
    steps: [
      {
        id: 'start',
        message: "This demo shows custom React components embedded in flow steps. Choose one:",
        quickReplies: [
          { label: '💳 Plan Selector', value: 'plan', next: 'plan_step' },
          { label: '⭐ Star Rating', value: 'rating', next: 'rating_step' },
          { label: '🎨 Color Picker', value: 'color', next: 'color_step' },
        ],
      },

      // Plan Selector
      { id: 'plan_step', message: "Select a plan using the interactive widget:", component: 'PlanSelector' },
      { id: 'plan_basic', message: "You chose **Basic** — perfect for getting started! 🚀", quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'start' }] },
      { id: 'plan_pro', message: "You chose **Pro** — unlimited power! ⚡", quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'start' }] },
      { id: 'plan_enterprise', message: "You chose **Enterprise** — the full package! 🏢", quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'start' }] },

      // Star Rating
      { id: 'rating_step', message: "Rate your experience with the star widget:", component: 'StarRating' },
      { id: 'review_good', message: "Glad you love it! Thanks for 4-5 stars! 🌟", quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'start' }] },
      { id: 'review_ok', message: "Thanks for the honest feedback! We'll keep improving. 💪", quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'start' }] },
      { id: 'review_bad', message: "Sorry to hear that. We'll work hard to do better. 🤝", quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'start' }] },

      // Color Picker
      { id: 'color_step', message: "Pick your favorite color:", component: 'ColorPicker' },
      { id: 'color_done', message: "Great taste! Your preference has been saved. 🎨", quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'start' }] },
    ],
  },
  components: {
    PlanSelector,
    StarRating,
    ColorPicker,
  },
};

export default demo;

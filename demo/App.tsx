import React from 'react';
import { ChatBot, analyticsPlugin } from '@enjoys/react-chatbot-plugin';
import type { FlowConfig, FormConfig, StepComponentProps, FlowActionResult } from '@enjoys/react-chatbot-plugin';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Custom Component: Account Plan Selector ─────────────────────

const AccountSelector: React.FC<StepComponentProps> = ({ data, onComplete }) => {
  const plans = [
    { id: 'basic', name: 'Basic', price: '$9/mo', features: ['5 Projects', '1 GB Storage', 'Email Support'] },
    { id: 'pro', name: 'Pro', price: '$29/mo', features: ['Unlimited Projects', '50 GB Storage', 'Priority Support'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'SSO & SAML', 'Dedicated Manager'] },
  ];

  return (
    <div style={{ background: 'rgba(108,92,231,0.06)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(108,92,231,0.15)' }}>
      <p style={{ fontWeight: 600, marginBottom: '12px', color: '#2D3436' }}>
        Hi {(data?.name as string) || 'there'}! Choose a plan:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => onComplete({ status: 'success', data: { plan: plan.id }, next: `plan_${plan.id}` })}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', background: '#fff', border: '1px solid rgba(108,92,231,0.2)',
              borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
              fontSize: '13px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = '#6C5CE7')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(108,92,231,0.2)')}
          >
            <span><strong>{plan.name}</strong> — {plan.features[0]}</span>
            <span style={{ fontWeight: 700, color: '#6C5CE7' }}>{plan.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Custom Component: Satisfaction Survey ───────────────────────

const SatisfactionSurvey: React.FC<StepComponentProps> = ({ onComplete }) => {
  const [rating, setRating] = React.useState(0);

  return (
    <div style={{ background: 'rgba(108,92,231,0.06)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(108,92,231,0.15)', textAlign: 'center' }}>
      <p style={{ fontWeight: 600, marginBottom: '8px', color: '#2D3436' }}>How was your experience?</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{ fontSize: '28px', cursor: 'pointer', opacity: star <= rating ? 1 : 0.3, transition: 'opacity 0.2s' }}
          >
            ⭐
          </span>
        ))}
      </div>
      <button
        disabled={rating === 0}
        onClick={() => onComplete({
          status: rating >= 4 ? 'positive' : rating >= 2 ? 'neutral' : 'negative',
          data: { satisfaction: rating },
          next: rating >= 4 ? 'survey_positive' : rating >= 2 ? 'survey_neutral' : 'survey_negative',
        })}
        style={{
          padding: '8px 24px', borderRadius: '20px', border: 'none', cursor: rating > 0 ? 'pointer' : 'default',
          background: rating > 0 ? 'linear-gradient(135deg, #6C5CE7, #A29BFE)' : '#ccc',
          color: '#fff', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
        }}
      >
        Submit Rating
      </button>
    </div>
  );
};

// ─── Sample Login Form ───────────────────────────────────────────

const loginForm: FormConfig = {
  id: 'login',
  title: 'Welcome! Please introduce yourself',
  fields: [
    { name: 'name', type: 'text', label: 'Your Name', placeholder: 'John Doe', required: true },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'john@example.com', required: true },
  ],
  submitLabel: 'Start Chat',
};

// ─── Sample Conversation Flow (JSON) ─────────────────────────────

const sampleFlow: FlowConfig = {
  startStep: 'greeting',
  steps: [
    {
      id: 'greeting',
      message: "Hi there! 👋 How can I help you today?",
      quickReplies: [
        { label: '💬 Sales', value: 'sales', next: 'sales' },
        { label: '🛠 Support', value: 'support', next: 'support' },
        { label: '📋 Feedback', value: 'feedback', next: 'feedback_form' },
        { label: '🔬 Demo Features', value: 'demo', next: 'demo_menu' },
      ],
    },
    {
      id: 'sales',
      message: "Great! Let me know what you're interested in.",
      quickReplies: [
        { label: 'Pricing', value: 'pricing', next: 'pricing' },
        { label: 'Enterprise', value: 'enterprise', next: 'enterprise' },
      ],
    },
    {
      id: 'pricing',
      messages: [
        "Our plans start at $29/month for individuals.",
        "Teams get a 20% discount. Want me to connect you with sales?",
      ],
      quickReplies: [
        { label: 'Yes, connect me', value: 'yes', next: 'connect_sales' },
        { label: 'No thanks', value: 'no', next: 'goodbye' },
      ],
    },
    {
      id: 'enterprise',
      message: "For enterprise, we offer custom solutions. Let me collect some info.",
      next: 'enterprise_form',
    },
    {
      id: 'enterprise_form',
      message: "Please fill out this form:",
      form: {
        id: 'enterprise-inquiry',
        title: 'Enterprise Inquiry',
        fields: [
          { name: 'company', type: 'text', label: 'Company Name', required: true },
          { name: 'size', type: 'select', label: 'Team Size', required: true, options: [
            { label: '1-10', value: '1-10' },
            { label: '11-50', value: '11-50' },
            { label: '51-200', value: '51-200' },
            { label: '200+', value: '200+' },
          ]},
          { name: 'needs', type: 'textarea', label: 'Your Needs', placeholder: 'Tell us what you need...' },
        ],
        submitLabel: 'Submit Inquiry',
      },
      next: 'connect_sales',
    },
    {
      id: 'connect_sales',
      message: "Thank you! Our sales team will reach out shortly. 🎉",
      next: 'goodbye',
    },
    {
      id: 'support',
      message: "Sure! What kind of issue are you facing?",
      quickReplies: [
        { label: 'Bug Report', value: 'bug', next: 'bug_form' },
        { label: 'Account Issue', value: 'account', next: 'account_help' },
        { label: 'Other', value: 'other', next: 'general_support' },
      ],
    },
    {
      id: 'bug_form',
      message: "Please describe the bug:",
      form: {
        id: 'bug-report',
        title: 'Bug Report',
        description: 'Help us fix this faster by providing details',
        fields: [
          { name: 'title', type: 'text', label: 'Bug Title', required: true },
          { name: 'severity', type: 'radio', label: 'Severity', required: true, options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
            { label: 'Critical', value: 'critical' },
          ]},
          { name: 'description', type: 'textarea', label: 'Description', required: true, placeholder: 'What happened?' },
          { name: 'screenshot', type: 'file', label: 'Screenshot', accept: 'image/*' },
        ],
        submitLabel: 'Submit Bug Report',
      },
      next: 'support_thanks',
    },
    {
      id: 'account_help',
      message: "For account issues, please visit your settings page or email support@example.com.",
      next: 'goodbye',
    },
    {
      id: 'general_support',
      message: "Please type your question and our team will get back to you.",
    },
    {
      id: 'support_thanks',
      message: "Thanks for the report! Our engineering team will look into it. 🔧",
      next: 'goodbye',
    },
    {
      id: 'feedback_form',
      message: "We'd love your feedback!",
      form: {
        id: 'feedback',
        title: 'Quick Feedback',
        fields: [
          { name: 'rating', type: 'select', label: 'Rating', required: true, options: [
            { label: '⭐ 1 Star', value: '1' },
            { label: '⭐⭐ 2 Stars', value: '2' },
            { label: '⭐⭐⭐ 3 Stars', value: '3' },
            { label: '⭐⭐⭐⭐ 4 Stars', value: '4' },
            { label: '⭐⭐⭐⭐⭐ 5 Stars', value: '5' },
          ]},
          { name: 'features', type: 'checkbox', label: 'What do you like?', options: [
            { label: 'Easy to use', value: 'ease' },
            { label: 'Fast', value: 'speed' },
            { label: 'Good design', value: 'design' },
            { label: 'Helpful support', value: 'support' },
          ]},
          { name: 'comment', type: 'textarea', label: 'Additional Comments', placeholder: 'Anything else?' },
        ],
        submitLabel: 'Send Feedback',
      },
      next: 'feedback_thanks',
    },
    {
      id: 'feedback_thanks',
      message: "Thank you for your feedback! We really appreciate it. 💙",
      next: 'goodbye',
    },

    // ─── Demo Features: Async Actions, Custom Components, Error Handling ───

    {
      id: 'demo_menu',
      message: "Welcome to the feature demo! Choose a scenario to try:",
      quickReplies: [
        { label: '🔄 API Verification', value: 'api', next: 'verify_collect' },
        { label: '🧩 Custom Component', value: 'component', next: 'plan_selector' },
        { label: '📊 Survey Widget', value: 'survey', next: 'survey_intro' },
        { label: '❌ Error Handling', value: 'error', next: 'error_demo' },
        { label: '🔀 Dynamic Routing', value: 'routing', next: 'routing_collect' },
        { label: '◀ Back', value: 'back', next: 'greeting' },
      ],
    },

    // ── Scenario 1: Async API Verification with progress messages ──

    {
      id: 'verify_collect',
      message: "Let's verify an email address. Fill in the form below:",
      form: {
        id: 'email-verify',
        title: 'Email Verification',
        fields: [
          { name: 'email', type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true,
            validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Enter a valid email' } },
        ],
        submitLabel: '🔍 Verify Email',
      },
      next: 'verify_run',
    },
    {
      id: 'verify_run',
      message: 'Starting verification...',
      asyncAction: {
        handler: 'verify-email',
        loadingMessage: '🔄 Please wait, verification in progress...',
        successMessage: '✅ Email verified successfully! Your account is ready.',
        errorMessage: '❌ Verification failed. This email is not eligible.',
        onSuccess: 'verify_success',
        onError: 'verify_fail',
      },
    },
    {
      id: 'verify_success',
      message: "Your email has been verified and your account is activated! 🎉",
      quickReplies: [
        { label: '🔬 More Demos', value: 'more', next: 'demo_menu' },
        { label: '👋 Done', value: 'done', next: 'goodbye' },
      ],
    },
    {
      id: 'verify_fail',
      message: "The email could not be verified. What would you like to do?",
      quickReplies: [
        { label: '🔄 Try Again', value: 'retry', next: 'verify_collect' },
        { label: '◀ Back to Demos', value: 'back', next: 'demo_menu' },
      ],
    },

    // ── Scenario 2: Custom Component — Plan Selector ──

    {
      id: 'plan_selector',
      message: "Here's our interactive plan selector widget — built as a custom React component:",
      component: 'AccountSelector',
    },
    {
      id: 'plan_basic',
      messages: [
        "You chose the Basic plan — great for getting started! 🚀",
        "You'll get 5 projects and 1 GB storage.",
      ],
      quickReplies: [
        { label: '🔬 More Demos', value: 'more', next: 'demo_menu' },
        { label: '👋 Done', value: 'done', next: 'goodbye' },
      ],
    },
    {
      id: 'plan_pro',
      messages: [
        "Excellent choice! The Pro plan unlocks unlimited projects. ⚡",
        "You'll get 50 GB storage and priority support.",
      ],
      quickReplies: [
        { label: '🔬 More Demos', value: 'more', next: 'demo_menu' },
        { label: '👋 Done', value: 'done', next: 'goodbye' },
      ],
    },
    {
      id: 'plan_enterprise',
      messages: [
        "Enterprise — the ultimate package for large teams! 🏢",
        "Includes SSO, SAML, and a dedicated account manager.",
      ],
      quickReplies: [
        { label: '🔬 More Demos', value: 'more', next: 'demo_menu' },
        { label: '👋 Done', value: 'done', next: 'goodbye' },
      ],
    },

    // ── Scenario 3: Custom Component — Survey Widget ──

    {
      id: 'survey_intro',
      message: "Here's an interactive star-rating survey — another custom component:",
      component: 'SatisfactionSurvey',
    },
    {
      id: 'survey_positive',
      message: "Wonderful! Glad you're having a great experience! 🌟",
      quickReplies: [
        { label: '🔬 More Demos', value: 'more', next: 'demo_menu' },
        { label: '👋 Done', value: 'done', next: 'goodbye' },
      ],
    },
    {
      id: 'survey_neutral',
      message: "Thanks for the honest feedback. We'll work to improve! 💪",
      quickReplies: [
        { label: '🔬 More Demos', value: 'more', next: 'demo_menu' },
        { label: '👋 Done', value: 'done', next: 'goodbye' },
      ],
    },
    {
      id: 'survey_negative',
      message: "We're sorry to hear that. Let us connect you with support. 🤝",
      quickReplies: [
        { label: '💬 Talk to Support', value: 'support', next: 'general_support' },
        { label: '◀ Back to Demos', value: 'back', next: 'demo_menu' },
      ],
    },

    // ── Scenario 4: Error Handling — API always fails + recovery ──

    {
      id: 'error_demo',
      messages: [
        "This demo simulates an API failure scenario.",
        "Watch how the chatbot handles errors gracefully with retry options:",
      ],
      asyncAction: {
        handler: 'failing-api',
        loadingMessage: '🔄 Calling external payment service...',
        successMessage: '✅ Payment processed!',
        errorMessage: '❌ Payment service is temporarily unavailable.',
        onSuccess: 'error_demo_success',
        onError: 'error_recovery',
      },
    },
    {
      id: 'error_demo_success',
      message: "Payment went through! (This shouldn't normally happen in this demo.)",
      next: 'demo_menu',
    },
    {
      id: 'error_recovery',
      message: "Oops! The service is down. What would you like to do?",
      quickReplies: [
        { label: '🔄 Retry', value: 'retry', next: 'error_demo' },
        { label: '💬 Talk to Support', value: 'support', next: 'general_support' },
        { label: '◀ Back to Demos', value: 'back', next: 'demo_menu' },
      ],
    },

    // ── Scenario 5: Dynamic Routing — API returns different statuses ──

    {
      id: 'routing_collect',
      message: "Dynamic routing demo: enter a username to check account status.",
      form: {
        id: 'username-check',
        title: 'Account Lookup',
        fields: [
          { name: 'username', type: 'text', label: 'Username', placeholder: 'Try: admin, vip, or anything else', required: true },
        ],
        submitLabel: '🔍 Check Account',
      },
      next: 'routing_check',
    },
    {
      id: 'routing_check',
      message: 'Looking up account...',
      asyncAction: {
        handler: 'check-account',
        loadingMessage: '🔄 Searching our database...',
        successMessage: '✅ Account found!',
        errorMessage: '❌ Account not found.',
        routes: {
          admin: 'route_admin',
          vip: 'route_vip',
          active: 'route_active',
          not_found: 'route_not_found',
        },
      },
    },
    {
      id: 'route_admin',
      messages: [
        "🔐 Admin account detected!",
        "You have full system access. Routing you to the admin panel...",
      ],
      quickReplies: [
        { label: '🔬 More Demos', value: 'more', next: 'demo_menu' },
        { label: '👋 Done', value: 'done', next: 'goodbye' },
      ],
    },
    {
      id: 'route_vip',
      messages: [
        "⭐ VIP account found!",
        "You have exclusive access to premium features and priority support.",
      ],
      quickReplies: [
        { label: '🔬 More Demos', value: 'more', next: 'demo_menu' },
        { label: '👋 Done', value: 'done', next: 'goodbye' },
      ],
    },
    {
      id: 'route_active',
      messages: [
        "✅ Regular active account found.",
        "Your account is in good standing.",
      ],
      quickReplies: [
        { label: '🔬 More Demos', value: 'more', next: 'demo_menu' },
        { label: '👋 Done', value: 'done', next: 'goodbye' },
      ],
    },
    {
      id: 'route_not_found',
      message: "🚫 No account found with that username.",
      quickReplies: [
        { label: '🔄 Try Another', value: 'retry', next: 'routing_collect' },
        { label: '◀ Back to Demos', value: 'back', next: 'demo_menu' },
      ],
    },

    // ─── End Steps ────────────────────────────────────────────────

    {
      id: 'goodbye',
      message: "Is there anything else I can help with?",
      quickReplies: [
        { label: 'Yes', value: 'yes', next: 'greeting' },
        { label: 'No, thanks!', value: 'no', next: 'bye' },
      ],
    },
    {
      id: 'bye',
      message: "Thanks for chatting! Have a great day! 👋",
    },
  ],
};

// ─── Custom Welcome Screen ───────────────────────────────────────

const CustomWelcome = (
  <div style={{ textAlign: 'center', padding: '12px 0' }}>
    <div style={{ 
      fontSize: '52px', 
      marginBottom: '20px',
      filter: 'drop-shadow(0 4px 8px rgba(108, 92, 231, 0.2))',
    }}>💬</div>
    <h2 style={{ 
      fontSize: '22px', 
      fontWeight: 700, 
      marginBottom: '10px', 
      color: '#2D3436',
      letterSpacing: '-0.02em',
    }}>
      Welcome to Our Chat!
    </h2>
    <p style={{ 
      color: 'rgba(0,0,0,0.5)', 
      fontSize: '14px', 
      lineHeight: '1.7', 
      marginBottom: '20px',
      maxWidth: '280px',
      margin: '0 auto 20px',
    }}>
      We're here to help you with sales inquiries, technical support, or just to hear your feedback.
    </p>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {['24/7 Support', 'Quick Response', 'Expert Team'].map((tag) => (
        <span
          key={tag}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.08), rgba(162, 155, 254, 0.08))',
            color: '#6C5CE7',
            borderRadius: '24px',
            fontSize: '12px',
            fontWeight: 600,
            border: '1px solid rgba(108, 92, 231, 0.12)',
            letterSpacing: '0.02em',
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

// ─── App ─────────────────────────────────────────────────────────

export const App: React.FC = () => {
  return (
    <>
      <div className="demo-page">
        <h1>React ChatBot Plugin Demo</h1>
        <p>Click the chat bubble in the bottom-right corner to try it out.</p>
      </div>

      <ChatBot
        theme={{
          primaryColor: '#6C5CE7',
          headerBg: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
          borderRadius: '20px',
        }}
        header={{
          title: 'Acme Support',
          subtitle: 'Usually replies instantly',
          showClose: true,
          showMinimize: true,
          showRestart: true,
        }}
        branding={{
          poweredBy: 'Enjoys ChatBot',
          poweredByUrl: 'https://github.com/enjoys',
          showBranding: true,
        }}
        welcomeScreen={CustomWelcome}
        loginForm={loginForm}
        flow={sampleFlow}
        inputPlaceholder="Type your message..."
        position="bottom-right"
        enableEmoji={true}
        fileUpload={{
          enabled: true,
          accept: 'image/*,.pdf,.doc,.docx',
          multiple: true,
          maxSize: 5 * 1024 * 1024,
          maxFiles: 3,
        }}
        plugins={[
          analyticsPlugin({
            onTrack: (event, data) => console.log(`[Analytics] ${event}:`, data),
          }),
        ]}
        actionHandlers={{
          // Scenario 1: Email verification with progress updates
          'verify-email': async (data, ctx) => {
            ctx.updateMessage('🔍 Checking email format...');
            await wait(1000);
            ctx.updateMessage('📡 Contacting verification server...');
            await wait(1200);
            ctx.updateMessage('🔐 Validating against our records...');
            await wait(1000);

            const email = (data.email as string) ?? '';
            // Simulate: emails starting with "fail" or "test" will fail
            if (email.startsWith('fail') || email.startsWith('test')) {
              return { status: 'error', message: `❌ The email "${email}" could not be verified.` };
            }
            return { status: 'success', data: { verified: true, verifiedAt: new Date().toISOString() } };
          },

          // Scenario 4: Always-failing API for error handling demo
          'failing-api': async (_data, ctx) => {
            ctx.updateMessage('🔗 Connecting to payment gateway...');
            await wait(1000);
            ctx.updateMessage('💳 Processing transaction...');
            await wait(1500);
            throw new Error('Service unavailable');
          },

          // Scenario 5: Dynamic routing based on username
          'check-account': async (data, ctx) => {
            ctx.updateMessage('🔍 Searching database...');
            await wait(800);
            ctx.updateMessage('📋 Checking account status...');
            await wait(1000);

            const username = ((data.username as string) ?? '').toLowerCase().trim();
            if (username === 'admin') {
              return { status: 'admin', data: { role: 'administrator', accessLevel: 'full' } };
            }
            if (username === 'vip') {
              return { status: 'vip', data: { role: 'vip', tier: 'gold' } };
            }
            if (username.length > 0) {
              return { status: 'active', data: { role: 'user', username } };
            }
            return { status: 'not_found' };
          },
        }}
        components={{
          AccountSelector,
          SatisfactionSurvey,
        }}
        callbacks={{
          onOpen: () => console.log('[ChatBot] opened'),
          onClose: () => console.log('[ChatBot] closed'),
          onMessageSend: (msg) => console.log('[ChatBot] user sent:', msg),
          onLogin: (data) => console.log('[ChatBot] login:', data),
          onFormSubmit: (id, data) => console.log(`[ChatBot] form "${id}":`, data),
          onQuickReply: (val, label) => console.log(`[ChatBot] quick reply: ${label} (${val})`),
          onFlowEnd: (data) => console.log('[ChatBot] flow ended, collected:', data),
          onFileUpload: (files) => console.log('[ChatBot] files uploaded:', files.map(f => f.name)),
          onEvent: (event, payload) => console.log(`[ChatBot] event: ${event}`, payload),
        }}
      />
    </>
  );
};

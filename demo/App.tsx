import React from 'react';
import { ChatBot } from 'react-chatbot-plugin';
import type { FlowConfig, FormConfig } from 'react-chatbot-plugin';

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
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
    <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#1a1a2e' }}>
      Welcome to Our Chat!
    </h2>
    <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
      We're here to help you with sales inquiries, technical support, or just to hear your feedback.
    </p>
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {['24/7 Support', 'Quick Response', 'Expert Team'].map((tag) => (
        <span
          key={tag}
          style={{
            padding: '6px 14px',
            backgroundColor: '#EBF5FF',
            color: '#0066FF',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 500,
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
          primaryColor: '#0066FF',
          headerBg: '#0066FF',
          borderRadius: '16px',
        }}
        header={{
          title: 'Acme Support',
          subtitle: 'Usually replies instantly',
          showClose: true,
        }}
        welcomeScreen={CustomWelcome}
        loginForm={loginForm}
        flow={sampleFlow}
        inputPlaceholder="Type your message..."
        position="bottom-right"
        callbacks={{
          onOpen: () => console.log('[ChatBot] opened'),
          onClose: () => console.log('[ChatBot] closed'),
          onMessageSend: (msg) => console.log('[ChatBot] user sent:', msg),
          onLogin: (data) => console.log('[ChatBot] login:', data),
          onFormSubmit: (id, data) => console.log(`[ChatBot] form "${id}":`, data),
          onQuickReply: (val, label) => console.log(`[ChatBot] quick reply: ${label} (${val})`),
          onFlowEnd: (data) => console.log('[ChatBot] flow ended, collected:', data),
        }}
      />
    </>
  );
};

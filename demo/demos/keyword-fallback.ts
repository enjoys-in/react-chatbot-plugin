import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'keyword-fallback',
  title: 'Keywords, Greetings & Fallback',
  description: 'Keyword-based routing, greeting detection, input validation, typing delay, and fallback responses — no flow required.',
  icon: '🔑',
  category: 'advanced',
  greetingResponse: "Hello! 👋 I'm a demo bot. Try typing 'pricing', 'help', or 'refund' to see keyword matching in action!",
  typingDelay: 600,
  fallbackMessage: (text: string) =>
    `I'm not sure how to respond to "${text}". Try typing **help**, **pricing**, or **refund**.`,
  keywords: [
    {
      patterns: ['pricing', 'price', 'cost', 'how much'],
      response: '💰 Our plans start at **$9/mo** for Starter, **$29/mo** for Pro, and **$99/mo** for Enterprise. Visit /pricing for details!',
      priority: 1,
    },
    {
      patterns: ['help', 'support', 'assist'],
      response: '🆘 I can help! Here are some things you can ask about:\n\n• **pricing** — see our plans\n• **refund** — refund policy\n• **demo** — request a demo\n• Or just say **hi**!',
      priority: 2,
    },
    {
      patterns: ['refund', 'money back', 'cancel subscription'],
      response: '🔄 We offer a **30-day money-back guarantee** on all plans. Contact support@example.com to request a refund.',
      matchType: 'contains',
      priority: 1,
    },
    {
      patterns: ['demo', 'trial', 'try'],
      response: '🎯 You can start a **14-day free trial** — no credit card required! Visit our signup page to get started.',
      priority: 0,
    },
    {
      patterns: ['^(bye|goodbye|see ya|cya)$'],
      response: 'Goodbye! 👋 Have a great day!',
      matchType: 'regex',
      priority: 0,
    },
  ],
  callbacks: {
    onUnhandledMessage: (text: string, ctx: { currentStepId: string | null }) => {
      console.log('[Demo] Unhandled message:', text, ctx);
    },
  },
};

export default demo;

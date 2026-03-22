import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'multi-step',
  title: 'Multi-Step Flow',
  description: 'A longer conversation with sequential messages, delays, and branching paths.',
  icon: '🔗',
  category: 'basic',
  flow: {
    startStep: 'welcome',
    steps: [
      {
        id: 'welcome',
        messages: [
          "Welcome to TechCorp! 🚀",
          "I'm your virtual assistant and I can help you with a few things.",
        ],
        delay: 800,
        next: 'menu',
      },
      {
        id: 'menu',
        message: "What would you like to explore?",
        quickReplies: [
          { label: '📦 Products', value: 'products', next: 'products' },
          { label: '💰 Pricing', value: 'pricing', next: 'pricing' },
          { label: '📍 Locations', value: 'locations', next: 'locations' },
          { label: '📞 Contact', value: 'contact', next: 'contact' },
        ],
      },
      {
        id: 'products',
        messages: [
          "We have three product lines:",
          "🔹 **CloudSync** — Real-time data synchronization",
          "🔹 **DataVault** — Secure cloud storage",
          "🔹 **FlowAI** — AI-powered workflow automation",
        ],
        quickReplies: [
          { label: 'Tell me about CloudSync', value: 'cloudsync', next: 'cloudsync' },
          { label: 'Tell me about DataVault', value: 'datavault', next: 'datavault' },
          { label: 'Tell me about FlowAI', value: 'flowai', next: 'flowai' },
          { label: '◀ Back', value: 'back', next: 'menu' },
        ],
      },
      {
        id: 'cloudsync',
        messages: [
          "☁️ **CloudSync** keeps your data in sync across all devices in real-time.",
          "Features: conflict resolution, offline mode, webhook triggers.",
          "Starting at $19/month per team.",
        ],
        quickReplies: [
          { label: '◀ Back to Products', value: 'back', next: 'products' },
          { label: '💰 See Pricing', value: 'pricing', next: 'pricing' },
        ],
      },
      {
        id: 'datavault',
        messages: [
          "🔒 **DataVault** provides military-grade encrypted cloud storage.",
          "Features: zero-knowledge encryption, versioning, 99.99% uptime.",
          "Starting at $12/month for 100 GB.",
        ],
        quickReplies: [
          { label: '◀ Back to Products', value: 'back', next: 'products' },
          { label: '💰 See Pricing', value: 'pricing', next: 'pricing' },
        ],
      },
      {
        id: 'flowai',
        messages: [
          "🤖 **FlowAI** automates your workflows with AI intelligence.",
          "Features: natural language triggers, 200+ integrations, analytics dashboard.",
          "Starting at $49/month.",
        ],
        quickReplies: [
          { label: '◀ Back to Products', value: 'back', next: 'products' },
          { label: '💰 See Pricing', value: 'pricing', next: 'pricing' },
        ],
      },
      {
        id: 'pricing',
        messages: [
          "💰 Our pricing is simple and transparent:",
          "• **Starter** — $19/mo (1 product, 5 users)",
          "• **Professional** — $49/mo (all products, 25 users)",
          "• **Enterprise** — Custom pricing (unlimited everything)",
        ],
        quickReplies: [
          { label: 'Start Free Trial', value: 'trial', next: 'trial' },
          { label: '◀ Back', value: 'back', next: 'menu' },
        ],
      },
      {
        id: 'trial',
        message: "Great choice! You can start a 14-day free trial — no credit card required. 🎉\nVisit our website to get started!",
        next: 'end',
      },
      {
        id: 'locations',
        messages: [
          "📍 We have offices worldwide:",
          "🇺🇸 San Francisco (HQ)",
          "🇬🇧 London",
          "🇩🇪 Berlin",
          "🇯🇵 Tokyo",
          "🇦🇺 Sydney",
        ],
        quickReplies: [
          { label: '◀ Back', value: 'back', next: 'menu' },
        ],
      },
      {
        id: 'contact',
        message: "You can reach us at:\n📧 hello@techcorp.com\n📞 +1 (555) 123-4567\n💬 Live chat (that's me!)",
        quickReplies: [
          { label: '◀ Back', value: 'back', next: 'menu' },
        ],
      },
      {
        id: 'end',
        message: "Anything else I can help with?",
        quickReplies: [
          { label: 'Yes', value: 'yes', next: 'menu' },
          { label: 'No, bye!', value: 'bye', next: 'bye' },
        ],
      },
      {
        id: 'bye',
        message: "Thanks for visiting TechCorp! Have a wonderful day! 🌟",
      },
    ],
  },
};

export default demo;

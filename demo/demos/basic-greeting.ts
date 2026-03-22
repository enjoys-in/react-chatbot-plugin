import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'basic-greeting',
  title: 'Basic Greeting',
  description: 'Simple welcome message with quick reply buttons. The most minimal chatbot flow.',
  icon: '👋',
  category: 'basic',
  flow: {
    startStep: 'greeting',
    steps: [
      {
        id: 'greeting',
        message: "Hi there! 👋 How can I help you today?",
        quickReplies: [
          { label: '💬 Sales', value: 'sales', next: 'sales' },
          { label: '🛠 Support', value: 'support', next: 'support' },
          { label: '📋 Feedback', value: 'feedback', next: 'feedback' },
        ],
      },
      {
        id: 'sales',
        messages: [
          "Our plans start at $29/month for individuals.",
          "Teams get a 20% discount. Want me to connect you with sales?",
        ],
        quickReplies: [
          { label: 'Yes please', value: 'yes', next: 'connect' },
          { label: 'No thanks', value: 'no', next: 'goodbye' },
        ],
      },
      {
        id: 'support',
        message: "Sure! Please describe your issue and our team will get back to you.",
        next: 'goodbye',
      },
      {
        id: 'feedback',
        message: "We'd love to hear from you! Please type your feedback below.",
        next: 'thanks',
      },
      {
        id: 'connect',
        message: "Our sales team will reach out to you shortly. 🎉",
        next: 'goodbye',
      },
      {
        id: 'thanks',
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
  },
};

export default demo;

import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'login-form',
  title: 'Login / Pre-Chat Form',
  description: 'Collect user info before the conversation starts with a login form gate.',
  icon: '🔐',
  category: 'forms',
  loginForm: {
    id: 'login',
    title: 'Welcome! Please introduce yourself',
    fields: [
      { name: 'name', type: 'text', label: 'Your Name', placeholder: 'John Doe', required: true },
      { name: 'email', type: 'email', label: 'Email', placeholder: 'john@example.com', required: true },
      { name: 'department', type: 'select', label: 'Department', options: [
        { label: 'Engineering', value: 'engineering' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales', value: 'sales' },
        { label: 'Support', value: 'support' },
      ]},
    ],
    submitLabel: '🚀 Start Chat',
  },
  flow: {
    startStep: 'greeting',
    steps: [
      {
        id: 'greeting',
        messages: [
          "Thanks for logging in! 🎉",
          "Your info has been saved. Now let's chat!",
        ],
        quickReplies: [
          { label: '💬 Ask a question', value: 'question', next: 'question' },
          { label: '📋 Give feedback', value: 'feedback', next: 'feedback' },
        ],
      },
      {
        id: 'question',
        message: "Sure! Type your question below and we'll get back to you.",
        next: 'thanks',
      },
      {
        id: 'feedback',
        message: "We'd love to hear your thoughts. Type away!",
        next: 'thanks',
      },
      {
        id: 'thanks',
        message: "Thank you! We've recorded your message along with your login info. 📝",
      },
    ],
  },
};

export default demo;

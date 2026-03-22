import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'conditional-branching',
  title: 'Conditional Branching',
  description: 'Route conversations based on user data with if/else conditions and operators.',
  icon: '🔀',
  category: 'basic',
  flow: {
    startStep: 'ask_age',
    steps: [
      {
        id: 'ask_age',
        message: "Welcome! Let's check your eligibility. How old are you?",
        form: {
          id: 'age-form',
          title: 'Age Verification',
          fields: [
            { name: 'age', type: 'number', label: 'Your Age', required: true, placeholder: 'Enter your age' },
          ],
          submitLabel: 'Continue',
        },
        next: 'check_age',
      },
      {
        id: 'check_age',
        message: 'Checking eligibility...',
        condition: {
          field: 'age',
          operator: 'gt',
          value: 17,
          then: 'adult',
          else: 'minor',
        },
      },
      {
        id: 'adult',
        message: "✅ You're eligible! Now let's check your region.",
        quickReplies: [
          { label: '🇺🇸 US', value: 'US', next: 'store_region' },
          { label: '🇪🇺 Europe', value: 'EU', next: 'store_region' },
          { label: '🌏 Asia', value: 'ASIA', next: 'store_region' },
          { label: '🌍 Other', value: 'OTHER', next: 'store_region' },
        ],
      },
      {
        id: 'store_region',
        message: 'Processing your region...',
        next: 'check_region',
      },
      {
        id: 'check_region',
        message: 'Checking regional availability...',
        condition: {
          field: 'region',
          operator: 'eq',
          value: 'US',
          then: 'us_offer',
          else: 'global_offer',
        },
      },
      {
        id: 'us_offer',
        messages: [
          "🇺🇸 Great news for US customers!",
          "You qualify for free shipping + 10% launch discount.",
          "Use code: **US10OFF** at checkout.",
        ],
        next: 'final',
      },
      {
        id: 'global_offer',
        messages: [
          "🌍 International shipping available!",
          "Standard delivery: 5-10 business days.",
          "Use code: **GLOBAL5** for 5% off your first order.",
        ],
        next: 'final',
      },
      {
        id: 'minor',
        messages: [
          "⚠️ Sorry, you must be 18 or older to access this service.",
          "Please come back when you meet the age requirement.",
        ],
        quickReplies: [
          { label: '🔄 Try Again', value: 'retry', next: 'ask_age' },
        ],
      },
      {
        id: 'final',
        message: "Ready to get started?",
        quickReplies: [
          { label: '🛒 Shop Now', value: 'shop', next: 'shop' },
          { label: '🔄 Start Over', value: 'restart', next: 'ask_age' },
        ],
      },
      {
        id: 'shop',
        message: "Redirecting you to the store... 🛒\nThank you for choosing us!",
      },
    ],
  },
};

export default demo;

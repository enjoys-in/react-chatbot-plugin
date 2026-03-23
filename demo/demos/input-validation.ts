import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'input-validation',
  title: 'Input Validation Steps',
  description: 'Free-text input steps with validation rules, transforms, and error messages.',
  icon: '✅',
  category: 'forms',
  flow: {
    startStep: 'ask-name',
    steps: [
      {
        id: 'ask-name',
        message: "Hi! Let's validate some inputs. What's your **name**? (min 2 characters)",
        input: {
          placeholder: 'Type your name...',
          transform: 'trim',
          validation: { required: true, minLength: 2, message: 'Please enter at least 2 characters.' },
        },
        next: 'ask-email',
      },
      {
        id: 'ask-email',
        message: 'Great, {{ask-name}}! Now enter your **email address**:',
        input: {
          placeholder: 'you@example.com',
          transform: 'email',
          validation: {
            required: true,
            pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
            message: 'Please enter a valid email address.',
          },
        },
        next: 'ask-age',
      },
      {
        id: 'ask-age',
        message: 'And your **age**? (must be a number between 1 and 120)',
        input: {
          placeholder: 'Enter your age...',
          transform: 'trim',
          validation: {
            required: true,
            pattern: '^\\d+$',
            message: 'Please enter a valid number.',
          },
        },
        next: 'confirm',
      },
      {
        id: 'confirm',
        messages: [
          '✅ All inputs validated! Here\'s what I collected:',
          '**Name:** {{ask-name}}\n**Email:** {{ask-email}}\n**Age:** {{ask-age}}',
          'Thanks for trying the input validation demo!',
        ],
      },
    ],
  },
};

export default demo;

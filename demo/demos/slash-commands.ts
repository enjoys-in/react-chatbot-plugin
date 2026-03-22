import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'slash-commands',
  title: 'Slash Commands',
  description: 'Built-in commands: /help, /back, /cancel, /restart. Navigate flows with keyboard.',
  icon: '⌨️',
  category: 'basic',
  flow: {
    startStep: 'intro',
    steps: [
      {
        id: 'intro',
        messages: [
          "This demo showcases built-in slash commands! ⌨️",
          "Try typing these commands in the input:",
          "• **/help** — Show available commands",
          "• **/back** — Go to the previous step",
          "• **/cancel** — Same as /back",
          "• **/restart** — Restart from the beginning",
        ],
        next: 'step1',
      },
      {
        id: 'step1',
        message: "📍 You're on **Step 1**. Try typing **/back** — it won't work because there's no previous step to go back to.",
        quickReplies: [
          { label: 'Go to Step 2', value: 'next', next: 'step2' },
        ],
      },
      {
        id: 'step2',
        message: "📍 **Step 2** — Now try **/back** to go back to Step 1, or continue forward.",
        quickReplies: [
          { label: 'Go to Step 3', value: 'next', next: 'step3' },
        ],
      },
      {
        id: 'step3',
        message: "📍 **Step 3** — You can type **/back** to go to Step 2, or **/restart** to start over completely.",
        quickReplies: [
          { label: 'Go to Step 4', value: 'next', next: 'step4' },
        ],
      },
      {
        id: 'step4',
        message: "📍 **Step 4** — Final step! Try **/help** to see all commands, or **/restart** to go back to the beginning.",
        quickReplies: [
          { label: '🔄 Start Over', value: 'restart', next: 'intro' },
        ],
      },
    ],
  },
};

export default demo;

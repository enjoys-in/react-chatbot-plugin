import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'slash-commands',
  title: 'Slash Commands',
  description: 'Type / to open the command menu — arrows to move, Enter to run. Built-ins plus custom commands.',
  icon: '⌨️',
  category: 'basic',
  markdown: true,
  slashCommands: [
    {
      name: 'agent',
      description: 'Talk to a human',
      handler: (ctx) => ctx.addBotMessage('Connecting you to a human agent… 🧑‍💼'),
    },
    {
      // `args` is everything after the command name.
      name: 'echo',
      description: 'Repeat back what you type',
      handler: (ctx) =>
        ctx.addBotMessage(ctx.args ? `You said: ${ctx.args}` : 'Try `/echo hello world`'),
    },
    {
      name: 'status',
      description: 'Show collected data',
      aliases: ['data'],
      handler: (ctx) => {
        const keys = Object.keys(ctx.data);
        ctx.addSystemMessage(
          keys.length ? `Collected: ${keys.join(', ')}` : 'Nothing collected yet.',
        );
      },
    },
  ],
  flow: {
    startStep: 'intro',
    steps: [
      {
        id: 'intro',
        messages: [
          "This demo showcases slash commands! ⌨️",
          "Type **/** in the input — a command menu opens as you type. Use **↑ ↓** to move, **Enter** or **Tab** to run, **Esc** to dismiss.",
          "Built-ins: **/help**, **/back**, **/cancel**, **/restart**",
          "Custom ones for this demo: **/agent**, **/echo**, **/status**",
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

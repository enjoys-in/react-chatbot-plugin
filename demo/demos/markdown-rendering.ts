import type { DemoConfig } from './types';

const markdownRendering: DemoConfig = {
  id: 'markdown-rendering',
  title: 'Markdown Rendering',
  description: 'Built-in markdown support in message bubbles — bold, italic, code, links, lists, and more.',
  icon: '📝',
  category: 'basic',
  // These messages use `#` headings, which are opt-in.
  markdown: { headings: true },
  flow: {
    startStep: 'welcome',
    steps: [
      {
        id: 'welcome',
        message: '# Welcome to Markdown Demo\n\nThis chatbot renders **markdown** in messages automatically. Try these examples:',
        quickReplies: [
          { label: 'Text Formatting', value: 'formatting', next: 'formatting' },
          { label: 'Lists', value: 'lists', next: 'lists' },
          { label: 'Code', value: 'code', next: 'code' },
          { label: 'Links', value: 'links', next: 'links' },
          { label: 'Combined', value: 'combined', next: 'combined' },
        ],
      },
      {
        id: 'formatting',
        message: 'Here\'s **bold text**, *italic text*, and ~~strikethrough~~.\n\nYou can combine them: **bold and *nested italic*** works too!',
        quickReplies: [
          { label: 'Lists', value: 'lists', next: 'lists' },
          { label: 'Code', value: 'code', next: 'code' },
          { label: 'Start Over', value: 'restart', next: 'welcome' },
        ],
      },
      {
        id: 'lists',
        message: 'Here are our pricing plans:\n\n• **Free** — 100 messages/month\n• **Pro** — $19/mo (unlimited messages)\n• **Enterprise** — Custom pricing (unlimited everything)\n\nAll plans include:\n- Real-time analytics\n- Custom branding\n- Priority support',
        quickReplies: [
          { label: 'Formatting', value: 'formatting', next: 'formatting' },
          { label: 'Code', value: 'code', next: 'code' },
          { label: 'Start Over', value: 'restart', next: 'welcome' },
        ],
      },
      {
        id: 'code',
        message: 'Inline code: use `npm install @enjoys/react-chatbot-plugin`\n\nCode block:\n```\nimport { ChatBot } from \'@enjoys/react-chatbot-plugin\';\n\n<ChatBot markdown={true} />\n```\n\nThat\'s all you need!',
        quickReplies: [
          { label: 'Links', value: 'links', next: 'links' },
          { label: 'Combined', value: 'combined', next: 'combined' },
          { label: 'Start Over', value: 'restart', next: 'welcome' },
        ],
      },
      {
        id: 'links',
        message: 'Check out our resources:\n\n- [GitHub Repository](https://github.com/enjoys-in/react-chatbot-plugin)\n- [npm Package](https://www.npmjs.com/package/@enjoys/react-chatbot-plugin)\n- [Documentation](https://github.com/enjoys-in/react-chatbot-plugin/tree/main/docs)',
        quickReplies: [
          { label: 'Combined', value: 'combined', next: 'combined' },
          { label: 'Start Over', value: 'restart', next: 'welcome' },
        ],
      },
      {
        id: 'combined',
        message: '## Full Example\n\nHere\'s everything together:\n\n**Features:**\n• *Lightweight* — no external dependencies\n• `Built-in` — just set `markdown={true}`\n• ~~Complex setup~~ — zero config needed\n\nInstall:\n```\nnpm install @enjoys/react-chatbot-plugin\n```\n\nLearn more at [our docs](https://github.com/enjoys-in/react-chatbot-plugin/tree/main/docs).',
        quickReplies: [
          { label: 'Start Over', value: 'restart', next: 'welcome' },
        ],
      },
    ],
  },
};

export default markdownRendering;

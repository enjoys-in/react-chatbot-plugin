import type { DemoConfig } from './types';

const markdownRendering: DemoConfig = {
  id: 'markdown-rendering',
  title: 'Markdown Rendering',
  description: 'Built-in markdown support in message bubbles — bold, italic, code, links, lists, and more.',
  icon: '📝',
  category: 'basic',
  markdown: true,
  flow: {
    id: 'markdown-demo',
    steps: [
      {
        id: 'welcome',
        message: '# Welcome to Markdown Demo\n\nThis chatbot renders **markdown** in messages automatically. Try these examples:',
        quickReplies: [
          { label: 'Text Formatting', value: 'formatting' },
          { label: 'Lists', value: 'lists' },
          { label: 'Code', value: 'code' },
          { label: 'Links', value: 'links' },
          { label: 'Combined', value: 'combined' },
        ],
        next: 'router',
      },
      {
        id: 'router',
        conditions: [
          { field: 'welcome', operator: 'equals', value: 'formatting', next: 'formatting' },
          { field: 'welcome', operator: 'equals', value: 'lists', next: 'lists' },
          { field: 'welcome', operator: 'equals', value: 'code', next: 'code' },
          { field: 'welcome', operator: 'equals', value: 'links', next: 'links' },
          { field: 'welcome', operator: 'equals', value: 'combined', next: 'combined' },
        ],
        next: 'formatting',
      },
      {
        id: 'formatting',
        message: 'Here\'s **bold text**, *italic text*, and ~~strikethrough~~.\n\nYou can combine them: **bold and *nested italic*** works too!',
        quickReplies: [
          { label: 'Lists', value: 'lists' },
          { label: 'Code', value: 'code' },
          { label: 'Start Over', value: 'restart' },
        ],
        next: 'router2',
      },
      {
        id: 'lists',
        message: 'Here are our pricing plans:\n\n• **Free** — 100 messages/month\n• **Pro** — $19/mo (unlimited messages)\n• **Enterprise** — Custom pricing (unlimited everything)\n\nAll plans include:\n- Real-time analytics\n- Custom branding\n- Priority support',
        quickReplies: [
          { label: 'Formatting', value: 'formatting' },
          { label: 'Code', value: 'code' },
          { label: 'Start Over', value: 'restart' },
        ],
        next: 'router2',
      },
      {
        id: 'code',
        message: 'Inline code: use `npm install @enjoys/react-chatbot-plugin`\n\nCode block:\n```\nimport { ChatBot } from \'@enjoys/react-chatbot-plugin\';\n\n<ChatBot markdown={true} />\n```\n\nThat\'s all you need!',
        quickReplies: [
          { label: 'Links', value: 'links' },
          { label: 'Combined', value: 'combined' },
          { label: 'Start Over', value: 'restart' },
        ],
        next: 'router2',
      },
      {
        id: 'links',
        message: 'Check out our resources:\n\n- [GitHub Repository](https://github.com/enjoys-in/react-chatbot-plugin)\n- [npm Package](https://www.npmjs.com/package/@enjoys/react-chatbot-plugin)\n- [Documentation](https://github.com/enjoys-in/react-chatbot-plugin/tree/main/docs)',
        quickReplies: [
          { label: 'Combined', value: 'combined' },
          { label: 'Start Over', value: 'restart' },
        ],
        next: 'router2',
      },
      {
        id: 'combined',
        message: '## Full Example\n\nHere\'s everything together:\n\n**Features:**\n• *Lightweight* — no external dependencies\n• `Built-in` — just set `markdown={true}`\n• ~~Complex setup~~ — zero config needed\n\nInstall:\n```\nnpm install @enjoys/react-chatbot-plugin\n```\n\nLearn more at [our docs](https://github.com/enjoys-in/react-chatbot-plugin/tree/main/docs).',
        quickReplies: [
          { label: 'Start Over', value: 'restart' },
        ],
        next: 'router2',
      },
      {
        id: 'router2',
        conditions: [
          { field: 'formatting', operator: 'equals', value: 'lists', next: 'lists' },
          { field: 'formatting', operator: 'equals', value: 'code', next: 'code' },
          { field: 'formatting', operator: 'equals', value: 'restart', next: 'welcome' },
          { field: 'lists', operator: 'equals', value: 'formatting', next: 'formatting' },
          { field: 'lists', operator: 'equals', value: 'code', next: 'code' },
          { field: 'lists', operator: 'equals', value: 'restart', next: 'welcome' },
          { field: 'code', operator: 'equals', value: 'links', next: 'links' },
          { field: 'code', operator: 'equals', value: 'combined', next: 'combined' },
          { field: 'code', operator: 'equals', value: 'restart', next: 'welcome' },
          { field: 'links', operator: 'equals', value: 'combined', next: 'combined' },
          { field: 'links', operator: 'equals', value: 'restart', next: 'welcome' },
          { field: 'combined', operator: 'equals', value: 'restart', next: 'welcome' },
        ],
        next: 'welcome',
      },
    ],
  },
};

export default markdownRendering;

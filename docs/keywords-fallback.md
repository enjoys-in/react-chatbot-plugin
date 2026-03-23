# Keywords, Fallback & Input Validation

> **v1.4.0** — Respond to user text without requiring a flow, detect greetings, validate free-text inputs, and more.

## Overview

These features let your chatbot intelligently handle user text even when no flow step is active:

- **Keyword Routes** — match user text against patterns and respond or jump to a flow step
- **Greeting Detection** — auto-respond to common greetings (hi, hello, hey, etc.)
- **Fallback Message** — catch-all reply when nothing else matches
- **Input Validation** — validate free-text input inside flow steps
- **Typing Delay** — add a realistic typing pause before keyword/fallback responses
- **onUnhandledMessage** — callback when absolutely nothing handled the text
- **Plugin onMessage** — plugins can now transform messages before they're dispatched

---

## Keyword Routes

Match user text to responses or flow steps using `keywords`:

```tsx
<ChatBot
  keywords={[
    {
      patterns: ['pricing', 'price', 'cost', 'how much'],
      response: 'Our plans start at $9/mo.',
      priority: 1,
    },
    {
      patterns: ['help', 'support'],
      response: 'How can I help? Try asking about pricing or refunds.',
      priority: 2,
    },
    {
      patterns: ['^bye$'],
      response: 'Goodbye! 👋',
      matchType: 'regex',
    },
    {
      patterns: ['demo'],
      next: 'demo-flow-step', // jump to a flow step
    },
  ]}
/>
```

### KeywordRoute Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `patterns` | `string[]` | — | Patterns to match |
| `response` | `string` | — | Bot reply when matched |
| `next` | `string` | — | Jump to this flow step |
| `caseSensitive` | `boolean` | `false` | Case-sensitive matching |
| `matchType` | `'exact' \| 'contains' \| 'startsWith' \| 'regex'` | `'contains'` | Match strategy |
| `priority` | `number` | `0` | Higher wins when multiple match |

---

## Greeting Detection

Shortcut for auto-responding to common greetings:

```tsx
<ChatBot
  greetingResponse="Hello! 👋 How can I help you today?"
/>
```

This automatically matches: `hi`, `hello`, `hey`, `howdy`, `hola`, `greetings`, `good morning`, `good afternoon`, `good evening`, `sup`, `yo`.

Internally creates a keyword route with `matchType: 'exact'` and `priority: -1` (lowest).

---

## Fallback Message

Catch-all when no keyword or flow matches:

```tsx
// Static string
<ChatBot fallbackMessage="Sorry, I didn't understand that." />

// Dynamic function
<ChatBot
  fallbackMessage={(text) =>
    `I'm not sure about "${text}". Try typing "help".`
  }
/>
```

Return `null` from the function to skip the fallback and let `onUnhandledMessage` fire instead.

---

## Input Validation

Add `input` to a flow step for validated free-text input:

```ts
{
  id: 'ask-email',
  message: 'Enter your email:',
  input: {
    placeholder: 'you@example.com',
    transform: 'email',        // 'trim' | 'lowercase' | 'uppercase' | 'email'
    validation: {
      required: true,
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      message: 'Please enter a valid email.',
    },
  },
  next: 'confirm',
}
```

### FlowStepInput Properties

| Property | Type | Description |
|----------|------|-------------|
| `placeholder` | `string` | Placeholder text (future UI use) |
| `transform` | `'trim' \| 'lowercase' \| 'uppercase' \| 'email'` | Transform before validation |
| `validation` | `FormFieldValidation` | Reuses form validation rules |

If validation fails, the bot sends an error message and waits for the user to re-enter.

---

## Typing Delay

Add a realistic typing pause before keyword/fallback replies:

```tsx
<ChatBot typingDelay={600} />
```

The bot shows the typing indicator for the specified ms before sending the reply.

---

## onUnhandledMessage

Fires when user text was not handled by any flow, keyword, or fallback:

```tsx
<ChatBot
  callbacks={{
    onUnhandledMessage: (text, { currentStepId }) => {
      console.log('Unhandled:', text, 'at step:', currentStepId);
      // Send to analytics, log, etc.
    },
  }}
/>
```

---

## Plugin onMessage

Plugins with an `onMessage` hook now receive every user message before it's dispatched. Plugins can transform the message (e.g., add metadata, filter profanity):

```ts
const myPlugin = {
  name: 'my-plugin',
  onMessage: async (msg, ctx) => {
    return { ...msg, text: msg.text.replace(/badword/gi, '***') };
  },
};
```

---

## Full Example

```tsx
<ChatBot
  greetingResponse="Hello! 👋"
  typingDelay={500}
  fallbackMessage={(text) => `I don't understand "${text}". Type "help"!`}
  keywords={[
    { patterns: ['help'], response: 'Try: pricing, refund, demo', priority: 2 },
    { patterns: ['pricing'], response: 'Plans from $9/mo.', priority: 1 },
    { patterns: ['demo'], next: 'demo-start' },
  ]}
  flow={{
    startStep: 'demo-start',
    steps: [
      {
        id: 'demo-start',
        message: 'Enter your email to start:',
        input: {
          transform: 'email',
          validation: { required: true, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', message: 'Invalid email.' },
        },
        next: 'done',
      },
      { id: 'done', message: 'Thanks! We will reach out to {{demo-start}}.' },
    ],
  }}
  callbacks={{
    onUnhandledMessage: (text) => console.log('Nothing matched:', text),
  }}
/>
```

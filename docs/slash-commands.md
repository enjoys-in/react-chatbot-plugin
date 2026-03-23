# Slash Commands

Built-in commands that users can type in the chat input for navigation.

## Available Commands

| Command | Description |
|---------|-------------|
| `/help` | Show all available commands |
| `/back` | Go back to the previous step |
| `/cancel` | Same as `/back` |
| `/restart` | Restart the conversation from the beginning |

## How They Work

- **`/help`** — Shows a system message listing all commands
- **`/back`** — Pops the step history and navigates to the previous step. Shows a message if there's nowhere to go back to.
- **`/cancel`** — Alias for `/back`
- **`/restart`** — Clears all messages, resets collected data, and starts the flow from `startStep`

## Step History

The flow engine maintains a step history stack. Every time a step is entered, it's pushed onto the stack. `/back` pops the current step and navigates to the previous one.

## Restart from Header

You can also add a restart button to the header:

```tsx
<ChatBot
  customizeChat={{
    header: {
      config: {
        title: 'Support Bot',
        showRestart: true,  // Adds a restart icon button
      },
    },
  }}
/>
```

## During Async Actions

When an async action or custom component is active, text input is blocked. However, users can still type `/back` to navigate away from the current step.

## Demo

See the **Slash Commands** demo for a 4-step flow where you can practice all commands.

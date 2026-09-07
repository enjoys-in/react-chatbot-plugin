# Slash Commands

Commands the visitor types in the composer. Typing `/` opens an autocomplete
menu; picking an entry runs it immediately.

## The command menu

Type `/` at the start of an empty message and the menu opens above the composer,
filtering as you type.

| Key | Action |
|-----|--------|
| `↑` / `↓` | Move the highlight |
| `Enter` / `Tab` | Run the highlighted command |
| `Esc` | Dismiss (typing a new `/` reopens it) |
| Click | Run that command |

The menu only opens for a bare `/name` at the start of an otherwise-empty
message, and closes once you type a space — so it never covers a real message
you're composing. Selecting sends `/name` through the normal pipeline, which is
the same path as typing it by hand.

Turn it off with `enableSlashCommandMenu={false}`; commands still work when
typed in full.

## Built-in commands

| Command | Description |
|---------|-------------|
| `/help` | List every available command, including your own |
| `/back` | Go back to the previous step |
| `/cancel` | Same as `/back` |
| `/restart` | Restart the conversation from the beginning |

## Custom commands

```tsx
<ChatBot
  slashCommands={[
    {
      name: 'agent',
      description: 'Talk to a human',
      handler: (ctx) => ctx.goToStep('handoff'),
    },
    {
      name: 'echo',
      description: 'Repeat back what you type',
      // `/echo hi there` → args === 'hi there'
      handler: (ctx) => ctx.addBotMessage(`You said: ${ctx.args}`),
    },
  ]}
/>
```

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Command name, without the leading slash |
| `description` | `string` | One-line description shown in the menu |
| `icon` | `ReactNode` | Icon shown in the menu |
| `aliases` | `string[]` | Extra terms the filter matches, e.g. `['clear']` |
| `hidden` | `boolean` | Keep it typeable but out of the menu |
| `handler` | `(ctx: SlashCommandContext) => void \| Promise<void>` | What it does |

A custom command whose `name` matches a built-in **replaces** it, so `/help` can
be overridden.

### SlashCommandContext

| Member | Type | Description |
|--------|------|-------------|
| `addBotMessage` | `(text: string) => void` | Post a bot message |
| `addSystemMessage` | `(text: string) => void` | Post a quiet system line |
| `sendMessage` | `(text: string) => void` | Send as the visitor, through the pipeline |
| `goToStep` | `(stepId: string) => void` | Jump the flow to a step |
| `goBack` | `() => void` | Previous step |
| `restart` | `() => void` | Reset the conversation |
| `data` | `Record<string, unknown>` | Collected flow/form data |
| `args` | `string` | Text after the command name |

## Building your own menu

The registry and filter helpers are exported, so a custom `input` slot can
render its own menu:

```tsx
import {
  BUILT_IN_COMMANDS, resolveCommands, filterCommands,
  commandMenuQuery, parseCommand, SlashCommandMenu,
} from '@enjoys/react-chatbot-plugin';

const commands = resolveCommands(myCommands);      // built-ins + custom
const query = commandMenuQuery(text);              // null when closed
const matches = query === null ? [] : filterCommands(commands, query);
```

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

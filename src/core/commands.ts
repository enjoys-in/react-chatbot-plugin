import type { SlashCommand } from '../types/command';

/** The commands every chatbot has. Their behaviour lives in `useChat`. */
export const BUILT_IN_COMMANDS: SlashCommand[] = [
  { name: 'help', description: 'Show available commands' },
  { name: 'back', description: 'Go back to the previous step' },
  { name: 'cancel', description: 'Cancel current step and go back' },
  { name: 'restart', description: 'Restart the conversation from the beginning', aliases: ['clear', 'reset'] },
];

/** Built-ins plus any custom commands. A custom command with the same name
 *  replaces the built-in, so `/help` can be overridden. */
export function resolveCommands(custom?: SlashCommand[]): SlashCommand[] {
  if (!custom || custom.length === 0) return BUILT_IN_COMMANDS;

  const byName = new Map<string, SlashCommand>();
  for (const c of BUILT_IN_COMMANDS) byName.set(c.name.toLowerCase(), c);
  for (const c of custom) {
    const name = c.name.replace(/^\//, '').trim().toLowerCase();
    if (name) byName.set(name, { ...c, name });
  }
  return [...byName.values()];
}

/**
 * Parse composer text into a command name and its arguments.
 * Returns `null` when the text isn't a command.
 *
 * `'/echo hi there'` → `{ name: 'echo', args: 'hi there' }`
 */
export function parseCommand(text: string): { name: string; args: string } | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith('/')) return null;
  const [head, ...rest] = trimmed.slice(1).split(/\s+/);
  return { name: head.toLowerCase(), args: rest.join(' ') };
}

/**
 * The menu query for the current composer value, or `null` when the menu
 * should stay closed.
 *
 * Only a command at the very start of an otherwise-empty message opens the
 * menu, and only before the first space — once arguments are being typed the
 * menu gets out of the way.
 */
export function commandMenuQuery(text: string): string | null {
  const m = /^\/([a-z0-9_-]*)$/i.exec(text);
  return m ? m[1].toLowerCase() : null;
}

/** Commands matching `query`, name-prefix first, then aliases, then substring. */
export function filterCommands(commands: SlashCommand[], query: string): SlashCommand[] {
  const visible = commands.filter((c) => !c.hidden);
  if (!query) return visible;

  const q = query.toLowerCase();
  const rank = (c: SlashCommand): number => {
    if (c.name.startsWith(q)) return 0;
    if (c.aliases?.some((a) => a.toLowerCase().startsWith(q))) return 1;
    if (c.name.includes(q)) return 2;
    if (c.aliases?.some((a) => a.toLowerCase().includes(q))) return 3;
    return -1;
  };

  return visible
    .map((c) => ({ c, r: rank(c) }))
    .filter(({ r }) => r >= 0)
    .sort((a, b) => a.r - b.r || a.c.name.localeCompare(b.c.name))
    .map(({ c }) => c);
}

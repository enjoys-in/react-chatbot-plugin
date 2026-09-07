import type { ReactNode } from 'react';

// ─── Slash Commands ──────────────────────────────────────────────

/** Handed to a custom command's `handler`. */
export interface SlashCommandContext {
  /** Post a bot message. */
  addBotMessage: (text: string) => void;
  /** Post a quiet, centred system line. */
  addSystemMessage: (text: string) => void;
  /** Send text as the visitor, through the normal pipeline. */
  sendMessage: (text: string) => void;
  /** Jump the flow to a step. */
  goToStep: (stepId: string) => void;
  /** Return to the previous step. */
  goBack: () => void;
  /** Clear the conversation and start the flow again. */
  restart: () => void;
  /** Everything the flow and its forms have collected. */
  data: Record<string, unknown>;
  /** Text after the command — `/echo hi there` gives `'hi there'`. */
  args: string;
}

/**
 * A command the visitor can run by typing `/name`.
 *
 * The four built-ins (`help`, `back`, `cancel`, `restart`) are always present.
 * Adding one with the same `name` overrides it.
 *
 * @example
 * ```tsx
 * <ChatBot
 *   slashCommands={[
 *     {
 *       name: 'agent',
 *       description: 'Talk to a human',
 *       handler: (ctx) => ctx.goToStep('handoff'),
 *     },
 *   ]}
 * />
 * ```
 */
export interface SlashCommand {
  /** Command name, without the leading slash. */
  name: string;
  /** One-line description shown in the menu. */
  description?: string;
  /** Icon shown in the menu. */
  icon?: ReactNode;
  /** Extra terms the menu filter should match, e.g. `['clear']` for restart. */
  aliases?: string[];
  /** Hide from the menu but keep it typeable. */
  hidden?: boolean;
  /** What it does. Built-ins handle themselves and need no handler. */
  handler?: (ctx: SlashCommandContext) => void | Promise<void>;
}

// ─── Poll Plugin ─────────────────────────────────────────────────
// Create inline polls in chat. Users vote by clicking options.
// Results are tracked and emitted via events.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';

export interface PollOption {
  label: string;
  value: string;
}

export interface PollConfig {
  id: string;
  question: string;
  options: PollOption[];
  /** Allow multiple votes (default: false) */
  multiSelect?: boolean;
  /** Auto-close after N votes (0 = never) */
  closeAfter?: number;
}

export interface PollResult {
  pollId: string;
  votes: Record<string, number>;
  totalVotes: number;
  userVote?: string | string[];
}

export interface PollPluginOptions {
  /** Callback when vote is cast */
  onVote?: (pollId: string, value: string) => void;
  /** Callback when poll closes */
  onClose?: (result: PollResult) => void;
  /** Webhook to report results */
  webhookUrl?: string;
}

export function pollPlugin(options: PollPluginOptions = {}): ChatPlugin {
  const polls = new Map<string, PollConfig>();
  const results = new Map<string, Record<string, number>>();
  const userVotes = new Map<string, string[]>();

  return {
    name: 'poll',

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      // Create a new poll
      if (event.type === 'poll:create') {
        const config = event.payload as PollConfig | undefined;
        if (!config?.id || !config?.question || !config?.options?.length) return;

        polls.set(config.id, config);
        results.set(config.id, Object.fromEntries(config.options.map((o) => [o.value, 0])));
        userVotes.set(config.id, []);

        const optionsText = config.options.map((o, i) => `  ${i + 1}. ${o.label}`).join('\n');
        ctx.addBotMessage(`📊 **Poll: ${config.question}**\n\n${optionsText}\n\n_Reply with the option number or value to vote._`);
        ctx.emit('poll:created', config);
      }

      // Cast a vote
      if (event.type === 'poll:vote') {
        const payload = event.payload as { pollId: string; value: string } | undefined;
        if (!payload?.pollId || !payload?.value) return;

        const poll = polls.get(payload.pollId);
        const pollResults = results.get(payload.pollId);
        if (!poll || !pollResults) return;

        const validOption = poll.options.find((o) => o.value === payload.value || o.label === payload.value);
        if (!validOption) return;

        const votes = userVotes.get(payload.pollId) ?? [];
        if (!poll.multiSelect && votes.length > 0) return; // Already voted

        pollResults[validOption.value] = (pollResults[validOption.value] ?? 0) + 1;
        votes.push(validOption.value);
        userVotes.set(payload.pollId, votes);

        options.onVote?.(payload.pollId, validOption.value);
        ctx.emit('poll:voted', { pollId: payload.pollId, value: validOption.value });

        const total = Object.values(pollResults).reduce((a, b) => a + b, 0);

        // Auto-close
        if (poll.closeAfter && total >= poll.closeAfter) {
          const result: PollResult = { pollId: poll.id, votes: pollResults, totalVotes: total, userVote: votes };
          options.onClose?.(result);
          ctx.emit('poll:closed', result);

          const resultText = poll.options
            .map((o) => {
              const count = pollResults[o.value] ?? 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
              return `  ${o.label}: ${bar} ${pct}% (${count})`;
            })
            .join('\n');
          ctx.addBotMessage(`📊 **Poll Results: ${poll.question}**\n\n${resultText}\n\nTotal votes: ${total}`);

          if (options.webhookUrl) {
            fetch(options.webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(result),
            }).catch(() => { /* silent */ });
          }
        }
      }

      // Get results
      if (event.type === 'poll:results' && typeof event.payload === 'string') {
        const pollResults = results.get(event.payload);
        if (pollResults) {
          const total = Object.values(pollResults).reduce((a, b) => a + b, 0);
          ctx.emit('poll:result', { pollId: event.payload, votes: pollResults, totalVotes: total });
        }
      }

      // Close poll manually
      if (event.type === 'poll:close' && typeof event.payload === 'string') {
        const poll = polls.get(event.payload);
        const pollResults = results.get(event.payload);
        if (poll && pollResults) {
          const total = Object.values(pollResults).reduce((a, b) => a + b, 0);
          const result: PollResult = { pollId: poll.id, votes: pollResults, totalVotes: total };
          options.onClose?.(result);
          ctx.emit('poll:closed', result);
        }
      }
    },
  };
}

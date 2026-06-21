// ─── Summary Plugin ──────────────────────────────────────────────
// Generate conversation summaries — AI-powered or keyword extraction.
// Useful for support handoffs, ticket creation, and analytics.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';
import type { ChatMessage } from '../types/message';

export interface SummaryPluginOptions {
  /** AI endpoint for summarization (POST with { messages } body) */
  endpoint?: string;
  /** Request headers */
  headers?: Record<string, string>;
  /** Fallback: extract key points from messages locally (default: true) */
  localFallback?: boolean;
  /** Max messages to include in summary request (default: 50) */
  maxMessages?: number;
  /** Callback with generated summary */
  onSummary?: (summary: string) => void;
}

function localSummarize(messages: ChatMessage[]): string {
  const userMsgs = messages.filter((m) => m.sender === 'user' && m.text);
  const botMsgs = messages.filter((m) => m.sender === 'bot' && m.text);

  const lines: string[] = [];
  lines.push(`📊 Conversation Summary (${messages.length} messages)`);
  lines.push(`• User messages: ${userMsgs.length}`);
  lines.push(`• Bot messages: ${botMsgs.length}`);

  if (userMsgs.length > 0) {
    lines.push(`• First user message: "${userMsgs[0]!.text!.slice(0, 60)}..."`);
    lines.push(`• Last user message: "${userMsgs[userMsgs.length - 1]!.text!.slice(0, 60)}..."`);
  }

  // Extract keywords (simple word frequency)
  const words = userMsgs
    .flatMap((m) => (m.text ?? '').toLowerCase().split(/\s+/))
    .filter((w) => w.length > 3);
  const freq = new Map<string, number>();
  words.forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1));
  const topWords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);

  if (topWords.length > 0) {
    lines.push(`• Key topics: ${topWords.join(', ')}`);
  }

  return lines.join('\n');
}

export function summaryPlugin(options: SummaryPluginOptions = {}): ChatPlugin {
  const maxMessages = options.maxMessages ?? 50;

  return {
    name: 'summary',

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'summary:generate') {
        const messages = ctx.getMessages().slice(-maxMessages);

        if (options.endpoint) {
          fetch(options.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...options.headers },
            body: JSON.stringify({ messages: messages.map((m) => ({ sender: m.sender, text: m.text })) }),
          })
            .then((r) => r.json())
            .then((data: { summary?: string }) => {
              const summary = data.summary ?? 'Unable to generate summary.';
              options.onSummary?.(summary);
              ctx.addBotMessage(summary);
              ctx.emit('summary:result', summary);
            })
            .catch(() => {
              if (options.localFallback !== false) {
                const summary = localSummarize(messages);
                options.onSummary?.(summary);
                ctx.addBotMessage(summary);
                ctx.emit('summary:result', summary);
              }
            });
        } else if (options.localFallback !== false) {
          const summary = localSummarize(messages);
          options.onSummary?.(summary);
          ctx.addBotMessage(summary);
          ctx.emit('summary:result', summary);
        }
      }
    },
  };
}

// ─── Transcript Export Plugin ────────────────────────────────────
// Export chat history as text, JSON, or downloadable file.
// Enable via `enableTranscriptExport` prop or directly as plugin.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';
import type { ChatMessage } from '../types/message';

export type TranscriptFormat = 'text' | 'json' | 'csv' | 'html';

export interface TranscriptExportPluginOptions {
  /** Export format (default: 'text') */
  format?: TranscriptFormat;
  /** Filename prefix (default: 'chat-transcript') */
  filename?: string;
  /** Include timestamps (default: true) */
  includeTimestamps?: boolean;
  /** Callback with exported content */
  onExport?: (content: string, format: TranscriptFormat) => void;
  /** Custom header text in exported file */
  header?: string;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}

function toText(messages: ChatMessage[], opts: TranscriptExportPluginOptions): string {
  const lines: string[] = [];
  if (opts.header) lines.push(opts.header, '');
  lines.push(`Chat Transcript — ${formatTimestamp(Date.now())}`, '─'.repeat(40), '');
  for (const msg of messages) {
    const time = opts.includeTimestamps !== false ? `[${formatTimestamp(msg.timestamp)}] ` : '';
    const sender = msg.sender === 'user' ? 'You' : msg.sender === 'bot' ? 'Bot' : 'System';
    lines.push(`${time}${sender}: ${msg.text ?? '[attachment]'}`);
  }
  return lines.join('\n');
}

function toCSV(messages: ChatMessage[], opts: TranscriptExportPluginOptions): string {
  const rows = ['timestamp,sender,text'];
  for (const msg of messages) {
    const text = (msg.text ?? '').replace(/"/g, '""');
    rows.push(`"${formatTimestamp(msg.timestamp)}","${msg.sender}","${text}"`);
  }
  return rows.join('\n');
}

function toHTML(messages: ChatMessage[], opts: TranscriptExportPluginOptions): string {
  const rows = messages.map((msg) => {
    const time = opts.includeTimestamps !== false ? `<span style="color:#888">[${formatTimestamp(msg.timestamp)}]</span> ` : '';
    const sender = msg.sender === 'user' ? '<b>You</b>' : msg.sender === 'bot' ? '<b>Bot</b>' : '<b>System</b>';
    return `<p>${time}${sender}: ${msg.text ?? '<i>[attachment]</i>'}</p>`;
  }).join('\n');
  return `<!DOCTYPE html><html><head><title>Chat Transcript</title></head><body><h1>Chat Transcript</h1><p>${formatTimestamp(Date.now())}</p><hr/>${rows}</body></html>`;
}

function download(content: string, filename: string, mime: string) {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function transcriptExportPlugin(options: TranscriptExportPluginOptions = {}): ChatPlugin {
  const format = options.format ?? 'text';
  const filenamePrefix = options.filename ?? 'chat-transcript';

  return {
    name: 'transcriptExport',

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'transcript:export') {
        const fmt = (typeof event.payload === 'string' ? event.payload : format) as TranscriptFormat;
        const messages = ctx.getMessages();
        let content: string;
        let mime: string;
        let ext: string;

        switch (fmt) {
          case 'json':
            content = JSON.stringify(messages, null, 2);
            mime = 'application/json';
            ext = 'json';
            break;
          case 'csv':
            content = toCSV(messages, options);
            mime = 'text/csv';
            ext = 'csv';
            break;
          case 'html':
            content = toHTML(messages, options);
            mime = 'text/html';
            ext = 'html';
            break;
          default:
            content = toText(messages, options);
            mime = 'text/plain';
            ext = 'txt';
        }

        options.onExport?.(content, fmt);
        download(content, `${filenamePrefix}-${Date.now()}.${ext}`, mime);
        ctx.emit('transcript:exported', { format: fmt, size: content.length });
      }
    },
  };
}

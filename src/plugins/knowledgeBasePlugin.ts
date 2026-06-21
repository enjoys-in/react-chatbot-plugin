// ─── Knowledge Base Plugin ───────────────────────────────────────
// Search FAQ/docs inline and surface answers before human handoff.
// Supports local articles array or remote API endpoint.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';
import type { ChatMessage } from '../types/message';

export interface KBArticle {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  url?: string;
}

export interface KnowledgeBasePluginOptions {
  /** Local articles for fuzzy search */
  articles?: KBArticle[];
  /** Remote search endpoint (GET with ?q= param) */
  endpoint?: string;
  /** Request headers */
  headers?: Record<string, string>;
  /** Auto-search user messages against KB (default: false) */
  autoSearch?: boolean;
  /** Minimum confidence to show result (0-1, default: 0.3) */
  threshold?: number;
  /** Max results to show (default: 3) */
  maxResults?: number;
  /** Callback on search result */
  onResult?: (articles: KBArticle[]) => void;
}

function fuzzyMatch(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return 1;
  const words = q.split(/\s+/);
  const matched = words.filter((w) => t.includes(w));
  return matched.length / words.length;
}

function searchLocal(query: string, articles: KBArticle[], threshold: number, max: number): KBArticle[] {
  return articles
    .map((a) => ({
      article: a,
      score: Math.max(
        fuzzyMatch(query, a.title),
        fuzzyMatch(query, a.content),
        ...(a.tags ?? []).map((t) => fuzzyMatch(query, t)),
      ),
    }))
    .filter((r) => r.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((r) => r.article);
}

export function knowledgeBasePlugin(options: KnowledgeBasePluginOptions = {}): ChatPlugin {
  const threshold = options.threshold ?? 0.3;
  const maxResults = options.maxResults ?? 3;

  const doSearch = async (query: string, ctx: PluginContext) => {
    let results: KBArticle[] = [];

    if (options.endpoint) {
      try {
        const url = `${options.endpoint}?q=${encodeURIComponent(query)}&limit=${maxResults}`;
        const res = await fetch(url, { headers: options.headers });
        const data = await res.json();
        results = (data.articles ?? data.results ?? data) as KBArticle[];
      } catch { /* fallback to local */ }
    }

    if (results.length === 0 && options.articles) {
      results = searchLocal(query, options.articles, threshold, maxResults);
    }

    if (results.length > 0) {
      options.onResult?.(results);
      const text = results
        .map((a, i) => `${i + 1}. **${a.title}**\n   ${a.content.slice(0, 100)}${a.url ? `\n   [Read more](${a.url})` : ''}`)
        .join('\n\n');
      ctx.addBotMessage(`📚 I found these articles:\n\n${text}`);
      ctx.emit('kb:results', results);
    }
  };

  return {
    name: 'knowledgeBase',

    onMessage(message: ChatMessage, ctx: PluginContext) {
      if (options.autoSearch && message.sender === 'user' && message.text) {
        doSearch(message.text, ctx);
      }
      return message;
    },

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'kb:search' && typeof event.payload === 'string') {
        doSearch(event.payload, ctx);
      }
    },
  };
}

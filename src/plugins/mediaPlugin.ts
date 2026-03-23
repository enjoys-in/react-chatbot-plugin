import type { ChatPlugin, PluginContext } from '../types/plugin';

/**
 * Media Plugin — adds support for rich media messages (images, videos, cards)
 */
export function mediaPlugin(options?: {
  allowedTypes?: ('image' | 'video' | 'audio' | 'card')[];
  onMediaRender?: (type: string, url: string) => void;
}): ChatPlugin {
  const allowed = new Set(options?.allowedTypes ?? ['image', 'video', 'audio', 'card']);

  const processMediaTags = (text: string): string => {
    if (!text) return text;

    let result = text;

    // [image:url] → HTML img
    if (allowed.has('image')) {
      result = result.replace(/\[image:([^\]]+)\]/g, (_, url: string) => {
        options?.onMediaRender?.('image', url);
        return `![image](${url})`;
      });
    }

    // [video:url] → markdown video link
    if (allowed.has('video')) {
      result = result.replace(/\[video:([^\]]+)\]/g, (_, url: string) => {
        options?.onMediaRender?.('video', url);
        return `🎬 [Watch video](${url})`;
      });
    }

    // [audio:url] → markdown audio link
    if (allowed.has('audio')) {
      result = result.replace(/\[audio:([^\]]+)\]/g, (_, url: string) => {
        options?.onMediaRender?.('audio', url);
        return `🔊 [Listen](${url})`;
      });
    }

    return result;
  };

  return {
    name: 'media',

    onInit(ctx) {
      // Allow programmatic media injection
      ctx.on('media:send', (...args: unknown[]) => {
        const config = args[0] as { type: string; url: string; caption?: string } | undefined;
        if (config && allowed.has(config.type as 'image')) {
          const text = config.caption
            ? `${processMediaTags(`[${config.type}:${config.url}]`)}\n${config.caption}`
            : processMediaTags(`[${config.type}:${config.url}]`);
          ctx.addBotMessage(text);
        }
      });
    },

    onMessage(message) {
      if (message.sender === 'bot' && message.text) {
        const processed = processMediaTags(message.text);
        if (processed !== message.text) {
          return { ...message, text: processed };
        }
      }
    },
  };
}

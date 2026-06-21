// ─── Notification Badge Plugin ───────────────────────────────────
// Track unread messages and emit badge count.
// Works with the `showNotificationBadge` prop on the Launcher.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';
import type { ChatMessage } from '../types/message';

export interface NotificationBadgePluginOptions {
  /** Play sound on new message (default: false) */
  playSound?: boolean;
  /** Sound URL */
  soundUrl?: string;
  /** Show browser notification (default: false) */
  browserNotification?: boolean;
  /** Update document.title with count (default: false) */
  updateTitle?: boolean;
  /** Original page title */
  originalTitle?: string;
}

export function notificationBadgePlugin(options: NotificationBadgePluginOptions = {}): ChatPlugin {
  let unreadCount = 0;
  let isOpen = false;
  const originalTitle = options.originalTitle ?? (typeof document !== 'undefined' ? document.title : '');

  const updateDocTitle = () => {
    if (options.updateTitle && typeof document !== 'undefined') {
      document.title = unreadCount > 0 ? `(${unreadCount}) ${originalTitle}` : originalTitle;
    }
  };

  const playNotifSound = () => {
    if (options.playSound && options.soundUrl && typeof Audio !== 'undefined') {
      const audio = new Audio(options.soundUrl);
      audio.volume = 0.5;
      audio.play().catch(() => { /* blocked by browser */ });
    }
  };

  return {
    name: 'notificationBadge',

    onInit(ctx: PluginContext) {
      ctx.setData('__unreadCount', 0);

      ctx.on('chatOpen', () => {
        isOpen = true;
        unreadCount = 0;
        ctx.setData('__unreadCount', 0);
        ctx.emit('badge:count', 0);
        updateDocTitle();
      });

      ctx.on('chatClose', () => {
        isOpen = false;
      });
    },

    onMessage(message: ChatMessage, ctx: PluginContext) {
      if (message.sender === 'bot' && !isOpen) {
        unreadCount++;
        ctx.setData('__unreadCount', unreadCount);
        ctx.emit('badge:count', unreadCount);
        updateDocTitle();
        playNotifSound();

        if (options.browserNotification && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification('New message', { body: message.text ?? 'You have a new message' });
        }
      }
      return message;
    },

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'badge:reset') {
        unreadCount = 0;
        ctx.setData('__unreadCount', 0);
        ctx.emit('badge:count', 0);
        updateDocTitle();
      }

      if (event.type === 'badge:get') {
        ctx.emit('badge:count', unreadCount);
      }
    },
  };
}

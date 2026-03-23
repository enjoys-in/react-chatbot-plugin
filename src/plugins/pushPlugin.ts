import type { ChatPlugin } from '../types/plugin';

/**
 * Push Plugin — sends browser push notifications for new messages
 */
export function pushPlugin(options?: {
  title?: string;
  icon?: string;
  onlyWhenHidden?: boolean;
  requestPermission?: boolean;
}): ChatPlugin {
  const title = options?.title ?? 'New Message';
  const onlyWhenHidden = options?.onlyWhenHidden ?? true;

  const canNotify = () =>
    typeof Notification !== 'undefined' && Notification.permission === 'granted';

  const shouldNotify = () =>
    canNotify() && (!onlyWhenHidden || document.hidden);

  return {
    name: 'push',

    async onInit() {
      if (options?.requestPermission !== false && typeof Notification !== 'undefined' && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    },

    onMessage(message) {
      if (message.sender === 'bot' && message.text && shouldNotify()) {
        new Notification(title, {
          body: message.text.slice(0, 200),
          icon: options?.icon,
          tag: 'chatbot-msg',
        });
      }
    },
  };
}

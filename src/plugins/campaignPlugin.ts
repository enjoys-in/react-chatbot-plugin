import type { ChatPlugin, PluginContext } from '../types/plugin';
import { TimerManager } from './utils/timer';

type TriggerType = 'exitIntent' | 'idle' | 'scroll' | 'pageLoad' | 'custom';

interface CampaignConfig {
  trigger: TriggerType;
  message: string;
  delay?: number;
  maxShows?: number;
  flowStep?: string;
}

/**
 * Campaign Plugin — starts flows or shows messages based on user behavior triggers
 */
export function campaignPlugin(options: {
  campaigns: CampaignConfig[];
  onTrigger?: (campaign: CampaignConfig, ctx: PluginContext) => void;
}): ChatPlugin {
  const timers = new TimerManager();
  const showCounts = new Map<number, number>();

  return {
    name: 'campaign',

    onInit(ctx) {
      options.campaigns.forEach((campaign, idx) => {
        const maxShows = campaign.maxShows ?? 1;

        const fire = () => {
          const count = showCounts.get(idx) ?? 0;
          if (count >= maxShows) return;
          showCounts.set(idx, count + 1);

          ctx.addBotMessage(campaign.message);
          if (campaign.flowStep) {
            ctx.emit('campaign:flowStart', { step: campaign.flowStep });
          }
          options.onTrigger?.(campaign, ctx);
          ctx.emit('campaign:triggered', { trigger: campaign.trigger, idx });
        };

        switch (campaign.trigger) {
          case 'pageLoad':
            timers.setTimeout(`campaign_${idx}`, fire, campaign.delay ?? 0);
            break;

          case 'idle':
            timers.setTimeout(`campaign_${idx}`, fire, campaign.delay ?? 30000);
            break;

          case 'exitIntent':
            if (typeof document !== 'undefined') {
              const handler = (e: MouseEvent) => {
                if (e.clientY <= 0) {
                  fire();
                  document.removeEventListener('mouseleave', handler);
                }
              };
              document.addEventListener('mouseleave', handler);
            }
            break;

          case 'scroll':
            if (typeof window !== 'undefined') {
              const handler = () => {
                const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
                if (scrollPct > 0.7) {
                  fire();
                  window.removeEventListener('scroll', handler);
                }
              };
              window.addEventListener('scroll', handler, { passive: true });
            }
            break;

          case 'custom':
            ctx.on(`campaign:fire:${idx}`, fire);
            break;
        }
      });
    },

    onDestroy() {
      timers.destroy();
    },
  };
}

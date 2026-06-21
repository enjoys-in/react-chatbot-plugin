// ─── Confetti Plugin ─────────────────────────────────────────────
// Trigger celebration animations on flow completion, milestones, etc.
// Lightweight CSS-based confetti — no external dependencies.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';

export interface ConfettiPluginOptions {
  /** Events that auto-trigger confetti (default: ['flowEnd']) */
  triggers?: string[];
  /** Duration in ms (default: 3000) */
  duration?: number;
  /** Number of particles (default: 50) */
  particleCount?: number;
  /** Custom colors */
  colors?: string[];
  /** Callback when confetti fires */
  onFire?: () => void;
}

export function confettiPlugin(options: ConfettiPluginOptions = {}): ChatPlugin {
  const triggers = options.triggers ?? ['flowEnd'];
  const duration = options.duration ?? 3000;
  const particleCount = options.particleCount ?? 50;
  const colors = options.colors ?? ['#6C5CE7', '#A29BFE', '#fd79a8', '#fdcb6e', '#00b894', '#0984e3'];

  const fireConfetti = () => {
    if (typeof document === 'undefined') return;
    options.onFire?.();

    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;overflow:hidden;';
    document.body.appendChild(container);

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * 100;
      const delay = Math.random() * 500;
      const size = Math.random() * 8 + 4;
      const rotation = Math.random() * 360;

      particle.style.cssText = `
        position:absolute;top:-10px;left:${x}%;
        width:${size}px;height:${size}px;
        background:${color};border-radius:${Math.random() > 0.5 ? '50%' : '0'};
        transform:rotate(${rotation}deg);
        animation:confetti-fall ${duration}ms ease-in ${delay}ms forwards;
        opacity:0.9;
      `;
      container.appendChild(particle);
    }

    // Inject keyframes if not present
    if (!document.getElementById('confetti-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.textContent = `
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => container.remove(), duration + 1000);
  };

  return {
    name: 'confetti',

    onEvent(event: ChatPluginEvent, _ctx: PluginContext) {
      if (triggers.includes(event.type)) {
        fireConfetti();
      }
      if (event.type === 'confetti:fire') {
        fireConfetti();
      }
    },
  };
}

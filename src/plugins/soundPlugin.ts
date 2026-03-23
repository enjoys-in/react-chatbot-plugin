import type { ChatPlugin } from '../types/plugin';

/**
 * Sound Plugin — plays sound on new bot messages
 */
export function soundPlugin(options?: {
  src?: string;
  volume?: number;
  onlyWhenHidden?: boolean;
}): ChatPlugin {
  const volume = Math.min(1, Math.max(0, options?.volume ?? 0.5));
  const onlyWhenHidden = options?.onlyWhenHidden ?? false;
  let audioCtx: AudioContext | null = null;

  const playDefault = () => {
    if (!audioCtx) audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 800;
    gain.gain.value = volume * 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.stop(audioCtx.currentTime + 0.15);
  };

  const play = () => {
    if (onlyWhenHidden && !document.hidden) return;
    if (options?.src) {
      const audio = new Audio(options.src);
      audio.volume = volume;
      audio.play().catch(() => { /* user hasn't interacted yet */ });
    } else {
      try { playDefault(); } catch { /* AudioContext not available */ }
    }
  };

  return {
    name: 'sound',

    onMessage(message) {
      if (message.sender === 'bot') play();
    },

    onDestroy() {
      audioCtx?.close().catch(() => {});
      audioCtx = null;
    },
  };
}

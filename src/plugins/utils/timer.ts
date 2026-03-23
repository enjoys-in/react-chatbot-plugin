/** Shared timer utility for plugins that schedule delayed actions */
export class TimerManager {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private intervals = new Map<string, ReturnType<typeof setInterval>>();

  setTimeout(id: string, fn: () => void, ms: number): void {
    this.clearTimeout(id);
    this.timers.set(id, setTimeout(() => { this.timers.delete(id); fn(); }, ms));
  }

  setInterval(id: string, fn: () => void, ms: number): void {
    this.clearInterval(id);
    this.intervals.set(id, setInterval(fn, ms));
  }

  clearTimeout(id: string): void {
    const t = this.timers.get(id);
    if (t) { clearTimeout(t); this.timers.delete(id); }
  }

  clearInterval(id: string): void {
    const i = this.intervals.get(id);
    if (i) { clearInterval(i); this.intervals.delete(id); }
  }

  destroy(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.intervals.forEach((i) => clearInterval(i));
    this.timers.clear();
    this.intervals.clear();
  }
}

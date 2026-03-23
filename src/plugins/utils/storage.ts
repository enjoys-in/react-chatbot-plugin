/** Shared browser storage utility for plugins */
export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export function createStorageAdapter(type: 'local' | 'session' = 'local'): StorageAdapter {
  const store = type === 'session' ? sessionStorage : localStorage;
  return {
    get: (key) => { try { return store.getItem(key); } catch { return null; } },
    set: (key, value) => { try { store.setItem(key, value); } catch { /* storage full */ } },
    remove: (key) => { try { store.removeItem(key); } catch { /* noop */ } },
  };
}

export function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

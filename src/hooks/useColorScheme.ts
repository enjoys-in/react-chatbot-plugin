import { useCallback, useSyncExternalStore } from 'react';
import type { ChatColorMode, ChatTheme } from '../types';
import { onColorSchemeChange, prefersDarkScheme } from '../styles/theme';

/**
 * Resolve a theme `mode` into a concrete `'light' | 'dark'`.
 *
 * With `mode: 'auto'` this tracks the visitor's `prefers-color-scheme` and
 * re-renders when they change it mid-session. For a fixed mode the snapshot is
 * constant, so no subscription work reaches React and nothing re-renders.
 *
 * Server-safe: renders light until the client hydrates.
 */
export function useColorScheme(mode: ChatTheme['mode']): ChatColorMode {
  const isAuto = mode === 'auto';

  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      isAuto ? onColorSchemeChange(() => onStoreChange()) : () => {},
    [isAuto],
  );

  const getSnapshot = useCallback(
    () => (isAuto ? prefersDarkScheme() : false),
    [isAuto],
  );

  // The server can't know the visitor's preference, so it commits to light.
  const getServerSnapshot = useCallback(() => false, []);

  const systemPrefersDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (isAuto) return systemPrefersDark ? 'dark' : 'light';
  return mode ?? 'light';
}

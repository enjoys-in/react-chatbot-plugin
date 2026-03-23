import type { ChatPlugin, PluginContext } from '../types/plugin';
import { createStorageAdapter } from './utils/storage';

/**
 * Auth Plugin — manages user authentication and identity
 */
export function authPlugin(options: {
  type?: 'jwt' | 'session' | 'custom';
  tokenKey?: string;
  storage?: 'local' | 'session';
  onAuth?: (token: string, ctx: PluginContext) => void;
  onAuthExpired?: (ctx: PluginContext) => void;
  validateToken?: (token: string) => boolean;
}): ChatPlugin {
  const tokenKey = options.tokenKey ?? 'chatbot_auth_token';
  const store = createStorageAdapter(options.storage ?? 'local');

  const isExpired = (token: string): boolean => {
    if (options.validateToken) return !options.validateToken(token);
    if (options.type === 'jwt') {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]!));
        return payload.exp ? payload.exp * 1000 < Date.now() : false;
      } catch { return true; }
    }
    return false;
  };

  return {
    name: 'auth',

    onInit(ctx) {
      const token = store.get(tokenKey);
      if (token) {
        if (isExpired(token)) {
          store.remove(tokenKey);
          options.onAuthExpired?.(ctx);
          ctx.emit('auth:expired', {});
        } else {
          ctx.setData('authToken', token);
          options.onAuth?.(token, ctx);
          ctx.emit('auth:restored', { token });
        }
      }

      // Listen for login events
      ctx.on('auth:login', (...args: unknown[]) => {
        const token = args[0] as string;
        if (token) {
          store.set(tokenKey, token);
          ctx.setData('authToken', token);
          ctx.emit('auth:success', { token });
        }
      });

      ctx.on('auth:logout', () => {
        store.remove(tokenKey);
        ctx.setData('authToken', undefined);
        ctx.emit('auth:loggedOut', {});
      });
    },
  };
}

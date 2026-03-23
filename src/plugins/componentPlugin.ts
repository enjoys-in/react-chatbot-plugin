import type { ChatPlugin, PluginContext } from '../types/plugin';

/**
 * Component Plugin — injects custom component messages into chat via events
 */
export function componentPlugin(options?: {
  components?: Record<string, string>;
  onRender?: (componentKey: string, ctx: PluginContext) => void;
}): ChatPlugin {
  return {
    name: 'component',

    onInit(ctx) {
      // Listen for component injection requests
      ctx.on('component:inject', (...args: unknown[]) => {
        const key = args[0] as string;
        if (key) {
          ctx.emit('component:render', { component: key });
          options?.onRender?.(key, ctx);
        }
      });

      // Allow aliased rendering
      if (options?.components) {
        for (const [alias, componentKey] of Object.entries(options.components)) {
          ctx.on(`component:${alias}`, () => {
            ctx.emit('component:render', { component: componentKey });
          });
        }
      }
    },
  };
}

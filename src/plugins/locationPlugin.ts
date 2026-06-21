// ─── Location Plugin ─────────────────────────────────────────────
// Share GPS location in chat via Geolocation API.
// Renders coordinates and optional map link.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';

export interface LocationPluginOptions {
  /** Map provider for link generation (default: 'google') */
  mapProvider?: 'google' | 'openstreetmap' | 'apple';
  /** High accuracy GPS (default: false) */
  highAccuracy?: boolean;
  /** Timeout in ms (default: 10000) */
  timeout?: number;
  /** Callback with location data */
  onLocation?: (lat: number, lng: number) => void;
  /** Custom message format */
  messageFormat?: (lat: number, lng: number, url: string) => string;
}

function getMapUrl(lat: number, lng: number, provider: string): string {
  switch (provider) {
    case 'openstreetmap':
      return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
    case 'apple':
      return `https://maps.apple.com/?ll=${lat},${lng}`;
    default:
      return `https://www.google.com/maps?q=${lat},${lng}`;
  }
}

export function locationPlugin(options: LocationPluginOptions = {}): ChatPlugin {
  const provider = options.mapProvider ?? 'google';
  const timeout = options.timeout ?? 10000;

  return {
    name: 'location',

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'location:share') {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
          ctx.addBotMessage('📍 Location sharing is not supported in this browser.');
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: lat, longitude: lng } = position.coords;
            const url = getMapUrl(lat, lng, provider);

            options.onLocation?.(lat, lng);

            const text = options.messageFormat
              ? options.messageFormat(lat, lng, url)
              : `📍 Location shared: [${lat.toFixed(5)}, ${lng.toFixed(5)}](${url})`;

            ctx.sendMessage(text);
            ctx.emit('location:shared', { lat, lng, url });
          },
          (error) => {
            ctx.addBotMessage(`📍 Unable to get location: ${error.message}`);
            ctx.emit('location:error', error.message);
          },
          {
            enableHighAccuracy: options.highAccuracy ?? false,
            timeout,
            maximumAge: 0,
          },
        );
      }
    },
  };
}

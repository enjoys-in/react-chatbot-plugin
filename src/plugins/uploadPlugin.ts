import type { ChatPlugin } from '../types/plugin';

/**
 * Upload Plugin — handles file uploads to external storage (S3, etc.)
 */
export function uploadPlugin(options: {
  endpoint: string;
  storage?: 's3' | 'gcs' | 'azure' | 'custom';
  headers?: Record<string, string>;
  maxSize?: number;
  allowedTypes?: string[];
  onUploadStart?: (file: { name: string; size: number }) => void;
  onUploadComplete?: (file: { name: string; url: string }) => void;
  onUploadError?: (file: { name: string }, error: Error) => void;
}): ChatPlugin {
  return {
    name: 'upload',

    onInit(ctx) {
      ctx.on('file:upload', async (...args: unknown[]) => {
        const files = args[0] as File[];
        if (!files?.length) return;

        for (const file of files) {
          // Validate size
          if (options.maxSize && file.size > options.maxSize) {
            options.onUploadError?.({ name: file.name }, new Error(`File too large: ${file.size} > ${options.maxSize}`));
            continue;
          }

          // Validate type
          if (options.allowedTypes?.length && !options.allowedTypes.some(t => file.type.startsWith(t))) {
            options.onUploadError?.({ name: file.name }, new Error(`File type not allowed: ${file.type}`));
            continue;
          }

          options.onUploadStart?.({ name: file.name, size: file.size });

          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('storage', options.storage ?? 'custom');

            const res = await fetch(options.endpoint, {
              method: 'POST',
              headers: options.headers,
              body: formData,
            });

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

            const result = await res.json() as { url?: string };
            options.onUploadComplete?.({ name: file.name, url: result.url ?? '' });
            ctx.emit('file:uploaded', { name: file.name, url: result.url });
          } catch (err) {
            options.onUploadError?.({ name: file.name }, err as Error);
          }
        }
      });
    },
  };
}

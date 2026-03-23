/** Shared HTTP utility for plugins that communicate with external endpoints */
export interface HttpOptions {
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export async function postJSON(
  url: string,
  body: unknown,
  headers?: Record<string, string>,
  timeout = 10000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function getJSON<T = unknown>(
  url: string,
  headers?: Record<string, string>,
  timeout = 10000,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', ...headers },
      signal: controller.signal,
    });
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

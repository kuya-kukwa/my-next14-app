import { authHeader } from '@/lib/session';

export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json', ...authHeader(), ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {}

    if (body && typeof body === 'object') {
      const obj = body as Record<string, unknown>;
      // Prefer explicit message when available
      const msg = (typeof obj.message === 'string' && obj.message)
        || (typeof obj.error === 'string' && obj.error)
        || `Request failed with ${res.status}`;
      throw new Error(msg);
    }

    throw new Error(`Request failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(url: string, init?: RequestInit) => http<T>(url, { ...init, method: 'GET' }),
  post: <T>(url: string, body?: unknown, init?: RequestInit) =>
    http<T>(url, { ...init, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(url: string, body?: unknown, init?: RequestInit) =>
    http<T>(url, { ...init, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  del: <T>(url: string, init?: RequestInit) => http<T>(url, { ...init, method: 'DELETE' }),
};

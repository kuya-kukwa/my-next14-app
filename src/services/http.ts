import { authHeader } from '@/lib/session';

const DEFAULT_TIMEOUT = 10000; // 10 seconds for better UX

export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const res = await fetch(input, {
      headers: { 'Content-Type': 'application/json', ...authHeader(), ...(init?.headers || {}) },
      ...init,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
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
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle abort/timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection and try again');
    }
    
    throw error;
  }
}

export const api = {
  get: <T>(url: string, init?: RequestInit) => http<T>(url, { ...init, method: 'GET' }),
  post: <T>(url: string, body?: unknown, init?: RequestInit) =>
    http<T>(url, { ...init, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(url: string, body?: unknown, init?: RequestInit) =>
    http<T>(url, { ...init, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  del: <T>(url: string, init?: RequestInit) => http<T>(url, { ...init, method: 'DELETE' }),
};

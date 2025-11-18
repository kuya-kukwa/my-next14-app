import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const TOKEN_KEY = 'appwrite_jwt';

export function getToken(): string | null {
  const value = getCookie(TOKEN_KEY);
  return typeof value === 'string' ? value : null;
}

export function setToken(jwt: string, maxAgeSeconds = 60 * 15) {
  setCookie(TOKEN_KEY, jwt, {
    maxAge: maxAgeSeconds,
    sameSite: 'lax',
    path: '/',
  });
}

export function clearToken() {
  deleteCookie(TOKEN_KEY, { path: '/' });
}

export function authHeader(): Record<string, string> {
  const jwt = getToken();
  return jwt ? { Authorization: `Bearer ${jwt}` } : {} as Record<string, string>;
}

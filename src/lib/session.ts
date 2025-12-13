import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const TOKEN_KEY = 'appwrite_jwt';

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    // Server-side: return null to avoid hydration mismatches
    return null;
  }
  const value = getCookie(TOKEN_KEY);
  return typeof value === 'string' ? value : null;
}

export function setToken(jwt: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  setCookie(TOKEN_KEY, jwt, {
    maxAge: maxAgeSeconds,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
}

export function clearToken() {
  deleteCookie(TOKEN_KEY, { path: '/' });
}

export function authHeader(): Record<string, string> {
  const jwt = getToken();
  return jwt ? { Authorization: `Bearer ${jwt}` } : {} as Record<string, string>;
}

// Check if token is expired
export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired (no buffer for accurate detection)
    return payload.exp && payload.exp < currentTime;
  } catch {
    return true;
  }
}

// Check if token is about to expire (within 5 minutes)
export function isTokenExpiringSoon(): boolean {
  const token = getToken();
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;

    // Check if token expires within 5 minutes
    return payload.exp && payload.exp < (currentTime + fiveMinutes) && payload.exp >= currentTime;
  } catch {
    return false;
  }
}

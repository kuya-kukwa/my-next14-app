import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const TOKEN_KEY = 'appwrite_jwt';
const ACTIVITY_KEY = 'last_activity';

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    // Server-side: return null to avoid hydration mismatches
    return null;
  }
  const value = getCookie(TOKEN_KEY);
  return typeof value === 'string' ? value : null;
}

/**
 * Store JWT token in cookie
 * 
 * Security notes:
 * - sameSite: 'strict' prevents CSRF attacks
 * - secure: true in production ensures HTTPS-only
 * - httpOnly cannot be set client-side; consider server-side cookie approach
 * 
 * @param jwt - JWT token from Appwrite
 * @param maxAgeSeconds - Cookie lifetime (default 7 days)
 */
export function setToken(jwt: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  setCookie(TOKEN_KEY, jwt, {
    maxAge: maxAgeSeconds,
    sameSite: 'strict',
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

/**
 * Get last activity timestamp
 */
export function getLastActivity(): number {
  if (typeof window === 'undefined') return 0;
  const lastActivity = getCookie(ACTIVITY_KEY);
  return lastActivity ? parseInt(lastActivity as string, 10) : 0;
}

/**
 * Update last activity timestamp
 */
export function updateLastActivity(): void {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  setCookie(ACTIVITY_KEY, now.toString(), {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
}

/**
 * Check if session should be refreshed (token expires within 2 hours and not yet expired)
 */
export function shouldRefreshSession(): boolean {
  if (isTokenExpired()) return false;
  
  const token = getToken();
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;
    
    // Refresh if less than 2 hours remaining (more conservative than 1 hour)
    return timeUntilExpiry > 0 && timeUntilExpiry < 7200;
  } catch {
    return false;
  }
}

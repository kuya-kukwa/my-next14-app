import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { SESSION_CONFIG } from '@/config/queryConfig';

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
 * - Cookie expiration synced with JWT expiration to prevent stale auth state
 * 
 * @param jwt - JWT token from Appwrite
 * @param maxAgeSeconds - Cookie lifetime fallback (default 3 days)
 */
export function setToken(jwt: string, maxAgeSeconds = SESSION_CONFIG.TOKEN_MAX_AGE) {
  const expirationTime = getTokenExpirationTime(jwt);
  const currentTime = Math.floor(Date.now() / 1000);
  let maxAge = maxAgeSeconds;
  
  if (expirationTime) {
    const calculatedMaxAge = expirationTime - currentTime;
    // Only use JWT expiration if it's in the future (positive value)
    if (calculatedMaxAge > 0) {
      maxAge = calculatedMaxAge;
    } else {
      // Token is already expired, don't set it
      console.warn('[Session] Attempting to set an expired token');
      return;
    }
  }
  
  setCookie(TOKEN_KEY, jwt, {
    maxAge,
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

/**
 * Extract user ID from JWT token
 */
export function getUserIdFromToken(): string | null {
  const token = getToken();
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    // Appwrite JWT contains userId field
    return payload.userId || null;
  } catch {
    return null;
  }
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
 * Extract expiration time from JWT token
 * @param token - JWT token string
 * @returns Expiration timestamp in seconds since epoch, or null if invalid
 */
function getTokenExpirationTime(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp || null;
  } catch {
    return null;
  }
}

/**
 * Check if session should be refreshed (token expires within 12 hours and not yet expired)
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
    
    // Refresh if less than configured warning threshold remaining
    return timeUntilExpiry > 0 && timeUntilExpiry < SESSION_CONFIG.TOKEN_WARNING_THRESHOLD;
  } catch {
    return false;
  }
}

/**
 * Refresh the JWT session by creating a new JWT from the current session
 * Returns false if there's no active session or token is expired
 */
export async function refreshSession(): Promise<boolean> {
  try {
    // If token is already expired, can't refresh - user needs to sign in again
    if (isTokenExpired()) {
      console.warn('[Session] Cannot refresh expired token - user must sign in again');
      clearToken();
      return false;
    }
    
    const { account } = await import('@/lib/appwriteClient').then(m => m.getAppwriteBrowser());
    
    // Create new JWT from current session
    const jwtRes = await account.createJWT() as unknown;
    if (jwtRes && typeof jwtRes === 'object' && 'jwt' in jwtRes) {
      const jwt = (jwtRes as { jwt?: string }).jwt ?? '';
      setToken(jwt);
      updateLastActivity();
      console.log('[Session] JWT refreshed successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('[Session] Failed to refresh session:', error);
    // Clear token on refresh failure
    clearToken();
    return false;
  }
}

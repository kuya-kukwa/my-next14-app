/**
 * Application routes configuration
 * Centralized route definitions for type-safe navigation
 */

export const ROUTES = {
  /** Landing/home page */
  HOME: '/',
  
  /** Authentication routes */
  AUTH: {
    /** Sign in page */
    SIGNIN: '/auths/signin',
    /** Sign up page */
    SIGNUP: '/auths/signup',
  },
  
  /** Authenticated user routes */
  AUTHENTICATED: {
    /** Authenticated home/browse page */
    HOME: '/home',
    /** User's watchlist page */
    WATCHLIST: '/watchlist',
    /** User profile page */
    PROFILE: '/profile',
  },
  
  /** API routes */
  API: {
    /** Movies API endpoint */
    MOVIES: '/api/movies',
    /** Watchlist API endpoint */
    WATCHLIST: '/api/watchlist',
    /** Profile API endpoint */
    PROFILE: '/api/profile',
    /** Contact API endpoint */
    CONTACT: '/api/contact',
  },
} as const;

/**
 * Routes that require authentication
 * Used by middleware to protect routes
 */
export const PROTECTED_ROUTES = [
  ROUTES.AUTHENTICATED.HOME,
  ROUTES.AUTHENTICATED.WATCHLIST,
  ROUTES.AUTHENTICATED.PROFILE,
] as const;

/**
 * Authentication routes that redirect to home if already authenticated
 * Used by middleware to prevent access when logged in
 */
export const AUTH_ROUTES = [
  ROUTES.AUTH.SIGNIN,
  ROUTES.AUTH.SIGNUP,
] as const;

/**
 * Helper function to check if a path is a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Helper function to check if a path is an auth route
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route));
}

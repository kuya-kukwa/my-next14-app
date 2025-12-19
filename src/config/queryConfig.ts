/**
 * React Query configuration constants
 * Centralized stale times, cache times, and retry settings
 */
export const QUERY_CONFIG = {
  STALE_TIME: {
    /** Default stale time: 1 minute */
    DEFAULT: 60 * 1000,
    /** Movies list stale time: 5 minutes */
    MOVIES: 5 * 60 * 1000,
    /** Watchlist stale time: 2 minutes */
    WATCHLIST: 2 * 60 * 1000,
    /** Profile data stale time: 10 minutes */
    PROFILE: 10 * 60 * 1000,
    /** Categories stale time: 10 minutes */
    CATEGORIES: 10 * 60 * 1000,
  },
  GC_TIME: {
    /** Default garbage collection time: 5 minutes */
    DEFAULT: 5 * 60 * 1000,
    /** Long-lived cache: 10 minutes */
    LONG: 10 * 60 * 1000,
  },
  /** Number of retry attempts for failed queries */
  RETRY_COUNT: 2,
} as const;

/**
 * API configuration constants
 */
export const API_CONFIG = {
  /** Simulated delay for loading state testing (ms) */
  SIMULATED_DELAY: 800,
  /** Request timeout duration (ms) */
  TIMEOUT: 30000,
} as const;

/**
 * Session and authentication constants
 */
export const SESSION_CONFIG = {
  /** Token max age: 3 days */
  TOKEN_MAX_AGE: 60 * 60 * 24 * 3,
  /** Token expiration warning threshold: 12 hours */
  TOKEN_WARNING_THRESHOLD: 60 * 60 * 12,
  /** Session check interval: 30 minutes */
  CHECK_INTERVAL: 30 * 60 * 1000,
  /** Session refresh check interval: 5 minutes */
  REFRESH_CHECK_INTERVAL: 5 * 60 * 1000,
} as const;

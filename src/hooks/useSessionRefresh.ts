import { useEffect } from 'react';
import { shouldRefreshSession, refreshSession, isTokenExpired } from '@/lib/session';
import { logger } from '@/lib/logger';
import { SESSION_CONFIG } from '@/config/queryConfig';

/**
 * Hook that automatically refreshes the JWT session when needed
 * Checks every 5 minutes if session should be refreshed
 */
export function useSessionRefresh() {
  useEffect(() => {
    const checkAndRefreshSession = async () => {
      // Don't refresh if token is expired (middleware will handle redirect)
      if (isTokenExpired()) {
        return;
      }

      if (shouldRefreshSession()) {
        logger.debug('Proactively refreshing session...');
        await refreshSession();
      }
    };

    // Check immediately on mount
    checkAndRefreshSession();

    // Set up interval to check based on config
    const interval = setInterval(checkAndRefreshSession, SESSION_CONFIG.REFRESH_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);
}
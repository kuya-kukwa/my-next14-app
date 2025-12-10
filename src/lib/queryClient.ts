import { QueryClient } from '@tanstack/react-query';
import { dehydrate, hydrate } from '@tanstack/react-query';

let client: QueryClient | null = null;

export function getQueryClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute default
          gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime in v5)
          retry: (failureCount, error) => {
            // Don't retry on 4xx errors (client errors)
            if (error instanceof Error) {
              const errorMessage = error.message.toLowerCase();
              if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('invalid token')) {
                // Trigger session expiration handling
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('session-expired'));
                }
                return false;
              }
              if (errorMessage.includes('4')) {
                return false;
              }
            }
            // Retry up to 2 times for other errors
            return failureCount < 2;
          },
          refetchOnWindowFocus: false, // Don't refetch on window focus by default
          refetchOnMount: true, // Always refetch on mount to ensure fresh data
          refetchOnReconnect: true, // Refetch when reconnecting
        },
        mutations: {
          retry: (failureCount, error) => {
            // Don't retry on auth errors
            if (error instanceof Error) {
              const errorMessage = error.message.toLowerCase();
              if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('invalid token')) {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('session-expired'));
                }
                return false;
              }
            }
            return failureCount < 1;
          },
        },
      },
    });
  }
  return client;
}

// Clear all query cache (use on logout or session expiry)
export function clearQueryCache() {
  if (client) {
    client.clear();
  }
}

// Hydration utilities for SSR
export { dehydrate, hydrate };

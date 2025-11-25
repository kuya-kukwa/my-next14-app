import { QueryClient } from '@tanstack/react-query';

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
              if (errorMessage.includes('4') || errorMessage.includes('unauthorized')) {
                return false;
              }
            }
            // Retry up to 2 times for other errors
            return failureCount < 2;
          },
          refetchOnWindowFocus: false, // Don't refetch on window focus by default
        },
        mutations: {
          retry: 1, // Retry mutations once on failure
        },
      },
    });
  }
  return client;
}

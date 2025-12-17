import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/http';

export type WatchlistItem = {
  movieId: string;
  createdAt: string;
};

export type WatchlistResponse = {
  movieIds: string[];
  watchlist: WatchlistItem[];
  total: number;
};

export type AddToWatchlistRequest = {
  movieId: string;
};

export type WatchlistItemResponse = {
  success: boolean;
  watchlistItem?: WatchlistItem;
  message: string;
};

export const watchlistKeys = {
  all: ['watchlist'] as const,
};

export function useWatchlist() {
  return useQuery({
    queryKey: watchlistKeys.all,
    queryFn: () => api.get<WatchlistResponse>('/api/watchlist'),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToWatchlistRequest) =>
      api.post<WatchlistItemResponse>('/api/watchlist', data),
    onMutate: async (newWatchlistItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: watchlistKeys.all });

      // Snapshot previous value
      const previousWatchlist = queryClient.getQueryData<WatchlistResponse>(watchlistKeys.all);

      // Optimistically update
      if (previousWatchlist) {
        queryClient.setQueryData<WatchlistResponse>(watchlistKeys.all, {
          ...previousWatchlist,
          movieIds: [...previousWatchlist.movieIds, newWatchlistItem.movieId],
          total: previousWatchlist.total + 1,
        });
      }

      return { previousWatchlist };
    },
    onSuccess: (data, variables) => {
      // Update cache with server response without causing scroll
      const currentWatchlist = queryClient.getQueryData<WatchlistResponse>(watchlistKeys.all);
      if (currentWatchlist && data.watchlistItem) {
        queryClient.setQueryData<WatchlistResponse>(watchlistKeys.all, {
          ...currentWatchlist,
          movieIds: currentWatchlist.movieIds.includes(variables.movieId)
            ? currentWatchlist.movieIds
            : [...currentWatchlist.movieIds, variables.movieId],
        });
      }
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousWatchlist) {
        queryClient.setQueryData(watchlistKeys.all, context.previousWatchlist);
      }
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string) =>
      api.del<WatchlistItemResponse>(`/api/watchlist/${movieId}`),
    onMutate: async (movieId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: watchlistKeys.all });

      // Snapshot previous value
      const previousWatchlist = queryClient.getQueryData<WatchlistResponse>(watchlistKeys.all);

      // Optimistically update
      if (previousWatchlist) {
        queryClient.setQueryData<WatchlistResponse>(watchlistKeys.all, {
          ...previousWatchlist,
          movieIds: previousWatchlist.movieIds.filter((id) => id !== movieId),
          total: previousWatchlist.total - 1,
        });
      }

      return { previousWatchlist };
    },
    onSuccess: (_data, movieId) => {
      // Update cache with server confirmation without causing scroll
      const currentWatchlist = queryClient.getQueryData<WatchlistResponse>(watchlistKeys.all);
      if (currentWatchlist) {
        queryClient.setQueryData<WatchlistResponse>(watchlistKeys.all, {
          ...currentWatchlist,
          movieIds: currentWatchlist.movieIds.filter((id) => id !== movieId),
        });
      }
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousWatchlist) {
        queryClient.setQueryData(watchlistKeys.all, context.previousWatchlist);
      }
    },
  });
}

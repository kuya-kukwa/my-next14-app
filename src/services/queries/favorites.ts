import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/http';

export type Favorite = {
  movieId: string;
  createdAt: string;
};

export type FavoritesResponse = {
  movieIds: string[];
  favorites: Favorite[];
  total: number;
};

export type AddFavoriteRequest = {
  movieId: string;
};

export type FavoriteResponse = {
  success: boolean;
  favorite?: Favorite;
  message: string;
};

export const favoriteKeys = {
  all: ['favorites'] as const,
};

export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.all,
    queryFn: () => api.get<FavoritesResponse>('/api/favorites'),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddFavoriteRequest) =>
      api.post<FavoriteResponse>('/api/favorites', data),
    onMutate: async (newFavorite) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: favoriteKeys.all });

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData<FavoritesResponse>(favoriteKeys.all);

      // Optimistically update
      if (previousFavorites) {
        queryClient.setQueryData<FavoritesResponse>(favoriteKeys.all, {
          ...previousFavorites,
          movieIds: [...previousFavorites.movieIds, newFavorite.movieId],
          total: previousFavorites.total + 1,
        });
      }

      return { previousFavorites };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(favoriteKeys.all, context.previousFavorites);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string) =>
      api.del<FavoriteResponse>(`/api/favorites/${movieId}`),
    onMutate: async (movieId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: favoriteKeys.all });

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData<FavoritesResponse>(favoriteKeys.all);

      // Optimistically update
      if (previousFavorites) {
        queryClient.setQueryData<FavoritesResponse>(favoriteKeys.all, {
          ...previousFavorites,
          movieIds: previousFavorites.movieIds.filter((id) => id !== movieId),
          total: previousFavorites.total - 1,
        });
      }

      return { previousFavorites };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(favoriteKeys.all, context.previousFavorites);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}

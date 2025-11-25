import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/http';
import type { Movie } from '@/types';

export type MoviesResponse = {
  movies: Movie[];
  total: number;
  categories: string[];
  timestamp: string;
};

export type MoviesFilters = {
  category?: string;
  search?: string;
};

export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters: MoviesFilters) => [...movieKeys.lists(), filters] as const,
};

export function useMovies(filters?: MoviesFilters) {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  
  const queryString = params.toString();
  const url = queryString ? `/api/movies?${queryString}` : '/api/movies';

  return useQuery({
    queryKey: movieKeys.list(filters || {}),
    queryFn: () => api.get<MoviesResponse>(url),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  });
}

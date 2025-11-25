import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/http';

export type CategoriesResponse = {
  categories: string[];
  total: number;
};

export const categoryKeys = {
  all: ['categories'] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => api.get<CategoriesResponse>('/api/categories'),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories rarely change)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

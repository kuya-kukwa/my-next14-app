# useQuery Guide - Best Practices for API Calls

This guide shows how to use `useQuery` effectively in your Next.js 14 project with proper loading/error states, caching, and API integration.

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Loading & Error States](#loading--error-states)
3. [Caching Strategies](#caching-strategies)
4. [Advanced Patterns](#advanced-patterns)
5. [Real Project Examples](#real-project-examples)

---

## Basic Usage

### 1. Simple Query Hook

```typescript
// src/services/queries/movies.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/http';

export function useMovies() {
  return useQuery({
    queryKey: ['movies'],           // Unique cache key
    queryFn: () => api.get('/api/movies'), // Fetch function
    staleTime: 5 * 60 * 1000,      // Data stays fresh for 5 minutes
  });
}
```

### 2. Using in Components

```typescript
// src/pages/movies.tsx
import { useMovies } from '@/services/queries/movies';

export default function MoviesPage() {
  const { data, isLoading, error } = useMovies();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
```

---

## Loading & Error States

### 1. Comprehensive State Handling

```typescript
import { useMovies } from '@/services/queries/movies';

export default function MoviesPage() {
  const { 
    data, 
    isLoading,      // Initial loading
    isFetching,     // Background refetch loading
    isError,        // Error occurred
    error,          // Error object
    isSuccess,      // Success state
    refetch         // Manual refetch function
  } = useMovies();

  // Initial loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  // Error state with retry
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red-600">
          <h2 className="text-2xl font-bold">Error Loading Movies</h2>
          <p className="text-sm mt-2">{error?.message || 'Unknown error'}</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Background loading indicator
  return (
    <div className="relative">
      {isFetching && (
        <div className="absolute top-4 right-4 z-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600" />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
```

### 2. Skeleton Loading State

```typescript
import { useMovies } from '@/services/queries/movies';
import MovieCardSkeleton from '@/components/ui/MovieCardSkeleton';

export default function MoviesPage() {
  const { data, isLoading } = useMovies();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {isLoading ? (
        // Show skeleton loaders
        Array.from({ length: 12 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))
      ) : (
        // Show actual data
        data?.movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))
      )}
    </div>
  );
}
```

### 3. Error Boundary Pattern

```typescript
import { useMovies } from '@/services/queries/movies';
import ErrorState from '@/components/ui/ErrorState';

export default function MoviesPage() {
  const { data, isLoading, isError, error, refetch } = useMovies();

  if (isLoading) return <LoadingSpinner />;
  
  if (isError) {
    return (
      <ErrorState 
        title="Failed to load movies"
        message={error?.message}
        onRetry={refetch}
      />
    );
  }

  return <MoviesList movies={data.movies} />;
}
```

---

## Caching Strategies

### 1. Query Keys for Smart Caching

```typescript
// src/services/queries/movies.ts
export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters: MoviesFilters) => [...movieKeys.lists(), filters] as const,
  detail: (id: string) => [...movieKeys.all, 'detail', id] as const,
  categories: () => [...movieKeys.all, 'categories'] as const,
};

// Usage
export function useMovies(filters?: MoviesFilters) {
  return useQuery({
    queryKey: movieKeys.list(filters || {}),
    queryFn: () => fetchMovies(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMovie(id: string) {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => fetchMovie(id),
    staleTime: 10 * 60 * 1000, // 10 minutes (details change less often)
  });
}
```

### 2. Cache Configuration

```typescript
// Different stale times for different data types
export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    staleTime: 5 * 60 * 1000,      // 5 min - movies list changes often
    gcTime: 10 * 60 * 1000,        // 10 min - keep in cache
  });
}

export function useMovieCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000,     // 30 min - categories rarely change
    gcTime: 60 * 60 * 1000,        // 1 hour - keep longer
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 2 * 60 * 1000,      // 2 min - user data changes more often
    gcTime: 5 * 60 * 1000,
  });
}
```

### 3. Manual Cache Updates

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { movieKeys } from '@/services/queries/movies';

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string) => api.post('/api/watchlist', { movieId }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      
      // Or update cache directly (optimistic update)
      queryClient.setQueryData(['watchlist'], (old: any) => ({
        ...old,
        movieIds: [...(old?.movieIds || []), movieId],
      }));
    },
  });
}
```

### 4. Prefetching Data

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { movieKeys } from '@/services/queries/movies';

export function MovieCard({ movie }: { movie: Movie }) {
  const queryClient = useQueryClient();

  const prefetchMovieDetails = () => {
    queryClient.prefetchQuery({
      queryKey: movieKeys.detail(movie.id),
      queryFn: () => fetchMovie(movie.id),
      staleTime: 10 * 60 * 1000,
    });
  };

  return (
    <div onMouseEnter={prefetchMovieDetails}>
      <Image src={movie.image} alt={movie.title} />
      <h3>{movie.title}</h3>
    </div>
  );
}
```

---

## Advanced Patterns

### 1. Dependent Queries

```typescript
// Fetch user first, then fetch their watchlist
export function useUserWatchlist() {
  const { data: user } = useUser();
  
  return useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: () => fetchWatchlist(user!.id),
    enabled: !!user?.id, // Only run when user exists
  });
}
```

### 2. Parallel Queries

```typescript
export function useDashboardData() {
  const movies = useMovies();
  const watchlist = useWatchlist();
  const profile = useProfile();

  const isLoading = movies.isLoading || watchlist.isLoading || profile.isLoading;
  const isError = movies.isError || watchlist.isError || profile.isError;

  return {
    movies: movies.data,
    watchlist: watchlist.data,
    profile: profile.data,
    isLoading,
    isError,
  };
}
```

### 3. Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfiniteMovies() {
  return useInfiniteQuery({
    queryKey: ['movies', 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      api.get(`/api/movies?page=${pageParam}&limit=20`),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length + 1 : undefined,
    initialPageParam: 1,
  });
}

// Usage in component
function MoviesList() {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteMovies();

  return (
    <>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </>
  );
}
```

### 4. Optimistic Updates

```typescript
export function useToggleWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, inWatchlist }: { movieId: string; inWatchlist: boolean }) => 
      inWatchlist 
        ? api.delete(`/api/watchlist/${movieId}`)
        : api.post('/api/watchlist', { movieId }),
    
    // Optimistic update
    onMutate: async ({ movieId, inWatchlist }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['watchlist'] });
      
      // Snapshot previous value
      const previousWatchlist = queryClient.getQueryData(['watchlist']);
      
      // Optimistically update
      queryClient.setQueryData(['watchlist'], (old: any) => ({
        ...old,
        movieIds: inWatchlist
          ? old?.movieIds.filter((id: string) => id !== movieId)
          : [...(old?.movieIds || []), movieId],
      }));
      
      // Return context with snapshot
      return { previousWatchlist };
    },
    
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousWatchlist) {
        queryClient.setQueryData(['watchlist'], context.previousWatchlist);
      }
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });
}
```

---

## Real Project Examples

### 1. Movies List with Filters

```typescript
// src/pages/authenticated/movies.tsx
import { useState } from 'react';
import { useMovies } from '@/services/queries/movies';

export default function MoviesPage() {
  const [category, setCategory] = useState<string>();
  const [search, setSearch] = useState<string>();

  const { data, isLoading, isError, error } = useMovies({ category, search });

  if (isLoading) return <MovieCardSkeleton count={12} />;
  if (isError) return <ErrorState error={error} />;

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 flex gap-4">
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {data?.categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="px-4 py-2 border rounded flex-1"
        />
      </div>

      {/* Results */}
      <div className="grid grid-cols-4 gap-6">
        {data?.movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
```

### 2. User Profile with Mutations

```typescript
// src/pages/profile.tsx
import { useProfile, useUpdateProfile } from '@/services/queries/profile';

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const handleSubmit = async (formData: ProfileData) => {
    try {
      await updateProfile.mutateAsync(formData);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue={profile?.name} />
      <input name="email" defaultValue={profile?.email} />
      
      <button 
        type="submit" 
        disabled={updateProfile.isPending}
      >
        {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
```

### 3. Watchlist with Optimistic Updates

```typescript
// src/components/MovieCard.tsx
import { useWatchlist, useToggleWatchlist } from '@/services/queries/watchlist';

export default function MovieCard({ movie }: { movie: Movie }) {
  const { data: watchlist } = useWatchlist();
  const toggleWatchlist = useToggleWatchlist();
  
  const inWatchlist = watchlist?.movieIds.includes(movie.id);

  const handleToggle = () => {
    toggleWatchlist.mutate({ movieId: movie.id, inWatchlist });
  };

  return (
    <div className="relative">
      <Image src={movie.image} alt={movie.title} />
      
      <button
        onClick={handleToggle}
        disabled={toggleWatchlist.isPending}
        className="absolute top-2 right-2"
      >
        {inWatchlist ? '🔖' : '📝'}
      </button>
      
      <h3>{movie.title}</h3>
    </div>
  );
}
```

---

## Best Practices Summary

### ✅ DO:
- Use meaningful query keys with filters
- Set appropriate `staleTime` based on data volatility
- Handle loading, error, and success states
- Implement optimistic updates for better UX
- Prefetch data on hover for instant navigation
- Use skeleton loaders instead of spinners

### ❌ DON'T:
- Use the same query key for different data
- Set `staleTime: 0` (always refetch)
- Ignore error states
- Fetch data in `useEffect` (use `useQuery` instead)
- Update cache directly without invalidation
- Forget to handle edge cases (empty states, no data)

---

## Query Client Configuration

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,           // 1 minute default
        gcTime: 5 * 60 * 1000,          // 5 minutes
        retry: 2,                        // Retry failed requests 2 times
        refetchOnWindowFocus: false,    // Don't refetch on tab focus
        refetchOnReconnect: true,       // Refetch on network reconnect
      },
      mutations: {
        retry: 1,                        // Retry mutations once
      },
    },
  });
}
```

---

## Debugging Tips

### 1. React Query Devtools

```typescript
// src/pages/_app.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 2. Logging Query State

```typescript
const { data, isLoading, error, status } = useMovies();

console.log({
  status,      // 'pending' | 'error' | 'success'
  isLoading,   // true during initial load
  isFetching,  // true during any fetch (including background)
  data,
  error,
});
```

---

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Caching Examples](https://tanstack.com/query/latest/docs/framework/react/guides/caching)

# Comprehensive Codebase Review: useQuery, State Handling & Caching

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [useQuery Implementation](#usequery-implementation)
3. [State Management](#state-management)
4. [Caching Strategy](#caching-strategy)
5. [Query Flow Diagrams](#query-flow-diagrams)
6. [Best Practices Applied](#best-practices-applied)
7. [Potential Improvements](#potential-improvements)

---

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 (Pages Router)
- **State Management**: React Query v5 (@tanstack/react-query)
- **HTTP Client**: Custom `api` service wrapper
- **UI Framework**: Material-UI (MUI)
- **Type Safety**: TypeScript

### File Structure
```
src/
├── lib/
│   ├── queryClient.ts          # Global QueryClient config
│   ├── session.ts              # Authentication utilities
│   └── index.ts                # Exports
├── services/
│   ├── http.ts                 # HTTP wrapper (GET, POST, PUT, DELETE)
│   └── queries/
│       ├── movies.ts           # useMovies, movieKeys
│       ├── watchlist.ts        # useWatchlist, useAddToWatchlist, etc.
│       ├── categories.ts       # useCategories
│       └── profile.ts          # useProfile, useUpdateProfile
├── pages/
│   ├── _app.tsx               # App provider setup
│   └── authenticated/
│       ├── home.tsx           # Movies feed page
│       └── watchlist.tsx       # Watchlist page
└── components/
    └── skeletons/
        ├── MovieCardSkeleton.tsx
        ├── WatchlistSkeleton.tsx
        └── HeroSkeleton.tsx
```

---

## useQuery Implementation

### 1. Query Client Configuration (`src/lib/queryClient.ts`)

```typescript
// Global defaults for all queries and mutations
QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // 1 minute - data freshness
      gcTime: 5 * 60 * 1000,           // 5 minutes - cache lifetime
      retry: (failureCount, error) => {
        // Smart retry logic: Don't retry 4xx errors
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase();
          if (errorMessage.includes('4') || errorMessage.includes('unauthorized')) {
            return false;
          }
        }
        return failureCount < 2;      // Retry 5xx errors max 2 times
      },
      refetchOnWindowFocus: false,    // Don't refetch on tab switch
    },
    mutations: {
      retry: 1,                        // Retry mutations once on failure
    },
  },
});
```

**Key Concepts**:
- `staleTime`: How long data is considered fresh (no refetch needed)
- `gcTime`: How long unused cache is kept in memory
- Smart retry strategy prevents hammering server on client errors

### 2. Query Hooks with Hierarchical Keys

#### Movies Query (`src/services/queries/movies.ts`)

```typescript
export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters: MoviesFilters) => [...movieKeys.lists(), filters] as const,
};

export function useMovies(filters?: MoviesFilters) {
  return useQuery({
    queryKey: movieKeys.list(filters || {}),      // ['movies', 'list', { category, search }]
    queryFn: () => api.get<MoviesResponse>(url),
    staleTime: 5 * 60 * 1000,                      // 5 minutes (content changes often)
    gcTime: 10 * 60 * 1000,                        // 10 minutes
    refetchOnMount: false,                         // Use cache on navigation
    refetchOnWindowFocus: false,                   // Disable tab switch refetch
  });
}
```

**Why Hierarchical Keys Matter**:
- Enables selective cache invalidation
- Example: `queryClient.invalidateQueries({ queryKey: ['movies'] })` invalidates all movie queries
- Filters create unique keys: `{ category: 'action' }` cached separately from `{ category: 'drama' }`

#### Watchlist Query (`src/services/queries/watchlist.ts`)

```typescript
export const watchlistKeys = {
  all: ['watchlist'] as const,
};

export function useWatchlist() {
  return useQuery({
    queryKey: watchlistKeys.all,
    queryFn: () => api.get<WatchlistResponse>('/api/watchlist'),
    staleTime: 2 * 60 * 1000,        // 2 minutes (user-specific, changes often)
    gcTime: 5 * 60 * 1000,           // 5 minutes
  });
}
```

**User-Specific Caching**: Shorter stale time because watchlist is per-user.

#### Categories Query (`src/services/queries/categories.ts`)

```typescript
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => api.get<CategoriesResponse>('/api/categories'),
    staleTime: 10 * 60 * 1000,       // 10 minutes (static data)
    gcTime: 30 * 60 * 1000,          // 30 minutes (keep long)
  });
}
```

**Static Data Caching**: Longest cache times for rarely-changing data.

#### Profile Query (`src/services/queries/profile.ts`)

```typescript
export function useProfile(jwt?: string) {
  return useQuery({
    queryKey: profileKeys.all,
    enabled: !!jwt,                  // Don't fetch until jwt exists
    queryFn: () => api.get<{ profile: Profile }>('/api/profile', ...),
  });
}
```

**Conditional Queries**: Uses `enabled` to prevent requests when data isn't available.

---

## State Management

### 1. Query States

Every `useQuery` returns multiple state flags:

```typescript
const {
  data,           // The fetched data
  isLoading,      // true during initial fetch (no cache)
  isFetching,     // true during any fetch (including background)
  isError,        // true if query errored
  error,          // The error object
  status,         // 'pending' | 'error' | 'success'
  refetch,        // Manual refetch function
} = useMovies();
```

**Important Distinction**:
- `isLoading` = `true` only on **first load** (no cached data)
- `isFetching` = `true` during **any fetch** (including background refetches)

### 2. State Handling in Pages

#### Home Page (`src/pages/authenticated/home.tsx`)

```typescript
export default function HomePage() {
  // ... queries ...
  const { data: moviesData, isLoading: moviesLoading, isFetching, isError } = useMovies();
  
  // Unified loading state - only true on initial load (due to refetchOnMount: false)
  const loading = !isMounted || moviesLoading || !heroMovie;

  // LOADING UI (skeleton)
  if (loading) {
    return <HeroSkeleton /> + <MovieRowSkeleton />;
  }

  // ERROR STATE
  if (isError) {
    return <ErrorState title="..." error={error} onRetry={() => refetch()} />;
  }

  // SUCCESS UI
  return <MovieContent />;
}
```

**Flow**:
1. On **first visit**: `isLoading = true` → Show skeleton
2. User **navigates away**: Cache preserved
3. User **returns**: `isLoading = false` → Show cached content instantly
4. After 5 minutes: `staleTime` expires → Background refetch silently updates

#### Watchlist Page (`src/pages/authenticated/watchlist.tsx`)

```typescript
export default function WatchlistPage() {
  const { data: moviesData, isLoading: moviesLoading } = useMovies();
  const { data: watchlistData, isLoading: watchlistLoading } = useWatchlist();

  // LOADING: Show skeleton while either is loading
  if (moviesLoading || watchlistLoading) {
    return <WatchlistSkeleton />;
  }

  // ERROR: Show error state with retry
  if (moviesError || watchlistError) {
    return <ErrorState ... />;
  }

  // Filter movies by watchlist
  const watchlistMovies = allMovies.filter(m => watchlistMovieIds.includes(m.id));

  // EMPTY: Show empty state
  if (watchlistMovies.length === 0) {
    return <EmptyState />;
  }

  // SUCCESS: Show watchlist
  return <MovieGrid />;
}
```

---

## Caching Strategy

### 1. Stale Time Hierarchy

Different data types have different cache durations:

| Data Type | Stale Time | GC Time | Reason |
|-----------|-----------|---------|--------|
| Movies | 5 min | 10 min | Frequently added/updated |
| Watchlist | 2 min | 5 min | Per-user, changes on each add/remove |
| Categories | 10 min | 30 min | Static, rarely changes |
| Profile | Default 1 min | Default 5 min | User-specific, can change |

### 2. Optimistic Updates (Watchlist)

```typescript
export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/api/watchlist', data),
    
    onMutate: async (newMovie) => {
      // 1. Cancel any pending refetches
      await queryClient.cancelQueries({ queryKey: watchlistKeys.all });

      // 2. Snapshot old data for rollback
      const previousWatchlist = queryClient.getQueryData<WatchlistResponse>(
        watchlistKeys.all
      );

      // 3. UPDATE UI IMMEDIATELY (optimistic)
      if (previousWatchlist) {
        queryClient.setQueryData<WatchlistResponse>(watchlistKeys.all, {
          ...previousWatchlist,
          movieIds: [...previousWatchlist.movieIds, newMovie.movieId],
          total: previousWatchlist.total + 1,
        });
      }

      return { previousWatchlist }; // Return for rollback
    },
    
    onError: (_error, _variables, context) => {
      // 4. ROLLBACK on error
      if (context?.previousWatchlist) {
        queryClient.setQueryData(watchlistKeys.all, context.previousWatchlist);
      }
    },
    
    onSettled: () => {
      // 5. REFETCH after mutation completes (success or error)
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });
}
```

**User Experience**:
```
User clicks "Add to Watchlist"
     ↓
Bookmark turns red IMMEDIATELY (optimistic)
     ↓
API request sent in background
     ↓
Success? → Keep UI as is
Error? → Revert bookmark to white
```

### 3. Cache Invalidation

When mutations succeed:

```typescript
// After successfully adding to watchlist
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
}
```

This triggers:
1. Mark cache as stale
2. Refetch in background if component still mounted
3. UI updates with fresh data

---

## Query Flow Diagrams

### Home Page Navigation Flow

```
User loads home.tsx (first time)
        ↓
    [isLoading = true]
    (no cached data)
        ↓
    Show HeroSkeleton + MovieRowSkeleton
        ↓
    useMovies() fetches /api/movies
        ↓
    [isLoading = false, data = movies]
        ↓
    Render Hero + Movie Grid
        ↓
    Cache stored with staleTime: 5min
        ↓
User navigates to watchlist page
        ↓
    [movies cache kept in memory]
        ↓
User returns to home page
        ↓
    [isLoading = false] (due to cache)
    [isFetching = false] (if within 5min)
        ↓
    Render Hero + Movie Grid INSTANTLY
    (no skeleton!)
        ↓
    If stale (>5min): Background refetch
```

### Watchlist Add Flow

```
User clicks bookmark icon on movie
        ↓
    handleToggleWatchlist(movieId)
        ↓
    removeFromWatchlist.mutate(movieId)
        ↓
    [onMutate triggered]
    Bookmark turns RED optimistically
    Cancel pending refetches
        ↓
    DELETE /api/watchlist/movieId
        ↓
    Success?
    ├─ Yes → [onSettled] Invalidate cache
    │         Refetch watchlist
    │         Bookmark stays RED
    │
    └─ No → [onError] Revert to previous
            Bookmark back to WHITE
            Show error toast
```

---

## Best Practices Applied

### ✅ What Your Project Does Right

#### 1. **Hierarchical Query Keys**
```typescript
movieKeys = {
  all: ['movies'],
  lists: () => [...movieKeys.all, 'list'],
  list: (filters) => [...movieKeys.lists(), filters],
}
```
Enables:
- Selective invalidation
- Automatic cache busting
- Type-safe query management

#### 2. **Smart Retry Logic**
```typescript
retry: (failureCount, error) => {
  if (error.message.includes('4')) return false; // Don't retry 4xx
  return failureCount < 2;                       // Retry 5xx max 2x
}
```
Prevents:
- Hammering server on auth errors
- Wasting requests on client errors
- Infinite retry loops

#### 3. **Optimistic Updates**
```typescript
onMutate: async (movieId) => {
  // Update UI before server response
}
onError: (error, variables, context) => {
  // Rollback on failure
}
```
Benefits:
- Instant UI feedback (1ms vs 200-500ms)
- Better perceived performance
- Automatic rollback on errors

#### 4. **Per-Query Stale Times**
Different cache durations for different data types:
- Movies: 5 min (changes often)
- Categories: 10 min (static)
- Watchlist: 2 min (per-user changes)

#### 5. **Automatic Cache Persistence**
`refetchOnMount: false` + `gcTime: 10 * 60 * 1000`:
- Navigate away: Cache stays in memory
- Return to page: Use cache immediately
- No Loading skeleton on return

---

## Potential Improvements

### 1. **Add Error Boundary for Server Errors**

Current: Global error state
```typescript
if (isError) return <ErrorState error={error} />;
```

Suggestion: Distinguish error types
```typescript
if (isError) {
  if (error instanceof UnauthorizedError) {
    return <SignInPrompt />;
  }
  if (error instanceof NotFoundError) {
    return <NotFoundPage />;
  }
  return <ErrorState error={error} />;
}
```

### 2. **Add Query Prefetching on Hover**

```typescript
const MovieCard = ({ movie }) => {
  const queryClient = useQueryClient();

  const prefetchDetails = () => {
    queryClient.prefetchQuery({
      queryKey: ['movie', movie.id],
      queryFn: () => api.get(`/api/movies/${movie.id}`),
    });
  };

  return (
    <div onMouseEnter={prefetchDetails}>
      {/* Movie card content */}
    </div>
  );
};
```

Benefits:
- User clicks movie → Details already loaded
- Feels instant

### 3. **Add Request Deduplication**

React Query does this automatically, but ensure:
```typescript
// Same query fired twice
useMovies();  // Request 1
useMovies();  // Request 2 (deduplicated, uses Request 1)
```

Current setup already handles this via unique query keys.

### 4. **Add Loading Optimizations**

Current: Show skeleton on `isLoading`
```typescript
if (isLoading) return <Skeleton />;
```

Enhancement: Show stale data while revalidating
```typescript
if (isLoading && !data) return <Skeleton />;

// Show stale data while refetching in background
return (
  <Content data={data} opacity={isFetching ? 0.5 : 1}>
    {isFetching && <RefreshingIndicator />}
  </Content>
);
```

### 5. **Monitor Cache Hit Rate**

Add development-only logging:
```typescript
const { status, isFetching } = useMovies();

useEffect(() => {
  if (status === 'success' && !isFetching) {
    console.log('📦 Cache hit - used existing data');
  } else if (status === 'success' && isFetching) {
    console.log('🔄 Background refetch');
  }
}, [status, isFetching]);
```

---

## HTTP Service Layer

### `src/services/http.ts`

```typescript
export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { 
      'Content-Type': 'application/json',
      ...authHeader(),              // Attach JWT automatically
      ...(init?.headers || {}),
    },
    ...init,
  });
  
  if (!res.ok) {
    // Parse error from response
    throw new Error(`Request failed with ${res.status}`);
  }
  
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(url, init?) => http<T>(url, { ...init, method: 'GET' }),
  post: <T>(url, body?, init?) => http<T>(url, { ...init, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url, body?, init?) => http<T>(url, { ...init, method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(url, init?) => http<T>(url, { ...init, method: 'DELETE' }),
};
```

**Features**:
- ✅ Automatic JWT attachment via `authHeader()`
- ✅ Error parsing from API responses
- ✅ Type-safe API calls
- ✅ All requests automatically JSON

---

## React Query Devtools

Enabled in development:

```typescript
{process.env.NODE_ENV !== 'production' && (
  <ReactQueryDevtools initialIsOpen={false} />
)}
```

Access at bottom-right corner to:
- See all cached queries
- View query state changes
- Manually trigger refetch
- Monitor cache timing

---

## Summary

### Architecture Strengths
1. ✅ Centralized query configuration
2. ✅ Hierarchical query keys for smart invalidation
3. ✅ Optimistic updates for better UX
4. ✅ Smart retry logic (don't retry 4xx)
5. ✅ Per-query cache strategies
6. ✅ Automatic cache persistence on navigation
7. ✅ Type-safe HTTP service
8. ✅ Dev tools for debugging

### How Caching Prevents Loading States
1. First visit: `staleTime` not expired → cache miss → fetch → show skeleton
2. Second visit (within staleTime): cache hit → show data instantly
3. Third visit (after staleTime): cache stale → show data + background refetch
4. Navigation: `gcTime` keeps data in memory → instant return

### Key Insight
The combination of `refetchOnMount: false` + `staleTime: 5min` + `gcTime: 10min` means:
- Users see instant content on return navigation
- No loading spinners for page-hoppers
- Fresh data fetched silently in background

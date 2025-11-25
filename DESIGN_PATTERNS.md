# React Query Implementation - Design Patterns Documentation

## Table of Contents
1. [Query Keys Architecture](#query-keys-architecture)
2. [Custom Hooks Pattern](#custom-hooks-pattern)
3. [Optimistic Updates Pattern](#optimistic-updates-pattern)
4. [Error Handling Pattern](#error-handling-pattern)
5. [Loading States Pattern](#loading-states-pattern)
6. [Authentication Guard Pattern](#authentication-guard-pattern)
7. [Debouncing Pattern](#debouncing-pattern)
8. [Cache Invalidation Strategy](#cache-invalidation-strategy)

---

## 1. Query Keys Architecture

### Pattern: Hierarchical Query Keys
**Purpose:** Enable precise cache management and automatic refetching when dependencies change.

### Implementation
```typescript
// src/services/queries/movies.ts
export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters: MoviesFilters) => [...movieKeys.lists(), filters] as const,
};
```

### Design Benefits
- **Hierarchical Structure:** Allows invalidating all movies (`movieKeys.all`) or specific filtered lists
- **Type Safety:** `as const` ensures TypeScript tracks exact key shapes
- **Granular Control:** Can target specific cache entries by filter values
- **Automatic Refetching:** When filters change, new query key triggers refetch

### Usage Example
```typescript
// Invalidate all movie queries
queryClient.invalidateQueries({ queryKey: movieKeys.all });

// Invalidate specific filtered list
queryClient.invalidateQueries({ 
  queryKey: movieKeys.list({ category: 'Action' }) 
});
```

### Pattern Applied To
- ✅ `movieKeys` - src/services/queries/movies.ts
- ✅ `categoryKeys` - src/services/queries/categories.ts
- ✅ `favoriteKeys` - src/services/queries/favorites.ts
- ✅ `profileKeys` - src/services/queries/profile.ts

---

## 2. Custom Hooks Pattern

### Pattern: Encapsulated Data Fetching
**Purpose:** Abstract API calls and React Query configuration into reusable hooks.

### Implementation
```typescript
// src/services/queries/movies.ts
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
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

### Design Benefits
- **Single Responsibility:** Each hook handles one data concern
- **Consistent Interface:** All hooks return same structure (data, isLoading, error, refetch)
- **Configuration Encapsulation:** Cache times and retry logic hidden from components
- **Type Safety:** Generic types ensure response data is properly typed

### Component Usage
```typescript
// Simple consumption in components
const { data, isLoading, error, refetch } = useMovies({ 
  category: selectedCategory,
  search: debouncedSearch 
});
```

### Pattern Applied To
- ✅ `useMovies(filters)` - Fetch movies with optional filters
- ✅ `useCategories()` - Fetch all categories
- ✅ `useFavorites()` - Fetch user's favorites
- ✅ `useProfile()` - Fetch user profile

---

## 3. Optimistic Updates Pattern

### Pattern: Immediate UI Feedback with Rollback
**Purpose:** Update UI instantly while API call processes, rollback if it fails.

### Implementation
```typescript
// src/services/queries/favorites.ts
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddFavoriteRequest) =>
      api.post<FavoriteResponse>('/api/favorites', data),
    
    // Step 1: Before mutation starts
    onMutate: async (newFavorite) => {
      // Cancel outgoing refetches to avoid race conditions
      await queryClient.cancelQueries({ queryKey: favoriteKeys.all });

      // Snapshot previous value for rollback
      const previousFavorites = queryClient.getQueryData<FavoritesResponse>(
        favoriteKeys.all
      );

      // Optimistically update cache
      if (previousFavorites) {
        queryClient.setQueryData<FavoritesResponse>(favoriteKeys.all, {
          ...previousFavorites,
          movieIds: [...previousFavorites.movieIds, newFavorite.movieId],
          total: previousFavorites.total + 1,
        });
      }

      // Return context for error handler
      return { previousFavorites };
    },
    
    // Step 2: If mutation fails
    onError: (_error, _variables, context) => {
      // Rollback to previous state
      if (context?.previousFavorites) {
        queryClient.setQueryData(favoriteKeys.all, context.previousFavorites);
      }
    },
    
    // Step 3: After mutation settles (success or error)
    onSettled: () => {
      // Refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}
```

### Design Benefits
- **Instant Feedback:** User sees result immediately (perceived performance)
- **Error Recovery:** Automatic rollback prevents showing incorrect state
- **Eventual Consistency:** `onSettled` ensures server and client sync
- **Race Condition Prevention:** `cancelQueries` prevents stale data overwrites

### User Experience Flow
```
User clicks heart → UI updates instantly → API call happens → 
  If success: Keep changes
  If error: Rollback + show error
```

### Pattern Applied To
- ✅ `useAddFavorite()` - Add to favorites
- ✅ `useRemoveFavorite()` - Remove from favorites
- ✅ `useUpdateProfile()` - Update user profile

---

## 4. Error Handling Pattern

### Pattern: Centralized Error UI with Retry
**Purpose:** Consistent error display across app with recovery mechanism.

### Implementation
```typescript
// src/components/ui/ErrorState.tsx
interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | unknown;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load data. Please try again.',
  error,
  onRetry,
}) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const errorMessage = error instanceof Error ? error.message : String(error || '');

  return (
    <Box sx={{ /* ...styling */ }}>
      <ErrorOutlineIcon sx={{ fontSize: 64, color: '#ef4444' }} />
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body1">{message}</Typography>
      {errorMessage && <Typography variant="body2">{errorMessage}</Typography>}
      {onRetry && <Button onClick={onRetry}>Try Again</Button>}
    </Box>
  );
};
```

### Component Usage
```typescript
// src/pages/movies.tsx
{moviesError ? (
  <ErrorState
    title="Failed to load movies"
    message="We couldn't fetch the movies. Please try again."
    error={moviesErrorObj}
    onRetry={() => refetchMovies()}
  />
) : ( /* ...render movies */ )}
```

### Design Benefits
- **Reusability:** Single component handles all error scenarios
- **User Empowerment:** "Try Again" button gives users control
- **Developer Experience:** Detailed error messages in development
- **Theme Awareness:** Adapts colors for light/dark mode

### Pattern Applied To
- ✅ Movies page error handling
- ✅ Favorites page error handling
- ✅ All protected routes with data fetching

---

## 5. Loading States Pattern

### Pattern: Skeleton Screens for Perceived Performance
**Purpose:** Show content-aware placeholders instead of generic spinners.

### Implementation
```typescript
// src/components/ui/MovieCardSkeleton.tsx
const MovieCardSkeleton: React.FC = () => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Box sx={{ /* ...match MovieCard layout */ }}>
      {/* Poster skeleton - matches actual image dimensions */}
      <Skeleton variant="rectangular" width="100%" height={300} />
      
      {/* Content skeleton - matches title/subtitle */}
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="60%" height={20} />
      </Box>
    </Box>
  );
};
```

### Component Usage
```typescript
// src/pages/movies.tsx
{moviesLoading ? (
  <Box sx={{ display: 'grid', gridTemplateColumns: { /* responsive */ }, gap: 3 }}>
    {Array.from({ length: 12 }).map((_, index) => (
      <MovieCardSkeleton key={index} />
    ))}
  </Box>
) : ( /* ...render actual movies */ )}
```

### Design Benefits
- **Perceived Performance:** Users know content is loading, see layout forming
- **Layout Stability:** No layout shift when data arrives
- **User Confidence:** Professional feel compared to spinners
- **Responsive:** Skeleton count matches grid columns

### Pattern Applied To
- ✅ `MovieCardSkeleton` - Individual card loading state
- ✅ Movies page grid (12 skeletons)
- ✅ Favorites page grid (8 skeletons)

---

## 6. Authentication Guard Pattern

### Pattern: Client-Side Route Protection
**Purpose:** Redirect unauthenticated users before rendering protected content.

### Implementation
```typescript
// src/pages/movies.tsx
export default function MoviesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/signin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Don't render until auth check completes
  if (!isAuthenticated) {
    return null;
  }

  // Protected content renders here
  return (/* ...page content... */);
}
```

### Design Benefits
- **Security:** Prevent unauthorized access to protected pages
- **UX:** Smooth redirect without flash of protected content
- **Simplicity:** No HOC or complex wrapper needed
- **Predictable:** Same pattern across all protected routes

### Pattern Applied To
- ✅ `/movies` page - Browse movies (protected)
- ✅ `/favorites` page - User favorites (protected)
- ✅ `/profile` page - User profile (protected)

---

## 7. Debouncing Pattern

### Pattern: Delayed Search Input Processing
**Purpose:** Reduce API calls while user types in search field.

### Implementation
```typescript
// src/pages/movies.tsx
export default function MoviesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input - wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    
    // Cleanup: cancel timer if user types again
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Use debounced value in query
  const { data, isLoading, error } = useMovies({
    search: debouncedSearch,
    category: selectedCategory
  });

  return (
    <TextField
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      placeholder="Search movies..."
    />
  );
}
```

### Design Benefits
- **Performance:** Reduces API calls from 10/second to 1 every 300ms
- **Cost Efficiency:** Fewer database queries
- **UX:** Smooth typing experience without lag
- **Server Load:** Dramatically reduces backend pressure

### Example Impact
```
Without debouncing: "action" = 6 API calls (a, ac, act, acti, actio, action)
With debouncing: "action" = 1 API call (action after 300ms delay)
```

### Pattern Applied To
- ✅ Movies page search bar
- ✅ Any future search/filter implementations

---

## 8. Cache Invalidation Strategy

### Pattern: Smart Cache Management
**Purpose:** Balance performance (caching) with data freshness.

### Implementation
```typescript
// src/lib/queryClient.ts
export function getQueryClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute default
          gcTime: 5 * 60 * 1000, // 5 minutes
          retry: (failureCount, error) => {
            // Don't retry 4xx errors (client errors)
            if (error instanceof Error) {
              const errorMessage = error.message.toLowerCase();
              if (errorMessage.includes('4') || 
                  errorMessage.includes('unauthorized')) {
                return false;
              }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
          },
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: 1, // Retry mutations once
        },
      },
    });
  }
  return client;
}
```

### Cache Time Strategy
```typescript
// Different data has different freshness requirements

// Movies - moderate caching (content rarely changes)
staleTime: 5 * 60 * 1000,  // 5 minutes
gcTime: 10 * 60 * 1000,     // 10 minutes

// Categories - aggressive caching (very stable)
staleTime: 10 * 60 * 1000,  // 10 minutes
gcTime: 30 * 60 * 1000,      // 30 minutes

// Favorites - short caching (user-specific, changes frequently)
staleTime: 2 * 60 * 1000,   // 2 minutes
gcTime: 5 * 60 * 1000,       // 5 minutes

// Profile - default caching (balanced)
staleTime: 60 * 1000,       // 1 minute
gcTime: 5 * 60 * 1000,       // 5 minutes
```

### Design Benefits
- **Performance:** Avoid unnecessary network requests
- **Freshness:** Data updates when it matters
- **Smart Retry:** Don't retry auth errors, do retry network issues
- **Memory Management:** gcTime prevents cache bloat

### Cache Lifecycle
```
1. Fresh (0 - staleTime): Use cached data, no refetch
2. Stale (staleTime - gcTime): Use cached data, refetch in background
3. Garbage Collected (> gcTime): Remove from memory
```

### Pattern Applied To
- ✅ Query client configuration (global defaults)
- ✅ Individual query overrides (per-hook basis)
- ✅ Mutation invalidation (after favorites add/remove)

---

## Design Pattern Summary

| Pattern | Problem Solved | Files Implementing |
|---------|---------------|-------------------|
| **Hierarchical Query Keys** | Cache management complexity | movies.ts, categories.ts, favorites.ts |
| **Custom Hooks** | API call duplication | All query files |
| **Optimistic Updates** | Slow perceived performance | favorites.ts, profile.ts |
| **Error Handling** | Inconsistent error UX | ErrorState.tsx, all pages |
| **Loading States** | Poor loading UX | MovieCardSkeleton.tsx |
| **Auth Guards** | Unauthorized access | movies.tsx, favorites.tsx |
| **Debouncing** | Excessive API calls | movies.tsx search |
| **Cache Invalidation** | Stale data vs performance | queryClient.ts, all hooks |

---

## Best Practices Checklist

### ✅ Query Hooks
- [x] Use hierarchical query keys
- [x] Type all responses with TypeScript
- [x] Set appropriate staleTime/gcTime
- [x] Handle loading and error states
- [x] Export query keys for invalidation

### ✅ Mutations
- [x] Implement optimistic updates for instant feedback
- [x] Provide rollback mechanism (onError)
- [x] Invalidate related queries (onSettled)
- [x] Handle race conditions (cancelQueries)

### ✅ Components
- [x] Use skeleton loaders over spinners
- [x] Provide retry functionality on errors
- [x] Theme-aware styling
- [x] Responsive design (mobile-first)
- [x] Accessibility (ARIA labels, keyboard nav)

### ✅ Performance
- [x] Debounce search inputs
- [x] Lazy load heavy components
- [x] Memoize expensive calculations
- [x] Use React.memo for pure components
- [x] CSS Grid over MUI Grid (performance)

---

## Future Enhancements

### Short-term
- [ ] Add pagination to movies list
- [ ] Implement infinite scroll
- [ ] Add movie detail modal
- [ ] Multi-select genre filters

### Medium-term
- [ ] Server-side rendering for SEO
- [ ] Prefetching on link hover
- [ ] Service worker for offline support
- [ ] WebSocket for real-time updates

### Long-term
- [ ] Micro-frontend architecture
- [ ] Edge caching with ISR
- [ ] GraphQL migration
- [ ] Mobile app with shared hooks

---

## References

- [React Query Docs](https://tanstack.com/query/latest)
- [Effective Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Web Performance Patterns](https://web.dev/patterns/)

---

**Last Updated:** November 24, 2025  
**Author:** Development Team  
**Version:** 1.0.0

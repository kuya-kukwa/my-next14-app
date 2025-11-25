# React Query Hooks - API Documentation

## Overview
This document provides comprehensive API documentation for all React Query hooks used in the application.

---

## Table of Contents
1. [Movies Hooks](#movies-hooks)
2. [Categories Hooks](#categories-hooks)
3. [Favorites Hooks](#favorites-hooks)
4. [Profile Hooks](#profile-hooks)
5. [Type Definitions](#type-definitions)
6. [Error Handling](#error-handling)

---

## Movies Hooks

### `useMovies(filters?)`
Fetches movies from the database with optional filtering.

#### Parameters
```typescript
filters?: MoviesFilters {
  category?: string;  // Filter by category (e.g., "Action", "Drama")
  search?: string;    // Search in title and genre
}
```

#### Returns
```typescript
{
  data: MoviesResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// MoviesResponse structure
type MoviesResponse = {
  movies: Movie[];
  total: number;
  categories: string[];
  timestamp: string;
}
```

#### Query Key
```typescript
movieKeys.list(filters || {})
// Examples:
// ['movies', 'list', {}]
// ['movies', 'list', { category: 'Action' }]
// ['movies', 'list', { search: 'matrix' }]
```

#### Cache Configuration
- **staleTime:** 5 minutes
- **gcTime:** 10 minutes
- **Retry:** Up to 2 times for network errors

#### Example Usage
```typescript
// Basic usage
const { data, isLoading, error } = useMovies();

// With category filter
const { data } = useMovies({ category: 'Action' });

// With search
const { data } = useMovies({ search: 'inception' });

// With both filters
const { data } = useMovies({ 
  category: 'Sci-Fi',
  search: 'space'
});

// Access response data
if (data) {
  console.log(data.movies);      // Movie[]
  console.log(data.total);       // number
  console.log(data.categories);  // string[]
}
```

#### Implementation Details
- Uses `URLSearchParams` to build query string
- Automatically refetches when filters change (new query key)
- Implements stale-while-revalidate pattern

---

## Categories Hooks

### `useCategories()`
Fetches all unique movie categories from the database.

#### Parameters
None

#### Returns
```typescript
{
  data: CategoriesResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// CategoriesResponse structure
type CategoriesResponse = {
  categories: string[];
  total: number;
}
```

#### Query Key
```typescript
categoryKeys.all
// ['categories']
```

#### Cache Configuration
- **staleTime:** 10 minutes (categories rarely change)
- **gcTime:** 30 minutes
- **Retry:** Up to 2 times

#### Example Usage
```typescript
const { data, isLoading, error } = useCategories();

if (data) {
  console.log(data.categories);  // ['Action', 'Drama', 'Sci-Fi', ...]
  console.log(data.total);       // 8
}

// Map categories to UI elements
{data?.categories.map(cat => (
  <Chip key={cat} label={cat} onClick={() => selectCategory(cat)} />
))}
```

---

## Favorites Hooks

### `useFavorites()`
Fetches the current user's favorite movie IDs.

#### Parameters
None

#### Returns
```typescript
{
  data: FavoritesResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// FavoritesResponse structure
type FavoritesResponse = {
  movieIds: number[];
  favorites: Favorite[];
  total: number;
}

type Favorite = {
  movieId: number;
  createdAt: string;
}
```

#### Query Key
```typescript
favoriteKeys.all
// ['favorites']
```

#### Cache Configuration
- **staleTime:** 2 minutes
- **gcTime:** 5 minutes
- **Retry:** Up to 2 times

#### Example Usage
```typescript
const { data, isLoading } = useFavorites();

// Check if movie is favorited
const isFavorited = data?.movieIds.includes(movieId) || false;

// Render heart icon based on favorite status
<IconButton>
  {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
</IconButton>
```

---

### `useAddFavorite()`
Adds a movie to the user's favorites with optimistic updates.

#### Parameters
None (returns mutation object)

#### Returns
```typescript
{
  mutate: (data: AddFavoriteRequest) => void;
  mutateAsync: (data: AddFavoriteRequest) => Promise<FavoriteResponse>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// AddFavoriteRequest structure
type AddFavoriteRequest = {
  movieId: number;
}

// FavoriteResponse structure
type FavoriteResponse = {
  success: boolean;
  favorite?: Favorite;
  message: string;
}
```

#### Mutation Behavior
1. **onMutate:** Immediately updates cache (optimistic)
2. **onError:** Rolls back if API call fails
3. **onSettled:** Refetches favorites to ensure sync

#### Example Usage
```typescript
const addFavorite = useAddFavorite();

// Add to favorites
const handleAddFavorite = (movieId: number) => {
  addFavorite.mutate({ movieId });
};

// With loading state
<IconButton 
  onClick={() => handleAddFavorite(123)}
  disabled={addFavorite.isLoading}
>
  <FavoriteIcon />
</IconButton>

// With async/await
const handleAddFavoriteAsync = async (movieId: number) => {
  try {
    const result = await addFavorite.mutateAsync({ movieId });
    console.log(result.message);
  } catch (error) {
    console.error('Failed to add favorite:', error);
  }
};
```

---

### `useRemoveFavorite()`
Removes a movie from the user's favorites with optimistic updates.

#### Parameters
None (returns mutation object)

#### Returns
```typescript
{
  mutate: (movieId: number) => void;
  mutateAsync: (movieId: number) => Promise<FavoriteResponse>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
```

#### Mutation Behavior
1. **onMutate:** Immediately removes from cache (optimistic)
2. **onError:** Rolls back if API call fails
3. **onSettled:** Refetches favorites to ensure sync

#### Example Usage
```typescript
const removeFavorite = useRemoveFavorite();

// Remove from favorites
const handleRemoveFavorite = (movieId: number) => {
  removeFavorite.mutate(movieId);
};

// With confirmation dialog
const handleRemoveFavorite = (movieId: number) => {
  if (confirm('Remove from favorites?')) {
    removeFavorite.mutate(movieId);
  }
};

// With error handling
<IconButton 
  onClick={() => handleRemoveFavorite(123)}
  disabled={removeFavorite.isLoading}
>
  {removeFavorite.isError && <ErrorIcon />}
  <DeleteIcon />
</IconButton>
```

---

## Profile Hooks

### `useProfile()`
Fetches the current user's profile information.

#### Parameters
None

#### Returns
```typescript
{
  data: Profile | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// Profile structure
type Profile = {
  id: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
}
```

#### Query Key
```typescript
profileKeys.all
// ['profile']
```

#### Cache Configuration
- **staleTime:** 1 minute
- **gcTime:** 5 minutes
- **Enabled:** Only when JWT token exists

#### Example Usage
```typescript
const { data: profile, isLoading } = useProfile();

if (isLoading) return <Skeleton />;

return (
  <Box>
    <Avatar src={profile?.avatarUrl} />
    <Typography>{profile?.displayName || 'Anonymous'}</Typography>
    <Typography variant="caption">{profile?.bio}</Typography>
  </Box>
);
```

---

### `useUpdateProfile()`
Updates the user's profile with optimistic updates.

#### Parameters
None (returns mutation object)

#### Returns
```typescript
{
  mutate: (data: UpdateProfileRequest) => void;
  mutateAsync: (data: UpdateProfileRequest) => Promise<Profile>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// UpdateProfileRequest structure
type UpdateProfileRequest = {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
}
```

#### Example Usage
```typescript
const updateProfile = useUpdateProfile();

const handleSubmit = (values: UpdateProfileRequest) => {
  updateProfile.mutate(values);
};

// With React Hook Form
<form onSubmit={handleSubmit(onSubmit)}>
  <TextField {...register('displayName')} />
  <TextField {...register('bio')} />
  <Button type="submit" disabled={updateProfile.isLoading}>
    Save Changes
  </Button>
</form>
```

---

## Type Definitions

### Core Types
```typescript
// Movie entity
type Movie = {
  id: number;
  title: string;
  category: string;
  genre: string;
  year: number;
  rating: number;
  image: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

// Favorite entity
type Favorite = {
  movieId: number;
  createdAt: string;
}

// Profile entity
type Profile = {
  id: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
}
```

### Request/Response Types
```typescript
// Movies
type MoviesFilters = {
  category?: string;
  search?: string;
}

type MoviesResponse = {
  movies: Movie[];
  total: number;
  categories: string[];
  timestamp: string;
}

// Categories
type CategoriesResponse = {
  categories: string[];
  total: number;
}

// Favorites
type FavoritesResponse = {
  movieIds: number[];
  favorites: Favorite[];
  total: number;
}

type AddFavoriteRequest = {
  movieId: number;
}

type FavoriteResponse = {
  success: boolean;
  favorite?: Favorite;
  message: string;
}

// Profile
type UpdateProfileRequest = {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
}
```

---

## Error Handling

### Error Types
```typescript
// API errors
class ApiError extends Error {
  status: number;
  data?: unknown;
}

// Network errors
class NetworkError extends Error {
  code: string;
}

// Validation errors
class ValidationError extends Error {
  fields: Record<string, string[]>;
}
```

### Error Handling Patterns

#### Query Errors
```typescript
const { data, error, isError, refetch } = useMovies();

if (isError) {
  if (error.message.includes('401')) {
    // Redirect to login
    router.push('/signin');
  } else {
    // Show error state
    return <ErrorState error={error} onRetry={refetch} />;
  }
}
```

#### Mutation Errors
```typescript
const addFavorite = useAddFavorite();

addFavorite.mutate(
  { movieId: 123 },
  {
    onError: (error) => {
      if (error.message.includes('duplicate')) {
        toast.error('Already in favorites');
      } else {
        toast.error('Failed to add favorite');
      }
    },
    onSuccess: () => {
      toast.success('Added to favorites');
    }
  }
);
```

#### Global Error Handling
```typescript
// src/lib/queryClient.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry 4xx errors
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
    },
  },
});
```

---

## Cache Management

### Manual Cache Updates
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { movieKeys } from '@/services/queries/movies';

const queryClient = useQueryClient();

// Update specific query
queryClient.setQueryData(movieKeys.list({ category: 'Action' }), newData);

// Invalidate all movies
queryClient.invalidateQueries({ queryKey: movieKeys.all });

// Refetch specific query
queryClient.refetchQueries({ queryKey: movieKeys.list({ category: 'Action' }) });

// Remove query from cache
queryClient.removeQueries({ queryKey: movieKeys.all });

// Get cached data
const cachedMovies = queryClient.getQueryData(movieKeys.all);
```

### Prefetching
```typescript
// Prefetch on route change
router.events.on('routeChangeStart', (url) => {
  if (url === '/movies') {
    queryClient.prefetchQuery({
      queryKey: movieKeys.list({}),
      queryFn: () => api.get('/api/movies'),
    });
  }
});

// Prefetch on hover
<Link 
  href="/movies"
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: movieKeys.list({}),
      queryFn: () => api.get('/api/movies'),
    });
  }}
>
  Browse Movies
</Link>
```

---

## Performance Tips

### 1. Use Specific Query Keys
```typescript
// ❌ Bad: Too broad, invalidates everything
queryClient.invalidateQueries({ queryKey: ['movies'] });

// ✅ Good: Specific, only invalidates filtered list
queryClient.invalidateQueries({ 
  queryKey: movieKeys.list({ category: 'Action' }) 
});
```

### 2. Debounce Search Inputs
```typescript
// ❌ Bad: Query on every keystroke
const { data } = useMovies({ search: searchInput });

// ✅ Good: Query 300ms after user stops typing
const [debouncedSearch, setDebouncedSearch] = useState('');
useEffect(() => {
  const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
  return () => clearTimeout(timer);
}, [searchInput]);
const { data } = useMovies({ search: debouncedSearch });
```

### 3. Optimize staleTime
```typescript
// ❌ Bad: Always refetch (slow)
staleTime: 0

// ✅ Good: Cache for appropriate duration
staleTime: 5 * 60 * 1000  // 5 minutes for movies
staleTime: 10 * 60 * 1000 // 10 minutes for categories
staleTime: 2 * 60 * 1000  // 2 minutes for user-specific data
```

### 4. Use Optimistic Updates
```typescript
// ❌ Bad: Wait for API response
addFavorite.mutate({ movieId }, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
  }
});

// ✅ Good: Update immediately, rollback on error
// (Already implemented in useAddFavorite hook)
```

---

## Testing Hooks

### Unit Testing
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMovies } from '@/services/queries/movies';

describe('useMovies', () => {
  it('fetches movies successfully', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useMovies(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.movies).toHaveLength(12);
  });
});
```

---

**Last Updated:** November 24, 2025  
**Version:** 1.0.0

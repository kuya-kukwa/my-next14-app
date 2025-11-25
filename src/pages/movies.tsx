"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useMovies } from '@/services/queries/movies';
import { useCategories } from '@/services/queries/categories';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '@/services/queries/favorites';
import { getToken } from '@/lib/session';
import MovieCard from '@/components/ui/MovieCard';
import MovieCardSkeleton from '@/components/ui/MovieCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';

export default function MoviesPage() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Check authentication
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/signin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: moviesData, isLoading: moviesLoading, isError: moviesError, error: moviesErrorObj, refetch: refetchMovies } = useMovies({
    category: selectedCategory || undefined,
    search: debouncedSearch || undefined,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: favoritesData } = useFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const movies = moviesData?.movies || [];
  const categories = categoriesData?.categories || [];
  const favoriteIds = favoritesData?.movieIds || [];

  const handleToggleFavorite = (movieId: string) => {
    if (favoriteIds.includes(movieId)) {
      removeFavorite.mutate(movieId);
    } else {
      addFavorite.mutate({ movieId });
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#0a0a0a' : '#f5f5f5',
        pt: { xs: 12, sm: 14, md: 16 },
        pb: 8,
        transition: 'background-color 0.5s',
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#0a0a0a',
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Browse Movies
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: isDark ? '#b3b3b3' : '#666666',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Discover and save your favorite movies
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search movies by title or genre..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: isDark ? '#b3b3b3' : '#666666' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#e50914',
                },
              },
              '& .MuiInputBase-input': {
                color: isDark ? '#ffffff' : '#0a0a0a',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1.5, sm: 2 },
              },
            }}
          />
        </Box>

        {/* Category Filters */}
        <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip
            label="All"
            onClick={() => setSelectedCategory('')}
            sx={{
              backgroundColor: !selectedCategory ? '#e50914' : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff'),
              color: !selectedCategory ? '#ffffff' : (isDark ? '#e5e5e5' : '#0a0a0a'),
              fontWeight: 600,
              px: 1,
              '&:hover': {
                backgroundColor: !selectedCategory ? '#b2070f' : (isDark ? 'rgba(255, 255, 255, 0.1)' : '#f5f5f5'),
              },
            }}
          />
          {categoriesLoading ? (
            <Typography sx={{ color: isDark ? '#b3b3b3' : '#666666' }}>Loading categories...</Typography>
          ) : (
            categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategoryClick(category)}
                sx={{
                  backgroundColor: selectedCategory === category ? '#e50914' : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff'),
                  color: selectedCategory === category ? '#ffffff' : (isDark ? '#e5e5e5' : '#0a0a0a'),
                  fontWeight: 600,
                  px: 1,
                  '&:hover': {
                    backgroundColor: selectedCategory === category ? '#b2070f' : (isDark ? 'rgba(255, 255, 255, 0.1)' : '#f5f5f5'),
                  },
                }}
              />
            ))
          )}
        </Box>

        {/* Movies Grid */}
        {moviesError ? (
          <ErrorState
            title="Failed to load movies"
            message="We couldn't fetch the movies. Please try again."
            error={moviesErrorObj}
            onRetry={() => refetchMovies()}
          />
        ) : moviesLoading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </Box>
        ) : movies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="h6"
              sx={{
                color: isDark ? '#b3b3b3' : '#666666',
                mb: 2,
              }}
            >
              No movies found
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isDark ? '#808080' : '#999999',
              }}
            >
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {movies.map((movie) => {
              const isFavorite = favoriteIds.includes(movie.id);
              return (
                <Box key={movie.id} sx={{ position: 'relative' }}>
                  <MovieCard movie={movie} />
                  <IconButton
                    onClick={() => handleToggleFavorite(movie.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(8px)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      },
                    }}
                  >
                    {isFavorite ? (
                      <FavoriteIcon sx={{ color: '#e50914' }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: '#ffffff' }} />
                    )}
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Results count */}
        {!moviesLoading && !moviesError && movies.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: isDark ? '#808080' : '#999999',
              }}
            >
              Showing {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
              {selectedCategory && ` in ${selectedCategory}`}
              {debouncedSearch && ` matching "${debouncedSearch}"`}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

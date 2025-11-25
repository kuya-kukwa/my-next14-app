"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useMovies } from '@/services/queries/movies';
import { useFavorites, useRemoveFavorite } from '@/services/queries/favorites';
import { getToken } from '@/lib/session';
import MovieCard from '@/components/ui/MovieCard';
import MovieCardSkeleton from '@/components/ui/MovieCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';

export default function FavoritesPage() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/signin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const { data: favoritesData, isLoading: favoritesLoading, isError: favoritesError, error: favoritesErrorObj, refetch: refetchFavorites } = useFavorites();
  const { data: moviesData, isLoading: moviesLoading, isError: moviesError, error: moviesErrorObj, refetch: refetchMovies } = useMovies();
  const removeFavorite = useRemoveFavorite();

  const favoriteIds = favoritesData?.movieIds || [];
  const allMovies = moviesData?.movies || [];
  
  // Filter movies to only show favorites
  const favoriteMovies = allMovies.filter((movie) => favoriteIds.includes(movie.id));

  const handleRemoveFavorite = (movieId: string) => {
    removeFavorite.mutate(movieId);
  };

  if (!isAuthenticated) {
    return null;
  }

  const isLoading = favoritesLoading || moviesLoading;
  const isError = favoritesError || moviesError;
  const error = favoritesErrorObj || moviesErrorObj;

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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <FavoriteIcon
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem' },
                color: '#e50914',
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 800,
                color: isDark ? '#ffffff' : '#0a0a0a',
                letterSpacing: '-0.02em',
              }}
            >
              My Favorites
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: isDark ? '#b3b3b3' : '#666666',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Your personally curated collection of favorite movies
          </Typography>
        </Box>

        {/* Content */}
        {isError ? (
          <ErrorState
            title="Failed to load favorites"
            message="We couldn't fetch your favorite movies. Please try again."
            error={error}
            onRetry={() => {
              refetchFavorites();
              refetchMovies();
            }}
          />
        ) : isLoading ? (
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
            {Array.from({ length: 8 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </Box>
        ) : favoriteMovies.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 12,
              px: 4,
            }}
          >
            <FavoriteIcon
              sx={{
                fontSize: 80,
                color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                mb: 3,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: isDark ? '#ffffff' : '#0a0a0a',
                mb: 2,
              }}
            >
              No favorites yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#b3b3b3' : '#666666',
                mb: 4,
                maxWidth: '400px',
                mx: 'auto',
              }}
            >
              Start building your collection by browsing movies and clicking the heart icon on your favorites
            </Typography>
            <Link href="/movies" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#e50914',
                  color: '#ffffff',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '9999px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#b2070f',
                  },
                }}
              >
                Browse Movies
              </Button>
            </Link>
          </Box>
        ) : (
          <>
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
              {favoriteMovies.map((movie) => (
                <Box key={movie.id} sx={{ position: 'relative' }}>
                  <MovieCard movie={movie} />
                  <IconButton
                    onClick={() => handleRemoveFavorite(movie.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(8px)',
                      '&:hover': {
                        backgroundColor: 'rgba(229, 9, 20, 0.9)',
                      },
                    }}
                  >
                    <DeleteIcon sx={{ color: '#ffffff' }} />
                  </IconButton>
                </Box>
              ))}
            </Box>

            {/* Results count */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? '#808080' : '#999999',
                  mb: 2,
                }}
              >
                {favoriteMovies.length} {favoriteMovies.length === 1 ? 'movie' : 'movies'} in your collection
              </Typography>
              <Link href="/movies" passHref style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    color: isDark ? '#ffffff' : '#0a0a0a',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: '9999px',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#e50914',
                      backgroundColor: 'rgba(229, 9, 20, 0.1)',
                    },
                  }}
                >
                  Add More Movies
                </Button>
              </Link>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

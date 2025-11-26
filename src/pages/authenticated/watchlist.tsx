"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useMovies } from '@/services/queries/movies';
import { useWatchlist, useRemoveFromWatchlist } from '@/services/queries/watchlist';
import { useProfile } from '@/services/queries/profile';
import { getToken } from '@/lib/session';
import MovieCard from '@/components/ui/MovieCard';
import MovieCardSkeleton from '@/components/ui/MovieCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';

export default function WatchlistPage() {
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

  const { data: profileData } = useProfile();
  const { data: watchlistData, isLoading: watchlistLoading, isError: watchlistError, error: watchlistErrorObj, refetch: refetchWatchlist } = useWatchlist();
  const { data: moviesData, isLoading: moviesLoading, isError: moviesError, error: moviesErrorObj, refetch: refetchMovies } = useMovies();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const watchlistMovieIds = watchlistData?.movieIds || [];
  const allMovies = moviesData?.movies || [];
  
  // Filter movies to only show watchlist items
  const watchlistMovies = allMovies.filter((movie) => watchlistMovieIds.includes(movie.id));
  
  // Get display name (use displayName if set, otherwise extract from email or use "User")
  const getUserDisplayName = () => {
    if (profileData?.displayName) {
      return profileData.displayName;
    }
    // Fallback to generic "User" since we don't have access to user email here
    return "Your";
  };

  const handleRemoveFromWatchlist = (movieId: string) => {
    removeFromWatchlist.mutate(movieId);
  };

  if (!isAuthenticated) {
    return null;
  }

  const isLoading = watchlistLoading || moviesLoading;
  const isError = watchlistError || moviesError;
  const error = watchlistErrorObj || moviesErrorObj;

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
        {/* Header with User Context */}
        <Box sx={{ mb: 6 }}>
          {/* User Badge */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Chip
              icon={<PersonIcon />}
              label={`${getUserDisplayName()} Collection`}
              sx={{
                backgroundColor: isDark ? 'rgba(229, 9, 20, 0.15)' : 'rgba(229, 9, 20, 0.1)',
                color: '#e50914',
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: 2,
                py: 2.5,
                borderRadius: '9999px',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                '& .MuiChip-icon': {
                  color: '#e50914',
                },
              }}
            />
          </Box>
          
          {/* Title */}
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <BookmarkIcon
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
                My Watchlist
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
              Your personal watchlist of movies you want to watch later
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        {isError ? (
          <ErrorState
            title="Failed to load watchlist"
            message="We couldn't fetch your watchlist movies. Please try again."
            error={error}
            onRetry={() => {
              refetchWatchlist();
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
        ) : watchlistMovies.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 12,
              px: 4,
            }}
          >
            <BookmarkIcon
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
              Your watchlist is empty
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
              Start building your watchlist by browsing movies and clicking the bookmark icon to save movies for later
            </Typography>
            <Link href="/authenticated/home" passHref style={{ textDecoration: 'none' }}>
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
              {watchlistMovies.map((movie) => (
                <Box key={movie.id} sx={{ position: 'relative' }}>
                  <MovieCard movie={movie} />
                  <IconButton
                    onClick={() => handleRemoveFromWatchlist(movie.id)}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7))',
                      backdropFilter: 'blur(8px)',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                      '&:hover': {
                        background: 'linear-gradient(to bottom right, rgba(229, 9, 20, 0.9), rgba(178, 7, 15, 0.7))',
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 6px 16px rgba(229, 9, 20, 0.25)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                      width: 44,
                      height: 44,
                    }}
                    aria-label="Remove from watchlist"
                  >
                    <BookmarkIcon sx={{ color: '#ffffff', fontSize: 20 }} />
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
                {watchlistMovies.length} {watchlistMovies.length === 1 ? 'movie' : 'movies'} in your watchlist
              </Typography>
              <Link href="/authenticated/home" passHref style={{ textDecoration: 'none' }}>
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

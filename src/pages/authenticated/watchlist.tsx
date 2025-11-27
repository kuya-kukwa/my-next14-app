'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useThemeContext } from '@/contexts/ThemeContext';
import { useMovies } from '@/services/queries/movies';
import {
  useWatchlist,
  useRemoveFromWatchlist,
} from '@/services/queries/watchlist';
import { getToken } from '@/lib/session';

import MovieCard from '@/components/ui/MovieCard';
import ErrorState from '@/components/ui/ErrorState';
import { WatchlistSkeleton } from '@/components/skeletons';

export default function WatchlistPage() {
  const router = useRouter();
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');

  // =============================
  // LOAD MOVIES + WATCHLIST DATA
  // =============================
  const {
    data: moviesData,
    isLoading: moviesLoading,
    isError: moviesError,
    error: moviesErr,
    refetch: refetchMovies,
  } = useMovies();

  const {
    data: watchlistData,
    isLoading: watchlistLoading,
    isError: watchlistError,
    error: watchlistErr,
    refetch: refetchWatchlist,
  } = useWatchlist();

  const removeFromWatchlist = useRemoveFromWatchlist();

  // =============================
  // AUTH CHECK
  // =============================
  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push('/auths/signin');
      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) return null;

  // =============================
  // LOADING UI
  // =============================
  if (moviesLoading || watchlistLoading) {
    return <WatchlistSkeleton />;
  }

  // =============================
  // ERROR STATE (Unified)
  // =============================
  if (moviesError || watchlistError) {
    return (
      <ErrorState
        title="Failed to load Watchlist"
        message="We couldn't fetch your watchlist. Please try again."
        error={moviesErr || watchlistErr}
        onRetry={() => {
          refetchMovies();
          refetchWatchlist();
        }}
      />
    );
  }

  // =============================
  // FILTER WATCHLIST MOVIES
  // =============================
  const watchlistMovieIds = watchlistData?.movieIds || [];
  const allMovies = moviesData?.movies || [];
  let filteredMovies = allMovies.filter((movie) =>
    watchlistMovieIds.includes(movie.id)
  );

  // Apply search filter
  if (searchTerm) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply category filter
  if (categoryFilter !== 'all') {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  // Apply genre filter
  if (genreFilter !== 'all') {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.genre.toLowerCase() === genreFilter.toLowerCase()
    );
  }

  const handleRemoveFromWatchlist = (movieId: string) => {
    removeFromWatchlist.mutate(movieId);
  };

  // =============================
  // PAGE UI
  // =============================
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
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            <BookmarkIcon sx={{ fontSize: '2.5rem', color: '#e50914' }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: isDark ? '#fff' : '#0a0a0a',
              }}
            >
              My Watchlist
            </Typography>
          </Box>

          <Typography
            sx={{
              maxWidth: 600,
              mx: 'auto',
              color: isDark ? '#b3b3b3' : '#666',
            }}
          >
            Your personal list of movies saved for later.
          </Typography>
        </Box>

        {/* Filter Bar Wrapper — centers content like the title */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              maxWidth: '1200px',
              width: '100%',
              textAlign: 'center',
              mb: 6,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
              alignItems: 'center',
              py: 1.5, // ↑ add vertical padding to make bar taller
            }}
          >
            {/* Search Input */}
            <TextField
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: { xs: '100%', sm: '350px' }, // responsive width
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#fff' : '#0a0a0a',
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                  '& fieldset': {
                    borderColor: isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDark
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(0,0,0,0.2)',
                  },
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                },
              }}
              size="small"
            />

            {/* Category Select */}
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as string)}
              sx={{
                minWidth: '180px',
                color: isDark ? '#fff' : '#0a0a0a',
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.03)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(0,0,0,0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark
                    ? 'rgba(255,255,255,0.3)'
                    : 'rgba(0,0,0,0.2)',
                },
              }}
              size="small"
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="action">Action</MenuItem>
              <MenuItem value="drama">Drama</MenuItem>
              <MenuItem value="comedy">Comedy</MenuItem>
              <MenuItem value="horror">Horror</MenuItem>
              <MenuItem value="sci-fi">Sci-Fi</MenuItem>
              <MenuItem value="thriller">Thriller</MenuItem>
            </Select>

            {/* Clear Button */}
            {(searchTerm ||
              categoryFilter !== 'all' ||
              genreFilter !== 'all') && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setGenreFilter('all');
                }}
                sx={{
                  color: isDark ? '#fff' : '#0a0a0a',
                  borderColor: isDark
                    ? 'rgba(255,255,255,0.3)'
                    : 'rgba(0,0,0,0.2)',
                  '&:hover': {
                    borderColor: isDark
                      ? 'rgba(255,255,255,0.5)'
                      : 'rgba(0,0,0,0.4)',
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.02)',
                  },
                  height: '36px', // match TextField height
                }}
                size="small"
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Box>

        {/* Empty State */}
        {filteredMovies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <BookmarkIcon
              sx={{
                fontSize: 80,
                color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                mb: 3,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: isDark ? '#fff' : '#0a0a0a',
                mb: 2,
              }}
            >
              Your watchlist is empty
            </Typography>

            <Typography
              sx={{
                maxWidth: 400,
                mx: 'auto',
                color: isDark ? '#b3b3b3' : '#666',
                mb: 4,
              }}
            >
              Start building your watchlist by browsing movies.
            </Typography>

            <Link href="/authenticated/home" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: isDark ? '#e50914' : '#e50914',
                  color: '#ffffff',
                  fontWeight: 600,
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: isDark ? '#b2070f' : '#b2070f',
                  },
                }}
              >
                Browse Movies
              </Button>
            </Link>
          </Box>
        ) : (
          <>
            {/* Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 3,
              }}
            >
              {filteredMovies.map((movie) => (
                <Box key={movie.id} sx={{ position: 'relative' }}>
                  <MovieCard movie={movie} />

                  <IconButton
                    onClick={() => handleRemoveFromWatchlist(movie.id)}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(0,0,0,0.8)',
                      '&:hover': {
                        background: 'rgba(229,9,20,0.9)',
                      },
                    }}
                  >
                    <BookmarkIcon sx={{ color: '#ef4444' }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

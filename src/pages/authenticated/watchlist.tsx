'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';

import { useMovies } from '@/services/queries/movies';
import {
  useWatchlist,
  useRemoveFromWatchlist,
} from '@/services/queries/watchlist';
import { useWatchlistConfirm } from '@/hooks/useWatchlistConfirm';
import { useScrollLock } from '@/hooks/useScrollLock';

import ErrorState from '@/components/ui/ErrorState';
import { WatchlistConfirmDialog } from '@/components/ui/WatchlistConfirmDialog';
import { WatchlistSkeleton } from '@/components/skeletons';
import MovieCard from '@/components/ui/MovieCard';
import { MovieDetailsModal } from '@/components/ui/MovieDetailsModal';
import type { Movie } from '@/types';

export default function WatchlistPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');

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

  // watchlist confirmation
  const { confirmState, openConfirm, closeConfirm, confirmAction } =
    useWatchlistConfirm((movieId) => {
      removeFromWatchlist.mutate(movieId);
    });

  // Prevent body scrolling when modals are open
  const isModalOpen = !!selectedMovie || confirmState.isOpen;
  useScrollLock(isModalOpen);

  // =============================
  // MEMOIZED DATA & HANDLERS
  // =============================
  const watchlistMovieIds = useMemo(
    () => watchlistData?.movieIds || [],
    [watchlistData]
  );
  const allMovies = useMemo(() => moviesData?.movies || [], [moviesData]);

  // Memoize watchlist movies
  const watchlistMovies = useMemo(
    () => allMovies.filter((movie) => watchlistMovieIds.includes(movie.id)),
    [allMovies, watchlistMovieIds]
  );

  // Memoize available genres
  const availableGenres = useMemo(
    () =>
      Array.from(new Set(watchlistMovies.map((movie) => movie.genre))).sort(),
    [watchlistMovies]
  );

  // Memoize filtered movies
  const filteredMovies = useMemo(() => {
    let filtered = watchlistMovies;

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter((movie) => movie.genre === selectedGenre);
    }

    return filtered;
  }, [watchlistMovies, searchTerm, selectedGenre]);

  const handleRemoveFromWatchlist = useCallback(
    (movieId: string, movieTitle: string) => {
      openConfirm(movieId, movieTitle, 'remove');
    },
    [openConfirm]
  );

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleGenreChange = useCallback((e: SelectChangeEvent<string>) => {
    setSelectedGenre(e.target.value);
  }, []);

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
  // PAGE UI
  // =============================
  return (
    <Box className="watchlist-page">
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box className="watchlist-header">
          <Typography variant="h3" className="watchlist-title">
            My Watchlist
          </Typography>

          <Box className="watchlist-controls">
            <Typography className="watchlist-count">
              Your personal collection of Movies
            </Typography>

            <Box className="watchlist-filters">
              {/* Genre Filter */}
              <FormControl
                size="small"
                className="watchlist-filter-control genre"
              >
                <InputLabel>Genre</InputLabel>
                <Select
                  value={selectedGenre}
                  label="Genre"
                  onChange={handleGenreChange}
                  className="filter-input-root"
                >
                  <MenuItem value="">All Genres</MenuItem>
                  {availableGenres.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Search Input */}
              <TextField
                placeholder="Search watchlist..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                className="watchlist-search"
                InputProps={{
                  className: 'filter-input-root',
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="search-icon" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Empty State */}
        {filteredMovies.length === 0 ? (
          <Box className="watchlist-empty">
            <BookmarkIcon className="watchlist-empty-icon watchlist-empty-icon-style" />

            <Typography variant="h5" className="watchlist-empty-title">
              {searchTerm ? 'No movies found' : 'Your watchlist is empty'}
            </Typography>

            <Typography className="watchlist-empty-text">
              {searchTerm
                ? 'Try searching for something else'
                : 'Start building your watchlist by browsing movies.'}
            </Typography>

            {!searchTerm && (
              <Link href="/authenticated/home" className="no-text-decoration">
                <Button variant="contained" className="watchlist-browse-button">
                  Browse Movies
                </Button>
              </Link>
            )}
          </Box>
        ) : (
          <Box className="watchlist-grid">
            {filteredMovies.map((movie, index) => (
              <Box
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className="watchlist-card watchlist-card-wrapper"
              >
                {/* Remove from Watchlist Icon */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWatchlist(movie.id, movie.title);
                  }}
                  className="watchlist-card-remove watchlist-remove-button"
                  aria-label="Remove from watchlist"
                >
                  <BookmarkIcon className="watchlist-remove-icon" />
                </IconButton>

                {/* Movie Poster */}
                <Box>
                  <MovieCard movie={movie} priority={index < 4} />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        open={!!selectedMovie}
        onClose={handleCloseModal}
        onRemove={handleRemoveFromWatchlist}
      />

      {/* Watchlist Confirmation Dialog */}
      <WatchlistConfirmDialog
        open={confirmState.isOpen}
        movieTitle={confirmState.movieTitle}
        action={confirmState.action}
        onConfirm={confirmAction}
        onCancel={closeConfirm}
        isLoading={removeFromWatchlist.isPending}
      />
    </Box>
  );
}

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
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

import { useThemeContext } from '@/contexts/ThemeContext';
import { useMovies } from '@/services/queries/movies';
import {
  useWatchlist,
  useRemoveFromWatchlist,
} from '@/services/queries/watchlist';
import { useWatchlistConfirm } from '@/hooks/useWatchlistConfirm';

import ErrorState from '@/components/ui/ErrorState';
import { WatchlistConfirmDialog } from '@/components/ui/WatchlistConfirmDialog';
import { WatchlistSkeleton } from '@/components/skeletons';
import MovieCard from '@/components/ui/MovieCard';
import type { Movie } from '@/types';

export default function WatchlistPage() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
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
  useEffect(() => {
    const isModalOpen = !!selectedMovie || confirmState.isOpen;

    if (isModalOpen) {
      // Calculate scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Store current scroll position
      const scrollY = window.scrollY;

      // Apply styles to prevent scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Get the scroll position from the fixed body
      const scrollY = document.body.style.top;

      // Remove styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';

      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedMovie, confirmState.isOpen]);

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

  // Memoize available years and genres
  const availableYears = useMemo(
    () =>
      Array.from(new Set(watchlistMovies.map((movie) => movie.year))).sort(
        (a, b) => b - a
      ),
    [watchlistMovies]
  );

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

    // Apply year filter
    if (selectedYear) {
      const yearNum = parseInt(selectedYear);
      filtered = filtered.filter((movie) => movie.year === yearNum);
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter((movie) => movie.genre === selectedGenre);
    }

    return filtered;
  }, [watchlistMovies, searchTerm, selectedYear, selectedGenre]);

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

  const handleYearChange = useCallback((e: SelectChangeEvent<string>) => {
    setSelectedYear(e.target.value);
  }, []);

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
              {/* Year Filter */}
              <FormControl size="small" className="watchlist-filter-control">
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Year"
                  onChange={handleYearChange}
                  className="filter-input-root"
                >
                  <MenuItem value="">All Years</MenuItem>
                  {availableYears.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
            <BookmarkIcon
              className="watchlist-empty-icon"
              sx={{
                color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              }}
            />

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
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#e50914',
                    color: '#ffffff',
                    fontWeight: 600,
                    px: 4,
                    py: 1.2,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#b2070f',
                    },
                  }}
                >
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
                className="watchlist-card"
                sx={{ position: 'relative' }}
              >
                {/* Remove from Watchlist Icon */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWatchlist(movie.id, movie.title);
                  }}
                  className="watchlist-card-remove"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    color: '#ef4444',
                    width: 36,
                    height: 36,
                    '&:hover': {
                      backgroundColor: '#e50914',
                      borderColor: '#e50914',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  aria-label="Remove from watchlist"
                >
                  <BookmarkIcon sx={{ fontSize: 18 }} />
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

      {/* Right-Side Slide Modal */}
      <Modal
        open={!!selectedMovie}
        onClose={handleCloseModal}
        className="watchlist-modal"
        aria-labelledby="movie-details-title"
        aria-describedby="movie-details-description"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }}
      >
        <Box onClick={handleCloseModal} className="watchlist-modal-backdrop">
          <Box
            onClick={(e) => e.stopPropagation()}
            className="watchlist-modal-panel"
          >
            {selectedMovie && (
              <>
                {/* Close Button */}
                <IconButton
                  onClick={handleCloseModal}
                  className="watchlist-modal-close modal-icon-close"
                >
                  <CloseIcon />
                </IconButton>

                {/* Movie Poster */}
                <Box className="watchlist-card-poster">
                  <Image
                    src={selectedMovie.image || selectedMovie.thumbnail}
                    alt={selectedMovie.title}
                    fill
                    sizes="550px"
                    priority
                  />
                  <Box />
                </Box>

                {/* Content */}
                <Box className="watchlist-modal-content">
                  <Typography
                    variant="h4"
                    className="watchlist-modal-title"
                    id="movie-details-title"
                  >
                    {selectedMovie.title}
                  </Typography>

                  {/* Meta Info */}
                  <Box className="watchlist-modal-meta">
                    {/* Year */}
                    <Box className="watchlist-modal-meta-item">
                      <CalendarTodayIcon className="modal-icon-meta" />
                      <Typography className="watchlist-modal-meta-text">
                        {selectedMovie.year}
                      </Typography>
                    </Box>

                    {/* Duration */}
                    {selectedMovie.duration && (
                      <Box className="watchlist-modal-meta-item">
                        <AccessTimeIcon className="modal-icon-meta" />
                        <Typography className="watchlist-modal-meta-text">
                          {Math.floor(selectedMovie.duration / 60)}h{' '}
                          {selectedMovie.duration % 60}m
                        </Typography>
                      </Box>
                    )}

                    {/* Rating */}
                    <Box className="watchlist-modal-meta-item">
                      <StarIcon className="modal-icon-star" />
                      <Typography className="watchlist-modal-rating-value">
                        {selectedMovie.rating}
                        <Typography
                          component="span"
                          className="watchlist-modal-rating-max"
                        >
                          / 5
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Genre */}
                  <Box className="watchlist-modal-genre">
                    <Chip
                      label={selectedMovie.genre}
                      className="modal-chip-genre"
                    />
                  </Box>

                  {/* Description */}
                  {selectedMovie.description && (
                    <Box className="watchlist-modal-synopsis">
                      <Typography
                        variant="h6"
                        className="watchlist-modal-synopsis-title"
                      >
                        Synopsis
                      </Typography>
                      <Typography
                        className="watchlist-modal-synopsis-text"
                        id="movie-details-description"
                      >
                        {selectedMovie.description}
                      </Typography>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box className="watchlist-modal-actions">
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      fullWidth
                      className="modal-btn-primary"
                    >
                      Watch Now
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<BookmarkIcon />}
                      fullWidth
                      onClick={() => {
                        handleRemoveFromWatchlist(
                          selectedMovie.id,
                          selectedMovie.title
                        );
                        setSelectedMovie(null);
                      }}
                      className="modal-btn-outlined"
                    >
                      Remove from Watchlist
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Modal>

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

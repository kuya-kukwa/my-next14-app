import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useMovies } from '@/services/queries/movies';
import {
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from '@/services/queries/watchlist';
import { useWatchlistConfirm } from '@/hooks/useWatchlistConfirm';
import { useScrollLock } from '@/hooks/useScrollLock';
import MovieCard from '@/components/ui/MovieCard';
import { WatchlistConfirmDialog } from '@/components/ui/WatchlistConfirmDialog';
import {
  HeroSkeleton,
  MovieRowSkeleton,
  FilterSkeleton,
} from '@/components/skeletons';
import { useThemeContext } from '@/contexts/ThemeContext';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import type { Movie } from '@/types';
import { ChevronRight } from 'lucide-react';
import ErrorState from '@/components/ui/ErrorState';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const { isDark } = useThemeContext();

  const {
    data: moviesData,
    isLoading: moviesLoading,
    isFetching: moviesFetching,
    isError,
    error,
    refetch,
  } = useMovies();

  const { data: watchlistData } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const watchlistMovieIds = watchlistData?.movieIds || [];

  // watchlist confirmation
  const { confirmState, openConfirm, closeConfirm, confirmAction } =
    useWatchlistConfirm((movieId, action) => {
      if (action === 'add') {
        addToWatchlist.mutate({ movieId });
      } else {
        removeFromWatchlist.mutate(movieId);
      }
    });

  // mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scrolling when modal is open
  useScrollLock(confirmState.isOpen);

  // toggle watchlist
  const handleToggleWatchlist = (movieId: string, movieTitle: string) => {
    const action = watchlistMovieIds.includes(movieId) ? 'remove' : 'add';
    openConfirm(movieId, movieTitle, action);
  };

  // movies fallback
  const movies = moviesData?.movies || [];

  // Apply filters to movies
  let filteredMovies = movies;

  // Apply search filter
  if (searchTerm) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply genre filter
  if (selectedGenre) {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.genre === selectedGenre
    );
  }

  // Get unique genres for filter
  const availableGenres = Array.from(
    new Set(movies.map((movie) => movie.genre))
  ).sort();

  // organize by category
  const moviesByCategory = filteredMovies.reduce((acc, movie) => {
    if (!acc[movie.category]) acc[movie.category] = [];
    acc[movie.category].push(movie);
    return acc;
  }, {} as Record<string, Movie[]>);

  // hero movie (The Quiet Place)
  const heroMovie = movies.length
    ? movies.find(movie => movie.title.toLowerCase().includes('quiet place')) || movies[0]
    : null;

  const heroImageUrl =
    heroMovie?.image?.replace('/w500/', '/original/') || heroMovie?.image;

  // unified loading state
  const loading = !isMounted || moviesLoading || moviesFetching || !heroMovie;

  // ERROR STATE (your ErrorState component)
  if (isError) {
    return (
      <ErrorState
        title="Failed to load movies"
        message="We encountered a problem loading movie data."
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  // LOADING UI
  if (loading) {
    return (
      <Box sx={{ overflowX: 'hidden' }}>
        <HeroSkeleton />
        <FilterSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
      </Box>
    );
  }

  // SUCCESS UI
  return (
    <>
      {/* PAGE CONTENT */}
      {heroMovie && (
        <>
          {/* Hero Section */}
          <Box
            sx={{
              position: 'relative',
              width: '100vw',
              height: { xs: '45vh', md: '65vh', lg: '89vh' },
              marginLeft: 'calc(-50vw + 50%)',
              overflow: 'hidden',
            }}
          >
            {/* Background Image */}
            <Image
              src={heroImageUrl || heroMovie.image}
              alt={heroMovie.title}
              fill
              priority
              sizes="100vw"
              quality={95}
              className="hero-image"
            />

            {/* Gradient Overlay for Better Text Readability */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: isDark
                  ? 'linear-gradient(to top, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.7) 30%, rgba(10, 10, 10, 0.3) 60%, transparent 100%)'
                  : 'linear-gradient(to top, rgba(250, 250, 250, 0.95) 0%, rgba(250, 250, 250, 0.7) 30%, rgba(250, 250, 250, 0.3) 60%, transparent 100%)',
                zIndex: 10,
              }}
            />

            {/* Content */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
                paddingLeft: { xs: '24px', sm: '5vw', lg: '80px' },
                paddingRight: { xs: '24px', sm: '5vw', lg: '80px' },
                paddingBottom: {
                  xs: '32px',
                  sm: '48px',
                  md: '64px',
                  lg: '96px',
                },
                maxWidth: '64rem',
              }}
            >
              {/* Title */}
              <Box
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '32px', sm: '48px', md: '60px', lg: '84px' },
                  lineHeight: 1.1,
                  textShadow: isDark
                    ? '2px 4px 8px rgba(0, 0, 0, 0.8)'
                    : '2px 4px 8px rgba(0, 0, 0, 0.3)',
                  mb: { xs: 2, md: 3, lg: 4 },
                }}
              >
                {heroMovie.title}
              </Box>

              {/* Info Badges */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: { xs: '8px', md: '12px', lg: '16px' },
                  mb: { xs: 2, md: 3, lg: 4 },
                }}
              >
                {/* Year Badge */}
                <span className="hero-info-badge">{heroMovie.year}</span>

                {/* Genre */}
                <span className="hero-info-text">{heroMovie.genre}</span>

                {/* Duration */}
                {heroMovie.duration && (
                  <span className="hero-info-text">
                    {Math.floor(heroMovie.duration / 60)}h{' '}
                    {heroMovie.duration % 60}m
                  </span>
                )}
              </Box>

              {/* Description */}
              {heroMovie.description && (
                <Box
                  component="p"
                  sx={{
                    maxWidth: '42rem',
                    fontSize: { xs: '14px', md: '16px', lg: '18px' },
                    lineHeight: 'relaxed',
                    textShadow: isDark
                      ? '1px 2px 4px rgba(0, 0, 0, 0.7)'
                      : '1px 2px 4px rgba(0, 0, 0, 0.2)',
                    display: '-webkit-box',
                    WebkitLineClamp: { xs: 2, md: 3 },
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: { xs: 3, md: 4, lg: 5 },
                  }}
                >
                  {heroMovie.description}
                </Box>
              )}

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1.5, sm: 2 },
                  alignItems: { xs: 'stretch', sm: 'center' },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    backgroundColor: '#e50914',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.25, md: 1.5 },
                    borderRadius: '6px',
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
                    '&:hover': {
                      backgroundColor: '#b2070f',
                      boxShadow: '0 6px 16px rgba(229, 9, 20, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Play Now
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<BookmarkIcon />}
                  onClick={() =>
                    handleToggleWatchlist(heroMovie.id, heroMovie.title)
                  }
                  sx={{
                    color: isDark ? '#ffffff' : '#0a0a0a',
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'rgba(0, 0, 0, 0.3)',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.25, md: 1.5 },
                    borderRadius: '6px',
                    textTransform: 'none',
                    backgroundColor: isDark
                      ? 'rgba(0, 0, 0, 0.5)'
                      : 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.6)'
                        : 'rgba(0, 0, 0, 0.5)',
                      backgroundColor: isDark
                        ? 'rgba(0, 0, 0, 0.7)'
                        : 'rgba(255, 255, 255, 0.7)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {watchlistMovieIds.includes(heroMovie.id)
                    ? 'Remove from Watchlist'
                    : 'Add to Watchlist'}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Movie Rows by Category */}
          <section className="relative z-20 -mt-32 md:-mt-40 lg:-mt-48 pb-16 md:pb-20 lg:pb-24">
            <div className="filters-container">
              <Box
                className="watchlist-filters"
                sx={{ justifyContent: 'flex-end', marginTop: 4 }}
              >
                {/* Genre Filter */}
                <FormControl
                  size="small"
                  className="watchlist-filter-control genre"
                >
                  <InputLabel>Genre</InputLabel>
                  <Select
                    value={selectedGenre}
                    label="Genre"
                    onChange={(e) => setSelectedGenre(e.target.value)}
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
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            </div>
            {Object.entries(moviesByCategory).map(
              ([category, categoryMovies]) => (
                <div key={category} className="movie-category-section">
                  <div className="flex items-center justify-between mb-5 md:mb-6">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold movie-category-title">
                      {category}
                    </h2>
                    <button className="text-sm flex items-center gap-1 category-see-all-btn">
                      <span>See all</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide pb-6">
                    {categoryMovies.map((movie) => (
                      <div
                        key={movie.id}
                        className="relative flex-shrink-0 cursor-pointer movie-card-container"
                      >
                        <MovieCard key={movie.id} movie={movie} />
                        <IconButton
                          onClick={() =>
                            handleToggleWatchlist(movie.id, movie.title)
                          }
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            zIndex: 100,
                            background:
                              'linear-gradient(to bottom right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7))',
                            backdropFilter: 'blur(8px)',
                            border: '2px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                            '&:hover': {
                              background:
                                'linear-gradient(to bottom right, rgba(229, 9, 20, 0.9), rgba(178, 7, 15, 0.7))',
                              borderColor: 'rgba(255, 255, 255, 0.8)',
                              boxShadow: '0 6px 16px rgba(229, 9, 20, 0.25)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                            width: 44,
                            height: 44,
                          }}
                          aria-label={
                            watchlistMovieIds.includes(movie.id)
                              ? 'Remove from watchlist'
                              : 'Add to watchlist'
                          }
                        >
                          <BookmarkIcon
                            sx={{
                              fontSize: 20,
                              color: watchlistMovieIds.includes(movie.id)
                                ? '#ef4444'
                                : '#ffffff',
                            }}
                          />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </section>

          <style jsx global>
            {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          `}
          </style>

          {/* Watchlist Confirmation Dialog */}
          <WatchlistConfirmDialog
            open={confirmState.isOpen}
            movieTitle={confirmState.movieTitle}
            action={confirmState.action}
            onConfirm={confirmAction}
            onCancel={closeConfirm}
            isLoading={
              addToWatchlist.isPending || removeFromWatchlist.isPending
            }
          />
        </>
      )}
    </>
  );
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useMovies } from '@/services/queries/movies';
import { getToken } from '@/lib/session';
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '@/services/queries/watchlist';
import MovieCard from '@/components/ui/MovieCard';
import { HeroSkeleton, MovieRowSkeleton } from '@/components/skeletons';
import { useThemeContext } from '@/contexts/ThemeContext';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import type { Movie } from '@/types';
import { ChevronRight } from 'lucide-react';
import ErrorState from '@/components/ui/ErrorState';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

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

  // mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // authentication check
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/signin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // toggle watchlist
  const handleToggleWatchlist = (movieId: string) => {
    if (watchlistMovieIds.includes(movieId)) {
      removeFromWatchlist.mutate(movieId);
    } else {
      addToWatchlist.mutate({ movieId });
    }
  };

  // movies fallback
  const movies = moviesData?.movies || [];

  // organize by category
  const moviesByCategory = movies.reduce((acc, movie) => {
    if (!acc[movie.category]) acc[movie.category] = [];
    acc[movie.category].push(movie);
    return acc;
  }, {} as Record<string, Movie[]>);

  // hero movie (highest rating)
  const heroMovie = movies.length
    ? [...movies].sort((a, b) => b.rating - a.rating)[0]
    : null;

  const heroImageUrl =
    heroMovie?.image?.replace('/w500/', '/original/') || heroMovie?.image;

  // unified loading state
  const loading =
    !isMounted || moviesLoading || moviesFetching || !heroMovie;

  // REDIRECT until authenticated
  if (!isAuthenticated) return null;

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
      <>
        <HeroSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />

      </>
    );
  }

  // SUCCESS UI
  return (
    <>


      {/* PAGE CONTENT */}
      {heroMovie && (
        <>
          {/* Hero Section */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              height: 'clamp(75vh, 85vh, 100vh)',
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
            }}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0"
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <Image
                src={heroImageUrl || heroMovie.image}
                alt={heroMovie.title}
                fill
                priority
                sizes="100vw"
                quality={95}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              {/* Gradient Overlay - subtle, only at bottom for text readability */}
              <div 
                className="absolute inset-0"
                style={{
                  background: isDark 
                    ? 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 25%, transparent 50%)'
                    : 'linear-gradient(to top, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.4) 25%, transparent 50%)'
                }}
              />
            </div>

            {/* Content */}
            <div
              className="relative z-20 flex flex-col justify-end h-full"
              style={{
                paddingLeft: 'clamp(24px, 5vw, 80px)',
                paddingRight: 'clamp(24px, 5vw, 80px)',
                paddingBottom: 'clamp(64px, 8vh, 96px)',
                maxWidth: '64rem',
              }}
            >
              {/* Title */}
              <h1
                className="font-bold mb-4 md:mb-5 lg:mb-6"
                style={{
                  fontSize: 'clamp(36px, 6vw, 84px)',
                  lineHeight: 1.1,
                  textShadow: isDark ? '2px 4px 8px rgba(0, 0, 0, 0.8)' : '2px 4px 8px rgba(0, 0, 0, 0.3)',
                }}
              >
                {heroMovie.title}
              </h1>

              {/* Info Badges */}
              <div className="flex items-center flex-wrap" style={{ gap: 'clamp(12px, 1.5vw, 16px)', marginBottom: 'clamp(20px, 3vh, 28px)' }}>
                {/* Year Badge */}
                <span
                  className="px-2.5 py-1 text-xs md:text-sm font-medium rounded"
                  style={{
                    color: isDark ? 'rgba(156, 163, 175, 1)' : '#737373',
                    border: isDark ? '1px solid rgba(156, 163, 175, 0.3)' : '1px solid rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {heroMovie.year}
                </span>

                {/* Genre */}
                <span
                  className="text-sm md:text-base"
                  style={{
                    color: isDark ? 'rgba(156, 163, 175, 1)' : '#737373',
                  }}
                >
                  {heroMovie.genre}
                </span>

                {/* Duration if available */}
                {heroMovie.duration && (
                  <span
                    className="text-sm md:text-base"
                    style={{
                      color: isDark ? 'rgba(156, 163, 175, 1)' : '#737373',
                    }}
                  >
                    {Math.floor(heroMovie.duration / 60)}h {heroMovie.duration % 60}m
                  </span>
                )}
              </div>

              {/* Description */}
              {heroMovie.description && (
                <p
                  className="mb-6 md:mb-7 lg:mb-8 leading-relaxed"
                  style={{
                    maxWidth: '42rem',
                    fontSize: 'clamp(14px, 1.5vw, 18px)',
                    textShadow: isDark ? '1px 2px 4px rgba(0, 0, 0, 0.7)' : '1px 2px 4px rgba(0, 0, 0, 0.2)',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {heroMovie.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center" style={{ gap: 'clamp(12px, 1.5vw, 16px)' }}>
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
                  onClick={() => handleToggleWatchlist(heroMovie.id)}
                  sx={{
                    color: isDark ? '#ffffff' : '#0a0a0a',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.25, md: 1.5 },
                    borderRadius: '6px',
                    textTransform: 'none',
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {watchlistMovieIds.includes(heroMovie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
              </div>
            </div>
          </div>

          {/* Movie Rows by Category */}
          <section className="relative z-20 -mt-32 md:-mt-40 lg:-mt-48 pb-16 md:pb-20 lg:pb-24">
            {Object.entries(moviesByCategory).map(([category, categoryMovies]) => (
              <div
                key={category}
                className="mb-10 md:mb-12 lg:mb-14"
                style={{
                  paddingLeft: 'clamp(24px, 5vw, 80px)',
                  paddingRight: 'clamp(24px, 5vw, 80px)',
                }}
              >
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <h2
                    className="text-xl md:text-2xl lg:text-3xl font-semibold"
                    style={{ color: isDark ? '#ffffff' : '#0a0a0a' }}
                  >
                    {category}
                  </h2>
                  <button
  className="text-sm flex items-center gap-1 transition-colors"
  style={{ color: isDark ? 'rgba(156, 163, 175, 1)' : '#737373' }}
  onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#ffffff' : '#0a0a0a'}
  onMouseLeave={(e) => e.currentTarget.style.color = isDark ? 'rgba(156, 163, 175, 1)' : '#737373'}
>
  <span>See all</span>
<ChevronRight size={16} />
</button>

                </div>
                <div className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide pb-6">
                  {categoryMovies.map((movie) => (
                    <div key={movie.id} className="relative flex-shrink-0 cursor-pointer" style={{ width: '210px' }}>
                      <MovieCard movie={movie} priority={false} />
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); handleToggleWatchlist(movie.id); }}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          zIndex: 100,
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
                        aria-label={watchlistMovieIds.includes(movie.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        <BookmarkIcon
                          sx={{
                            fontSize: 20,
                            color: watchlistMovieIds.includes(movie.id) ? '#ef4444' : '#ffffff'
                          }}
                        />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <style jsx global>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </>
      )}
    </>
  );
}
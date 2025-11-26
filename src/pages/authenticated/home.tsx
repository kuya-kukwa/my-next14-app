import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { useMovies } from '@/services/queries/movies';
import { getToken } from '@/lib/session';
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '@/services/queries/watchlist';
import MovieCard from '@/components/ui/MovieCard';
import { HeroSkeleton, MovieRowSkeleton } from '@/components/skeletons';
import { useThemeContext } from '@/contexts/ThemeContext';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import type { Movie } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  const { data: moviesData, isLoading: moviesLoading, isFetching: moviesFetching } = useMovies();
  const { data: watchlistData } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const movies = moviesData?.movies || [];
  const watchlistMovieIds = watchlistData?.movieIds || [];

  // Mount check
  useEffect(() => setIsMounted(true), []);

  // Authentication check
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/signin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Loading showcase timer
  useEffect(() => {
    if (isAuthenticated && isMounted) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000); // Show loading for at least 2 seconds after authentication
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isMounted]);

  const handleToggleWatchlist = (movieId: string) => {
    if (watchlistMovieIds.includes(movieId)) removeFromWatchlist.mutate(movieId);
    else addToWatchlist.mutate({ movieId });
  };

  // Organize movies by category
  const moviesByCategory = movies.reduce((acc, movie) => {
    if (!acc[movie.category]) acc[movie.category] = [];
    acc[movie.category].push(movie);
    return acc;
  }, {} as Record<string, Movie[]>);

  // Hero movie
  const heroMovie = movies.length ? [...movies].sort((a, b) => b.rating - a.rating)[0] : null;

  // Unified loading
  const isLoading = !isMounted || showLoading || moviesLoading || moviesFetching || !heroMovie;

  if (!isAuthenticated) return null;

  return (
    <>
      <Head>
        <title>{isLoading ? 'Loading - NextFlix' : 'NextFlix - Home'}</title>
      </Head>

      {/* LOADING SKELETON */}
      {isLoading && (
        <div className="w-full">
          <HeroSkeleton />
          <section className="relative z-20 -mt-16 md:-mt-20 lg:-mt-24 pb-16 md:pb-20 lg:pb-24 space-y-10 md:space-y-12 lg:space-y-14">
            {Array(2).fill(0).map((_, i) => <MovieRowSkeleton key={i} />)}
          </section>
        </div>
      )}

      {/* PAGE CONTENT */}
      {!isLoading && heroMovie && (
        <>
          {/* Hero Section */}
          <section className="relative h-[75vh] md:h-[85vh] lg:h-[100vh] w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={heroMovie.image}
                alt={heroMovie.title}
                fill  
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Theme-aware gradients */}
              <div
                className="absolute inset-0"
                style={{
                  background: isDark
                    ? 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)'
                    : 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.3) 100%)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: isDark
                    ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)'
                    : 'linear-gradient(to top, rgba(250,250,250,0.95) 0%, rgba(0,0,0,0.4) 30%, transparent 70%)',
                }}
              />           
            </div>

            {/* Hero Content - Enhanced with consistent spacing */}
            <div className="relative z-10 flex flex-col justify-end h-full max-w-4xl px-6 md:px-12 lg:px-20 pb-16 md:pb-20 lg:pb-24">
              {/* Title */}
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-5 lg:mb-6 leading-tight"
                style={{ 
                  color: isDark ? '#fff' : '#0a0a0a', 
                  textShadow: isDark ? '0 4px 12px rgba(0,0,0,0.8)' : '0 2px 8px rgba(255,255,255,0.9)' 
                }}
              >
                {heroMovie.title}
              </h1>

              {/* Info badges */}
              <div className="flex items-center gap-4 md:gap-6 mb-5 md:mb-6 lg:mb-7 text-sm md:text-base">
                <span 
                  className="px-3 py-1.5 font-semibold rounded-md border"
                  style={{
                    borderColor: isDark ? 'rgba(156,163,175,0.4)' : 'rgba(64,64,64,0.6)',
                    color: isDark ? '#fff' : '#0a0a0a',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  {heroMovie.year}
                </span>
                <span 
                  className="px-3 py-1.5 rounded-md border font-medium"
                  style={{
                    borderColor: isDark ? 'rgba(156,163,175,0.4)' : 'rgba(64,64,64,0.6)',
                    color: isDark ? 'rgba(229,229,229,1)' : '#262626',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                  }}
                >
                  {heroMovie.rating.toFixed(1)} ★
                </span>
                <span 
                  className="px-3 py-1.5 rounded-md border"
                  style={{
                    borderColor: isDark ? 'rgba(156,163,175,0.4)' : 'rgba(64,64,64,0.6)',
                    color: isDark ? 'rgba(209,213,219,1)' : '#404040',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {heroMovie.category}
                </span>
              </div>

              {/* Description */}
              <p 
                className="text-base md:text-lg mb-6 md:mb-7 lg:mb-8 line-clamp-3 max-w-[60%] leading-relaxed"
                style={{ color: isDark ? 'rgba(209,213,219,1)' : '#404040' }}
              >
                {heroMovie.description || `${heroMovie.genre} • An unforgettable cinematic experience.`}
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-6 md:gap-8">
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    width: { xs: 130, md: 150 },
                    height: { xs: 44, md: 50 },
                    fontWeight: 'semibold',
                    textTransform: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#dc2626',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    '&:hover': {
                      backgroundColor: '#b91c1c',
                      boxShadow: '0 6px 16px rgba(229, 9, 20, 0.5)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                  }}
                  aria-label="Play movie"
                >
                  Play Now
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={watchlistMovieIds.includes(heroMovie.id) ? <CheckIcon /> : <AddIcon />}
                  sx={{
                    width: { xs: 170, md: 200 },
                    height: { xs: 44, md: 50 },
                    fontWeight: 'semibold',
                    textTransform: 'none',
                    borderRadius: '6px',
                    backgroundColor: isDark ? 'rgba(55,65,81,0.9)' : 'rgba(255,255,255,0.9)',
                    color: isDark ? '#fff' : '#0a0a0a',
                    border: isDark ? 'none' : '1px solid rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(8px)',
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(55,65,81,0.95)' : 'rgba(255,255,255,0.95)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                  }}
                  onClick={() => handleToggleWatchlist(heroMovie.id)}
                  aria-label={watchlistMovieIds.includes(heroMovie.id) ? 'Remove from watch list' : 'Add to watch list'}
                >
                  {watchlistMovieIds.includes(heroMovie.id) ? 'In My List' : 'My List'}
                </Button>
              </div>
            </div>
          </section>

          {/* Movie Rows by Category */}
          <section className="relative z-20 -mt-16 md:-mt-20 lg:-mt-24 pb-16 md:pb-20 lg:pb-24 space-y-10 md:space-y-12 lg:space-y-14">
            {Object.entries(moviesByCategory).map(([category, categoryMovies]) => (
              <div key={category} className="px-6 md:px-12 lg:px-20">
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
                    See All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide pb-6">
                  {categoryMovies.map((movie) => (
                    <div key={movie.id} className="relative flex-shrink-0 group cursor-pointer" style={{ width: '220px' }}>
                      <MovieCard movie={movie} priority={false} />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleWatchlist(movie.id); }}
                        className="absolute top-3 right-3 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:from-red-600/90 hover:to-red-500/70 transition-all duration-300 border-2 border-white/40 shadow-xl hover:shadow-red-500/25 hover:scale-110 cursor-pointer"
                        aria-label={watchlistMovieIds.includes(movie.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        {watchlistMovieIds.includes(movie.id) ? (
                          <svg className="w-5 h-5 text-red-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        )}
                      </button>
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

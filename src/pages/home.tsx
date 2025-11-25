import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/layouts/Layout';
import { movies } from '@/data/movies';
import { getToken } from '@/lib/session';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '@/services/queries/favorites';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: favoritesData } = useFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const favoriteIds = favoritesData?.movieIds || [];

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/signin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleToggleFavorite = (movieId: string) => {
    if (favoriteIds.includes(movieId)) {
      removeFavorite.mutate(movieId);
    } else {
      addFavorite.mutate({ movieId });
    }
  };

  // Organize movies by category
  const moviesByCategory = movies.reduce((acc, movie) => {
    if (!acc[movie.category]) {
      acc[movie.category] = [];
    }
    acc[movie.category].push(movie);
    return acc;
  }, {} as Record<string, typeof movies>);

  // Get top rated movie for hero
  const heroMovie = [...movies].sort((a, b) => b.rating - a.rating)[0];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Nextflix - Watch Movies & TV Shows</title>
        <meta name="description" content="Watch unlimited movies and TV shows" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-black text-white">
          {/* Hero Section */}
          <section className="relative h-[85vh] w-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={heroMovie.image}
                alt={heroMovie.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 lg:px-16 max-w-2xl">
              {/* Movie Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 drop-shadow-lg">
                {heroMovie.title}
              </h1>

              {/* Movie Info */}
              <div className="flex items-center gap-4 text-sm md:text-base mb-6">
                <span className="text-white font-semibold">{heroMovie.year}</span>
                <span className="px-2 py-0.5 border border-gray-400 text-gray-300 text-xs">
                  {heroMovie.rating >= 4.5 ? '16+' : '13+'}
                </span>
                <span className="text-white font-semibold">
                  {Math.floor(heroMovie.rating * 20)}% Match
                </span>
                <span className="text-gray-300">1h 56m</span>
              </div>

              {/* Movie Description */}
              <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-8 line-clamp-3 max-w-xl">
                This is a thrilling {heroMovie.genre.toLowerCase()} movie that keeps you on the edge of your seat. 
                Experience an unforgettable journey filled with suspense, action, and drama.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2.5 md:py-3 rounded font-semibold hover:bg-gray-200 transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Now
                </button>
                <button 
                  onClick={() => handleToggleFavorite(heroMovie.id)}
                  className="flex items-center gap-2 bg-gray-600/80 text-white px-6 md:px-8 py-2.5 md:py-3 rounded font-semibold hover:bg-gray-600 transition-all backdrop-blur-sm"
                >
                  {favoriteIds.includes(heroMovie.id) ? (
                    <>
                      <span className="text-xl">✓</span>
                      Added
                    </>
                  ) : (
                    <>
                      <span className="text-xl">+</span>
                      Add to Wish List
                    </>
                  )}
                </button>
              </div>

              {/* Thumbnail Preview */}
              <div className="flex gap-3 mt-8 overflow-x-auto scrollbar-hide">
                {movies.slice(0, 3).map((movie) => (
                  <div key={movie.id} className="relative w-24 h-36 flex-shrink-0 rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                    <Image
                      src={movie.thumbnail}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <button className="flex items-center justify-center w-24 h-36 bg-gray-800/50 backdrop-blur-sm rounded hover:bg-gray-700/50 transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* Movie Rows by Category */}
          <section className="relative z-20 -mt-32 pb-16">
            {Object.entries(moviesByCategory).map(([category, categoryMovies]) => (
              <div key={category} className="mb-8 px-4 md:px-12 lg:px-16">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-semibold">{category} Movies</h2>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    See All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Horizontal Scrollable Movie List */}
                <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-4">
                  {categoryMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="relative flex-shrink-0 w-32 md:w-40 lg:w-48 group cursor-pointer"
                    >
                      {/* Movie Poster */}
                      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-800 transition-all duration-300 group-hover:scale-110 group-hover:z-10">
                        <Image
                          src={movie.image}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="font-semibold text-sm mb-1 line-clamp-1">{movie.title}</h3>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">{movie.year}</span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {movie.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(movie.id);
                        }}
                        className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90 hover:scale-110"
                      >
                        {favoriteIds.includes(movie.id) ? (
                          <span className="text-red-500 text-lg">❤️</span>
                        ) : (
                          <span className="text-gray-400 text-lg">🤍</span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* My Favorites Section (if any) */}
            {favoriteIds.length > 0 && (
              <div className="mb-8 px-4 md:px-12 lg:px-16">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-semibold">My Favorites</h2>
                  <button 
                    onClick={() => router.push('/favorites')}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-4">
                  {movies
                    .filter(movie => favoriteIds.includes(movie.id))
                    .slice(0, 8)
                    .map((movie) => (
                      <div
                        key={movie.id}
                        className="relative flex-shrink-0 w-32 md:w-40 lg:w-48 group cursor-pointer"
                      >
                        <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-800 transition-all duration-300 group-hover:scale-110 group-hover:z-10">
                          <Image
                            src={movie.image}
                            alt={movie.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="font-semibold text-sm mb-1 line-clamp-1">{movie.title}</h3>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-300">{movie.year}</span>
                                <span className="flex items-center gap-1">
                                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  {movie.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(movie.id);
                          }}
                          className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90 hover:scale-110"
                        >
                          <span className="text-red-500 text-lg">❤️</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </Layout>
    </>
  );
}

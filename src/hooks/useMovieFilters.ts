import { useMemo, useState } from 'react';
import type { Movie } from '@/types';

export interface MovieFilterOptions {
  searchTerm?: string;
  selectedGenre?: string;
  selectedYear?: string;
}

/**
 * Custom hook for filtering movies by search term and genre
 * Provides memoized filtered results and available filter options
 * 
 * @param movies - Array of movies to filter
 * @param initialFilters - Optional initial filter values
 * @returns Filtered movies, filter state, and filter controls
 * 
 * @example
 * ```tsx
 * const {
 *   filteredMovies,
 *   searchTerm,
 *   setSearchTerm,
 *   availableGenres,
 *   resetFilters
 * } = useMovieFilters(allMovies);
 * ```
 */
export function useMovieFilters(
  movies: Movie[],
  initialFilters?: MovieFilterOptions
) {
  const [searchTerm, setSearchTerm] = useState(initialFilters?.searchTerm || '');
  const [selectedGenre, setSelectedGenre] = useState(initialFilters?.selectedGenre || '');

  // Memoize filtered movies
  const filteredMovies = useMemo(() => {
    let filtered = movies;

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
  }, [movies, searchTerm, selectedGenre]);

  // Memoize available genres
  const availableGenres = useMemo(
    () => Array.from(new Set(movies.map((m) => m.genre))).sort(),
    [movies]
  );

  // Memoize available years
  const availableYears = useMemo(
    () => Array.from(new Set(movies.map((m) => m.year))).sort((a, b) => b - a),
    [movies]
  );

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
  };

  return {
    // Filtered results
    filteredMovies,
    
    // Filter state
    searchTerm,
    selectedGenre,
    
    // Available options
    availableGenres,
    availableYears,
    
    // State setters
    setSearchTerm,
    setSelectedGenre,
    
    // Utilities
    resetFilters,
    hasActiveFilters: !!(searchTerm || selectedGenre ),
  };
}

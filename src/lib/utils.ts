import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges and combines Tailwind CSS classes using clsx and tailwind-merge.
 * Handles conditional classes and removes conflicting Tailwind classes.
 *
 * @param inputs - Class values to merge (strings, objects, arrays, etc.)
 * @returns Merged and optimized class string
 *
 * @example
 * ```ts
 * cn('px-4 py-2', { 'bg-blue-500': isActive }, ['text-white', condition && 'font-bold'])
 * // Returns: "px-4 py-2 bg-blue-500 text-white font-bold"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric rating to a string with one decimal place.
 *
 * @param rating - Numeric rating value
 * @returns Formatted rating string (e.g., "8.5")
 *
 * @example
 * ```ts
 * formatRating(8.7) // "8.7"
 * formatRating(7)   // "7.0"
 * ```
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Formats movie duration from minutes to a human-readable string.
 *
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "2h 15m" or "45m")
 *
 * @example
 * ```ts
 * formatDuration(135) // "2h 15m"
 * formatDuration(45)  // "45m"
 * ```
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

/**
 * Extracts initials from a name.
 *
 * @param name - Name string
 * @returns Uppercase initials (max 2 characters)
 *
 * @example
 * ```ts
 * getInitials("John Doe")      // "JD"
 * getInitials("Jane")          // "J"
 * getInitials("Mary Jane Smith") // "MJ"
 * ```
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
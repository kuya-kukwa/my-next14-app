import { z } from 'zod';

/**
 * Validation schemas for API routes
 */

// Movies API validation
export const moviesQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().max(200).optional(),
  delay: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : undefined),
});

export type MoviesQuery = z.infer<typeof moviesQuerySchema>;

// Watchlist API validation
export const watchlistAddSchema = z.object({
  movieId: z.string().min(1, 'Movie ID is required').max(100),
});

export type WatchlistAdd = z.infer<typeof watchlistAddSchema>;

export const watchlistRemoveSchema = z.object({
  movieId: z.string().min(1, 'Movie ID is required').max(100),
});

export type WatchlistRemove = z.infer<typeof watchlistRemoveSchema>;

// Profile API validation
export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional()
    .or(z.literal('').transform(() => null)),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

// Avatar upload validation (in middleware, not schema)
export const avatarUploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

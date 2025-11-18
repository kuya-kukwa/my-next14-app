import { z } from 'zod';

export const profileSchema = z.object({
  displayName: z.string().trim().min(2, 'Display name must be at least 2 characters').max(60, 'Too long').nullable().optional(),
  avatarUrl: z
    .string()
    .trim()
    .url('Enter a valid URL')
    .max(300, 'URL too long')
    .nullable()
    .optional(),
  bio: z.string().trim().max(280, 'Max 280 characters').nullable().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

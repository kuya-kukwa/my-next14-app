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

/**
 * Password validation schema with strict requirements
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

/**
 * Account deletion validation schema
 */
export const accountDeletionSchema = z.object({
  password: z.string().min(1, 'Password is required to delete account'),
});

export type AccountDeletionFormData = z.infer<typeof accountDeletionSchema>;

/**
 * Password strength calculation
 * Returns score from 0-4 and list of met requirements
 */
export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export const calculatePasswordStrength = (
  password: string
): PasswordStrength => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;

  let score: 0 | 1 | 2 | 3 | 4;
  let label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';

  if (metRequirements === 0) {
    score = 0;
    label = 'Very Weak';
  } else if (metRequirements <= 2) {
    score = 1;
    label = 'Weak';
  } else if (metRequirements === 3) {
    score = 2;
    label = 'Fair';
  } else if (metRequirements === 4) {
    score = 3;
    label = 'Good';
  } else {
    score = 4;
    label = 'Strong';
  }

  return { score, label, requirements };
};

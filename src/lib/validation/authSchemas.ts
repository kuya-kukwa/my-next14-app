import { z } from 'zod';

// Common weak passwords to reject
const commonPasswords = [
  'password', 'Password', 'PASSWORD', 'password1', 'Password1', 'PASSWORD1',
  '12345678', '123456789', '1234567890', 'qwerty', 'Qwerty', 'QWERTY',
  'abc123', 'Abc123', 'ABC123', 'password123', 'Password123', 'PASSWORD123',
  'welcome', 'Welcome', 'WELCOME', 'letmein', 'Letmein', 'LETMEIN',
  'admin', 'Admin', 'ADMIN', 'user', 'User', 'USER'
];

// Password validation with Appwrite requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(265, 'Password must not exceed 265 characters')
  .refine(
    (password) => !commonPasswords.includes(password),
    'Password is too common. Please choose a stronger password.'
  )
  .refine(
    (password) => {
      // Check for at least one number or special character for better security
      const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      return hasNumberOrSpecial;
    },
    'Password must contain at least one number or special character'
  );

export const signInSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: passwordSchema,
});

export const signUpFormSchema = signUpSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignUpFormInput = z.infer<typeof signUpFormSchema>;

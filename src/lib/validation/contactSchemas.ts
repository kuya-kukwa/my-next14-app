import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().optional(),
  message: z.string().min(6, 'Message must be at least 6 characters'),
});

export type ContactInput = z.infer<typeof contactSchema>;

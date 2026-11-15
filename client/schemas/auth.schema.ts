import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Username or email is required'),

  password: z.string().trim().min(6, 'Password is required'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().trim().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().trim().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

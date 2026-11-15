import { z } from 'zod';
import { ASSIGNABLE_ROLES } from '@/constants/roles';

export const createUserSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.email('Invalid email'),
  username: z.string().trim().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(ASSIGNABLE_ROLES),
});

export const updateUserSchema = createUserSchema.omit({
  password: true,
  email: true,
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const updateMeSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  username: z.string().trim().min(3, 'Username must be at least 3 characters'),
});

export type UpdateMeSchema = z.infer<typeof updateMeSchema>;

export const changeMyPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangeMyPasswordSchema = z.infer<typeof changeMyPasswordSchema>;

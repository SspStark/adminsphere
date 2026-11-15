import { z } from 'zod';

export const createCommentSchema = z.object({
  message: z.string().trim().min(1, 'Comment is required'),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;

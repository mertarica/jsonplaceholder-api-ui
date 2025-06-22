import { z } from 'zod';

export const PostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
});

export const CreatePostRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  userId: z.number().min(1, 'User ID is required'),
});

export type Post = z.infer<typeof PostSchema>;
export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;

import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { postApi } from '@/services/apiService';
import { CreatePostRequestSchema } from '@/schemas/post';
import { z } from 'zod';

export const usePosts = (userId: number) => {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => postApi.getPostsByUserId(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: unknown) => {
      // Validate before API call
      const validatedPost = CreatePostRequestSchema.parse(post);
      return postApi.createPost(validatedPost);
    },
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ['posts', newPost.userId] });
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        console.error('Failed to create post:', error.message);
      }
    },
    throwOnError: false,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: unknown) => {
      // Validate post ID
      const validatedId = z.number().min(1, 'Invalid post ID').parse(postId);
      return postApi.deletePost(validatedId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        console.error('Failed to delete post:', error.message);
      }
    },
    throwOnError: false,
  });
};

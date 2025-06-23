import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { postApi } from '@/services/apiService';
import { CreatePostRequestSchema } from '@/schemas/post';
import { z } from 'zod';
import type { PaginationParams } from '@/types/api';
import { computed, type Ref } from 'vue';

// 3 posts per page, 4 pages total (10 posts max)
const POSTS_PER_PAGE = 3;
const MAX_POSTS_PER_USER = 10;
const TOTAL_PAGES = Math.ceil(MAX_POSTS_PER_USER / POSTS_PER_PAGE);

export const usePosts = (userId: Ref<number>, page: Ref<number>) => {
  return useQuery({
    queryKey: computed(() => ['posts', userId.value, page.value]),
    queryFn: () => {
      const pagination: PaginationParams = {
        _start: page.value * POSTS_PER_PAGE,
        _limit: POSTS_PER_PAGE,
      };
      return postApi.getPostsByUserId(userId.value, pagination);
    },
    enabled: computed(() => !!userId.value),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: unknown) => {
      const validatedPost = CreatePostRequestSchema.parse(post);
      return postApi.createPost(validatedPost);
    },
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({
        queryKey: ['posts', newPost.userId],
        exact: false,
      });
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        console.error('Network error:', error);
      }
    },
    throwOnError: false,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: unknown) => {
      const validatedId = z.number().min(1, 'Invalid post ID').parse(postId);
      return postApi.deletePost(validatedId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
        exact: false,
      });
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        // Validation error
      } else {
        // Network error
      }
    },
    throwOnError: false,
  });
};

export const PAGINATION_CONFIG = {
  POSTS_PER_PAGE,
  TOTAL_PAGES,
  MAX_POSTS_PER_USER,
} as const;

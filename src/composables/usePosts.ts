import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { postApi } from '@/services/apiService';
import {
  CreatePostRequestSchema,
  type CreatePostRequest,
} from '@/schemas/post';
import { z } from 'zod';
import type { PaginationParams } from '@/types/api';
import { computed, type Ref } from 'vue';
import { errorService } from '@/services/errorService';

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
    mutationFn: async (post: CreatePostRequest) => {
      const validatedPost = CreatePostRequestSchema.parse(post);
      return postApi.createPost(validatedPost);
    },
    onSuccess: (newPost) => {
      // Note: JSONPlaceholder is a mockup API - posts aren't actually created in the server
      // when the API returns 200 the data still static, so invalidating queries will not show the new created post
      // I could use optimistic updates to show the post from the cache, but for real the product, I would just invalidate the query
      queryClient.invalidateQueries({
        queryKey: ['posts', newPost.userId],
        exact: false,
      });
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        errorService.logError(error, { context: 'post-creation-validation' });
      } else {
        errorService.logError(error, { context: 'post-creation-network' });
      }
    },
    throwOnError: false,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const validatedId = z.number().min(1, 'Invalid post ID').parse(postId);
      return postApi.deletePost(validatedId);
    },
    onSuccess: () => {
      // Note: JSONPlaceholder is a mockup API - posts aren't actually deleted from the server
      // when the API returns 200 the data stilll persists, so invalidating queries will still show the "deleted" post
      // I could use optimistic updates to remove the post from the cache, but for real the product, I would just invalidate the query
      queryClient.invalidateQueries({
        queryKey: ['posts'],
        exact: false,
      });
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        errorService.logError(error, { context: 'post-deletion-validation' });
      } else {
        errorService.logError(error, { context: 'post-deletion-network' });
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

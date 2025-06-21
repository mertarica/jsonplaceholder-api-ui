import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { postApi } from '@/services/apiService';
import type { CreatePostRequest } from '@/types/post';

export const usePosts = (userId: number) => {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => postApi.getPostsByUserId(userId, { _start: 0, _limit: 100 }),
    enabled: !!userId && userId > 0,
    staleTime: 2 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    select: (data) => data?.sort((a, b) => b.id - a.id),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: CreatePostRequest) => postApi.createPost(post),
    onSuccess: (_data, newPost) => {
      queryClient.invalidateQueries({ queryKey: ['posts', newPost.userId] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

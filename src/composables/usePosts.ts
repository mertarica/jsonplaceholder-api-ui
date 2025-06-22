import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { postApi } from '@/services/apiService';

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
    mutationFn: postApi.createPost,
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ['posts', newPost.userId] });
    },
    onError: (error) => {
      console.error('Failed to create post:', error.message);
    },
    throwOnError: false,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Failed to delete post:', error.message);
    },
    throwOnError: false,
  });
};

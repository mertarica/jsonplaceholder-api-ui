import { useQuery } from '@tanstack/vue-query';
import { userApi } from '@/services/apiService';

const QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  throwOnError: true,
};

export const useUsers = () => {
  return useQuery({
    ...QUERY_OPTIONS,
    queryKey: ['users'],
    queryFn: userApi.getUsers,
    retry: 2,
  });
};

export const useUser = (id: number) => {
  return useQuery({
    ...QUERY_OPTIONS,
    queryKey: ['user', id],
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  });
};

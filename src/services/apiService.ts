import type { User } from '@/types/user';
import type { Post, CreatePostRequest } from '@/types/post';
import type { PaginationParams } from '@/types/api';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const api = {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch data`, response.status);
      }
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error', 0);
    }
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new ApiError(`Failed to create item`, response.status);
      }
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error', 0);
    }
  },

  async delete(endpoint: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new ApiError(`Failed to delete item`, response.status);
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error', 0);
    }
  },
};

export const userApi = {
  getUsers: (): Promise<User[]> => api.get('/users'),
  getUserById: (id: number): Promise<User> => api.get(`/users/${id}`),
};

export const postApi = {
  getPostsByUserId: (
    userId: number,
    pagination?: PaginationParams
  ): Promise<Post[]> => {
    if (pagination) {
      const params = new URLSearchParams({
        userId: userId.toString(),
        _start: pagination._start.toString(),
        _limit: pagination._limit.toString(),
      });
      return api.get(`/posts?${params}`);
    }
    return api.get(`/posts?userId=${userId}`);
  },

  createPost: (post: CreatePostRequest): Promise<Post> =>
    api.post('/posts', post),

  deletePost: (postId: number): Promise<void> => api.delete(`/posts/${postId}`),
};
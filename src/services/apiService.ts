import type { User } from '@/types/user';
import type { Post, CreatePostRequest } from '@/types/post';
import type { PaginationParams } from '@/types/api';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
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
    pagination: PaginationParams
  ): Promise<Post[]> => {
    const params = new URLSearchParams({
      userId: userId.toString(),
      _start: pagination._start.toString(),
      _limit: pagination._limit.toString(),
    });
    return api.get(`/posts?${params}`);
  },

  createPost: (post: CreatePostRequest): Promise<Post> =>
    api.post('/posts', post),

  deletePost: (postId: number): Promise<void> => api.delete(`/posts/${postId}`),
};

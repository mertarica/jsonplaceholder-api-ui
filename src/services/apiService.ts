import type { PaginationParams } from '@/types/api';
import { UserSchema, type User } from '@/schemas/user';
import {
  PostSchema,
  CreatePostRequestSchema,
  type CreatePostRequest,
  type Post,
} from '@/schemas/post';
import { z } from 'zod';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
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
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return z.array(UserSchema).parse(response);
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return UserSchema.parse(response);
  },
};

export const postApi = {
  getPostsByUserId: async (
    userId: number,
    pagination?: PaginationParams
  ): Promise<Post[]> => {
    let endpoint = `/posts?userId=${userId}`;

    if (pagination) {
      const params = new URLSearchParams({
        userId: userId.toString(),
        _start: pagination._start.toString(),
        _limit: pagination._limit.toString(),
      });
      endpoint = `/posts?${params}`;
    }

    const response = await api.get(endpoint);
    return z.array(PostSchema).parse(response);
  },

  createPost: async (post: CreatePostRequest): Promise<Post> => {
    // Validate input before sending
    const validatedPost = CreatePostRequestSchema.parse(post);
    const response = await api.post('/posts', validatedPost);
    return PostSchema.parse(response);
  },

  deletePost: async (postId: number): Promise<void> => {
    const validatedId = z.number().min(1).parse(postId);
    return api.delete(`/posts/${validatedId}`);
  },
};

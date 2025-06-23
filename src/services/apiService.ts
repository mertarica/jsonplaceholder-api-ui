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

const request = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new ApiError(`Request failed`, response.status);
    }
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error', 0);
  }
};

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await request('/users');
    return z.array(UserSchema).parse(response);
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await request(`/users/${id}`);
    return UserSchema.parse(response);
  },
};

export const postApi = {
  getPostsByUserId: async (
    userId: number,
    pagination?: PaginationParams
  ): Promise<Post[]> => {
    const params = new URLSearchParams({ userId: userId.toString() });
    if (pagination) {
      params.append('_start', pagination._start.toString());
      params.append('_limit', pagination._limit.toString());
    }

    const response = await request(`/posts?${params}`);
    return z.array(PostSchema).parse(response);
  },

  createPost: async (post: CreatePostRequest): Promise<Post> => {
    const validatedPost = CreatePostRequestSchema.parse(post);
    const response = await request('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedPost),
    });
    return PostSchema.parse(response);
  },

  deletePost: async (postId: number): Promise<void> => {
    await request(`/posts/${postId}`, { method: 'DELETE' });
  },
};

<template>
  <div class="posts-container">
    <!-- Delete Error -->
    <Message
      v-if="deleteError"
      severity="error"
      :closable="false"
      class="delete-error"
    >
      Failed to delete post. Please try again.
    </Message>

    <!-- Loading State -->
    <div v-if="isLoading" class="posts-loading">
      <ProgressSpinner size="small" />
      <p>Loading posts...</p>
    </div>

    <!-- Posts List -->
    <div v-else-if="posts?.length" class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post">
        <div class="post-content">
          <h5>{{ post.title }}</h5>
          <p>{{ post.body }}</p>
        </div>
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          @click="$emit('delete', post.id)"
          :loading="isDeleting"
        />
      </div>
    </div>

    <!-- No Posts -->
    <div v-else class="no-posts">
      <i class="pi pi-inbox"></i>
      <p>No posts yet</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/schemas/post';

interface Props {
  posts?: Post[];
  isLoading: boolean;
  isDeleting: boolean;
  deleteError: boolean;
}

interface Emits {
  (e: 'delete', postId: number): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.posts-container {
  margin-bottom: 2rem;
}

.delete-error {
  margin-bottom: 1rem;
}

.posts-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  gap: 1rem;
  color: var(--text-muted);
}

.posts-loading p {
  margin: 0;
  font-size: 0.9rem;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.post:hover {
  background: var(--surface-hover);
  border-color: var(--border-medium);
}

.post-content {
  flex: 1;
  margin-right: 1rem;
}

.post h5 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.post p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.no-posts {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

.no-posts i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

@media (max-width: 480px) {
  .post {
    flex-direction: column;
    gap: 1rem;
  }

  .post-content {
    margin-right: 0;
  }
}
</style>

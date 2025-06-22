<template>
  <ErrorBoundary
    fallback-title="User Detail Error"
    fallback-message="Failed to load user details."
    @error="handleUserError"
  >
    <div class="user-detail">
      <div v-if="userLoading" class="loading">
        <ProgressSpinner />
        <p>Loading...</p>
      </div>

      <Message
        v-if="userError || postsError"
        severity="error"
        :closable="false"
      >
        {{ userError?.message || postsError?.message }}
      </Message>

      <div v-if="userData" class="content-grid">
        <!-- User Profile -->
        <div class="profile-column">
          <UserProfile :user="userData" />
        </div>

        <!-- Posts -->
        <div class="posts-column">
          <Card>
            <template #title>
              <div class="posts-header">
                <h3>Posts</h3>
                <small
                  >Page {{ currentPage + 1 }} of
                  {{ PAGINATION_CONFIG.TOTAL_PAGES }}</small
                >
              </div>
            </template>

            <template #content>
              <!-- Create Post Form -->
              <CreatePostForm
                :is-pending="createPostMutation.isPending.value"
                :is-error="createPostMutation.isError.value"
                @submit="handleCreatePost"
              />

              <!-- Posts List -->
              <PostsList
                :posts="postsData"
                :is-loading="postsLoading"
                :is-deleting="deletePostMutation.isPending.value"
                :delete-error="deletePostMutation.isError.value"
                @delete="handleDeletePost"
              />

              <!-- Pagination -->
              <Pagination
                :current-page="currentPage"
                :total-pages="PAGINATION_CONFIG.TOTAL_PAGES"
                :disabled="postsLoading"
                @next="goToNextPage"
                @previous="goToPreviousPage"
              />
            </template>
          </Card>
        </div>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useUser } from '@/composables/useUsers';
import {
  usePosts,
  useCreatePost,
  useDeletePost,
  PAGINATION_CONFIG,
} from '@/composables/usePosts';
import { CreatePostRequestSchema } from '@/schemas/post';
import { z } from 'zod';

// Components
import UserProfile from '@/components/UserProfile.vue';
import CreatePostForm from '@/components/post/CreatePostForm.vue';
import PostsList from '@/components/post/PostsList.vue';
import Pagination from '@/components/Pagination.vue';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const userId = computed(() => parseInt(props.id));
const currentPage = ref(0);

// Queries & Mutations
const {
  data: userData,
  isLoading: userLoading,
  error: userError,
} = useUser(userId.value);

const {
  data: postsData,
  isLoading: postsLoading,
  error: postsError,
} = usePosts(userId, currentPage);

const createPostMutation = useCreatePost();
const deletePostMutation = useDeletePost();

// Pagination
const goToNextPage = () => {
  if (currentPage.value < PAGINATION_CONFIG.TOTAL_PAGES - 1) {
    currentPage.value++;
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

watch(userId, () => {
  currentPage.value = 0;
});

const handleUserError = (error: Error, info: string) => {
  console.error('User Detail Error:', error);
  console.error('Error Info:', info);
};

const handleCreatePost = async (formData: { title: string; body: string }) => {
  if (!userData.value) return;

  try {
    const validatedPost = CreatePostRequestSchema.parse({
      title: formData.title,
      body: formData.body,
      userId: userData.value.id,
    });

    const result = await createPostMutation.mutateAsync(validatedPost);

    if (result) {
      currentPage.value = 0; // Reset to first page
    }
  } catch (error) {
    // Error handled by mutation
  }
};

const handleDeletePost = async (postId: number) => {
  try {
    const validatedId = z.number().min(1).parse(postId);
    await deletePostMutation.mutateAsync(validatedId);
  } catch (error) {
    // Error handled by mutation
  }
};
</script>

<style scoped>
.user-detail {
  max-width: 1200px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  gap: 1rem;
  color: var(--text-muted);
}

.content-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  align-items: start;
}

.profile-column {
  position: sticky;
  top: 2rem;
}

.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.posts-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.posts-header small {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .profile-column {
    position: static;
  }
}
</style>

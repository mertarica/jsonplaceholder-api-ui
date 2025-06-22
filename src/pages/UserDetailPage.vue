<template>
  <ErrorBoundary
    fallback-title="User Detail Error"
    fallback-message="Failed to load user details."
    @error="handleUserError"
  >
    <div class="user-detail">
      <div v-if="userLoading || postsLoading" class="loading">
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
          <Card class="profile-card">
            <template #header>
              <div class="profile-header">
                <Avatar
                  :label="userData.name.charAt(0)"
                  size="xlarge"
                  class="profile-avatar"
                />
                <h2>{{ userData.name }}</h2>
                <p>@{{ userData.username }}</p>
              </div>
            </template>

            <template #content>
              <div class="profile-details">
                <div class="detail">
                  <i class="pi pi-envelope"></i>
                  <div>
                    <label>Email</label>
                    <span>{{ userData.email }}</span>
                  </div>
                </div>

                <div class="detail">
                  <i class="pi pi-phone"></i>
                  <div>
                    <label>Phone</label>
                    <span>{{ userData.phone }}</span>
                  </div>
                </div>

                <div class="detail">
                  <i class="pi pi-globe"></i>
                  <div>
                    <label>Website</label>
                    <span>{{ userData.website }}</span>
                  </div>
                </div>

                <div class="detail">
                  <i class="pi pi-map-marker"></i>
                  <div>
                    <label>Address</label>
                    <span
                      >{{ userData.address.street }},
                      {{ userData.address.city }}</span
                    >
                  </div>
                </div>

                <div class="detail">
                  <i class="pi pi-building"></i>
                  <div>
                    <label>Company</label>
                    <span>{{ userData.company.name }}</span>
                  </div>
                </div>
              </div>
            </template>
          </Card>
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
              <!-- Add Post -->
              <div class="add-post">
                <h4>Create Post</h4>

                <!-- Validation Errors -->
                <div v-if="validationErrors.length" class="validation-errors">
                  <Message
                    v-for="error in validationErrors"
                    :key="error"
                    severity="warn"
                    :closable="false"
                    class="validation-error"
                  >
                    {{ error }}
                  </Message>
                </div>

                <!-- Create Post Error -->
                <Message
                  v-if="createPostMutation.isError.value"
                  severity="error"
                  :closable="false"
                  class="form-error"
                >
                  Failed to create post. Please try again.
                </Message>

                <form @submit.prevent="handleAddPost" class="post-form">
                  <InputText
                    v-model="newPost.title"
                    placeholder="Post title..."
                    :disabled="createPostMutation.isPending.value"
                    :class="{ 'p-invalid': titleError }"
                  />
                  <small v-if="titleError" class="p-error">{{
                    titleError
                  }}</small>

                  <Textarea
                    v-model="newPost.body"
                    placeholder="Write something..."
                    :disabled="createPostMutation.isPending.value"
                    rows="3"
                    :class="{ 'p-invalid': bodyError }"
                  />
                  <small v-if="bodyError" class="p-error">{{
                    bodyError
                  }}</small>

                  <Button
                    type="submit"
                    label="Publish"
                    icon="pi pi-send"
                    :loading="createPostMutation.isPending.value"
                    :disabled="!isFormValid"
                  />
                </form>
              </div>

              <!-- Delete Error -->
              <Message
                v-if="deletePostMutation.isError.value"
                severity="error"
                :closable="false"
                class="delete-error"
              >
                Failed to delete post. Please try again.
              </Message>

              <div v-if="postsLoading" class="posts-loading">
                <ProgressSpinner size="small" />
                <p>Loading posts...</p>
              </div>

              <div v-else-if="postsData?.length" class="posts-list">
                <div v-for="post in postsData" :key="post.id" class="post">
                  <div class="post-content">
                    <h5>{{ post.title }}</h5>
                    <p>{{ post.body }}</p>
                  </div>
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    @click="handleDeletePost(post.id)"
                    :loading="deletePostMutation.isPending.value"
                  />
                </div>
              </div>

              <div v-else class="no-posts">
                <i class="pi pi-inbox"></i>
                <p>No posts yet</p>
              </div>

              <!-- Server-side Pagination -->
              <div class="pagination">
                <Button
                  icon="pi pi-angle-left"
                  text
                  @click="goToPreviousPage()"
                  :disabled="currentPage === 0 || postsLoading"
                />
                <span
                  >Page {{ currentPage + 1 }} of
                  {{ PAGINATION_CONFIG.TOTAL_PAGES }}</span
                >
                <Button
                  icon="pi pi-angle-right"
                  text
                  @click="goToNextPage()"
                  :disabled="
                    currentPage >= PAGINATION_CONFIG.TOTAL_PAGES - 1 ||
                    postsLoading
                  "
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue';
import { useUser } from '@/composables/useUsers';
import {
  usePosts,
  useCreatePost,
  useDeletePost,
  PAGINATION_CONFIG,
} from '@/composables/usePosts';
import { CreatePostRequestSchema } from '@/schemas/post';
import { z } from 'zod';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const userId = computed(() => parseInt(props.id));

// Server-side pagination state
const currentPage = ref(0);

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

const newPost = reactive({
  title: '',
  body: '',
});

const validationErrors = ref<string[]>([]);
const titleError = ref('');
const bodyError = ref('');

const isFormValid = computed(() => {
  return (
    newPost.title.trim() &&
    newPost.body.trim() &&
    !titleError.value &&
    !bodyError.value
  );
});

watch(
  () => newPost.title,
  (newTitle) => {
    try {
      z.string().min(1, 'Title is required').parse(newTitle.trim());
      titleError.value = '';
    } catch (error) {
      if (error instanceof z.ZodError) {
        titleError.value = error.errors[0]?.message || 'Invalid title';
      }
    }
  }
);

watch(
  () => newPost.body,
  (newBody) => {
    try {
      z.string().min(1, 'Body is required').parse(newBody.trim());
      bodyError.value = '';
    } catch (error) {
      if (error instanceof z.ZodError) {
        bodyError.value = error.errors[0]?.message || 'Invalid body';
      }
    }
  }
);

const handleUserError = (error: Error, info: string) => {
  console.error('User detail error:', error, info);
  userError.value = error;
};

const handleAddPost = async () => {
  if (!userData.value) return;

  validationErrors.value = [];

  try {
    const validatedPost = CreatePostRequestSchema.parse({
      title: newPost.title.trim(),
      body: newPost.body.trim(),
      userId: userData.value.id,
    });

    const result = await createPostMutation.mutateAsync(validatedPost);

    if (result) {
      newPost.title = '';
      newPost.body = '';
      titleError.value = '';
      bodyError.value = '';
      currentPage.value = 0;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      validationErrors.value = error.errors.map((err) => err.message);
    }
  }
};

const handleDeletePost = async (postId: number) => {
  try {
    const validatedId = z.number().min(1).parse(postId);
    await deletePostMutation.mutateAsync(validatedId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
    } else {
      console.error('Delete post error:', error);
    }
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

.profile-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  gap: 1rem;
}

.profile-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.profile-header p {
  margin: 0;
  opacity: 0.8;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 2rem 2rem;
}

.detail {
  display: flex;
  gap: 1rem;
}

.detail i {
  margin-top: 2px;
  opacity: 0.8;
}

.detail label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.detail span {
  font-size: 0.95rem;
}

.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.posts-header h3 {
  margin: 0;
}

.add-post {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.add-post h4 {
  margin-bottom: 1rem;
  font-weight: 600;
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.post {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: background 0.2s;
}

.post:hover {
  background: #f3f4f6;
}

.post-content {
  flex: 1;
  margin-right: 1rem;
}

.post h5 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.post p {
  color: #4b5563;
  margin: 0;
  font-size: 0.9rem;
}

.no-posts {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.no-posts i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.form-error,
.delete-error {
  margin-bottom: 1rem;
}

.form-error {
  margin-top: 0;
}

.validation-errors {
  margin-bottom: 1rem;
}

.validation-error {
  margin-bottom: 0.5rem;
}

.p-invalid {
  border-color: #ef4444 !important;
}

.p-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.posts-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  gap: 1rem;
  color: #6b7280;
}

.posts-loading p {
  margin: 0;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .profile-column {
    position: static;
  }

  .profile-header {
    flex-direction: row;
    text-align: left;
  }

  .profile-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-details {
    grid-template-columns: 1fr;
  }

  .post {
    flex-direction: column;
    gap: 1rem;
  }

  .post-content {
    margin-right: 0;
  }
}
</style>

<template>
  <div class="user-detail">
    <div v-if="userLoading || postsLoading" class="loading">
      <ProgressSpinner />
      <p>Loading...</p>
    </div>

    <Message v-if="userError || postsError" severity="error" :closable="false">
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
              <small>{{ postsData?.length || 0 }} total</small>
            </div>
          </template>

          <template #content>
            <!-- Add Post -->
            <div class="add-post">
              <h4>Create Post</h4>
              <form @submit.prevent="handleAddPost" class="post-form">
                <InputText
                  v-model="newPost.title"
                  placeholder="Post title..."
                  :disabled="createPostMutation.isPending.value"
                />
                <Textarea
                  v-model="newPost.body"
                  placeholder="Write something..."
                  :disabled="createPostMutation.isPending.value"
                  rows="3"
                />
                <Button
                  type="submit"
                  label="Publish"
                  icon="pi pi-send"
                  :loading="createPostMutation.isPending.value"
                  :disabled="!newPost.title || !newPost.body"
                />
              </form>
            </div>

            <!-- Posts List -->
            <div v-if="postsData?.length" class="posts-list">
              <div v-for="post in paginatedPosts" :key="post.id" class="post">
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

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="pagination">
              <Button
                icon="pi pi-angle-left"
                text
                @click="postStore.goToPreviousPage()"
                :disabled="postStore.currentPage === 0"
              />
              <span
                >Page {{ postStore.currentPage + 1 }} of {{ totalPages }}</span
              >
              <Button
                icon="pi pi-angle-right"
                text
                @click="postStore.goToNextPage(totalPages)"
                :disabled="postStore.currentPage >= totalPages - 1"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUser } from '@/composables/useUsers';
import { usePosts, useCreatePost, useDeletePost } from '@/composables/usePosts';
import { usePostStore } from '@/stores/postStore';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const userId = computed(() => parseInt(props.id));

const postStore = usePostStore();
const { currentPage, postsPerPage } = storeToRefs(postStore);

const {
  data: userData,
  isLoading: userLoading,
  error: userError,
} = useUser(userId.value);
const {
  data: postsData,
  isLoading: postsLoading,
  error: postsError,
} = usePosts(userId.value);

const createPostMutation = useCreatePost();
const deletePostMutation = useDeletePost();

const totalPages = computed(() =>
  postsData.value ? Math.ceil(postsData.value.length / postsPerPage.value) : 0
);

const paginatedPosts = computed(() => {
  if (!postsData.value) return [];
  const start = currentPage.value * postsPerPage.value;
  const end = start + postsPerPage.value;
  return postsData.value.slice(start, end);
});

watch(postsData, () => {
  postStore.resetPagination();
});

const newPost = reactive({
  title: '',
  body: '',
});

const handleAddPost = async () => {
  if (newPost.title && newPost.body && userData.value) {
    await createPostMutation.mutateAsync({
      title: newPost.title,
      body: newPost.body,
      userId: userData.value.id,
    });
    newPost.title = '';
    newPost.body = '';
  }
};

const handleDeletePost = async (postId: number) => {
  await deletePostMutation.mutateAsync(postId);
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

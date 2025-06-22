<template>
  <ErrorBoundary
    fallback-title="Users List Error"
    fallback-message="Failed to load users."
    @error="handleUserError"
  >
    <div class="users-page">
      <div class="page-header">
        <h2>Users</h2>
        <p>Browse user profiles</p>
      </div>

      <Message v-if="error" severity="error" :closable="false">
        {{ error.message }}
      </Message>

      <div v-if="isLoading" class="loading">
        <ProgressSpinner />
        <p>Loading users...</p>
      </div>

      <div v-else-if="data" class="users-content">
        <!-- Search Filter -->
        <InputText
          v-model="searchQuery"
          placeholder="Search users..."
          class="search-input"
        />

        <!-- Users Grid -->
        <div class="users-grid">
          <Card v-for="user in filteredUsers" :key="user.id" class="user-card">
            <template #content>
              <router-link :to="`/users/${user.id}`" class="user-link">
                <Avatar :label="user.name.charAt(0)" class="user-avatar" />
                <div>
                  <div class="user-name">{{ user.name }}</div>
                  <small>@{{ user.username }}</small>
                </div>
              </router-link>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { useUsers } from '@/composables/useUsers';
import { computed, ref } from 'vue';

const { data, isLoading, error } = useUsers();
const searchQuery = ref('');

const filteredUsers = computed(() => {
  if (!data.value || !searchQuery.value.trim()) {
    return data.value || [];
  }
  const query = searchQuery.value.toLowerCase();
  return data.value.filter((user) => user.name.toLowerCase().includes(query));
});

const handleUserError = (error: Error, info: string) => {
  console.error('User Detail Error:', error);
  console.error('Error Info:', info);
};
</script>

<style scoped>
.users-page {
  max-width: 1200px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #6b7280;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  gap: 1rem;
}

.users-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-input {
  max-width: 300px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.user-card:hover {
  transform: translateY(-2px);
}

.user-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.user-link:hover {
  color: #3b82f6;
}

.user-avatar {
  background: #3b82f6;
}

.user-name {
  font-weight: 500;
}
</style>

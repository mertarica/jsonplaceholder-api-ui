<template>
  <div class="users-page">
    <div class="page-header">
      <h2>Users</h2>
      <p>Manage and view user information</p>
    </div>

    <Message v-if="error" severity="error" :closable="false">
      {{ error.message }}
    </Message>

    <div v-if="isLoading" class="loading">
      <ProgressSpinner />
      <p>Loading users...</p>
    </div>

    <div v-else-if="data" class="table-wrapper">
      <DataTable
        :value="data"
        stripedRows
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 25]"
      >
        <Column field="name" header="Name" sortable>
          <template #body="{ data }">
            <router-link :to="`/users/${data.id}`" class="user-link">
              <Avatar :label="data.name.charAt(0)" class="user-avatar" />
              <div>
                <div class="user-name">{{ data.name }}</div>
                <small>@{{ data.username }}</small>
              </div>
            </router-link>
          </template>
        </Column>

        <Column field="email" header="Email" sortable>
          <template #body="{ data }">
            <span>{{ data.email }}</span>
          </template>
        </Column>

        <Column field="phone" header="Phone">
          <template #body="{ data }">
            <span>{{ data.phone }}</span>
          </template>
        </Column>

        <Column field="company.name" header="Company" sortable>
          <template #body="{ data }">
            <span>{{ data.company.name }}</span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsers } from '@/composables/useUsers';

const { data, isLoading, error } = useUsers();
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

.table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.user-link:hover {
  transform: translateX(2px);
  color: #3b82f6;
}

.user-avatar {
  background: #3b82f6;
}

.user-name {
  font-weight: 500;
}
</style>

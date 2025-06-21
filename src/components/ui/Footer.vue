<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-info">
        <p>&copy; {{ currentYear }} UserHub. Built with Vue 3 & TypeScript.</p>
      </div>

      <div class="footer-stats">
        <span class="stat">
          <i class="pi pi-users"></i>
          {{ totalUsers }} Users
        </span>
        <span class="stat">
          <i class="pi pi-file"></i>
          {{ totalPosts }} Posts
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUsers } from '@/composables/useUsers';

const currentYear = new Date().getFullYear();
const { data: users } = useUsers();

const totalUsers = computed(() => users.value?.length || 0);
const totalPosts = computed(() => {
  return totalUsers.value * 10;
});
</script>

<style scoped>
.footer {
  background: #f8fafc;
  border-top: 1px solid #e1e5e9;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.footer-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.stat i {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer-stats {
    gap: 1rem;
  }
}
</style>

<template>
  <div class="pagination">
    <Button
      icon="pi pi-angle-left"
      text
      @click="$emit('previous')"
      :disabled="currentPage === 0 || disabled"
    />
    <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
    <Button
      icon="pi pi-angle-right"
      text
      @click="$emit('next')"
      :disabled="currentPage >= totalPages - 1 || disabled"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number;
  totalPages: number;
  disabled?: boolean;
}

interface Emits {
  (e: 'next'): void;
  (e: 'previous'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.pagination span {
  color: var(--text-secondary);
}
</style>

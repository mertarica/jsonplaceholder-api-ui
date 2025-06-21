import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePostStore = defineStore('post', () => {
  const currentPage = ref(0);
  const postsPerPage = ref(3);

  const goToNextPage = (totalPages: number) => {
    if (currentPage.value < totalPages - 1) {
      currentPage.value++;
    }
  };

  const goToPreviousPage = () => {
    if (currentPage.value > 0) {
      currentPage.value--;
    }
  };

  const goToPage = (page: number, totalPages: number) => {
    if (page >= 0 && page < totalPages) {
      currentPage.value = page;
    }
  };

  const resetPagination = () => {
    currentPage.value = 0;
  };

  return {
    // State
    currentPage,
    postsPerPage,
    // Actions
    goToNextPage,
    goToPreviousPage,
    goToPage,
    resetPagination,
  };
});
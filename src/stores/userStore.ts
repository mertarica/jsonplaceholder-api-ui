import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types/user';

export const useUserStore = defineStore('user', () => {
  const selectedUser = ref<User | null>(null);

  const setSelectedUser = (user: User | null) => {
    selectedUser.value = user;
  };

  const clearSelectedUser = () => {
    selectedUser.value = null;
  };

  return {
    selectedUser,
    setSelectedUser,
    clearSelectedUser,
  };
});

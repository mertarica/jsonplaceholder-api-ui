import type { User } from '@/schemas/user';
import { defineStore } from 'pinia';
import { ref } from 'vue';

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

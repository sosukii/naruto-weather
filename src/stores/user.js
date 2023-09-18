import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    setIsAuthenticated(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    },
  },
});
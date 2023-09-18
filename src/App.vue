<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink v-if="!isUserAuthenticated" to="/register">Register</RouterLink>
      <RouterLink v-if="!isUserAuthenticated" to="/login">Login</RouterLink>
      <button v-if="isUserAuthenticated" @click="logout">Logout</button>
    </nav>
  </header>

  <RouterView />
</template>

<script setup>
  import { RouterLink, RouterView, useRouter } from 'vue-router'
  import { computed, onMounted } from 'vue'
  import { useUserStore } from './stores/user'
  import { removeAuthTokenFromCookies, isAuthenticated } from './api/login'

  const userStore = useUserStore();
  const router = useRouter();

  const isUserAuthenticated = computed(() => userStore.isAuthenticated);

  onMounted(() => {
    userStore.setIsAuthenticated(isAuthenticated());
  });

  const logout = () => {
    removeAuthTokenFromCookies();
    userStore.setIsAuthenticated(false);
    router.push('/login');
  };
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>

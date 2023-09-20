<template>
  <div>
    <h1>Register page</h1>
    <form @submit.prevent="registerHandler">
      <label for="name">Name:</label>
      <input class="input" v-model="userData.name">

      <label for="email">Email:</label>
      <input class="input" type="email" v-model="userData.email" required>

      <label for="password">Password:</label>
      <input class="input" type="password" v-model="userData.password" required>

      <button class="btn" type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
  import { ref} from 'vue'
  import { useRouter } from 'vue-router';
  import { notify } from "@kyvg/vue3-notification";
  import { register } from '../api/register'
  import { login } from '../api/login'
  import { setAuthTokenToCookies } from '../api/login'
  import { redirectTo } from '../api/redirect'
  import { useUserStore } from '../stores/user'

  const router = useRouter();
  const userData = ref({
    name: '',
    email: '',
    password: ''
  })

  async function registerHandler() {
    const result = await register({...userData.value})
    const data = await result.json()

    notify({
      title: "Registration",
      text: data.message,
    });

    if(result.status === 200) {
      const result = await login({...userData.value})
      const data = await result.json()

      if(result.status === 200) {
        setAuthTokenToCookies(data.token)
        const userStore = useUserStore();
        userStore.setIsAuthenticated(true);
        await redirectTo('/', router);
      }

      notify({
        title: "Login",
        text: data.message,
      });
    }
  }

</script>

<style scoped>

</style>
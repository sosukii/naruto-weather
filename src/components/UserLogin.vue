<template>
  <div>
    <h1>Login page</h1>
    <form class="form" @submit.prevent="loginHandler">
      <div class="form__block">
        <label for="username">Email:</label>
        <input class="input" type="text" v-model="userData.email">
      </div>
      <div class="form__block">
        <label for="password">Password:</label>
        <input class="input" type="password" v-model="userData.password">
      </div>
      <button class="btn" type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
  import { ref} from 'vue'
  import { useRouter } from 'vue-router';
  import { login } from '../api/login'
  import { notify } from "@kyvg/vue3-notification";
  import { setAuthTokenToCookies } from '../api/login'
  import { redirectTo } from '../api/redirect'
  import { useUserStore } from '../stores/user'

  const router = useRouter();
  const userData = ref({
    email: '',
    password: ''
  })

  async function loginHandler() {
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

</script>

<style scoped lang="sass">
.form
  padding-top: 25px
  display: flex
  flex-direction: column
  gap: 14px
  align-items: center
  &__block
    display: flex
    flex-direction: column
</style>
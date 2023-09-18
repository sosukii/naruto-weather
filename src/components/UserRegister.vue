<template>
  <div>
    <h1>Register page</h1>
    <form @submit.prevent="registerHandler">
      <label for="name">Name:</label>
      <input v-model="userData.name">

      <label for="email">Email:</label>
      <input type="email" v-model="userData.email" required>

      <label for="password">Password:</label>
      <input type="password" v-model="userData.password" required>

      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
  import { ref} from 'vue'
  import {register} from '../api/register'
  import { notify } from "@kyvg/vue3-notification";

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
  }

</script>

<style scoped>

</style>
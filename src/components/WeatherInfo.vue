<template>
  <div>
    <form @submit.prevent="weatherHandler">
      <input v-model="town" type="text" placeholder="Tomsk" required>
      <button type="submit">Get weather!</button>
    </form>
    <div v-if="isTownExist">
      <h2>Weather for {{ town ? town : 'Tomsk' }}</h2>
      <div>Temperature: {{ weatherData.temperature }}, {{ weatherData.description }}</div>
      <div>Humidity: {{ weatherData.humidity }}</div>
      <div>Wind speed: {{ weatherData.wind }}</div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted} from 'vue'
  import { notify } from "@kyvg/vue3-notification";
  import { getWeather } from '../api/weather'

  const town = ref('')
  const isTownExist = ref(false)
  const weatherData = ref({
    temperature: '',
    description: '',
    humidity: '',
    wind: '',
    icon: ''
  })

  async function weatherHandler() {
    const townName = town.value ? town.value : 'Tomsk'

    const result = await getWeather(townName)

    if(result.cod === 200) {
      isTownExist.value = true

      weatherData.value.temperature = `${Math.round(result.main.temp)}°C`
      weatherData.value.description = result.weather[0].description
      weatherData.value.humidity = `${result.main.humidity}%`
      weatherData.value.wind = `${Math.round(result.wind.speed)} m/s`
    } else {
      notify({
      text: result.message,
    });
    }
  }


  onMounted(() => weatherHandler());
</script>

<style scoped>
</style>
<template>
  <div>
    <form @submit.prevent="weatherHandler">
      <input v-model="town" type="text" placeholder="Tomsk" required>
      <div>Weather for {{ town }}, {{ daysCount }} day(s)</div>

      <input type="radio" id="one" value="1" v-model="daysCount" />
      <label for="one">1</label>

      <input type="radio" id="three" value="3" v-model="daysCount" />
      <label for="three">3</label>

      <input type="radio" id="five" value="5" v-model="daysCount" />
      <label for="five">5</label>

      <button type="submit">Get weather!</button>
      <button @click="addCityToFavorites">Add city to favorites</button>
    </form>

    <div class="favorites">
      Favorites cities:
      <div v-for="city in favoritesCities" :key="city">{{ city }}</div>
    </div>

    <div class="weather">
      <div v-for="day in weatherData.slice(0, daysCount)" :key="day[0].dt_txt" class="cards">
        <p>Date: {{ (day[0].dt_txt).split(' ')[0] }}</p>
        <div v-for="weather in day" :key="weather" class="card">
          <p class="card__date">{{ formatTime(new Date(weather.dt_txt)) }}</p>
          <div>Temperature: {{ Math.round(weather.main.temp) }}°C, {{ weather.weather[0].description }}</div>
          <div>Humidity: {{ weather.main.humidity }}%</div>
          <div>Wind speed: {{ weather.wind.speed }} m/s</div>
        </div>
        <hr>
      </div>
    </div>

    <div class="history">
      History of request:
      <div v-for="sity in history.slice(1)" :key="sity">{{ sity }}</div>
      <button @click="clearHistory">clear history</button>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted} from 'vue'
  import { notify } from "@kyvg/vue3-notification";
  import { getCityGeoTags, getWeatherByCoordinates } from '../api/weather'
  import { useUserStore } from '../stores/user'

  const userStore = useUserStore();
  const isUserAuthenticated = computed(() => userStore.isAuthenticated);

  const town = ref('Tomsk')
  let oldTownValue = ''
  const history = ref([])
  const favoritesCities = ref([])

  const weatherData = ref([])
  const daysCount = ref('1')

  const requestCount = ref(0)
  const REQUEST_LIMIT = isUserAuthenticated.value? Infinity : 16

  let cities = {}

  async function weatherHandler() {
    const cityName = town.value ? town.value : 'Tomsk'
    if(cityName === oldTownValue) return

    const resultGeo = await getCityGeoTags(cityName)

    if(resultGeo.length === 0) {
      notify({
        text: `Cannot find city with name ${town.value}`,
      });
      return
    }

    const { lat, lon } = resultGeo[0]
    const resultWeather = await getWeatherByCoordinates(lat, lon)

    if(+resultWeather.cod !== 200) {
      notify({
        text: 'Server error, try again',
      });
      return
    }

    oldTownValue = cityName
    history.value.push(cityName)
    if(requestCount.value >= REQUEST_LIMIT) {
      notify({
        text: 'Register to remove limit request 🐈',
      });
      return
    }
    requestCount.value +=1

    cities = {}
    resultWeather.list.forEach(obj => {
      const dateKey = new Date(obj.dt_txt).getDate()

      if(cities[dateKey]) {
        cities[dateKey].push(obj)
      } else {
        cities[dateKey] = [obj]
      }
    })

    weatherData.value = Object.values(cities);
  }

  function formatTime(date) {
    const hours = (date.getHours()+'').length === 1 ? `0${date.getHours()}` : date.getHours()
    const minutes = (date.getMinutes()+'').length === 1 ? `0${date.getMinutes()}` : date.getMinutes()

    return `${hours}:${minutes}`
  }

  function clearHistory() {
    history.value = []
  }
  function addCityToFavorites(){
    if(!favoritesCities.value.includes(town.value)){
      favoritesCities.value.push(town.value)
    }
  }

  setInterval(() => {
    requestCount.value = 0;
  }, 60 * 60 * 1000);

  onMounted(() => weatherHandler());
</script>

<style scoped lang="sass">
.weather
  display: flex
  flex-wrap: wrap
  .cards
    border: 2px solid blue
    margin-bottom: 10px
    width: 250px
    .card
      border: 2px solid red
</style>
<template>
  <div>
    <form class="form" @submit.prevent="weatherHandler">
      <div>Selected options: weather in {{ town }}, for {{ daysCount }} day(s)</div>

      <div class="form__block">
        <label for="cityinput">Enter city:</label>
        <input class="input" v-model="town" type="text" placeholder="Tomsk" required id="cityinput">
      </div>

      <div class="wrapperDaysCount">
        <p class="wrapperDaysCount__title">Select days:</p>
        <div class="wrapperDaysCount__content">
          <div class="wrapperDaysCount__content__item">
            <input type="radio" id="one" value="1" v-model="daysCount" />
            <label for="one">1</label>
          </div>
          <div class="wrapperDaysCount__content__item">
            <input type="radio" id="three" value="3" v-model="daysCount" />
            <label for="three">3</label>
          </div>
          <div class="wrapperDaysCount__content__item">
            <input type="radio" id="five" value="5" v-model="daysCount" />
            <label for="five">5</label>
          </div>
        </div>
      </div>


      <button class="btn" type="submit">Get weather!</button>
      <button class="btn" @click="addCityToFavorites">Add city to favorites</button>
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
      <button class="btn" @click="clearHistory">clear history</button>
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
.form
  padding-top: 25px
  display: flex
  flex-direction: column
  gap: 14px
  align-items: center
  &__block
    display: flex
    flex-direction: column
.wrapperDaysCount
  display: flex
  gap: 14px
  &__content
    display: flex
    gap: 14px
    &__item
      display: flex
      gap: 3px
.weather
  display: flex
  flex-wrap: wrap
  justify-content: center
  gap: 10px
  .cards
    border: 1px solid orange
    border-radius: 4px
    box-shadow: rgba(255, 196, 0, 0.9) 0px 2px 8px 0px
    margin-bottom: 10px
    width: 250px
    display: flex
    flex-direction: column

    .card
      padding: 10px 5px
      box-shadow: 0px 15px 10px -15px blue
</style>
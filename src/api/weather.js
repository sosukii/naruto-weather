const appid = import.meta.env.VITE_WEATHE_APP_ID

export async function getWeather(city, lang) {
  try {
    const language = lang? lang : "en";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${language}&appid=${appid}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    return data
  } catch(e) {
    return null
  }
}

export async function getWeatherByCoordinates(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}&units=metric&cnt=50`;
    const res = await fetch(url);
    const data = await res.json();

    return data
  } catch(e) {
    return null
  }
}

export async function getCityGeoTags(city, limitCount=5) {
  try {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limitCount}&appid=${appid}`
    const res = await fetch(url)
    const data = await res.json()

    return data
  } catch(e) {
    return null
  }
}

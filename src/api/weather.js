export async function getWeather(city, lang) {
  const appid = import.meta.env.VITE_WEATHE_APP_ID

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
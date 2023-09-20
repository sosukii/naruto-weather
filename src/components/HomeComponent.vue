<template>
  <div class="wrapper">
    <h1>Weather application for COOL ninja!! 🔥🔥✨</h1>
    <img class="naruto" src="/public/naruto.png" alt="ninja naruto">
    <div class="description">
      <h2>About product</h2>
      <p class="description__title">
        You can get the weather for city you want.
        This application use open source API to get the weather info.
      </p>
      <ul class="description__ability">
        <li class="description__ability__item">Write you're city into input at Weather page</li>
        <li class="description__ability__item">Choose how many days youre interesting for: we can displayed 1, 3 or 5 days weather for you</li>
        <li class="description__ability__item">Click the "Get weather" button and see what happend!</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="sass">
.wrapper
  padding-top: 25px
  display: flex
  flex-direction: column
  align-items: center
  .description
    display: flex
    flex-direction: column
    align-items: center
.naruto
  width: 60%
</style>
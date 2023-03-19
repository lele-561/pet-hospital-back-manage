<template>
  <div id='app'>
    <router-view :key='$route.query'></router-view>
<!--    <router-view :key='$route.path'></router-view>-->
  </div>
</template>

<script>
import Main from './views/Main.vue'

export default {
  name: 'App',
  components: {
    Main
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
}
</style>

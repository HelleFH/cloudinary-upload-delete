<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <DisplayImagesFromCloudinary />

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import DisplayImagesFromCloudinary from './components/viewImages.vue'
export default {
  name: 'App',
  components: {
    HelloWorld,
    DisplayImagesFromCloudinary,
  },
  data() {
    return {
      prompt: '' // Define prompt data property
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <div id="app">
<h1>AI Images </h1>  
<p> Feel free to upload and delete images </p>
    <UploadImage msg="Welcome to Your Vue.js App"/>
    <DisplayImagesFromCloudinary />

  </div>
</template>

<script>
import UploadImage from './components/UploadImage.vue'
import DisplayImagesFromCloudinary from './components/viewImages.vue'
export default {
  name: 'App',
  components: {
    UploadImage,
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

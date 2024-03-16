<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="(imageUrl, index) in images" :key="index">
        {{ imageUrl }}
        <img :src="imageUrl" :alt="'Image ' + index" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  name: 'DisplayImagesFromCloudinary',
  setup() {
    const images = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/images`);
        images.value = response.data.imageUrls;
        console.log('Images:', images.value);
        loading.value = false;
      } catch (error) {
        console.error('Error fetching images:', error);
        error.value = 'Error fetching images. Please try again later.';
        loading.value = false;
      }
    };

    onMounted(fetchImages);

    return {
      images,
      loading,
      error
    };
  }
};
</script>

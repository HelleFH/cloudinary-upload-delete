<template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-4" v-for="(imageUrl, index) in images" :key="index">
          <div class="card mb-3">
            <img :src="imageUrl" :alt="'Image ' + index" class="card-img-top" />
            <div class="card-body">
              <p class="card-text">Image {{ index + 1 }}</p>
              <button @click="deleteImage(index)" class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="loading" class="text-center mt-3">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p>Loading...</p>
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
  
      const deleteImage = async (index) => {
        try {
          const publicIdToDelete = getPublicIdFromUrl(images.value[index]);
          if (publicIdToDelete) {
            const response = await axios.delete(`${API_URL}/delete-image/${publicIdToDelete}`);
            console.log('Cloudinary image deletion response:', response.data);
            images.value.splice(index, 1); // Remove the deleted image from the images array
          }
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      };
  
      const getPublicIdFromUrl = (imageUrl) => {
        // Extract the public ID from the Cloudinary image URL
        const parts = imageUrl.split('/');
        return parts[parts.length - 1].split('.')[0];
      };
  
      onMounted(fetchImages);
  
      return {
        images,
        loading,
        error,
        deleteImage
      };
    }
  };
  </script>
  
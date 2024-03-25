<template>
  <!-- Container for displaying images -->
  <div class="container pt-4">
    <div class="row">
      <!-- Loop through images and display them in cards -->
      <div class="col-md-4 " v-for="(imageUrl, index) in images" :key="index">
        <div class="card image-container mb-3">
          <!-- Display image -->
          <img :src="imageUrl" :alt="'Image ' + index" class="card-img-top" />
          <div class="card-body">
            <!-- Display image URL as a clickable link -->
            <div class="card-text">Image URL: <br><a :href="imageUrl">{{ imageUrl }}</a></div>
            <!-- Button to trigger delete modal -->
            <button @click="showDeleteModal(index)" class="btn mt-4 mb-2">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Loading spinner when images are being fetched -->
    <div v-if="loading" class="text-center mt-3 text-white">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading...</p>
    </div>
    <!-- Delete confirmation modal -->
    <delete-confirmation-modal 
      :isOpen="deleteModalOpen" 
      @onCancel="closeDeleteModal" 
      @onConfirm="confirmDeleteImage" 
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DeleteConfirmationModal from './DeleteConfirmationModal.vue';

const API_URL = 'https://react-listings.onrender.com';

export default {
  name: 'DisplayImagesFromCloudinary',
  components: {
    DeleteConfirmationModal
  },
  setup() {
    const images = ref([]); // Array to hold image URLs
    const loading = ref(true); // Loading state
    const deleteModalOpen = ref(false); // State to control delete modal visibility
    let deletionIndex = null; // Index of image to be deleted

    // Function to fetch images from the server
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/images`);
        images.value = response.data.imageUrls;
        console.log('Images:', images.value);
        loading.value = false;
      } catch (error) {
        console.error('Error fetching images:', error);
        loading.value = false;
      }
    };

    // Function to delete an image
    const deleteImage = async (index) => {
      try {
        const publicIdToDelete = getPublicIdFromUrl(images.value[index]);
        if (publicIdToDelete) {
          const response = await axios.delete(`${API_URL}/delete-image/${publicIdToDelete}`);
          console.log('Cloudinary image deletion response:', response.data);
          images.value.splice(index, 1);
          closeDeleteModal(); // Close the delete modal after deletion
        }
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    };

    // Function to show the delete modal
    const showDeleteModal = (index) => {
      deletionIndex = index;
      deleteModalOpen.value = true;
    };

    // Function to close the delete modal
    const closeDeleteModal = () => {
      deleteModalOpen.value = false;
      deletionIndex = null;
    };

    // Function to confirm image deletion
    const confirmDeleteImage = () => {
      if (deletionIndex !== null) {
        deleteImage(deletionIndex);
      }
    };

    // Function to extract public ID from Cloudinary image URL
    const getPublicIdFromUrl = (imageUrl) => {
      const parts = imageUrl.split('/');
      return parts[parts.length - 1].split('.')[0];
    };

    // Fetch images on component mount
    onMounted(fetchImages);

    return {
      images,
      loading,
      deleteModalOpen,
      showDeleteModal,
      closeDeleteModal,
      confirmDeleteImage
    };
  }
};
</script>

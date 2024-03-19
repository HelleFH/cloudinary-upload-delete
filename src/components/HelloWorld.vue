<template>
  <div>
    <form @submit.prevent="handleImageUpload" enctype="multipart/form-data">
      <div class="upload-section w-100">
        <div
          class="upload-zone"
          style="cursor: pointer"
          @dragover.prevent
          @drop="onDrop"
        >
          <div class="bg-light text-dark mt-2 mb-2 w-75 p-1">
            <input
              type="file"
              class="text-dark ml-1"
              @change="onFileChange"
              accept="image/*"
            />
          </div>
        </div>
        <div v-if="previewSrc" class="image-preview">
          <img :src="previewSrc" alt="Preview" class="preview-image" />
        </div>
        <div v-else class="preview-message">
          <p v-if="errorMsg" class="errorMsg">{{ errorMsg }}</p>
          <p v-else>No preview available for this file</p>
        </div>
      </div>
      <button class="mt-4 mb-4 w-25 button button--orange" type="submit">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'; // Import axios for making HTTP requests
const API_URL = 'http://localhost:3000'; // Replace with your server URL

export default {
  name: 'UploadImageToCloudinary',
  data() {
    return {
      file: null,
      previewSrc: '',
      isPreviewAvailable: false,
      errorMsg: '',
    };
  },
  methods: {
    onDrop(event) {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files[0];
      this.setFile(droppedFile);
      this.previewFile(droppedFile);
    },
    onFileChange(event) {
      const selectedFile = event.target.files[0];
      this.setFile(selectedFile);
      this.previewFile(selectedFile);
    },
    setFile(file) {
      this.file = file;
    },
    previewFile(file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.previewSrc = fileReader.result;
      };
      fileReader.readAsDataURL(file);
      this.isPreviewAvailable = file.name.match(/\.(jpeg|jpg|png)$/);
    },
    async handleImageUpload() {
      try {
        if (!this.file) {
          this.errorMsg = 'Please select a file to upload.';
          return;
        }

        const formData = new FormData();
        formData.append('file', this.file);

        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Handle server response
        console.log(response.data); // For debugging

        // Reset form fields after successful upload
        this.file = null;
        this.previewSrc = '';
        this.errorMsg = ''; // Clear any previous error message
      } catch (error) {
        console.error('Error uploading image:', error);
        this.errorMsg = 'Error uploading image. Please try again.';
      }
    },
  },
};
</script>

<style scoped>
.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload-zone {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
}
.preview-message {
  margin-top: 10px;
}
.preview-message p {
  margin: 0;
}
.image-preview img {
  max-width: 100%;
}
</style>
<template>
    <div v-if="isOpen">
      <div class="modal-backdrop show"></div>
      <div class="modal" tabIndex="-1" role="dialog" style="display: block;">
        <div class="modal-dialog" role="document">
          <div class="modal-content text-dark">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteModalLabel">
                Confirm Deletion
              </h5>
              <button type="button" class="btn-close" aria-label="Close" @click="onCancel"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this listing?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="onCancel">
                Cancel
              </button>
              <button type="button" class="btn btn-danger" @click="onConfirm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isOpen: {
        type: Boolean,
        required: true
      },
      onCancel: {
        type: Function,
        required: true
      },
      onConfirm: {
        type: Function,
        required: true
      }
    },
    methods: {
      onCancel() {
        this.$emit('onCancel'); // Emitting onCancel event
      },
      onConfirm() {
        this.$emit('onConfirm');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your modal styles here */
  </style>
  
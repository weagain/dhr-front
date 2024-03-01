<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Boolean,
    },
    title: {
      type: String,
      default: 'Rules',
    },
  })

  const emit = defineEmits(['update:modelValue', 'close'])

  const visible = ref(false)

  watch(
    () => props.modelValue,
    (val) => {
      if (visible.value !== val) {
        visible.value = val
      }
    },
  )
  watch(
    () => visible.value,
    (val) => {
      if (props.modelValue !== val) {
        emit('update:modelValue', val)
      }
    },
  )

  const closeModal = () => {
    emit('close')
  }
</script>

<template>
  <div v-show="visible" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <span class="modal-title">{{ title }}</span>
        <button class="close-button" @click="closeModal">X</button>
      </div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-container {
    position: absolute;
    background: white;
    padding: 20px;
    border-radius: 8px;

    .modal-content {
      margin: 20px 0 0 0;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: #333;
  }
</style>

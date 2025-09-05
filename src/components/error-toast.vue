<template>
  <transition name="fade">
    <div v-if="visible" class="toast">
      <span class="toast-icon">⚠</span>
      <span class="toast-message">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useToast } from '@/stores/toast'

const { visible, message } = useToast()
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  min-width: 200px;
  padding: 12px 16px;
  background-color: #d93025;
  color: white;
  font-family: Arial, sans-serif;
  font-weight: 500;
  border-radius: 6px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}

.toast-icon {
  margin-right: 8px;
}
</style>

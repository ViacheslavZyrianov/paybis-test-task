import { ref } from 'vue'
import type { ToastState } from '@/types/toast.ts'

const state: ToastState = {
  visible: ref(false),
  message: ref(''),
}

let timeoutId: number | undefined

export const useToast = () => {
  const showError = (msg: string, duration = 3000): void => {
    state.message.value = msg
    state.visible.value = true

    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      state.visible.value = false
    }, duration)
  }

  return {
    visible: state.visible,
    message: state.message,
    showError,
  }
}

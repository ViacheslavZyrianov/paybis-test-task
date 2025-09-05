import type { Ref } from 'vue'

export type ToastState = {
  visible: Ref<boolean>
  message: Ref<string>
}

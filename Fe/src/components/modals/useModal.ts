import { useUserStore } from "../../stores/user"
import { inject, ref } from "vue"

export const useModal = (modalName: string) => {
  const user = useUserStore()
  const $vfm: any = inject('$vfm')
  const show = (params?: any) => $vfm.show(modalName, params)
  const hide = () => $vfm.hide(modalName)
  const modalClosing = (event: any) => user.loading && event.stop()
  const showModal = ref(false)

  return {
    modalName,
    show,
    hide,
    modalClosing,
    showModal
  }
}

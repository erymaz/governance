<template>
  <vue-final-modal :name="modalName"
                   classes="flex justify-center items-center"
                   content-class="w-full max-w-md flex flex-col mx-1 p-1 border-solid border-1 bg-white rounded-lg"
                   v-model="showModal"
                   @beforeOpen="beforeOpen">
    <div class="h-14 grid grid-cols-header text-right font-bold">
      <span />
      <div class="self-center text-center text-gray-900 text-xl">Post Proposal</div>
      <img src="/img/close.svg"
           class="close-icon"
           @click="hide" />
    </div>

    <div class="p-6 overflow-y-auto scrollbar-hide">
      <div class="text-center mb-10">
        Send {{ params.fee }} to post a proposal.
      </div>

      <div class="grid grid-cols-2 gap-8">
        <button @click="hide"
                class="inline-flex justify-center items-center py-1.5 mx-auto text-md font-medium rounded w-full border border-purple-600">
          Cancel
        </button>
        <button @click="confirm"
                class="inline-flex justify-center items-center bg-purple-600 text-white py-1.5 mx-auto text-md font-medium rounded w-full">
          Confirm
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModal } from './useModal'

const { hide, modalName, showModal } = useModal('proposal-confirm')
const params = ref({
  fee: '',
  publish: Function
})

const confirm = async (): Promise<void> => {
  hide()
  params.value.publish()
}

const beforeOpen = (event: any) => {
  params.value = event.ref.params.value
}
</script>

<style scoped>
.close-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  align-self: center;
  justify-self: center;
  cursor: pointer;
}
</style>

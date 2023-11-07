<template>
  <vue-final-modal :name="modalName"
                   classes="flex justify-center items-center"
                   content-class="w-full max-w-md flex flex-col mx-1 p-1 border-solid border-1 bg-white rounded-lg"
                   v-model="showModal"
                   @beforeOpen="beforeOpen">
    <div class="h-14 grid grid-cols-header text-right font-bold">
      <span />
      <div class="self-center text-center text-gray-900 text-xl">Add voting system</div>
      <img src="/img/close.svg"
           class="close-icon"
           @click="hide" />
    </div>

    <div class="p-6 overflow-y-auto scrollbar-hide">
      <div v-for="system of availableVotingSystems"
           :key="system.id"
           @click="selected = system.id"
           class="hover:bg-gray-100 rounded border py-2 px-4 mb-2 cursor-pointer"
           :class="{ 'border-purple-700': system.id == selected }">
        <div class="flex justify-between items-center py-1">
          <div class="w-full truncate">
            <span class="font-semibold mr-4">{{ system.name }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8 mt-8">
        <button @click="hide"
                class="inline-flex justify-center items-center py-1.5 mx-auto text-md font-medium rounded w-full border border-purple-600">
          Cancel
        </button>
        <button @click="confirm"
                class="inline-flex justify-center items-center py-1.5 mx-auto text-md font-medium rounded w-full"
                :class="selected == null ? 'bg-gray-200 text-gray-400' : 'bg-purple-600 text-white'"
                :disabled="selected == null">
          Confirm
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useModal } from './useModal'
import { votingSystems } from '@/helpers'

const { modalName, hide, showModal } = useModal('select-voting-system')

const params = ref({
  addVotingSystem: Function
})

const selected = ref<string | null>(null)

const availableVotingSystems = computed(() => {
  return votingSystems.filter(_ => _.active)
})

const confirm = () => {
  hide()
  if (selected.value) {
    params.value.addVotingSystem(selected.value)
  }
}
const beforeOpen = (event: any) => {
  selected.value = null
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

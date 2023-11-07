<template>
  <vue-final-modal :name="modalName"
                   classes="flex justify-center items-center"
                   content-class="w-full max-w-md flex flex-col mx-1 p-1 border-solid border-1 bg-white rounded-lg"
                   v-model="showModal"
                   @beforeOpen="beforeOpen">
    <div class="h-14 grid grid-cols-header text-right font-bold">
      <span />
      <div class="self-center text-center text-gray-900 text-xl">Add strategy</div>
      <img src="/img/close.svg"
           class="close-icon"
           @click="hide" />
    </div>

    <div class="p-6 overflow-y-auto scrollbar-hide">
      <div v-for="strategy of strategyNames"
           :key="strategy"
           @click="selected = strategy"
           class="hover:bg-gray-100 rounded border py-2 px-4 mb-2 cursor-pointer"
           :class="{ 'border-purple-700': strategy == selected }">
        <div class="flex justify-between items-center py-1">
          <div class="w-full truncate">
            <span class="font-semibold mr-4">{{ strategy }}</span>
            <span class="rounded bg-gray-200 p-1">{{ getStrategy(strategy).tokens[0].currency }}</span>
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
import { useStrategyStore } from '@/stores/strategy'

const { hide, modalName, showModal } = useModal('select-strategy')
const strategyStore = useStrategyStore()

const params = ref({
  addStrategy: Function
})

const selected = ref<string | null>(null)

const strategyNames = computed((): string[] => {
  return Object.keys(strategyStore.strategies)
})

const getStrategy = (name: string) => {
  return strategyStore.findStrategy(name)
}

const confirm = () => {
  hide()
  if (selected.value) {
    params.value.addStrategy(selected.value)
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

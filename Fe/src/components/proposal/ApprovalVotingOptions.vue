<template>
  <div class="mt-3">
    <div
      v-for="(option, index) of props.modelValue"
      :key="option"
      class="relative border border-gray-200 hover:border-gray-800 px-4 py-2 my-1 rounded-lg"
    >
      <img
        v-if="option != 'None of the above'"
        @click="removeOption(option)"
        src="/img/close.svg"
        class="absolute right-4 top-3 w-4 h-4 cursor-pointer"
      />
      <span class="text-gray-900">Choice {{ index + 1 }}: {{ option }}</span>
    </div>

    <div class="flex mt-3">
      <input
        v-model="newOption"
        type="text"
        name="proposal-discussion"
        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md mr-2"
      />
      <button
        @click="addOption"
        type="button"
        class="inline-flex justify-center items-center px-4 border border-purple-600 text-md font-medium rounded shadow-sm text-purple-700"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['update:modelValue'])

interface Props {
  modelValue: string[];
}

// props
const props = defineProps<Props>();

const newOption = ref('')

const removeOption = (option: string): void => {
  const options = [...props.modelValue].filter(_ => _ != option)
  emit('update:modelValue', options)
}

const addOption = (): void => {
  if (newOption.value != '' && !props.modelValue.includes(newOption.value)) {
    const options = [...props.modelValue]
    options.unshift(newOption.value)
    emit('update:modelValue', options)
    newOption.value = ''
  }
}
</script>

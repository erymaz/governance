<template>
  <div class="text-sm flex-1">
    <span for="comments"
          class="font-semibold">Quorum</span>
    <div class="flex items-center float-right">
      <CheckIcon v-if="props.current >= props.quorum"
                 class="w-5 h-5 text-green-600 mr-3" />
      <span id="comments-description"
            class="text-purple-800 text-base">
        {{ quorum }}
      </span>
    </div>
    <div class="w-full bg-purple-100 rounded-full h-2 mt-2">
      <div class="bg-purple-800 h-2 rounded-full"
           :style="`width: ${percent}%`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon } from '@heroicons/vue/solid'

interface Props {
  quorum: number;
  current: number;
}

// props
const props = defineProps<Props>();

const quorum = computed(() => {
  return `${props.current}% / ${props.quorum}%`
})

const percent = computed(() => {
  return props.current * 100 / props.quorum;
})
</script>

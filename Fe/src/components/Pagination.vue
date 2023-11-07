<template>
  <nav class="border-t border-gray-200 px-4 flex items-center justify-center sm:px-0">
    <div class="-mt-px flex">
      <button :disabled="currentPage < 2"
              @click="changePage(1, true)"
              class="cursor-pointer pt-4 pr-1 inline-flex items-center text-sm font-medium"
              :class="(currentPage < 2) ? 'text-gray-300' : 'text-purple-800'">
        <ChevronDoubleLeftIcon class="mr-3 h-5 w-5"
                               aria-hidden="true" />
      </button>
    </div>
    <div class="-mt-px flex">
      <button :disabled="currentPage < 2"
              @click="changePage(-1, false)"
              class="cursor-pointer pt-4 pr-1 inline-flex items-center text-sm font-medium"
              :class="(currentPage < 2) ? 'text-gray-300' : 'text-purple-800'">
        <ChevronLeftIcon class="mr-3 h-5 w-5"
                         aria-hidden="true" />
      </button>
    </div>
    <div class="md:-mt-px md:flex">
      <div class="border-indigo-500 text-indigo-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
           aria-current="page"> {{ currentPage }} </div>
    </div>
    <div class="-mt-px flex justify-end">
      <button :disabled="currentPage >= last"
              @click="changePage(1, false)"
              class="cursor-pointer pt-4 pl-1 inline-flex items-center text-sm font-medium"
              :class="(currentPage >= last) ? 'text-gray-300' : 'text-purple-800'">
        <ChevronRightIcon class="mx-3 h-5 w-5"
                          aria-hidden="true" />
      </button>
    </div>
    <div class="-mt-px flex">
      <button :disabled="currentPage >= last"
              @click="changePage(last, true)"
              class="cursor-pointer pt-4 pr-1 inline-flex items-center text-sm font-medium"
              :class="(currentPage >= last) ? 'text-gray-300' : 'text-purple-800'">
        <ChevronDoubleRightIcon class="mr-3 h-5 w-5"
                                aria-hidden="true" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/vue/solid'

const props = defineProps<{
  current: number;
  total: number;
}>()
const emit = defineEmits(['change'])
const pageLength = 10
const last = computed(() => Math.ceil(props.total / pageLength))
const currentPage = computed(() => props.current)


function changePage(page: number, isStatic: boolean): void {
  if (isStatic) {
    emit('change', page)
  } else {
    emit('change', currentPage.value + page)
  }
}
</script>

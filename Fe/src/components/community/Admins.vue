<template>
  <div class="w-full mt-10 mb-12 sm:mb-20">
    <div class="text-xl sm:text-2xl font-semibold">Admins</div>

    <div class="flex flex-col sm:flex-row justify-between sm:items-center mt-8">
      <h3 class="mb-3">List of admins</h3>
      <div class="relative rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-500 sm:text-sm">
            <SearchIcon class="w-4 h-4 text-purple-800" />
          </span>
        </div>
        <input v-model="searchTxt"
               type="text"
               class="w-full md:w-64 focus:ring-indigo-500 focus:border-indigo-500 block pl-10 sm:text-base border-gray-300 rounded-md"
               placeholder="Search Admins" />
      </div>
    </div>

    <table class="w-full mt-6">
      <tbody class="bg-white">
        <tr v-for="admin of admins"
            :key="admin"
            class="text-sm font-medium bg-gray-50 odd:bg-gray-100">
          <td class="flex items-center p-2">
            <img src="https://bloks.io/img/proton_avatar.png"
                 class="w-4 h-4" />
            <span class="ml-2 text-gray-600">{{ admin }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SearchIcon } from '@heroicons/vue/solid'
import { Community } from '@/types'

const props = defineProps<{ community: Community }>()

const searchTxt = ref<string>('')
const admins = computed(() => {
  if (!props.community) {
    return []
  }
  return props.community.admins.filter(_ => _.trim().toLowerCase().indexOf(searchTxt.value) !== -1)
})
</script>

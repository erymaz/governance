<template>
  <div class="w-full mt-10 mb-12 sm:mb-20">
    <div class="text-xl sm:text-2xl font-semibold">About</div>
    <div class="text-sm sm:text-md text-gray-400 py-4 sm:py-6">
      {{ community.description }}
    </div>

    <div class="py-6 border-b border-solid border-gray-200">
      <p class="text-lg font-medium">Admins</p>
      <ul class="mt-3 text-md rounded text-gray-400">
        <li v-for="admin in admins"
            :key="admin"
            class="py-1">{{ admin }}</li>
      </ul>
    </div>

    <div class="py-6 border-b border-solid border-gray-200">
      <p class="text-lg font-medium">Strategies</p>
      <ul class="mt-3 text-md text-gray-400">
        <li class="mb-3"
            v-for="strategy of community.strategies"
            :key="strategy">
          {{ strategy }}
        </li>
      </ul>
    </div>

    <div class="py-6 border-b border-solid border-gray-200">
      <p class="text-lg font-medium">Proposals</p>
      <ul class="mt-3 text-md text-gray-400">
        <li class="mb-3">Admin must approve: {{ community?.approvingProposal ? 'Yes' : 'No' }}</li>
      </ul>
    </div>

    <div class="py-6">
      <p class="text-lg font-medium">Voting systems</p>
      <ul class="mt-3 text-md text-gray-400">
        <li v-for="system of availableVotingSystems"
            :key="system.id"
            class="mb-3">
          {{ system.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Community } from '@/types'
import { votingSystems } from '@/helpers'

const props = defineProps<{ community: Community }>()
const admins = computed(() => {
  if (!props.community) {
    return []
  }
  const adminList = [...props.community.admins]
  if (!adminList.includes(props.community.controller)) {
    adminList.unshift(props.community.controller)
  }
  return adminList
})
const availableVotingSystems = computed(() => {
  if (!props.community) {
    return []
  }
  return votingSystems.filter(_ => props.community!.votingSystems.includes(_.id))
})
</script>

<template>
  <div v-if="strategy"
       class="strategy-details mt-6 md:mt-10 p-4">
    <template v-if="!isLoading">
      <button @click="$router.push(`/?tab=strategies`)"
              type="button"
              class="inline-flex items-center mb-4 md:mb-8 text-base font-semibold">
        <ArrowLeftIcon class="-ml-0.5 mr-2 h-4 w-4"
                       aria-hidden="true" />
        Back
      </button>
      <h1 class="font-bold mb-6">{{ strategyName }}</h1>
      <div class="mb-2">
        <span class="text-md font-semibold">Author: &nbsp;</span>
        <span>{{ strategy.author }}</span>
      </div>
      <div class="mb-14">
        <span class="text-md font-semibold">Version: &nbsp;</span>
        <span>{{ strategy.version }}</span>
      </div>
      <div my-4>
        <VueMarkdown :source="strategy.about"></VueMarkdown>
      </div>
    </template>

    <template v-else>
      <ListLoader></ListLoader>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/solid'
import { useStrategyStore } from '@/stores/strategy'
import VueMarkdown from 'vue-markdown-render'
import { ListLoader } from 'vue-content-loader'

const route = useRoute()
const strategyStore = useStrategyStore()

const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    await strategyStore.fetchStrategies()
    isLoading.value = false
  } catch (err) {
    console.log(err)
    isLoading.value = false
  }
})

const strategyName = computed(() => {
  return route.params.name as string
})

const strategy = computed(() => {
  return strategyStore.strategies[strategyName.value]
})
</script>

<style scoped>
.strategy-details {
  max-width: 1160px;
  width: 100%;
  padding: 20px;
}
</style>

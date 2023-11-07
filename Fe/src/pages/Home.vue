<template>
  <div class="dashboard mb-12 sm:mb-20">
    <template v-if="!isLoading">
      <div class="mt-6 sm:mt-10 text-3xl sm:text-4xl font-bold">Governance Dashboard</div>

      <div class="mt-4 text-base font-medium text-gray-400">
        <span>Total: </span>
        <span v-if="selectedCategory === 'communities'">{{communities.length}} {{communities.length > 1 ? 'communities' : 'community'}}</span>
        <span v-if="selectedCategory === 'strategies'">{{strategies.length}} {{strategies.length > 1 ? 'strategies' : 'strategy'}}</span>
      </div>

      <div class="max-w-md w-full mt-6 relative rounded-md">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span class="text-gray-500 sm:text-sm">
            <SearchIcon class="w-4 h-4 text-purple-800" />
          </span>
        </div>
        <input
          v-model="searchTxt"
          type="text"
          class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-base border-gray-300 rounded-md"
          placeholder="Search"
        />
      </div>

      <div class="flex justify-center max-w-md w-full mt-8 overflow-x-auto">
        <div
          v-for="category of categories"
          :key="category.name"
          class="mx-2"
        >
          <button
            @click="clickCategory(category.query)"
            type="button"
            class="px-4 py-2 text-xs font-medium rounded-full bg-purple-100"
            :class="{'text-white bg-purple-800': selectedCategory == category.query}"
          >
            {{category.name}}
          </button>
        </div>
      </div>

      <div v-if="selectedCategory === 'communities'" class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <div
          v-for="community of communities"
          :key="community.id"
          @click="$router.push(`/communities/${community.id}`)"
          class="flex items-center border border-solid hover:border-purple-700 rounded-lg p-8 cursor-pointer"
        >
          <img 
            :src="community.iconUrl"
            alt="logo"
            class="mr-3 rounded-full w-16 sm:w-28"
          />
          <div>
            <div class="mb-2 text-lg font-semibold">{{community.name}}</div>
            <div class="text-gray-400">{{community.memberCount}} member(s)</div>
          </div>
        </div>
      </div>

      <div v-if="selectedCategory === 'strategies'" class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <div
          v-for="(strategy, index) of strategies"
          :key="index"
          class="border border-solid hover:border-purple-700 rounded-lg p-8 cursor-pointer"
          @click="$router.push(`/strategies/${strategy}`)"
        >
          <div class="w-full flex items-center">
            <div class="max-w-xs truncate text-2xl font-semibold">{{strategy}} &nbsp;</div>
            <div class="text-md">v{{ getStrategy(strategy).version }}</div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <ListLoader></ListLoader>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { SearchIcon } from '@heroicons/vue/solid'
import { useCommunityStore } from '@/stores/community'
import { useStrategyStore } from '@/stores/strategy'
import { Community, Strategy } from '@/types'
import { ListLoader } from 'vue-content-loader'

const communityStore = useCommunityStore()
const strategyStore = useStrategyStore()
const route = useRoute()

type Category = 'communities' | 'strategies'

const categories: { name: string, query: Category }[] = [
  { name: 'Communities', query: 'communities' },
  { name: 'Strategies', query: 'strategies' },
]

const selectedCategory = ref<Category>('communities')

const searchTxt = ref<string>('')
const isLoading = ref<boolean>(false)

onMounted(async () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  isLoading.value = true
  try {
    await Promise.all([
      communityStore.fetchCommunities(),
      strategyStore.fetchStrategies(),
    ])
    if (route.query.tab) {
      selectedCategory.value = route.query.tab as Category
    }
  } catch(err) {
    console.log(err)
    isLoading.value = false
  } finally {
    isLoading.value = false
  }
})

const communities = computed(() => {
  return communityStore.communities.filter((_: Community) => _.name.trim().toLowerCase().indexOf(searchTxt.value) !== -1)
})

const strategies = computed(() => {
  const strategyNames = Object.keys(strategyStore.strategies)
  return strategyNames.filter((_: string) => _.trim().toLowerCase().indexOf(searchTxt.value) !== -1)
})

const clickCategory = (category: Category) => {
  selectedCategory.value = category
}

const getStrategy = (name: string): Strategy => {
  return strategyStore.strategies[name]
}

</script>

<!--Vue in page CSS-->
<style scoped>
.dashboard {
  max-width: 1160px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.space-card {
  max-width: 372px;
  width: 100%;
}
</style>

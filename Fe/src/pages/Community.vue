<template>
  <div class="community flex flex-col sm:flex-row sm:space-x-4">
    <template v-if="!isLoading">
      <div v-if="community" class="sm:w-64 lg:w-80">
        <Sidebar
          @communityTabSelected="selectTab"
          :selectedTab="selectedTab"
          :community="community"
        />
      </div>
      <div v-if="community" class="flex-1">
        <Proposals v-if="selectedTab == 'proposals'" :community="community" />
        <About v-else-if="selectedTab == 'about'" :community="community" />
        <Admins v-else-if="selectedTab == 'admins'" :community="community" />
        <NewProposal
          v-else-if="selectedTab == 'newProposal'"
          :community="community"
          @created = "selectTab('proposals')"
        />
        <Delegate v-else-if="selectedTab == 'delegate'" />
        <Settings v-else-if="selectedTab == 'settings'" :community="community" />
      </div>
    </template>

    <template v-else>
      <ListLoader></ListLoader>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ListLoader } from 'vue-content-loader'
import Sidebar from '@/components/layouts/Sidebar.vue'
import Proposals from '@/components/community/Proposals.vue'
import NewProposal from '@/components/community/NewProposal.vue'
import About from '@/components/community/About.vue'
import Admins from '@/components/community/Admins.vue'
import Settings from '@/components/community/Settings.vue'
import Delegate from '@/components/community/Delegate.vue'
import { useCommunityStore } from '@/stores/community'
import { useStrategyStore } from '@/stores/strategy'
import { Community } from '@/types'

const route = useRoute()
const communityStore = useCommunityStore()
const strategyStore = useStrategyStore()


const selectedTab = ref('proposals')
const community = ref<null | Community>(null)
const isLoading = ref<boolean>(false)

onMounted(async () => {
  isLoading.value = true
  try {
    const [comm] = await Promise.all([
      communityStore.fetchCommunity(+route.params.communityId),
      strategyStore.fetchStrategies(),
    ])
    community.value = comm
    isLoading.value = false
  } catch(err) {
    console.log(err)
    isLoading.value = false
  }
})

const selectTab = (tabKey: string) => {
  selectedTab.value = tabKey
}

</script>

<style>
.community {
  max-width: 1160px;
  width: 100%;
  padding: 10px 15px;
}
</style>

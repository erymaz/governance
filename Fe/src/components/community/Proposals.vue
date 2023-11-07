<template>
  <div v-if="community"
       class="w-full mt-10 mb-12 sm:mb-20"
       ref="scrollComponent">
    <div class="text-xl sm:text-2xl font-semibold">Proposals</div>
    <div class="text-sm sm:text-md text-gray-400 mt-6">
      {{ community.description }}
    </div>

    <div class="flex my-8 py-1 overflow-x-auto">
      <div v-for="filter of filters"
           :key="filter.name"
           class="mr-4">
        <button @click="clickFilter(filter.query)"
                type="button"
                class="w-20 py-2 text-center text-xs font-medium rounded-full bg-purple-100"
                :class="{ 'text-white bg-purple-800': selectedFilter == filter.query }">
          {{ filter.name }}
        </button>
      </div>
    </div>

    <ProposalItem v-for="proposal of proposals"
                  :key="proposal._id"
                  :community="community"
                  :proposal="proposal"
                  @updated="fetchProposals" />

    <div class="w-full mt-2"
         v-if="!isLoading">
      <button v-if="proposals.length && canLoadMore"
              @click="loadMore"
              class="w-full py-2 text-center text-gray-200 font-semibold border rounded-md"
              :class="{ 'hover:border-purple-700 text-gray-600 ': canLoadMore }">
        Load more
      </button>
    </div>

    <div v-else
         style="border-top-color:transparent"
         class="w-5 h-5 mt-3 border-4 mx-auto border-blue-400 border-solid rounded-full animate-spin"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useProposalStore } from '@/stores/proposal'
import { Community, ProposalStatus, ProposalFilters } from '@/types'
import ProposalItem from '@/components/community/ProposalItem.vue'

const props = defineProps<{ community: Community }>()
const proposalStore = useProposalStore()


const selectedFilter = ref<ProposalFilters>(ProposalStatus.ACTIVE)
const isLoading = ref<boolean>(false)
const page = ref<number>(1)
const scrollComponent = ref(null)

window.onscroll = () => {
  if (!scrollComponent.value) {
    return;
  }
  let element = scrollComponent.value as any;
  if (element.getBoundingClientRect().bottom < window.innerHeight && canLoadMore.value) {
    loadMore();
  }
};

onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  fetchProposals()
})

const filters: {
  name: string;
  query: ProposalFilters;
}[] = [
    { name: 'All', query: 'All' },
    { name: 'Active', query: ProposalStatus.ACTIVE },
    { name: 'Pending', query: ProposalStatus.PENDING },
    { name: 'Expired', query: ProposalStatus.EXPIRED },
    { name: 'Closed', query: ProposalStatus.CLOSED },
  ]

const proposals = computed(() => {
  return proposalStore.proposals
})

const canLoadMore = computed(() => {
  return proposalStore.canLoadMore
})

const clickFilter = (query: ProposalFilters) => {
  selectedFilter.value = query
  page.value = 1
  fetchProposals()
}

const loadMore = () => {
  if (isLoading.value) {
    return;
  }
  page.value += 1
  fetchProposals()
}

const fetchProposals = async () => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true
  await proposalStore.fetchProposals(props.community!.id, page.value, selectedFilter.value)
  isLoading.value = false
}
</script>

<template>
  <div class="w-full">
    <template v-if="votes.length" >
      <table class="w-full mt-2">
        <thead class="bg-gray-400">
          <tr class="h-10 text-white">
            <th scope="col"
                class="w-1/3 md:w-1/4 p-2 text-left text-xs font-semibold">PROFILE</th>
            <th scope="col"
                class="w-1/3 md:w-2/4 p-2 text-left text-xs font-semibold">ANSWER</th>
            <th scope="col"
                class="w-1/3 md:w-1/4 p-2 text-right text-xs font-semibold">WEIGHT</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="vote of votes"
              :key="vote._id"
              class="text-sm font-medium bg-gray-200 odd:bg-gray-100">
            <td class="p-2">
              <div class="flex items-center">
                <img src="https://bloks.io/img/proton_avatar.png"
                    class="w-5 h-5" />
                <span class="ml-2">{{ vote.voter }}</span>
              </div>
            </td>
            <td class="p-2">
              <div class="w-36 lg:w-96 md:truncate cursor-pointer"
                  :title="getCandidates(vote.winners)">
                {{ getCandidates(vote.winners) }}
              </div>
            </td>
            <td class="p-2 text-right">
              <span class="whitespace-nowrap">{{ shortAmountStr(getAmount(vote.winners)) }}
                {{ getCrrencies() }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="w-full mt-2"
          v-if="!isLoading">
        <Pagination @change="changePage"
                    :current="page"
                    :total="total" />
      </div>
    </template>
    <div v-else
      class="w-full py-2 text-center text-gray-600 font-normal"
      :class="{'h-96': isLoading}"
    >
      <span v-if="!isLoading">No votes yet</span>
      <div v-else
            style="border-top-color:transparent"
            class="w-5 h-5 mt-3 border-4 mx-auto border-blue-400 border-solid rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Community, Proposal, votingSystemId, Winner } from '@/types'
import { useVoteStore } from '@/stores/vote'
import { useStrategyStore } from '@/stores/strategy'
import Pagination from '@/components/Pagination.vue'
import { shortAmountStr } from '@/helpers'

interface Props {
  community: Community,
  proposal: Proposal,
}

// props
const props = defineProps<Props>();

const voteStore = useVoteStore()
const strategyStore = useStrategyStore()
const isLoading = ref(false)
const page = ref(1)

onMounted(() => {
  fetchVotes()
})

const votes = computed(() => {
  return voteStore.votes
})

const total = computed(() => {
  return voteStore.total
})

const strategy = computed(() => {
  return strategyStore.findStrategy(props.proposal.strategy)
})

const changePage = async (p: number) => {
  page.value = p
  fetchVotes()
}

const fetchVotes = async () => {
  isLoading.value = true
  await voteStore.fetchAllVotes(props.proposal._id!, page.value)
  isLoading.value = false
}

const getCandidates = (winners: Winner[]): string => {
  const candidates: string[] = []
  for (const winner of winners) {
    const candidate = props.proposal.candidates.find(_ => _.id == winner.id)
    if (props.proposal.votingSystem === votingSystemId.WEIGHTED_VOTING) {
      if (winner.weight > 0) {
        candidates.push(`${winner.weight}% for ${candidate?.name || ''}`)
      }
    } else {
      candidates.push(candidate?.name || '')
    }
  }
  return candidates.join(', ')
}

const getAmount = (winners: Winner[]): number => {
  let amount = 0
  for (const winner of winners) {
    amount += winner.tokenAmount || 0
  }
  return amount
}

const getCrrencies = (): string => {
  const tokens = strategy.value.tokens.map(_ => _.currency)
  return tokens.join('+')
}
</script>

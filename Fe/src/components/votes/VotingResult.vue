<template>
  <div class="md:sticky md:top-24 mb-4">
    <div class="text-2xl font-medium">
      <p v-if="!isEndedProposal">Current Results</p>
      <p v-else>Results</p>
    </div>

    <div v-for="option of proposal.candidates"
         :key="option.id"
         class="mt-4">
      <div class="flex justify-between items-start">
        <div for="comments"
              class="font-medium w-40 truncate">{{ option.name }}</div>
        <div id="comments-description"
              class="text-purple-800 text-base">
          <span class="text-sm">{{ shortAmountStr(option.tokenAmount || 0) }}&nbsp;</span>
          <span class="text-sm">{{ getCrrencies() }}&nbsp;</span>
          <span class="text-sm">{{ getPercent(option.tokenAmount || 0) }}%</span>
        </div>
      </div>
      <div class="w-full bg-purple-100 rounded-full h-2 mt-3">
        <div class="bg-purple-800 h-2 rounded-full"
              :style="`width: ${getPercent(option.tokenAmount || 0)}%`" />
      </div>
    </div>

    <div class="mt-8 py-4 border-dashed border-t border-purple-700">
      <Quorum :quorum="props.community.quorum / 100"
              :current="props.proposal.quorum || 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Proposal, Community, ProposalStatus } from '@/types'
import { useStrategyStore } from '@/stores/strategy'
import { getProposalStatus } from '@/helpers/proposal'
import { shortAmountStr } from '@/helpers'
import Quorum from '@/components/votes/Quorum.vue'

interface Props {
  community: Community,
  proposal: Proposal;
}

// props
const props = defineProps<Props>();

const strategyStore = useStrategyStore()

const isEndedProposal = computed(() => {
  if (!props.proposal) {
    return true
  }

  const status = getProposalStatus(props.proposal)
  if (status == ProposalStatus.EXPIRED || status == ProposalStatus.CLOSED) {
    return true
  }

  return false
})

const strategy = computed(() => {
  return strategyStore.findStrategy(props.proposal.strategy)
})

const getPercent = (amount: number): number => {
  const totalAmount = props.proposal.tokenAmount
  return totalAmount == 0 ? 0 : Math.round(amount * 100 / totalAmount)
}

const getCrrencies = (): string => {
  const tokens = strategy.value.tokens.map(_ => _.currency)
  return tokens.join('+')
}
</script>

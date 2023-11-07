<template>
  <div class="md:sticky md:top-24 mb-4">
    <div v-for="option of proposal.candidates"
         :key="option.id"
         class="mt-1">
      <div class="relative w-full bg-purple-50 rounded h-8">
        <div class="bg-purple-300 h-8 rounded"
              :style="`width: ${getPercent(option.tokenAmount || 0)}%`">
        </div>
        <div class="absolute top-0 bottom-0 left-4 right-4 flex justify-between items-center">
          <div for="comments"
              class="flex items-center text-sm text-black truncate">
            <span v-if="props.winners.includes(option.id)">
              <ThumbUpIcon
                class="w-5 h-5 text-green-600 mr-2"
              />
            </span>
            <span v-if="isClosed && isWinner(option.id, option.tokenAmount || 0)">
              <CheckIcon
                class="w-6 h-6 text-green-600 mr-2"
              />
            </span>
            <span>{{ option.name }}</span>
          </div>
          <div id="comments-description"
              class="text-black text-base">
            <span class="text-sm">{{ shortAmountStr(option.tokenAmount || 0) }}&nbsp;</span>
            <span class="text-sm">{{ getCrrencies() }}&nbsp;</span>
            <span class="mx-1">|</span>
            <span class="text-sm">{{ getPercent(option.tokenAmount || 0) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon, ThumbUpIcon } from '@heroicons/vue/solid'
import { Proposal, Community, ProposalStatus } from '@/types'
import { useStrategyStore } from '@/stores/strategy'
import { shortAmountStr } from '@/helpers'
import { getProposalStatus } from '@/helpers/proposal'

interface Props {
  community: Community,
  proposal: Proposal;
  winners: number[];
}

// props
const props = defineProps<Props>();

const strategyStore = useStrategyStore()

const strategy = computed(() => {
  return strategyStore.findStrategy(props.proposal.strategy)
})

const isClosed = computed(() => {
  if (!props.proposal) {
    return false
  }

  const currentQ = props.proposal.quorum || 0
  const status = getProposalStatus(props.proposal, currentQ >= props.community.quorum / 100)
  if (status == ProposalStatus.CLOSED) {
    return true
  }

  return false
})

const isWinner = (id: number, amount: number): boolean => {
  return !props.proposal.candidates.find(_ => _.id !== id && (_.tokenAmount || 0) > amount)
}

const getPercent = (amount: number): number => {
  const totalAmount = props.proposal.tokenAmount
  return totalAmount == 0 ? 0 : Math.round(amount * 100 / totalAmount)
}

const getCrrencies = (): string => {
  const tokens = strategy.value.tokens.map(_ => _.currency)
  return tokens.join('+')
}
</script>

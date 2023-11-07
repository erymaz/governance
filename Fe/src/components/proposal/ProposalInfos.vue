<template>
  <div v-if="props.proposal"
       class="mb-8">
    <p class="text-2xl font-medium mb-4">Details</p>
    <div class="flex justify-between items-center font-medium mb-2">
      <p class="font-medium text-gray-400 mr-2">Strategy</p>
      <a class="text-md font-semibold truncate"
          href="#"
          @click="$router.push(`/strategies/${proposal.strategy}`)"
          style="max-width: 200px;">
        {{ proposal.strategy }}
      </a>
    </div>
    <div class="flex justify-between items-center font-medium mb-2">
      <p class="font-medium text-gray-400 mr-2">Voting System</p>
      <p class="text-md font-semibold">{{ getVotingSystem(proposal.votingSystem)?.name || '-' }}</p>
    </div>
    <div class="flex justify-between items-center font-medium mb-2">
      <p class="font-medium text-gray-400 mr-2">Start Date</p>
      <p class="text-md font-semibold">{{ formatDate(proposal.startTime * 1000, 'MMM DD, YYYY') }}</p>
    </div>
    <div class="flex justify-between items-center font-medium mb-2">
      <p class="font-medium text-gray-400 mr-2">End Date</p>
      <p class="text-md font-semibold">{{ formatDate(proposal.endTime * 1000, 'MMM DD, YYYY') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@bloks/numbers'
import { Proposal, VotingSystem } from '@/types'
import { votingSystems } from '@/helpers'

interface Props {
  proposal: Proposal;
}

// props
const props = defineProps<Props>();

const getVotingSystem = (id: string): VotingSystem | undefined => {
  return votingSystems.find(_ => _.id == id)
}

</script>

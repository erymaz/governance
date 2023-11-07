<template>
  <div>
    <div v-if="proposalStatus == ProposalStatus.ACTIVE"
         class="flex items-center rounded-full w-24 h-9 bg-green-100 px-2 mr-4">
      <img src="/img/timer.png"
           class="w-6" />
      <span class="text-sm text-gray-400 font-medium ml-2">Active</span>
    </div>
    <div v-if="proposalStatus == ProposalStatus.EXPIRED"
         class="flex items-center rounded-full w-24 h-9 bg-purple-100 px-2 mr-4">
      <img src="/img/check-purple.png"
           class="w-6" />
      <span class="text-sm text-gray-400 font-medium ml-2">Expired</span>
    </div>
    <div v-if="proposalStatus == ProposalStatus.CLOSED"
         class="flex items-center rounded-full w-24 h-9 bg-purple-100 px-2 mr-4">
      <img src="/img/check-purple.png"
           class="w-6" />
      <span class="text-sm text-gray-400 font-medium ml-2">Closed</span>
    </div>
    <div v-if="proposalStatus == ProposalStatus.PENDING"
         class="flex items-center rounded-full w-28 h-9 bg-yellow-100 px-2 mr-4">
      <img src="/img/check-yellow.png"
           class="w-6" />
      <span class="text-sm text-gray-400 font-medium ml-2">Pending</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Community, Proposal, ProposalStatus } from '@/types'
import { getProposalStatus } from '@/helpers/proposal'

interface Props {
  community: Community;
  proposal: Proposal;
}

// props
const props = defineProps<Props>();

const proposalStatus = computed(() => {
  if (!props.community || !props.proposal) {
    return ProposalStatus.DECLINED
  }
  const currentQ = props.proposal.quorum || 0
  return getProposalStatus(props.proposal, currentQ >= props.community.quorum / 100)
})
</script>

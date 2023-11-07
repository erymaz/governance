<template>
  <div @click="$router.push(`/communities/${community.id}/proposals/${proposal._id}`)"
       class="my-2 p-6 border hover:border-purple-700 rounded-xl cursor-pointer">
    <div>
      <span class="text-sm text-gray-400">On {{ formatDate(proposal.startTime * 1000, 'MMM DD, YYYY') }} - By </span>
      <span class="text-sm">{{ proposal.author }}</span>
    </div>

    <div class="mt-4 text-lg font-semibold">
      {{ proposal.title }}
    </div>

    <div class="mt-3 text-base text-gray-400">
      <div
        v-html="proposal.description"
        class="h-12 overflow-hidden break-word"
      ></div>
    </div>

    <div class="mt-3">
      <VotingResultPreview
        :community="community"
        :proposal="proposal"
        :winners="winnersVoted"
      />
    </div>

    <div class="flex items-center mt-3">
      <proposal-status-badge v-if="community && proposal"
                             :community="community"
                             :proposal="proposal" />

      <template v-if="proposalStatus(proposal) != ProposalStatus.PENDING">
        <div v-if="proposalStatus(proposal) == ProposalStatus.ACTIVE"
             class="flex items-center mr-4">
          <img src="/img/timer_purple.svg"
               class="w-4" />
          <span class="text-sm text-gray-400 font-medium ml-2">{{ getLeftDays(proposal) }} days left</span>
        </div>
        <div class="flex items-center">
          <img src="/img/users.png"
               class="w-5" />
          <span class="text-sm text-gray-400 font-medium ml-2 mt-1">
            {{ voteCount }}
          </span>
        </div>
      </template>

      <template v-if="proposalStatus(proposal) == ProposalStatus.PENDING && isAdmin">
        <div class="ml-auto flex flex-col md:flex-row">
          <button @click="decline"
                  type="button"
                  class="w-28 inline-flex justify-center items-center px-6 py-1.5 text-md font-medium rounded text-purple-700 border border-purple-500 m-1">
            Decline
          </button>
          <button @click="approve"
                  type="button"
                  class="w-28 inline-flex justify-center items-center px-6 py-1.5 bg-purple-600 hover:bg-purple-700 text-md font-medium rounded text-white m-1">
            Approve
          </button>
        </div>
      </template>

      <template v-if="proposalStatus(proposal) == ProposalStatus.EXPIRED && isAuthor">
        <div class="ml-auto flex flex-col md:flex-row">
          <button @click="showExtendModal"
                  type="button"
                  class="inline-flex justify-center items-center px-2 py-1 text-md font-medium rounded text-purple-700 border border-purple-500 m-1">
            Extend period
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { formatDate } from '@bloks/numbers'
import { useToast } from 'vue-toastification'
import { useVoteStore } from '@/stores/vote'
import { useUserStore } from '@/stores/user'
import { useProposalStore } from '@/stores/proposal'
import { Proposal, Community, ProposalStatus } from '@/types'
import ProposalStatusBadge from '@/components/proposal/ProposalStatusBadge.vue'
import { getProposalStatus } from '@/helpers/proposal'
import { useModal } from '@/components/modals/useModal'
import { GOV_CONTRACT } from '@/constants'
import VotingResultPreview from '@/components/votes/VotingResultPreview.vue'

type Props = {
  community: Community
  proposal: Proposal;
}

const props = defineProps<Props>()

const emit = defineEmits(['updated'])
const voteStore = useVoteStore()
const userStore = useUserStore()
const proposalStore = useProposalStore()
const toast = useToast()
const extendProposalPeriodModal = useModal('extend-proposal-period')

const voteCount = ref<number>(0)
const winnersVoted = ref([] as number[])

onMounted(async () => {
  voteCount.value = await voteStore.fetchVoteCount(props.proposal._id!)
  if (userStore.actor) {
    const votes = await voteStore.fetchByVoter(userStore.actor, props.proposal!._id!)
    if (votes.length) {
      winnersVoted.value = votes[0].winners.map(_ => _.id)
    }
  }
})

const isAdmin = computed(() => {
  return (userStore.actor && props.community?.admins.includes(userStore.actor)) ? true : false
})

const isAuthor = computed(() => {
  return (userStore.actor && props.proposal?.author === userStore.actor) ? true : false
})

const proposalStatus = (pp: Proposal) => {
  if (!props.community || !props.proposal) {
    return ''
  }
  const currentQ = props.proposal.quorum || 0
  return getProposalStatus(pp, currentQ >= props.community.quorum / 100)
}

const getLeftDays = (pp: Proposal) => {
  const now = new Date().getTime() / 1000
  const left = pp.endTime - now
  return Math.ceil(left / 86400)
}

async function updateProposal(endTime: number, approve: ProposalStatus): Promise<boolean> {
  const actions: any[] = [
    {
      account: GOV_CONTRACT,
      name: 'updateprop',
      data: {
        id: props.proposal.sid,
        author: props.proposal.author,
        endTime,
        approve,
      }
    }
  ]
  const success = await userStore.transact({
    actions,
    broadcast: true
  })
  if (success) {
    return true
  } else {
    return false
  }
}

const extend = async (newTime: string): Promise<void> => {
  try {
    const ret = await updateProposal(Number(newTime), props.proposal.approve)
    if (ret) {
      await proposalStore.updateProposal(props.proposal!._id!, { endTime: Number(newTime) })
      toast.success('Success!')
    }
  } catch (err) {
    toast.error(`Error: ${err}`)
  }
}

const showExtendModal = (event: Event): void => {
  event.stopPropagation()
  extendProposalPeriodModal.show({
    endTime: props.proposal ? new Date(props.proposal.endTime * 1000) : new Date(),
    confirm: extend,
  })
}

async function decline(event: Event): Promise<void> {
  event.stopPropagation()
  const proposalStore = useProposalStore()
  const ret = await updateProposal(props.proposal.endTime, ProposalStatus.DECLINED)
  if (ret) {
    await proposalStore.updateProposal(props.proposal._id!, { approve: ProposalStatus.DECLINED })
    emit('updated')
  }
}

async function approve(event: Event): Promise<void> {
  event.stopPropagation()
  const proposalStore = useProposalStore()
  const ret = await updateProposal(props.proposal.endTime, ProposalStatus.APPROVED)
  if (ret) {
    await proposalStore.updateProposal(props.proposal._id!, { approve: ProposalStatus.APPROVED })
    emit('updated')
  }
}
</script>

<style scoped>
.line-clamp {
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

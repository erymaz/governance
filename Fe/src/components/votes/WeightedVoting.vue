<template>
  <div class="">
    <div class="text-2xl font-medium mb-4">
      <p>Cast your vote</p>
    </div>

    <div v-for="option of options"
         :key="option.id"
         class="relative flex border border-gray-200 hover:border-gray-800 my-2 rounded-full">
      <div class="px-4 md:px-6 text-gray-900 py-2 truncate">{{ option.name }}</div>
      <div class="flex ml-auto cursor-pointer">
        <div @click="selectOption(option.id, false)"
             class="border-0 border-l px-4 py-2">-</div>
        <div class="w-10 text-center border-0 border-l py-2"> {{ option.weight }} </div>
        <div @click="selectOption(option.id, true)"
             class="border-0 border-l px-4 py-2">+</div>
        <div class="w-20 text-center border-0 border-l py-2">{{ option.percent }}%</div>
      </div>
    </div>

    <div v-if="!isEndedProposal"
         class="flex justify-start mt-6">
      <button @click="confirm"
              :disabled="!canVote"
              type="button"
              class="inline-flex justify-center items-center py-2 text-md font-medium rounded-full w-full"
              :class="!canVote ? 'bg-gray-200 text-gray-400' : 'bg-purple-600 text-white'">
        <span v-if="!actor">Login</span>
        <span v-else-if="isVoted">Change Vote</span>
        <span v-else-if="!isStarted">Not started yet</span>
        <span v-else>Vote</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { Proposal, Winner, Community, ProposalStatus } from '@/types'
import { useVoteStore } from '@/stores/vote'
import { useUserStore } from '@/stores/user'
import { getProposalStatus } from '@/helpers/proposal'
import { calculatePercentage } from '@bloks/numbers'

const emit = defineEmits(['selected'])

interface Props {
  community: Community,
  proposal: Proposal;
}

// props
const props = defineProps<Props>();

// State
const options = ref(props.proposal.candidates.map(_ => ({
  ..._,
  weight: 0,
  percent: 0,
})))
const isVoted = ref(false);

const voteStore = useVoteStore()
const userStore = useUserStore()

onMounted(() => checkVote())

const actor = computed(() => userStore.actor)

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

const isStarted = computed(() => {
  if (!props.proposal) {
    return false
  }
  const now = new Date().getTime()
  return now > props.proposal.startTime * 1000
})

const canVote = computed(() => {
  if (!props.proposal) {
    return false
  }

  let hasWeight = false
  options.value.forEach(_ => {
    if (_.weight > 0) {
      hasWeight = true;
    }
  })
  if (!hasWeight) {
    return false
  }

  if (props.proposal.approve !== ProposalStatus.APPROVED) {
    return false
  }

  const now = new Date().getTime()
  if (now < props.proposal.startTime * 1000 || now > props.proposal.endTime * 1000) {
    return false
  }
  return true
})

watch(() => userStore.actor, () => checkVote())

const calcPercent = () => {
  let totalWeight = 0
  options.value.forEach(_ => {
    totalWeight += _.weight
  })

  if (totalWeight !== 0) {
    options.value = options.value.map(_ => {
      return {
        ..._,
        percent: Math.round(_.weight * 100 / totalWeight),
      }
    })

    // Total percent should be 100
    let totalPercent = 0;
    options.value.forEach(_ => {
      totalPercent += _.percent
    })
    if (totalPercent !== 100) {
      const left = totalPercent - 100;
      for (const option of options.value) {
        if (option.percent > 0) {
          option.percent -= left;
          break;
        }
      }
    }
  } else {
    options.value = options.value.map(_ => {
      return {
        ..._,
        percent: 0,
      }
    })
  }
}

const selectOption = (id: number, op: boolean): void => {
  options.value = options.value.map(_ => {
    if (_.id === id) {
      if (op) {
        _.weight += 1
      } else if (_.weight > 0) {
        _.weight -= 1
      }
      return _
    } else {
      return _
    }
  })

  calcPercent();
}

const checkVote = async (): Promise<void> => {
  if (userStore.actor) {
    const votes = await voteStore.fetchByVoter(userStore.actor, props.proposal!._id!)
    if (votes.length) {
      isVoted.value = true
    } else {
      isVoted.value = false
    }
  }
}

const confirm = () => {
  if (!userStore.actor) {
    userStore.login()
    return
  }

  const winners: Winner[] = []
  options.value.forEach(_ => {
    const find = props.proposal.candidates.find(cd => cd.id === _.id)
    if (find) {
      winners.push({
        id: _.id,
        weight: _.percent,
      })
    }
  })

  voteStore.community = props.community
  voteStore.proposal = props.proposal
  voteStore.winners = winners

  emit('selected')
  options.value.forEach(_ => _.weight = 0)
}
</script>

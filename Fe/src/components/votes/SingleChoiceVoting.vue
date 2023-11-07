<template>
  <div class="">
    <div class="text-2xl font-medium">
      <p>Cast your vote</p>
    </div>

    <div
      v-for="option of proposal.candidates"
      :key="option.id"
      class="flex items-start mt-4"
    >
      <div class="flex items-center mr-3">
        <input
          @change="selectOption(option)"
          :checked="isSelected(option)"
          aria-describedby="comments-description"
          name="comments"
          :id="'vote-option-'+option.id"
          type="radio"
          class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded-full"
        />
      </div>
      <div class="text-sm flex-1">
        <label :for="'vote-option-'+option.id" class="font-medium">{{ option.name }}</label>
      </div>
    </div>

    <div v-if="!isEndedProposal" class="flex justify-start mt-8">
      <button
        @click="confirm"
        :disabled="!canVote || isSameOption"
        type="button"
        class="inline-flex justify-center items-center py-1.5 text-md font-medium rounded w-full sm:w-48"
        :class="!canVote || isSameOption ? 'bg-gray-200 text-gray-400' : 'bg-purple-600 text-white'"
      >
        <span v-if="!actor">Login</span>
        <span v-else-if="isVoted && !isSameOption">Change Vote</span>
        <span v-else-if="isVoted && isSameOption">Voted</span>
        <span v-else-if="!isStarted">Not started yet</span>
        <span v-else>Vote</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { Proposal, Candidate, Winner, Community, ProposalStatus } from '@/types'
import { useVoteStore } from '@/stores/vote'
import { useUserStore } from '@/stores/user'
import { getProposalStatus } from '@/helpers/proposal'

const emit = defineEmits(['selected'])

interface Props {
  community: Community,
  proposal: Proposal;
}

// props
const props = defineProps<Props>();

// State
const selectedOptions = ref([] as number[])
const isVoted = ref(false);
const winnersVoted = ref([] as number[])

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
  return now > props.proposal.startTime*1000
})

const canVote = computed(() => {
  if (!props.proposal || !selectedOptions.value.length) {
    return false
  }
  if (props.proposal.approve !== ProposalStatus.APPROVED) {
    return false
  }
  const now = new Date().getTime()
  if (now < props.proposal.startTime*1000 || now > props.proposal.endTime*1000) {
    return false
  }
  return true
})

const isSameOption = computed(() => {
  if (isVoted.value && winnersVoted.value.length) {
    if (selectedOptions.value[0] === winnersVoted.value[0]) {
      return true
    }
  }
  return false
})

watch(() => userStore.actor, () => checkVote())

const selectOption = (option: Candidate): void => {
  if (selectedOptions.value[0] == option.id) {
    selectedOptions.value = []
  } else {
    selectedOptions.value = []
    selectedOptions.value.push(option.id)
  }
}

const isSelected = (option: Candidate): boolean => {
  return selectedOptions.value.includes(option.id)
}

const checkVote = async(): Promise<void> => {
  if (userStore.actor) {
    const votes = await voteStore.fetchByVoter(userStore.actor, props.proposal!._id!)
    if (votes.length) {
      winnersVoted.value = votes[0].winners.map((_: Winner) => _.id)
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
  selectedOptions.value.forEach(_ => {
    const find = props.proposal.candidates.find(cd => cd.id === _)
    if (find) {
      winners.push({
        id: _,
        weight: 100,
      })
    }
  })
  voteStore.community = props.community
  voteStore.proposal = props.proposal
  voteStore.winners = winners

  emit('selected')
  selectedOptions.value = []
}
</script>

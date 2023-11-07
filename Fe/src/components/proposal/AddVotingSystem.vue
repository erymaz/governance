<template>
  <div class="w-full">
    <div class="mt-6 sm:mt-14 text-lg font-medium">Select Strategy</div>
    <div class="mt-3">
      <div
        v-for="strategy of props.community.strategies"
        @click="selectedStrategy=strategy"
        :key="strategy"
        class="relative border border-purple-200 px-4 py-2 my-1 rounded-lg text-center cursor-pointer"
        :class="{'border-purple-600' : selectedStrategy == strategy}"
      >
        <CheckIcon
          v-if="selectedStrategy == strategy"
          class="absolute left-4 top-1.5 w-8 h-8 text-purple-600"
        />
        <span class="text-gray-900">{{ strategy }} &nbsp;</span>
        <span class="text-sm">v{{ getStrategy(strategy).version }}</span>
      </div>
    </div>

    <div class="mt-6 sm:mt-14 text-lg font-medium">Select Voting System</div>
    <div class="mt-3">
      <div
        v-for="system of availableVotingSystems"
        @click="selectVotingSystem(system)"
        :key="system.id"
        class="relative border border-purple-200 px-4 py-2 my-1 rounded-lg text-center cursor-pointer"
        :class="{'border-purple-600' : selectedVotingSystem == system.id, 'bg-gray-200 hidden': !system.active}"
      >
        <CheckIcon
          v-if="selectedVotingSystem == system.id"
          class="absolute left-4 top-1.5 w-8 h-8 text-purple-600"
        />
        <span class="text-gray-900">{{ system.name }}</span>
      </div>
    </div>

    <div class="mt-6 sm:mt-10 text-lg font-medium">Voting Options</div>
    <SingleChoiceVotingOptions
      v-if="selectedVotingSystem!=votingSystemId.APPROVAL_VOTING"
      v-model="votingOptions"
      :votingSystem="selectedVotingSystem"
    />
    <ApprovalVotingOptions
      v-if="selectedVotingSystem==votingSystemId.APPROVAL_VOTING"
      v-model="votingOptions"
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="w-full mt-6 sm:mt-10">
        <div class="text-lg font-medium">Start Date</div>
        <Datepicker v-model="startTime" :clearable="false" :minDate="new Date()"></Datepicker>
      </div>
      <div class="w-full mt-6 sm:mt-10">
        <div class="flex items-center">
          <div class="text-lg font-medium mr-1 whitespace-nowrap">
            End Date
          </div>
          <div class="w-full group flex relative">
            <InformationCircleIcon class="w-8 h-6 sm:w-5 sm:h-5 text-purple-600" />
            <span class="group-hover:opacity-100 transition-opacity bg-black px-1 text-sm text-white rounded absolute left-0 -top-8 opacity-0 px-2 py-1">
              Maximun proposal period: 3 months
            </span>
          </div>
        </div>
        <Datepicker v-model="endTime" :clearable="false" :minDate="startTime"></Datepicker>
      </div>
    </div>

    <div class="flex justify-end mt-8">
      <button
        @click="confirm"
        :disabled="!canPublish"
        type="button"
        class="inline-flex justify-center items-center px-8 py-1.5 border border-transparent text-md font-medium rounded shadow-sm text-white"
        :class="canPublish ? 'bg-purple-600' : 'bg-gray-200'"
      >
        Publish
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { CheckIcon, InformationCircleIcon } from '@heroicons/vue/solid'
import { useUserStore } from '@/stores/user'
import { useProposalStore } from '@/stores/proposal'
import { useStrategyStore } from '@/stores/strategy'
import { Candidate, VotingSystem, votingSystemId, Strategy, Community } from "@/types"
import Datepicker from '@vuepic/vue-datepicker'
import { GOV_CONTRACT } from '@/constants'
import { votingSystems } from '@/helpers'
import { useModal } from '@/components/modals/useModal'
import SingleChoiceVotingOptions from '@/components/proposal/SingleChoiceVotingOptions.vue'
import ApprovalVotingOptions from '@/components/proposal/ApprovalVotingOptions.vue'

import '@vuepic/vue-datepicker/dist/main.css'

interface Props {
  community: Community;
}

// props
const props = defineProps<Props>()

const userStore = useUserStore()
const proposalStore = useProposalStore()
const strategyStore = useStrategyStore()
const proposalConfirmModal = useModal('proposal-confirm')
const toast = useToast()

const emit = defineEmits(['created', 'failed'])

// state
const selectedVotingSystem = ref(votingSystemId.SINGLE_CHOICE_VOTING)
const selectedStrategy = ref(props.community.strategies[0])
const votingOptions = ref([] as string[])
const startTime = ref(new Date())
const endTime = ref(new Date())

onMounted(async () => {
  try {
    userStore.setLoading(true)
    await strategyStore.fetchStrategies()
  } catch (err) {
    console.log(err)
  }
  userStore.setLoading(false)
})

const canPublish = computed(() => {
  if (votingOptions.value.length > 1) {
    return true
  } else {
    return false
  }
})

const availableVotingSystems = computed(() => {
  return votingSystems.filter(_ => props.community.votingSystems.includes(_.id))
})

// actions
const getStrategy = (name: string): Strategy => {
  return strategyStore.strategies[name]
}

const selectVotingSystem = (system: VotingSystem): void => {
  if (!system.active) {
    return
  }
  if(selectedVotingSystem.value !== system.id) {
    selectedVotingSystem.value = system.id
    votingOptions.value = []
    if (selectedVotingSystem.value === votingSystemId.APPROVAL_VOTING) {
      votingOptions.value.push("None of the above")
    } else if (selectedVotingSystem.value === votingSystemId.BASIC_VOTING) {
      votingOptions.value.push("Yes")
      votingOptions.value.push("No")
    }
  }
}

const confirm = (): void => {
  const _startTime = startTime.value.getTime()
  const _endTime = endTime.value.getTime()
  const diff = (_endTime - _startTime) / 3600000
  const maxPeriod = 2208      // Maximum 3 months
  if (diff <  props.community.minProposalTime || diff > maxPeriod) {
    toast.warning('Invalid proposal time')
    return
  }

  proposalConfirmModal.show({
    fee: props.community.proposalFee.quantity,
    publish: handlePublish,
  })
}

const handlePublish = async(): Promise<void> => {
  if (!proposalStore.newProposal) {
    return
  }

  const candidates: Candidate[] = votingOptions.value.map((_, id) => ({
    id,
    name: _,
    tokenAmount: 0,
  }))
  proposalStore.newProposal.strategy = selectedStrategy.value
  proposalStore.newProposal.votingSystem = selectedVotingSystem.value
  proposalStore.newProposal.candidates = candidates
  proposalStore.newProposal.startTime = Math.floor(startTime.value.getTime() / 1000)
  proposalStore.newProposal.endTime = Math.floor(endTime.value.getTime() / 1000)

  const newProposal = await proposalStore.createProposal(proposalStore.newProposal)
  if (!newProposal) {
    // Something went wrong
    return
  }

  // Create proposal on-chain
  const actions: any[] = [
    {
      account: props.community.proposalFee.contract,
      name: 'transfer',
      data: {
        from: userStore.actor,
        to: GOV_CONTRACT,
        quantity: props.community.proposalFee.quantity,
        memo: 'deposit to create a proposal'
      }
    },
    {
      account: GOV_CONTRACT,
      name: 'postprop',
      data: {
        author: proposalStore.newProposal.author,
        communityId: proposalStore.newProposal.communityId,
        content: newProposal._id!,
        strategy: proposalStore.newProposal.strategy,
        votingSystem: proposalStore.newProposal.votingSystem,
        candidates: proposalStore.newProposal.candidates,
        startTime: proposalStore.newProposal.startTime,
        endTime: proposalStore.newProposal.endTime,
        approve: proposalStore.newProposal.approve,
      }
    }
  ]
  const success = await userStore.transact({
    actions,
    broadcast: true
  })

  if (success) {
    await proposalStore.updateProposal(newProposal._id!, {confirmed: true})
    toast.success('Success!')
    emit('created')
  } else {
    proposalStore.deleteProposal(newProposal._id!)
    toast.error(`Error: ${userStore.error}`)
    emit('failed')
  }

  proposalStore.newProposal = null
}
</script>

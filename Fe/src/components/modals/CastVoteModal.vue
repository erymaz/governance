<template>
  <vue-final-modal :name="modalName"
                   classes="flex justify-center items-center"
                   content-class="w-full max-w-md flex flex-col mx-1 p-1 border-solid border-1 bg-white rounded-lg"
                   v-model="showModal"
                   @beforeOpen="beforeOpen">
    <div class="h-14 grid grid-cols-header text-right font-bold">
      <span />
      <div class="self-center text-center text-gray-900 text-xl">Cast your vote</div>
      <img src="/img/close.svg"
           class="close-icon"
           @click="hide" />
    </div>

    <div class="p-6 overflow-y-auto scrollbar-hide">
      <div v-if="strategy"
           class="grid grid-cols-2 mb-6">
        <div class="text-gray-400 mr-4">Choice</div>
        <div class="w-full text-right text-gray-900 font-semibold truncate"> {{ choices }} </div>

        <template v-if="!isLoading">
          <div class="text-gray-400">Your voting power</div>
          <div class="text-right text-gray-900 font-semibold"> {{ displayNumberAsAmount(votingPower,
            strategy.tokens[0].decimals) }} {{ strategy.tokens[0].currency }} </div>
        </template>
        <div v-else
             class="col-span-2">
          <div style="border-top-color:transparent"
               class="w-5 h-5 mt-3 border-4 mx-auto border-blue-400 border-solid rounded-full animate-spin"></div>
        </div>
      </div>

      <div v-if="!isLoading && !canVote"
           class="flex items-start mt-4 sm:mt-8 text-gray-600 border border-gray-200 rounded-lg p-4">
        <InformationCircleIcon class="w-8 h-6 sm:w-5 sm:h-5 text-purple-600" />
        <span class="ml-2">Oops, it seems you don't have any voting power</span>
      </div>

      <div class="grid grid-cols-2 gap-8 mt-8">
        <button @click="hide"
                class="inline-flex justify-center items-center py-1.5 mx-auto text-md font-medium rounded w-full border border-purple-600">
          Cancel
        </button>
        <button @click="confirm"
                :disabled="!canVote"
                class="inline-flex justify-center items-center py-1.5 mx-auto text-md font-medium rounded w-full"
                :class="(!canVote || isLoading) ? 'bg-gray-200 text-gray-400' : 'bg-purple-600 text-white'">
          Confirm
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { InformationCircleIcon } from '@heroicons/vue/solid'
import { displayNumberAsAmount } from '@bloks/numbers'
import { useModal } from './useModal'
import { Vote } from '@/types'
import { useUserStore } from '@/stores/user'
import { useVoteStore } from '@/stores/vote'
import { useToast } from 'vue-toastification'
import { useStrategyStore } from '@/stores/strategy'
import { GOV_CONTRACT } from '@/constants'
import { useRouter } from 'vue-router'

const router = useRouter()

const { modalName, showModal, hide } = useModal('cast-vote')
const userStore = useUserStore()
const voteStore = useVoteStore()
const strategyStore = useStrategyStore()
const toast = useToast()


const isLoading = ref(false)
const votingPower = ref(0)

const canVote = computed(() => votingPower.value > 0)

const choices = computed((): string => {
  const choices: string[] = []
  voteStore.winners.forEach(_ => {
    const find = voteStore.proposal!.candidates.find(cd => cd.id === _.id)
    if (find && _.weight > 0) {
      choices.push(find.name)
    }
  })
  return choices.join(', ')
})

const strategy = computed(() => {
  if (!voteStore.proposal) {
    return
  }
  return strategyStore.findStrategy(voteStore.proposal.strategy)
})

const beforeOpen = () => {
  votingPower.value = 0
  getVotingPower()
}

const getVotingPower = async () => {
  if (!voteStore.community || !voteStore.proposal || !voteStore.winners.length) {
    toast.error('Something went wrong!')
    hide()
    return
  }
  isLoading.value = true
  votingPower.value = await voteStore.fetchVotingPower(userStore.actor!, voteStore.proposal.strategy)
  isLoading.value = false
}

const confirm = async (): Promise<void> => {
  hide()

  if (!voteStore.community || !voteStore.proposal || !voteStore.winners.length) {
    toast.error('Something went wrong!')
    return
  }

  const actions: any[] = [
    {
      account: GOV_CONTRACT,
      name: 'vote',
      data: {
        voter: userStore.actor,
        communityId: voteStore.community.id,
        proposalId: voteStore.proposal.sid,
        winners: voteStore.winners,
      }
    }
  ]

  try {
    const success = await userStore.transact({
      actions,
      broadcast: true
    })

    if (!success) {
      toast.error(`Error: ${userStore.error}`)
      return
    }

    // Need to get the voting power
    const payload: Vote = {
      voter: userStore.actor!,
      communityId: voteStore.community.id,
      proposalId: voteStore.proposal._id!,
      winners: voteStore.winners.map(_ => ({
        ..._,
        tokenAmount: votingPower.value * _.weight / 100
      })),
      tokenAmount: votingPower.value,
      timestamp: Math.floor(new Date().getTime() / 1000),
    }
    await voteStore.createVote(payload)
    toast.success('Success!')
    router.push(`/communities/${voteStore.community.id}`)

    // Init
    voteStore.community = null
    voteStore.proposal = null
    voteStore.winners = []
  } catch (err) {
    console.error(err)
  }
}

</script>

<style scoped>
.close-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  align-self: center;
  justify-self: center;
  cursor: pointer;
}
</style>

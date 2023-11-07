<template>
  <div class="w-full">
    <!-- TODO What about moving this information closer to button and show it only if actor doesn't have enough tokens -->
    <div class="flex items-start sm:items-center mt-4 sm:mt-8 text-gray-600 border border-gray-200 rounded-lg p-4">
      <InformationCircleIcon class="w-8 h-6 sm:w-5 sm:h-5 text-purple-600" />
      <span class="ml-2">You will be charged {{ getFormattedQuantity(props.community.proposalFee.quantity) }} in order to submit a proposal.</span>
    </div>

    <div class="mt-6 sm:mt-10 text-lg font-medium">Title</div>
    <input v-model="title"
           type="text"
           name="proposal-title"
           id="search-daos"
           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md mt-3" />

    <div class="flex justify-between items-end mt-6 sm:mt-10  mb-3">
      <div class="text-lg font-medium">Description (optional)</div>
      <!-- <div class="text-md text-gray-400">0 / 14,400</div> -->
    </div>
    <Tiptap v-model="content" />

    <!-- <div class="mt-6 sm:mt-10 text-lg font-medium">More info (optional)</div>
    <input v-model="discussion"
           type="text"
           name="proposal-discussion"
           id="search-daos"
           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md mt-3"
           placeholder="e.g. https://www.protonmarket.com/" /> -->

    <div v-if="guideline"
        class="flex flex-wrap items-center text-base mt-8">
      <label class="flex items-center mr-1">
        <div class="flex items-center mr-3">
          <input v-model="confirmGuideline"
                :checked="confirmGuideline"
                aria-describedby="confirm-guideline"
                type="checkbox"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
        </div>
        <span class="flex-1">
          I have read the 
        </span>
      </label>
      <a :href="guideline"
          target="_blank"
          class="underline">
        Community Guidelines
      </a>
    </div>

    <div class="mt-8">
      <button @click="handleNext"
              type="button"
              :disabled="!canNext && Boolean(actor)"
              class="inline-flex justify-center items-center px-8 py-1.5 border border-transparent text-md font-medium rounded shadow-sm text-white focus:ring-2 focus:ring-offset-1 focus:ring-purple-500"
              :class="canNext || !actor ? 'bg-purple-600' : 'bg-gray-200'">
        <span v-if="!actor">Login</span>
        <span v-else>Continue</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { displayNumberAsAmount } from '@bloks/numbers'
import { InformationCircleIcon } from '@heroicons/vue/solid'
import { useUserStore } from '@/stores/user'
import { useProposalStore } from '@/stores/proposal'
import Tiptap from '@/components/editor/Tiptap.vue'
import { Community, Proposal, Token, votingSystemId, ProposalStatus } from '@/types'

interface Props {
  community: Community;
}

// props
const props = defineProps<Props>()

const route = useRoute()
const userStore = useUserStore()
const proposalStore = useProposalStore()
const emit = defineEmits(['next'])

const title = ref('')
const content = ref('')
const discussion = ref('')
const confirmGuideline = ref(props.community.guideline ? false : true);

const canNext = computed(() => {
  if (!userStore.actor) {
    return false
  }
  // Check if user input title
  if (title.value == '') {
    return false
  }
  // Check user confirmed community guideline
  if (!confirmGuideline.value) {
    return false
  }
  // Check if user have required tokens
  const { quantity, contract } = props.community.proposalFee
  const symbolArr = quantity.split(' ')
  const decimals = symbolArr[0].split('.')[1].length
  const amount = Number(symbolArr[0])
  const governanceToken = userStore.tokens.find((_: Token) => _.contract == contract && _.currency == symbolArr[1] && _.decimals == decimals)
  if (!governanceToken || governanceToken.amount < amount) {
    return false
  }
  return true
})

const actor = computed(() => userStore.actor)

const guideline = computed(() => props.community.guideline)

const getFormattedQuantity = (quantity: string): string => {
  if (!quantity) {
    return ''
  }
  const quantityArr = quantity.split(' ')
  const precision = Number(quantityArr[0].split('.')[1].length) || 4
  const value = Number(quantityArr[0])
  const symbol = quantityArr[1]
  return `${displayNumberAsAmount(value, precision, true)} ${symbol}`
}

const handleNext = () => {
  if (!userStore.actor) {
    userStore.login()
    return
  }
  const proposal: Proposal = {
    author: userStore.actor!,
    communityId: +route.params.communityId,
    title: title.value,
    description: content.value,
    discussion: discussion.value,
    strategy: '',
    votingSystem: votingSystemId.SINGLE_CHOICE_VOTING,
    candidates: [],
    tokenAmount: 0,
    startTime: Math.floor(new Date().getTime() / 1000),
    endTime: Math.floor(new Date().getTime() / 1000),
    confirmed: false,
    approve: props.community.approvingProposal ? ProposalStatus.PENDING : ProposalStatus.APPROVED,
  }
  proposalStore.newProposal = proposal
  emit('next')
}
</script>

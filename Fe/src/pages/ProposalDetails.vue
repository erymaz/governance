<template>
  <div class="proposal-details">
    <template v-if="!isLoading">
      <div v-if="proposal" class="flex flex-col md:flex-row my-4">
        <div class="flex-1">
          <button
            @click="$router.push(`/communities/${$route.params.communityId}`)"
            type="button"
            class="inline-flex items-center mb-4 md:mb-8 text-base font-semibold"
          >
            <ArrowLeftIcon class="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Back
          </button>

          <div class="text-2xl md:text-4xl leading-snug font-semibold">{{ proposal.title }}</div>

          <div class="flex flex-wrap items-center mt-6">
            <proposal-status-badge
              v-if="community && proposal"
              :community="community"
              :proposal="proposal"
            />
            <div class="mr-4 whitespace-nowrap">
              <span class="text-sm text-gray-400 mr-2">Created by</span>
              <span>{{ proposal.author }}</span>
            </div>
          </div>

          <div class="text-2xl font-medium mt-8 sm:mt-10">Description</div>
          <div class="mt-2 text-gray-600 break-words md:break-normal">
            <span v-html="proposal.description" class="proposal-description"></span>
          </div>

          <div v-if="community"
              class="md:hidden w-full mt-8">
            <ProposalInfos :proposal="proposal" />

            <VotingResult
              :community="community"
              :proposal="proposal"
            />
          </div>

          <div class="mt-8 md:mt-10" v-if="community">
            <WeightedVoting
              v-if="proposal.votingSystem == votingSystemId.WEIGHTED_VOTING"
              :community="community"
              :proposal="proposal"
              @selected="openVoteModal"
            />
            <ApprovalVoting
              v-else-if="proposal.votingSystem == votingSystemId.APPROVAL_VOTING"
              :community="community"
              :proposal="proposal"
              @selected="openVoteModal"
            />
            <SingleChoiceVoting
              v-else
              :community="community"
              :proposal="proposal"
              @selected="openVoteModal"
            />
          </div>

          <p class="text-2xl font-medium mt-8 md:mt-12">Votes ({{ total }})</p>
          <VoteList
            v-if="community && proposal"
            :community="community"
            :proposal="proposal"
          />

          <p class="text-2xl font-medium mt-8 md:mt-12">Discussion</p>
          <div class="mt-2">
            <CommentList :proposalId="proposalId" />
          </div>

          <template v-if="!isEndedProposal">
            <Tiptap v-model="newComment" class="mt-10" />
            <div class="flex justify-center mt-6">
              <button
                @click="addComment"
                :disabled="!canComment"
                type="button"
                class="inline-flex justify-center items-center px-8 py-1.5 border border-transparent text-md font-medium rounded shadow-sm text-white focus:ring-2 focus:ring-offset-1 focus:ring-purple-500"
                :class="canComment ? 'bg-purple-800' : 'bg-gray-200'"
              >
                <span v-if="!actor">Login</span>
                <span v-else>Reply</span>
              </button>
            </div>
          </template>
        </div>

        <div v-if="community"
            class="hidden md:block w-full md:max-w-xs pt-9 md:pt-16 sm:pl-6">
          <ProposalInfos :proposal="proposal" />

          <VotingResult
            :community="community"
            :proposal="proposal"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <ListLoader></ListLoader>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { ListLoader } from 'vue-content-loader'
import { ArrowLeftIcon } from '@heroicons/vue/solid'
import { useProposalStore } from '@/stores/proposal'
import { useStrategyStore } from '@/stores/strategy'
import { useVoteStore } from '@/stores/vote'
import { useUserStore } from '@/stores/user'
import { useCommentStore } from '@/stores/comment'
import Tiptap from '@/components/editor/Tiptap.vue'
import ProposalStatusBadge from '@/components/proposal/ProposalStatusBadge.vue'
import ProposalInfos from '@/components/proposal/ProposalInfos.vue'
import VotingResult from '@/components/votes/VotingResult.vue'
import SingleChoiceVoting from '@/components/votes/SingleChoiceVoting.vue'
import ApprovalVoting from '@/components/votes/ApprovalVoting.vue'
import WeightedVoting from '@/components/votes/WeightedVoting.vue'
import CommentList from '@/components/comment/CommentList.vue'
import VoteList from '@/components/votes/VoteList.vue'
import { votingSystemId, Comment, Community, Proposal, ProposalStatus } from '@/types'
import { useCommunityStore } from '@/stores/community'
import { useModal } from '@/components/modals/useModal'
import { getProposalStatus } from '@/helpers/proposal'

const route = useRoute()
const communityStore = useCommunityStore()
const proposalStore = useProposalStore()
const strategyStore = useStrategyStore()
const voteStore = useVoteStore()
const userStore = useUserStore()
const commentStore = useCommentStore()
const toast = useToast()
const castVoteModal = useModal('cast-vote')

const newComment = ref('')
const community = ref(null as null | Community)
const proposal = ref(null as null | Proposal)
const proposalId = ref(route.params.proposalId as string)
const isLoading = ref(false)

onMounted(async () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  isLoading.value = true
  try {
    const [comm, prop, _] = await Promise.all([
      communityStore.fetchCommunity(+route.params.communityId),
      proposalStore.fetchProposal(proposalId.value),
      strategyStore.fetchStrategies(),
    ])
    community.value = comm
    proposal.value = prop
    isLoading.value = false
  } catch(err) {
    console.log(err)
    isLoading.value = false
  }
})

const actor = computed(() => userStore.actor)

const isEndedProposal = computed(() => {
  if (!proposal.value) {
    return true
  }

  const status = getProposalStatus(proposal.value)
  if (status === ProposalStatus.EXPIRED || status == ProposalStatus.CLOSED) {
    return true
  }

  return false
})

const isJoined = computed(() => {
  if (!userStore.actor) {
    return false
  }
  const user = communityStore.getUser(userStore.actor)
  if (!community.value || !user) {
    return false
  }
  return user.communities.includes(community.value.id)
})

const canComment = computed(() => {
  const txt = newComment.value.replace( /(<([^>]+)>)/ig, '')
  return isJoined.value && txt != ''
})

const total = computed(() => {
  return voteStore.total
})

const openVoteModal = (): void => {
  castVoteModal.show()
}

const addComment = async (): Promise<void> => {
  if (!userStore.actor) {
    userStore.login()
    return
  }

  const data: Comment = {
    author: userStore.actor,
    content: newComment.value,
    communityId: +route.params.communityId,
    proposalId: proposalId.value,
  }
  const success = await commentStore.createComment(data)
  if (success) {
    newComment.value = ''
    await commentStore.fetchComments(proposalId.value, 1)
  } else {
    toast.error(`Error: ${userStore.error}`)
  }
}
</script>

<style>
.proposal-details {
  max-width: 1160px;
  width: 100%;
  padding: 10px 15px;
  color: #1A1A1A;
}

.proposal-details a {
  color: #68CEF8;
}

.proposal-description p {
  min-height: 24px;
}
</style>

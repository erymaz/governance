import { defineStore } from 'pinia'
import $http from '@/api/service'
import { Community, Proposal, Vote, Winner, PaginationData } from '../types'
// import { proton } from '../api/proton'
// import { GOV_CONTRACT } from '../constants'

const getDefaultState = () => ({
  votes: [] as Vote[],
  community: null as null | Community,
  proposal: null as null | Proposal,
  winners: [] as Winner[],
  total: 0,
})

export const useVoteStore = defineStore({
  id: 'vote',
  state: () => getDefaultState(),

  actions: {
    async fetchAllVotes(proposalId: string, page: number): Promise<Vote[]> {
      this.votes = []
      const pageLength = 10
      const response = await $http.get<PaginationData>(`/votes?proposalId=${proposalId}&page=${page}&pageLength=${pageLength}`)
      this.votes = response.data.list
      this.total = response.data.total
      return this.votes
    },

    async createVote(payload: Vote): Promise<boolean> {
      try {
        await $http.post('/votes', payload)
        return true
      } catch (err) {
        console.log("Err: ", err)
        return false
      }
    },

    async fetchVote(id: string): Promise<Vote | null> {
      const response = await $http.get<Vote>(`/votes/${id}`)
      return response.data || null
    },

    async fetchByVoter(voter: string, proposalId: string): Promise<Vote[]> {
      const response = await $http.get<PaginationData>(`/votes?proposalId=${proposalId}&voter=${voter}`)
      return response.data?.list || []
    },

    async fetchVoteCount(proposalId: string): Promise<number> {
      const response = await $http.get<number>(`/votes/count?proposalId=${proposalId}`)
      return response.data || 0
    },

    async fetchVotingPower(voter: string, strategy: string): Promise<number> {
      const response = await $http.get<number>(`/votes/votingPower?voter=${voter}&strategy=${strategy}`)
      return response.data || 0
    },
  }
})

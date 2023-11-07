import { defineStore } from 'pinia'
import { Proposal, ProposalFilters } from '@/types'
import $http from '@/api/service'

const getDefaultState = () => ({
  proposals: [] as Proposal[],
  newProposal: null as null | Proposal,
  canLoadMore: true,
})

export const useProposalStore = defineStore({
  id: 'proposal',
  state: () => getDefaultState(),

  actions: {
    async fetchProposals(communityId: number, page: number, status: ProposalFilters): Promise<Proposal[]> {
      if (page === 1) {
        this.proposals = []
      }

      const pageLength = 10;
      const response = await $http.get<Proposal[]>(`/proposals?communityId=${communityId}&page=${page}&pageLength=${pageLength}&status=${status}`)
      this.proposals = this.proposals.concat(response.data)

      if (response.data?.length < pageLength) {
        this.canLoadMore = false
      } else {
        this.canLoadMore = true
      }

      return this.proposals
    },

    async createProposal(proposal: Proposal): Promise<Proposal | null> {
      try {
        const response = await $http.post<Proposal>('/proposals', proposal)
        return response.data
      } catch (err) {
        console.log(err)
        return null
      }
    },

    async fetchProposal(proposalId: string): Promise<Proposal | null> {
      const response = await $http.get<Proposal>(`/proposals/${proposalId}`)
      return response.data || null
    },

    async updateProposal(proposalId: string, payload: Partial<Proposal>): Promise<null | Proposal> {
      try {
        const response = await $http.put(`/proposals/${proposalId}`, payload)
        return response.data
      } catch (err) {
        console.log(err)
        return null
      }
    },

    async deleteProposal(id: string): Promise<boolean> {
      try {
        await $http.delete(`/proposals/${id}`)
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },

    findProposal(proposalId: string): Proposal | null {
      const proposal = this.proposals.find(_ => _._id == proposalId)
      if (!proposal) {
        return null
      }
      return proposal
    },
  }
})

import { defineStore } from 'pinia'
import { Community, User } from '../types'
import $http from '@/api/service'

const getDefaultState = () => ({
  communities: [] as Community[],
  user: null as User | null,
})

export const useCommunityStore = defineStore({
  id: 'community',
  state: () => getDefaultState(),

  actions: {
    async fetchCommunities(): Promise<void> {
      const response = await $http.get<Community[]>('/communities')
      this.communities = [];
      this.communities = response.data?.map((_: Community) => {
        if (!_.iconUrl) {
          _.iconUrl = '/img/proton.png' 
        }
        return _
      })
    },

    async fetchCommunity(id: number): Promise<Community | null> {
      const response = await $http.get<Community>(`/communities/${id}`)
      return response.data || null
    },

    fetchUser(account: string): void {
      $http.get<User>(`/users/${account}`)
        .then(response => {
          this.user = response.data
        })
    },

    async join(payload: {account: string, communityId: number}): Promise<void> {
      const response = await $http.post('/users', payload)
      this.user = response.data
    },

    async leave(payload: {account: string, communityId: number}): Promise<void> {
      const response = await $http.delete(`/users/${payload.account}`, {
        data: {communityId: payload.communityId}
      })
      this.user = response.data
    },

    findCommunity(communityId: number): Community | null {
      if (!this.communities.length) {
        this.fetchCommunities();
      }

      const community = this.communities.find(_ => _.id == communityId)
      if (!community) {
        return null
      }
      return community
    },

    getUser(account: string): User | null {
      if (!this.user || this.user.account != account) {
        this.fetchUser(account);
      }

      return this.user
    },

    async saveGuideline(payload: {sid: number, guideline: string, admin: string}): Promise<void> {
      await $http.post(`/communities`, payload)
    },
  }
})

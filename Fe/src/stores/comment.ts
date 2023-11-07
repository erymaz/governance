import { defineStore } from 'pinia'
import { Comment } from '../types'
import $http from '@/api/service'

const getDefaultState = () => ({
  comments: [] as Comment[],
  canLoadMore: true,
})

export const useCommentStore = defineStore({
  id: 'comment',
  state: () => getDefaultState(),

  actions: {
    async fetchComments(proposalId: string, page: number): Promise<Comment[]> {
      if (page === 1) {
        this.comments = []
      }

      const pageLength = 10;
      const response = await $http.get<Comment[]>(`/comments?proposalId=${proposalId}&page=${page}&pageLength=${pageLength}`)
      this.comments = this.comments.concat(response.data)

      if (response.data?.length < pageLength) {
        this.canLoadMore = false
      } else {
        this.canLoadMore = true
      }
      return this.comments
    },

    async createComment(payload: Comment): Promise<boolean> {
      try {
        await $http.post('/comments', payload)
        return true
      } catch (err) {
        console.log("Err: ", err)
        return false
      }
    },
  }
})

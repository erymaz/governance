import { defineStore } from 'pinia'
import { Strategies, Strategy } from '@/types'
import $http from '@/api/service'

const getDefaultState = () => ({
  strategies: {} as Strategies,
})

export const useStrategyStore = defineStore({
  id: 'strategy',
  state: () => getDefaultState(),

  actions: {
    async fetchStrategies(): Promise<void> {
      const response = await $http.get<Strategies>('/strategies')
      this.strategies = response.data
    },

    findStrategy(name: string): Strategy {
      const strategy = this.strategies[name] as Strategy
      return strategy || {}
    },
  }
})

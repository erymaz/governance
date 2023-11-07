import { defineStore } from 'pinia'
import { LinkSession } from '@proton/link';
import { Serialize, ApiInterfaces } from '@proton/js'
import userApi from '@/api/user'
import { proton } from '@/api/proton'
import { Token } from '@/types'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

const getDefaultState = () => ({
  actor: undefined as string | undefined,
  permission: undefined as string | undefined,
  accountData: undefined as any,
  kyc: undefined as string | undefined,
  location: undefined as string | undefined,
  success: undefined as ApiInterfaces.TransactResult | undefined,
  error: undefined as string | undefined,
  loading: false as boolean,
  staked: undefined as number | undefined,
  tokens: [] as Token[],
})

export const useUserStore = defineStore({
  id: 'user',

  state: () => getDefaultState(),

  actions: {
    async login () {
      this.clear()
      const session = await userApi.login()
      await this.initializeSession(session)
    },
  
    async reconnect () {
      this.clear()
      const session = await userApi.reconnect()
      await this.initializeSession(session)
    },

    async initializeSession (session: LinkSession) {
      if (session) {
        if (session.auth) {
          this.actor = session.auth.actor.toString()
          this.permission = session.auth.permission.toString()

          try {
            const { rows } = await proton.rpc.get_table_rows({
              code: 'eosio',
              scope: 'eosio',
              lower_bound: this.actor,
              upper_bound: this.actor,
              table: 'votersxpr',
              limit: 1
            })
            if (rows && rows.length) {
              this.staked = rows[0].staked / Math.pow(10, 4)
            }
          } catch (e) {
            console.error(e)
          }

          await this.getTokens(this.actor)
          this.accountData = await proton.getProtonAvatar(this.actor)
        }
      }
    },
  
    async logout () {
      await userApi.logout()
      this.$reset()
    },

    async transact ({ actions, broadcast = true }: { actions: PartialBy<Serialize.Action, "authorization">[]; broadcast: boolean }) {
      if (!this.actor || !this.permission) {
        throw new Error(`Cannot transact as actor or permission are missing. Current: ${this.actor}@${this.permission}`)
      }

      this.clear()
      
      actions = actions.map(action => {
        action.authorization = [{
          actor: this.actor as string,
          permission: this.permission as string
        }]
        return action
      })
      
      try {
        const success = await userApi.transact(actions as Serialize.Action[], broadcast)

        if (broadcast) {
          this.setSuccess(success as unknown as ApiInterfaces.TransactResult)
        }

        return success
      } catch (e: any) {
        const detailsError = e.error && e.error.details && e.error.details.length && e.error.details[0].message
        const fieldError = e.json && e.json.fields && e.json.fields.length && e.json.fields[0].error
        const error = detailsError || fieldError || e.message || e.toString() || e
        this.setError(error)
      }
    },

    async getTokens (name: string) {
      const tokens = await proton.getAccountTokens(name)
      if (!tokens) return
      this.tokens = [];
      this.tokens = tokens.map(el => {
        return {
          ...el,
          decimals: Number(el.decimals)
        }
      })
    },

    clear () {
      this.setSuccess(undefined)
      this.setError(undefined)
    },

    setLoading (loading: boolean) {
      this.loading = loading
    },

    setSuccess (success: ApiInterfaces.TransactResult | undefined) {
      this.success = success
    },
    
    setError (error: string | undefined) {
      this.error = error
    }
  },
})

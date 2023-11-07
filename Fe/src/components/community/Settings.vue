<template>
  <div class="w-full mt-10 mb-12 sm:mb-20">
    <h2 class="font-semibold mb-4">Settings</h2>
    <div class="p-4 border rounded-lg">
      <h3 class="mb-3">Profile</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        <div>
          <label class="">Name</label>
          <input v-model="state.name"
                 :disabled="!isController"
                 type="text"
                 class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md my-1"
                 placeholder="Name" />
        </div>
        <div>
          <label class="">Icon</label>
          <input v-model="state.iconUrl"
                 :disabled="!isController"
                 type="text"
                 class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md my-1"
                 placeholder="Name" />
        </div>
      </div>

      <label class="">Description</label>
      <textarea v-model="state.description"
                :disabled="!isController"
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md my-1"
                placeholder="Description" />

      <div class="flex justify-end mt-4">
        <button @click="saveProfile"
                :disabled="!isController"
                type="button"
                class="w-full md:w-24 inline-flex justify-center items-center px-8 py-1.5 bg-gray-200 text-md font-medium rounded text-white"
                :class="{ 'bg-purple-600 hover:bg-purple-700': isController }">
          Save
        </button>
      </div>
    </div>

    <div class="p-4 border rounded-lg mt-10">
      <h3 class="mb-3">Guideline</h3>
      <input v-model="state.guideline"
            :disabled="!isAdmin"
            type="text"
            class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md my-1"
            placeholder="Guideline URL" />

      <div class="flex justify-end mt-4">
        <button @click="saveGuideline"
                :disabled="!isAdmin"
                type="button"
                class="w-full md:w-24 inline-flex justify-center items-center px-8 py-1.5 bg-gray-200 text-md font-medium rounded text-white"
                :class="{ 'bg-purple-600 hover:bg-purple-700': isAdmin }">
          Save
        </button>
      </div>
    </div>

    <div class="p-4 border rounded-lg mt-10">
      <div class="flex flex-col sm:flex-row justify-between sm:items-end">
        <h3 class="mb-3">Admins</h3>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">
              <SearchIcon class="w-4 h-4 text-purple-800" />
            </span>
          </div>
          <input v-model="state.searchTxt"
                 type="text"
                 class="w-full md:w-64 focus:ring-indigo-500 focus:border-indigo-500 block pl-10 sm:text-base border-gray-300 rounded-md"
                 placeholder="Search Admins" />
        </div>
      </div>

      <div v-if="!state.isLoading"
           class="mt-3 text-md text-gray-400 rounded">
        <div v-for="admin of administrators"
             :key="admin"
             class="flex justify-between items-center py-2 border hover:border-purple-400 mb-1 px-4 rounded">
          <div class="flex items-center">
            <img src="https://bloks.io/img/proton_avatar.png"
                 class="w-4 h-4" />
            <span class="ml-2 text-gray-600">{{ admin }}</span>
          </div>
          <img @click="removeAdmin(admin)"
               src="/img/close.svg"
               class="w-4 h-4 cursor-pointer" />
        </div>
      </div>

      <div v-else
           style="border-top-color:transparent"
           class="w-5 h-5 mt-3 border-4 border-blue-400 border-solid rounded-full animate-spin"></div>

      <div class="flex mt-8">
        <input v-model="state.newAdmin"
               type="text"
               class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md mr-2"
               placeholder="Account" />
        <button @click="addAdmin"
                :disabled="state.newAdmin == '' || !isAdmin"
                type="button"
                class="inline-flex justify-center items-center px-8 py-1.5 bg-gray-200 text-md font-medium rounded text-white"
                :class="{ 'bg-purple-600 hover:bg-purple-700': state.newAdmin && isAdmin }">
          Add
        </button>
      </div>
    </div>

    <div class="p-4 border rounded-lg mt-10">
      <h3 class="mb-3">Strategies</h3>
      <div v-for="strategy of state.strategies"
           :key="strategy"
           class="border hover:border-purple-400 mb-1 py-1 px-4 rounded">
        <div class="flex justify-between items-center py-1">
          <div class="w-full truncate">
            <span class="mr-4">{{ strategy }}</span>
          </div>
          <img @click="removeStrategy(strategy)"
               src="/img/close.svg"
               class="w-4 h-4 cursor-pointer" />
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button @click="showStrategyModal"
                :disabled="!isAdmin"
                type="button"
                class="inline-flex justify-center items-center px-8 py-1.5 bg-gray-200 text-md font-medium rounded text-white"
                :class="{ 'bg-purple-600 hover:bg-purple-700': isAdmin }">
          Add strategy
        </button>
      </div>
    </div>

    <div class="p-4 border rounded-lg mt-10">
      <h3 class="mb-3">Proposal</h3>
      <div class="">
        <label>Proposal Fee</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="state.quantity"
                 :disabled="!isAdmin"
                 type="text"
                 class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md my-1"
                 placeholder="10.0000 XPR" />
          <input v-model="state.contract"
                 :disabled="!isAdmin"
                 type="text"
                 class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md my-1"
                 placeholder="eosio.token" />
        </div>
      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Quorum (% of total votes to pass)</label>
          <input v-model="state.quorum"
                 :disabled="!isAdmin"
                 type="number"
                 step="0.01"
                 class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md my-1"
                 placeholder="10.0000 XPR" />
        </div>
        <div>
          <label>Minimum Proposal Time (Hour)</label>
          <input v-model="state.minProposalTime"
                 :disabled="!isAdmin"
                 type="number"
                 min="0"
                 class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md my-1"
                 placeholder="10.0000 XPR" />
        </div>
      </div>

      <SwitchGroup as="div"
                   class="flex items-center mt-4">
        <Switch v-model="state.approving"
                :class="[state.approving ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2']"
                :aria-disabled="!isAdmin">
          <span aria-hidden="true"
                :class="[state.approving ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
        </Switch>
        <SwitchLabel as="span"
                     class="ml-3">
          <span class="font-medium text-gray-900">Proposal needs to be approved</span>
        </SwitchLabel>
      </SwitchGroup>

      <div class="flex justify-end mt-4">
        <button @click="saveProposal"
                :disabled="!isAdmin"
                type="button"
                class="w-full md:w-24 inline-flex justify-center items-center px-8 py-1.5 bg-gray-200 text-md font-medium rounded text-white"
                :class="{ 'bg-purple-600 hover:bg-purple-700': isAdmin }">
          Save
        </button>
      </div>
    </div>

    <div class="p-4 border rounded-lg mt-10">
      <div class="flex">
        <h3 class="mb-3">Voting systems</h3>
      </div>

      <div v-if="!state.isLoading"
           class="mt-3 text-md text-gray-400 rounded">
        <div v-for="system of availableVotingSystems"
             :key="system.id"
             class="flex justify-between items-center py-2 border hover:border-purple-400 mb-1 px-4 rounded">
          <div class="flex items-center">
            <span class="ml-2 text-gray-600">{{ system.name }}</span>
          </div>
          <img @click="removeVotingSystem(system.id)"
               src="/img/close.svg"
               class="w-4 h-4 cursor-pointer" />
        </div>
      </div>

      <div v-else
           style="border-top-color:transparent"
           class="w-5 h-5 mt-3 border-4 border-blue-400 border-solid rounded-full animate-spin"></div>

      <div class="flex justify-end mt-4">
        <button @click="showVotingSystemModal"
                :disabled="!isAdmin"
                type="button"
                class="inline-flex justify-center items-center px-8 py-1.5 bg-gray-200 text-md font-medium rounded text-white"
                :class="{ 'bg-purple-600 hover:bg-purple-700': isAdmin }">
          Add Voting System
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { SearchIcon } from '@heroicons/vue/solid'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { useUserStore } from '@/stores/user'
import { useCommunityStore } from '@/stores/community'
import { Community } from '@/types'
import { GOV_CONTRACT } from '@/constants'
import { useModal } from '@/components/modals/useModal'
import { useRouter } from 'vue-router'
import { votingSystems } from '@/helpers'

const router = useRouter()

const props = defineProps<{ community: Community }>()

const userStore = useUserStore()
const communityStore = useCommunityStore();
const selectStrategyModal = useModal('select-strategy')
const votingSystemModal = useModal('select-voting-system')
const toast = useToast()

const state = reactive({
  isLoading: false,
  name: props.community?.name || '',
  iconUrl: props.community?.iconUrl || '',
  description: props.community?.description || '',
  newAdmin: '',
  searchTxt: '',
  quantity: props.community?.proposalFee.quantity || '',
  contract: props.community?.proposalFee.contract || '',
  quorum: props.community ? props.community?.quorum / 100 : 0,
  minProposalTime: props.community?.minProposalTime || 0,
  approving: !!props.community?.approvingProposal,
  strategies: props.community?.strategies || [],
  guideline: props.community?.guideline || '',
})

const administrators = computed(() => {
  return props.community?.admins?.filter(_ => _.trim().toLowerCase().indexOf(state.searchTxt) !== -1)
})

const isController = computed(() => {
  if (!props.community) {
    return false
  }
  return props.community.controller == userStore.actor
})

const isAdmin = computed(() => {
  if (!props.community || !userStore.actor) {
    return false
  }
  const admins = [props.community.controller].concat(props.community.admins)
  return admins.includes(userStore.actor)
})

const availableVotingSystems = computed(() => {
  if (!props.community) {
    return []
  }
  return votingSystems.filter(_ => props.community!.votingSystems.includes(_.id))
})

const saveProfile = async () => {
  if (!isController.value) {
    return
  }

  if (!props.community) {
    return
  }

  if (!state.name || !state.iconUrl) {
    toast.warning('Enter community name and icon URL.')
    return
  }

  const actions = [{
    account: GOV_CONTRACT,
    name: 'setprofile',
    data: {
      id: props.community.id,
      name: state.name,
      description: state.description,
      iconUrl: state.iconUrl,
      website: props.community.website,
    }
  }]
  const success = await userStore.transact({
    actions,
    broadcast: true
  })

  if (success) {
    toast.success('Success!')
    router.push('/')
  } else {
    toast.error(`Error: ${userStore.error}`)
  }
}

const saveGuideline = async () => {
  if (!userStore.actor || state.guideline === props.community?.guideline) {
    return;
  }

  try {
    await communityStore.saveGuideline({
      sid: props.community.id,
      guideline: state.guideline,
      admin: userStore.actor
    })
    toast.success('Success!')
    router.push('/')
  } catch (err) {
    toast.error(`Error: ${err}`)
  }
}

const updateCommunity = async (
  id: number,
  strategies: string[],
  approvingProposal: boolean,
  proposalFee: {
    quantity: string,
    contract: string,
  },
  minProposalTime: number,
  admins: string[],
  quorum: number,
  votingSystems: string[],
): Promise<void> => {
  if (!isAdmin.value) {
    return
  }

  const actions = [{
    account: GOV_CONTRACT,
    name: 'updatecmty',
    data: {
      id,
      strategies,
      votingSystems,
      approvingProposal,
      proposalFee,
      minProposalTime,
      admins,
      quorum,
    }
  }]
  const success = await userStore.transact({
    actions,
    broadcast: true
  })

  if (success) {
    toast.success('Success!')
    router.push('/')
  } else {
    toast.error(`Error: ${userStore.error}`)
  }
}

const addAdmin = async (): Promise<void> => {
  if (state.newAdmin == '' || !props.community) {
    return
  }
  const admins = props.community?.admins || []
  admins.push(state.newAdmin)
  try {
    state.isLoading = true
    await updateCommunity(
      props.community.id,
      props.community.strategies,
      !!props.community.approvingProposal,
      props.community.proposalFee,
      props.community.minProposalTime,
      admins,
      props.community.quorum,
      props.community.votingSystems,
    )
    state.newAdmin = ''
    state.isLoading = false
  } catch (err) {
    state.isLoading = false
  }
}

const removeAdmin = async (admin: string): Promise<void> => {
  if (!isAdmin.value || !props.community) {
    return
  }
  const admins = props.community.admins?.filter((_: string) => _ != admin) || []
  try {
    state.isLoading = true
    await updateCommunity(
      props.community.id,
      props.community.strategies,
      !!props.community.approvingProposal,
      props.community.proposalFee,
      props.community.minProposalTime,
      admins,
      props.community.quorum,
      props.community.votingSystems,
    )
    state.isLoading = false
  } catch (err) {
    state.isLoading = false
  }
}

const addVotingSystem = async (id: string): Promise<void> => {
  if (!props.community || !isAdmin.value) {
    return
  }

  if (props.community.votingSystems.includes(id)) {
    toast.info(`Already added`)
    return
  }

  try {
    const votingSystems = [...props.community.votingSystems]
    votingSystems.push(id)
    state.isLoading = true
    await updateCommunity(
      props.community.id,
      props.community.strategies,
      !!props.community.approvingProposal,
      props.community.proposalFee,
      props.community.minProposalTime,
      props.community.admins,
      props.community.quorum,
      votingSystems,
    )
    state.newAdmin = ''
    state.isLoading = false
  } catch (err) {
    state.isLoading = false
  }
}

const removeVotingSystem = async (systemId: string): Promise<void> => {
  if (!isAdmin.value || !props.community) {
    return
  }
  const votingSystems = props.community.votingSystems?.filter((_: string) => _ != systemId) || []
  try {
    state.isLoading = true
    await updateCommunity(
      props.community.id,
      props.community.strategies,
      !!props.community.approvingProposal,
      props.community.proposalFee,
      props.community.minProposalTime,
      props.community.admins,
      props.community.quorum,
      votingSystems,
    )
    state.isLoading = false
  } catch (err) {
    state.isLoading = false
  }
}

const saveProposal = async () => {
  if (!isAdmin.value || !props.community) {
    return
  }

  if (!state.quantity || !state.contract || !state.quorum) {
    toast.warning('Fill the all required fields')
    return
  }

  if (state.minProposalTime < 0) {
    toast.warning('Invalid proposal time')
    return
  }

  try {
    const fee = {
      quantity: state.quantity,
      contract: state.contract,
    }
    await updateCommunity(
      props.community.id,
      props.community.strategies,
      state.approving,
      fee,
      state.minProposalTime,
      props.community.admins,
      state.quorum * 100,
      props.community.votingSystems,
    )
  } catch (err) {
    console.log(err)
  }
}

const showStrategyModal = () => {
  if (!isAdmin.value) {
    return
  }
  selectStrategyModal.show({ addStrategy })
}

const showVotingSystemModal = () => {
  if (!isAdmin.value) {
    return
  }
  votingSystemModal.show({
    addVotingSystem,
  })
}

const addStrategy = async (name: string) => {
  if (!props.community || !isAdmin.value) {
    return
  }

  if (state.strategies.includes(name)) {
    toast.info(`Already added: ${name}`)
    return
  }

  try {
    const list = [...state.strategies]
    list.push(name)
    await updateCommunity(
      props.community.id,
      list,
      !!props.community.approvingProposal,
      props.community.proposalFee,
      props.community.minProposalTime,
      props.community.admins,
      props.community.quorum,
      props.community.votingSystems,
    )
  } catch (err) {
    console.log(err)
  }
}

const removeStrategy = async (name: string) => {
  if (!props.community || !isAdmin.value) {
    return
  }

  if (!state.strategies.includes(name) || state.strategies.length < 2) {
    toast.info('Community must have at least one strategy.')
    return
  }

  try {
    const list = [...state.strategies]
    await updateCommunity(
      props.community.id,
      list.filter(_ => _ != name),
      !!props.community.approvingProposal,
      props.community.proposalFee,
      props.community.minProposalTime,
      props.community.admins,
      props.community.quorum,
      props.community.votingSystems,
    )
  } catch (err) {
    console.log(err)
  }
}

</script>

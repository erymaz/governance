<template>
  <div class="w-full flex flex-col items-center my-6 sm:mt-10">
    <img :src="community.iconUrl" alt="logo" width="72" />
    <div class="flex items-start mt-6 sm:mt-8">
      <span class="font-semibold text-xl mr-2">{{ community.name }}</span>
      <img src="/img/verified_badge.png" width="24" height="24" />
    </div>
    <div class="font-medium text-base text-gray-400 mt-3">{{ community.memberCount }} member(s)</div>
    <div class="flex mt-5">
      <a
        :href="social.github"
        target="_blank"
      >
        <img src="/img/github.png" class="mx-3 cursor-pointer" width="16" />
      </a>
      <a
        :href="social.twitter"
        target="_blank"
      >
        <img src="/img/twitter.png" class="mx-3 cursor-pointer" width="16" />
      </a>
      <a
        :href="social.link"
        target="_blank"
      >
        <img src="/img/link.png" class="mx-3 cursor-pointer" width="16" />
      </a>
    </div>
    <div class="w-full mt-8">
      <button
        v-if="!actor"
        @click="login"
        type="button"
        class="inline-flex justify-center items-center w-full px-2 py-1.5 border border-transparent text-md font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        Login
      </button>
      <button
        v-else
        @click="join"
        type="button"
        class="inline-flex justify-center items-center w-full px-2 py-1.5 border border-transparent text-md font-medium rounded shadow-sm"
        :class="!isJoined ? 'text-white bg-purple-600 hover:bg-purple-700' : 'text-purple-700 ring-2 ring-purple-500'"
      >
        <span v-if="isJoined">Joined</span>
        <span v-else>Join</span>
      </button>
    </div>
    <div class="flex sm:flex-col w-full mt-4 sm:mt-8 overflow-x-auto border-0 md:border-l">
      <div
        v-for="tab of tabs"
        :key="tab.key"
        @click="$emit('communityTabSelected', tab.key)"
        class="border-b-4 sm:border-l-4 sm:border-b-0 border-transparent my-3 py-0 mr-6 sm:mx-0 sm:px-3 text-md text-gray-400 font-semibold cursor-pointer whitespace-nowrap"
        :class="{'border-purple-800 text-gray-900': selectedTab===tab.key, 'hidden': !hasRole(tab.role)}"
      >
        {{tab.name}}
      </div>
    </div>
    <div class="mx-auto sm:ml-0">
      <div
        @click="$emit('communityTabSelected', 'newProposal')"
        class="flex items-center mt-4 mx-auto cursor-pointer"
      >
        <img src="/img/plus.png" class="w-6 sm:w-8" />
        <span class="text-purple-800 font-semibold ml-2">New Proposal</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Community } from '@/types'
import { socials } from '@/helpers'
import { useUserStore } from '@/stores/user'
import { useCommunityStore } from '@/stores/community'
  
const props = defineProps<{
  selectedTab: string,
  community: Community
}>()

const userStore = useUserStore()
const communityStore = useCommunityStore()

const tabs = [
  {name: 'Proposals', key: 'proposals', role: ''},
  {name: 'About', key: 'about', role: ''},
  {name: 'Admins', key: 'admins', role: ''},
  // {name: 'Delegate', key: 'delegate'},
  {name: 'Settings', key: 'settings', role: 'admins'}
]

const isJoined = computed(() => {
  if (!userStore.actor) {
    return false
  }
  const user = communityStore.getUser(userStore.actor)
  return user?.communities.includes(props.community!.id)
})

const social = computed(() => {
  const name = props.community?.name.includes('LOAN') ? 'LOAN' :
    props.community?.name.includes('Metal') ? 'METAL' :
    props.community?.name.includes('XPR') || props.community?.name.includes('Proton') ? 'XPR' : '';

  return socials[name]
})

const isAdmin = computed(() => {
  if(!props.community || !userStore.actor) {
    return false
  }
  const admins = [props.community.controller].concat(props.community.admins)
  return admins.includes(userStore.actor)
})

const actor = computed(() => userStore.actor)

const hasRole = (role: string): boolean => {
  if (role === 'admins') {
    return isAdmin.value
  } else {
    return true
  }
}

const join = async () => {
  const data = {
    account: userStore.actor!,
    communityId: props.community.id,
  }

  if (!isJoined.value) {
    await communityStore.join(data)
  }
  // else {
  //   await communityStore.leave(data)
  // }
}

function login() {
  userStore.login()
} 

</script>

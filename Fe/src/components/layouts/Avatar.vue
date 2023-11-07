<template>
  <div class="relative text-gray-900">
    <div v-click-outside="clickOutside">
      <button class="max-w-xs rounded-full flex items-center text-sm"
              id="user-menu"
              aria-haspopup="true"
              @click="clickDropdown">
        <img class="h-9 w-9 object-contain rounded-full"
             :src="avatar"
             alt="Profile Photo" />

        <span class="block ml-3 text-lg font-medium mr-5">
          {{ name || actor }}
        </span>

        <svg class="hidden sm:block flex-shrink-0 mr-3 h-5 w-5 text-gray-400"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 20 20"
             fill="currentColor"
             aria-hidden="true">
          <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <transition enter-active-class="transition ease-out duration-100 transform"
                enter-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75 transform"
                leave-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
      <div class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-1 bg-white border z-10"
           role="menu"
           aria-orientation="vertical"
           aria-labelledby="user-menu"
           v-if="active">
        <span class="block px-4 py-2 text-sm"
              role="menuitem"
              @click.stop>
          Account: {{ actor }}
        </span>
        <span class="block px-4 py-2 text-sm cursor-pointer"
              role="menuitem"
              @click.stop="logout">
          Logout
        </span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const accountData = computed(() => user.accountData)
const active = ref(false)

const actor = computed(() => user.actor)
const name = computed(() => accountData.value && accountData.value.name)

const avatar = computed(() => {
  const avatar = accountData.value && accountData.value.avatar

  if (avatar) {
    if (avatar.indexOf('/9j/') !== -1) {
      return `data:image/jpeg;base64,${avatar}`
    } else if (avatar.indexOf('iVBORw0KGgo') !== -1) {
      return `data:image/png;base64,${avatar}`
    }
  }

  return 'https://bloks.io/img/proton_avatar.png'
})

function logout() { user.logout() }

function clickDropdown(e: Event) {
  if (active.value) {
    active.value = false;
    (e.currentTarget as HTMLElement).blur()
  } else {
    active.value = true
  }

}
function clickOutside() {
  if (active.value) {
    active.value = false
  }
}
</script>

<style></style>

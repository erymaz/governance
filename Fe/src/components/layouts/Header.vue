<template>
  <div class="flex justify-center border-b-2 border-solid border-gray-200">
    <div class="header">
      <div
        @click="$router.push('/')"
        class="flex items-center cursor-pointer mr-8"
      >
        <img src="/img/logo.svg" class="w-52 mr-2 cursor-pointer object-contain hidden sm:block"/>
        <img src="/img/logomark.svg" class="w-10 sm:hidden" />
      </div>

      <a href="https://docs.protongov.com/" target="_blank" rel="noreferrer">
        <span class="text-lg text-gray-900">Docs</span>
      </a>

      <div
        class="ml-auto rounded-full border border-solid border-gray-200"
        :class="{
          'h-10 flex items-center cursor-pointer border': !actor
        }"
        @click="() => !actor && login()"
      >
        <span
          v-if="!actor"
          class="text-lg flex items-center text-center text-white"
        >
          <span class="px-5 truncate block text-purple-800">
            Log in
          </span>
        </span>
        <span
          v-else
          class="flex items-center text-lg text-white"
        >
          <Avatar/>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Avatar from '@/components/layouts/Avatar.vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const login = () => { user.login() }
const actor = computed(() => user.actor)

</script>

<!--Vue in page CSS-->
<style scoped>
.header {
  width: 100%;
  max-width: 1160px;
  display: flex;
  align-items: center;
  justify-content: left;
  height: 77px;
  padding: 0 15px;
}
</style>

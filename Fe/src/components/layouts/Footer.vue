<template>
  <div class="flex justify-center border-t border-solid border-gray-200">
    <div class="flex flex-col-reverse sm:flex-row justify-between sm:items-center footer">
      <div class="flex justify-between items-center">
        <img src="/img/logo.svg" class="w-24 sm:w-36 my-3 mr-2 cursor-pointer object-contain opacity-90" @click="$router.push('/')"/>
        <span class="text-xs text-gray-350 sm:hidden">@2023 Metallicus, Inc. All rights reserved.</span>
      </div>

      <div class="flex flex-wrap justify-left py-2">
        <a
          v-for="option of options"
          :key="option.link"
          :href="option.link"
          class="mr-10 sm:mr-8 flex"
          target="_blank"
          rel="noreferrer"
        >
          <div
            class="text-center text-xs sm:text-sm font-medium cursor-pointer text-gray-350 whitespace-nowrap"
            style="min-width: 32px"
          >
            {{ option.name }}
          </div>
        </a>
      </div>

      <div class="py-4">
        <SocialLinks />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'

interface Option {
  link: string;
  name: string;
}
const options: Option[] = [
  { link: 'https://xprnetwork.org/news', name: 'News' },
  { link: 'https://docs.protongov.com/', name: 'Docs' },
  { link: 'https://help.proton.org/hc/en-us', name: 'Knowledge Center' },
]
</script>

<!--Vue in page CSS-->
<style scoped>
.footer {
  width: 100%;
  max-width: 1160px;
  padding: 10px 15px;
}
</style>
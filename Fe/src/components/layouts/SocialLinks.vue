<template>
  <div class="flex space-x-8 items-center">
    <NewTabHyperlink class="block" href="https://www.facebook.com/protonxpr">
      <img src="/img/facebook-icon.svg" alt="facebook-icon" />
    </NewTabHyperlink>
    <NewTabHyperlink class="block" href="https://twitter.com/protonxpr">
      <img src="/img/twitter-icon.svg" alt="twitter-icon" />
    </NewTabHyperlink>
    <NewTabHyperlink class="block" href="https://github.com/ProtonProtocol">
      <img src="/img/github-icon.svg" alt="github-icon" />
    </NewTabHyperlink>
    <NewTabHyperlink class="block" href="https://t.me/protonxpr">
      <img src="/img/telegram-icon.svg" alt="telegram-icon" />
    </NewTabHyperlink>
  </div>
</template>

<script setup lang="ts">
import NewTabHyperlink from '@/components/layouts/NewTabHyperlink.vue';
</script>

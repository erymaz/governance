<template>
  <a v-bind="{ ...props }" target="_blank" rel="noreferrer">
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
interface Props {
  href: string;
  class?: string;
}

const props = defineProps<Props>();
</script>

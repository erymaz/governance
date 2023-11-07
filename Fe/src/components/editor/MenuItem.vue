<template>
  <button
    class="menu-item"
    :class="{ 'is-active': isActive ? isActive(): null }"
    @click="action"
    :title="title"
  >
    <svg class="remix">
      <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

interface Props {
  icon: string;
  title: string;
  action: () => void;
  isActive?: () => boolean;
}

defineProps<Props>()

</script>

<style lang="css">
.menu-item {
  width: 1.75rem;
  height: 1.75rem;
  color: #0D0D0D;
  border: none;
  background-color: transparent;
  border-radius: 0.4rem;
  padding: 0.25rem;
  margin-right: 0.25rem;
}

.menu-item svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.is-active,
.menu-item:hover {
  color: #FFF;
  background-color: #0D0D0D;
}
</style>

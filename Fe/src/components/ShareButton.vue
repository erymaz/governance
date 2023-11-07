<template>
  <Menu as="div"
        class="relative inline-block text-left sm:ml-auto">
    <MenuButton class="flex items-center">
      <span class="sr-only">Open options</span>
      <div class="flex items-center cursor-pointer">
        <img src="/img/share.png"
             class="w-3 mb-1" />
        <span class="text-sm text-gray-400 ml-2">Share</span>
      </div>
    </MenuButton>

    <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
      <MenuItems
                 class="origin-top-right absolute left-0 sm:left-auto sm:right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div class="py-1">
          <MenuItem v-slot="{ active }">
          <a href="#"
             class="flex w-32 text-purple-800 whitespace-nowrap"
             :class="[active ? 'bg-purple-200' : '', 'block px-4 py-2 text-sm']">
            <img src="/img/twitter.png"
                 class="w-4 mb-1" />
            <span class="text-sm text-gray-400 ml-2">Twitter</span>
          </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
          <a href="#"
             class="flex w-32 text-purple-800 whitespace-nowrap"
             :class="[active ? 'bg-purple-200' : '', 'block px-4 py-2 text-sm']">
            <img src="/img/facebook.png"
                 class="w-4 mb-1" />
            <span class="text-sm text-gray-400 ml-2">Facebook</span>
          </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
          <a href="#"
             class="flex w-32 text-purple-800 whitespace-nowrap"
             :class="[active ? 'bg-purple-200' : '', 'block px-4 py-2 text-sm']">
            <img src="/img/link.png"
                 class="w-4 mb-1" />
            <span class="text-sm text-gray-400 ml-2">Copy link</span>
          </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
</script>

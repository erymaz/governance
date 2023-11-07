<template>
  <div class="w-full mt-10">
    <div class="text-2xl font-semibold">Delegate</div>

    <div class="mt-10 pb-6 border-b border-solid border-gray-200">
      <div class="text-lg font-medium">Delegate to</div>
      <input
        type="text"
        name="delete-to"
        id="search-daos"
        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 border-gray-300 rounded-md mt-3 mb-6"
        placeholder="Address"
      />
      <div class="flex justify-end">
        <button
          type="button"
          class="inline-flex justify-center items-center px-8 py-1.5 border border-transparent text-md font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-offset-1 focus:ring-purple-500"
        >
          Deletegate
        </button>
      </div>
    </div>

    <div class="mt-14 pb-6">
      <div class="text-lg font-medium">Top delegates</div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style>

</style>

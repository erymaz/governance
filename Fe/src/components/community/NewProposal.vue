<template>
  <div class="w-full mt-6 sm:mt-10">
    <div class="text-2xl font-semibold">New Proposal</div>
    <CreateContent v-if="curStep == 0"
                   :community="props.community"
                   @next="handleNext" />
    <AddVotingSystem v-if="curStep == 1"
                     :community="props.community"
                     @created="$emit('created')"
                     @failed="back" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Community } from '@/types'
import CreateContent from '@/components/proposal/CreateContent.vue'
import AddVotingSystem from '@/components/proposal/AddVotingSystem.vue'

const props = defineProps<{ community: Community }>()

const curStep = ref<number>(0)

const handleNext = () => {
  curStep.value = 1
}

const back = () => {
  curStep.value = 0
}

</script>

<style></style>

<template>
  <div class="w-full py-2 px-2">
    <template v-if="comments.length">
      <div v-for="comment of comments"
           :key="comment._id"
           class="py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <img src="https://bloks.io/img/proton_avatar.png"
                 class="w-6 h-6" />
            <span class="text-sm ml-3">{{ comment.author }}</span>
          </div>
          <div class="text-sm text-gray-400">{{ formatDate(comment.createdAt, 'MMM DD HH:mm') }}</div>
        </div>
        <div class="pl-8 pt-4 text-sm text-gray-600 comment-content">
          <span v-html="comment.content"></span>
        </div>
      </div>

      <div class="w-full mt-2"
           v-if="!isLoading">
        <button v-if="comments.length && canLoadMore"
                @click="loadMore"
                class="w-full py-2 text-center text-gray-200 font-semibold border rounded-md"
                :class="{ 'hover:border-purple-700 text-gray-600 ': canLoadMore }">
          Load more
        </button>
      </div>

      <div v-else
           style="border-top-color:transparent"
           class="w-5 h-5 mt-3 border-4 mx-auto border-blue-400 border-solid rounded-full animate-spin"></div>

    </template>
    <div v-else
            class="w-full py-2 text-center text-gray-600 font-normal">
      No comments yet
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { formatDate } from '@bloks/numbers'
import { useCommentStore } from '@/stores/comment'

interface Props {
  proposalId: string;
}

// props
const props = defineProps<Props>();

const commentStore = useCommentStore()

const isLoading = ref(false)
const page = ref(1)

onMounted(() => {
  fetchComments()
})

const comments = computed(() => {
  return commentStore.comments
})

const canLoadMore = computed(() => {
  return commentStore.canLoadMore
})

const loadMore = () => {
  page.value += 1
  fetchComments()
}

const fetchComments = async () => {
  isLoading.value = true
  await commentStore.fetchComments(props.proposalId, page.value)
  isLoading.value = false
}
</script>

<style>
.comment-content p {
  min-height: 24px;
}
</style>

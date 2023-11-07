<template>
  <div v-if="editor"
       class="editor__core border border-gray-300 rounded-lg">
    <menu-bar class="editor__header"
              :editor="editor" />
    <editor-content :editor="editor"
                    class="editor__content" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import CharacterCount from '@tiptap/extension-character-count'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Link from '@tiptap/extension-link'
import Code from '@tiptap/extension-code'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import MenuBar from '@/components/editor/MenuBar.vue'

const props = withDefaults(defineProps<{
  modelValue: string
}>(), {
  modelValue: ''
})

const emits = defineEmits(['update:modelValue'])

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      history: false,
      code: false
    }),
    Highlight,
    TaskList,
    TaskItem,
    CharacterCount.configure({
      limit: 14400,
    }),
    Code,
    Link.configure({
      openOnClick: true,
    }),
  ],
  onUpdate: () => {
    emits('update:modelValue', editor.value!.getHTML())
  },
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value!.getHTML() === value
  if (isSame) {
    return
  }
  editor.value!.commands.setContent(value, false)
})

onMounted(() => {
  editor.value?.commands.setContent(props.modelValue, false)
})

onBeforeUnmount(() => {
  editor.value!.destroy()
})
</script>

<style>
.editor__header {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  flex-wrap: wrap;
  padding: 0.25rem;
  border-bottom: 1px solid #aaaaaa;
}

.editor__content {
  padding: 1.25rem 1rem;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  word-break: break-all;
}

.editor__content .ProseMirror {
  min-height: 75px;
}

.editor__content .ProseMirror:focus-visible {
  outline: none;
}

code {
  font-size: 0.9rem;
  padding: 0.25em;
  border-radius: 0.25em;
  background-color: rgba(#616161, 0.1);
  color: #616161;
  box-decoration-break: clone;
}

.editor__content a {
  color: #68CEF8 !important;
}
</style>

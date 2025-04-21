<script setup lang="ts">
import { ref, watch } from 'vue'
import { format, isToday } from 'date-fns'
import type { Mail } from '~/types'

// Props
const props = defineProps<{
  mails: Mail[]
}>()

// Selected mail state
const selectedMail = defineModel<Mail | null>()

// Properly typed mail refs
const mailsRefs = ref<Record<string, HTMLElement | null>>({})

// ✅ Watch for selected mail and scroll to it
watch(selectedMail, () => {
  const id = selectedMail.value?.id
  if (!id) return

  const element = (mailsRefs.value as Record<string, HTMLElement | null>)[id]
  element?.scrollIntoView({ block: 'nearest' })
})

// ⌨️ Shortcuts
defineShortcuts({
  arrowdown: () => {
    const index = props.mails.findIndex(mail => mail.id === selectedMail.value?.id)
    if (index === -1 && props.mails.length > 0) {
      selectedMail.value = props.mails[0]
    } else if (index < props.mails.length - 1) {
      selectedMail.value = props.mails[index + 1]
    }
  },
  arrowup: () => {
    const index = props.mails.findIndex(mail => mail.id === selectedMail.value?.id)
    if (index === -1 && props.mails.length > 0) {
      selectedMail.value = props.mails[props.mails.length - 1]
    } else if (index > 0) {
      selectedMail.value = props.mails[index - 1]
    }
  }
})
</script>


<template>
  <div class="overflow-y-auto divide-y divide-(--ui-border)">
    <div
      v-for="mail in props.mails"
      :key="mail.id"
      :ref="el => {
        if (el) mailsRefs.value[mail.id] = el as HTMLElement
      }"
    >
      <div
        class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
        :class="[
          mail.unread ? 'text-(--ui-text-highlighted)' : 'text-(--ui-text-toned)',
          selectedMail?.id === mail.id
            ? 'border-(--ui-primary) bg-(--ui-primary)/10'
            : 'border-(--ui-bg) hover:border-(--ui-primary) hover:bg-(--ui-primary)/5'
        ]"
        @click="selectedMail = mail"
        tabindex="0"
        role="button"
        :aria-pressed="selectedMail?.id === mail.id"
      >
        <div class="flex items-center justify-between" :class="mail.unread ? 'font-semibold' : ''">
          <div class="flex items-center gap-3">
            {{ mail.from.name }}
            <UChip v-if="mail.unread" />
          </div>
          <span>
            {{
              isToday(new Date(mail.date))
                ? format(new Date(mail.date), 'HH:mm')
                : format(new Date(mail.date), 'dd MMM')
            }}
          </span>
        </div>

        <p class="truncate" :class="mail.unread ? 'font-semibold' : ''">
          {{ mail.subject }}
        </p>

        <p class="text-(--ui-text-dimmed) line-clamp-1">
          {{ mail.body }}
        </p>
      </div>
    </div>
  </div>
</template>

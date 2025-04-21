<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { Mail } from '~/types'

const selectedTab = ref<'all' | 'unread'>('all')
const selectedMail = ref<Mail | null>(null)

const tabItems = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' }
]

const { data: mails } = await useFetch<Mail[]>('/api/mails', {
  default: () => []
})

// 🔍 Filter by tab
const filteredMails = computed(() => {
  return selectedTab.value === 'unread'
    ? mails.value.filter(mail => mail.unread)
    : mails.value
})

// 📱 Breakpoint handling for mobile view
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')

// 🧠 Slideover panel control (for mobile)
const isMailPanelOpen = computed({
  get: () => !!selectedMail.value,
  set: (open) => {
    if (!open) selectedMail.value = null
  }
})

// 🧹 Reset selected mail if filtered out
watch(filteredMails, () => {
  if (selectedMail.value && !filteredMails.value.some(m => m.id === selectedMail.value?.id)) {
    selectedMail.value = null
  }
})
</script>

<template>
  <!-- Left Panel -->
  <UDashboardPanel
    id="inbox"
    :default-size="25"
    :min-size="20"
    :max-size="30"
    resizable
  >
    <UDashboardNavbar title="Inbox">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>

      <template #trailing>
        <UBadge :label="filteredMails.length" variant="subtle" />
      </template>

      <template #right>
        <UTabs
          v-model="selectedTab"
          :items="tabItems"
          class="w-32"
          size="xs"
          :content="false"
        />
      </template>
    </UDashboardNavbar>

    <InboxList v-model="selectedMail" :mails="filteredMails" />
  </UDashboardPanel>

  <!-- Right Panel (desktop) -->
  <InboxMail
    v-if="selectedMail && !isMobile"
    :mail="selectedMail"
    @close="selectedMail = null"
  />

  <!-- Placeholder when no mail is selected -->
  <div v-else-if="!isMobile" class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-inbox" class="size-32 text-(--ui-text-dimmed)" />
  </div>

  <!-- Slideover (mobile) -->
  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isMailPanelOpen">
      <template #content>
        <InboxMail v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
      </template>
    </USlideover>
  </ClientOnly>
</template>

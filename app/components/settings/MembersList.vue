<script setup lang="ts">
import type { Member } from '~/types'

defineProps<{
  members: Member[]
}>()

const items = [{
  label: 'Edit member',
  onSelect: () => console.log('Edit member')
}, {
  label: 'Remove member',
  color: 'error' as const,
  onSelect: () => console.log('Remove member')
}]

// Helper function to handle different avatar types
function getAvatarProps(avatar: string | object | undefined) {
  if (!avatar) {
    return {}
  }
  
  if (typeof avatar === 'string') {
    return { src: avatar }
  }
  
  return avatar
}
</script>

<template>
  <ul role="list" class="divide-y divide-(--ui-border)">
    <li
      v-for="(member, index) in members"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar
          v-bind="getAvatarProps(member.avatar)"
          size="md"
        />

        <div class="text-sm min-w-0">
          <p class="text-(--ui-text-highlighted) font-medium truncate">
            {{ member.name }}
          </p>
          <p class="text-(--ui-text-muted) truncate">
            {{ member.username }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <USelect
          :model-value="member.role"
          :items="['member', 'owner']"
          color="neutral"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
        />

        <UDropdownMenu :items="items" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
</template>
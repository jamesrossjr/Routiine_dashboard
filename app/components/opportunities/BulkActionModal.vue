<script setup lang="ts">
defineProps<{
  count: number
}>()

const isOpen = ref(false)

function open() {
  isOpen.value = true
}
</script>

<template>
  <div>
    <slot>
      <UButton
        label="Bulk Action"
        variant="subtle"
        icon="i-lucide-sparkles"
        @click="open"
      />
    </slot>

    <UModal v-model="isOpen">
      <UCard>
        <template #header>
          <div class="text-lg font-semibold">Bulk Actions</div>
        </template>

        <p class="text-sm text-gray-500 mb-4">
          You have selected <span class="font-medium">{{ count }}</span> opportunity<span v-if="count !== 1">ies</span>.
        </p>

        <div class="space-y-3">
          <UButton
            block
            variant="outline"
            label="Change Stage"
            icon="i-lucide-layers"
            @click="() => $emit('change-stage')"
          />
          <UButton
            block
            variant="outline"
            label="Assign Tags"
            icon="i-lucide-tags"
            @click="() => $emit('tag')"
          />
          <UButton
            block
            variant="outline"
            label="Archive Selected"
            color="warning"
            icon="i-lucide-archive"
            @click="() => $emit('archive')"
          />
        </div>
      </UCard>
    </UModal>
  </div>
</template>

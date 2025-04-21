<script setup lang="ts">
const token = ref('')
const saved = ref(false)

async function saveToken() {
  await $fetch('/api/set-token', {
    method: 'POST',
    body: { token: token.value }
  })
  saved.value = true
}
</script>

<template>
  <UDashboardPanel title="Integrations">
    <template #body>
      <UForm class="space-y-4" @submit.prevent="saveToken">
        <UFormField label="Pipedrive API Token" name="token">
          <UInput v-model="token" placeholder="Paste your Pipedrive API token here" />
        </UFormField>

        <UButton type="submit" label="Save Token" color="primary" />
        <div v-if="saved" class="text-green-600 mt-2">Token saved successfully!</div>
      </UForm>
    </template>
  </UDashboardPanel>
</template>

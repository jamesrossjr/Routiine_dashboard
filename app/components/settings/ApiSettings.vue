<script setup lang="ts">
import { ref } from 'vue'

const pipedriveToken = ref('')
const loading = ref(false)
const toast = useToast()

async function saveToken() {
  loading.value = true
  try {
    await $fetch('/api/pipedrive/token', {
      method: 'POST',
      body: { token: pipedriveToken.value }
    })
    toast.add({ title: 'Token Saved', description: 'Pipedrive connection updated' })
  } catch (err) {
    toast.add({
  title: 'Error',
  description: 'Failed to save token.',
  color: 'error'
})
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <UFormField label="Pipedrive API Token">
      <UInput v-model="pipedriveToken" placeholder="Paste your API token" />
    </UFormField>
    <UButton @click="saveToken" :loading="loading" label="Save Token" color="primary" />
  </div>
</template>

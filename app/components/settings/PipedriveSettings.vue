<script setup lang="ts">
import { ref, onMounted } from 'vue'

const pipedriveToken = ref('')
const loading = ref(false)
const toast = useToast()

// Load existing token (if available from cookie)
onMounted(async () => {
  try {
    const res = await $fetch('/api/pipedrive/tokens')

    if ('token' in res && typeof res.token === 'string') {
      pipedriveToken.value = res.token
    }
  } catch (e) {
    console.warn('Unable to fetch Pipedrive token.', e)
  }
  type TokenResponse = { token: string } | { error: string } | { status: string }

const res = await $fetch<TokenResponse>('/api/pipedrive/tokens')
})

async function saveToken() {
  loading.value = true
  try {
    await $fetch('/api/pipedrive/tokens', {
      method: 'POST',
      body: { token: pipedriveToken.value }
    })
    toast.add({
      title: 'Token Saved',
      description: 'Pipedrive API token connected successfully.',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to save Pipedrive token.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="border border-gray-200 dark:border-gray-800 rounded-xl">
    <template #header>
      <div class="flex flex-col space-y-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pipedrive</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Paste your personal API token from Pipedrive to connect your CRM.
        </p>
      </div>
    </template>

    <div class="space-y-4">
      <UFormField label="Pipedrive API Token" name="pipedriveToken">
        <UInput
          v-model="pipedriveToken"
          type="text"
          placeholder="Paste your token here"
          icon="i-lucide-key"
        />
      </UFormField>

      <UButton
        label="Save Token"
        color="primary"
        :loading="loading"
        @click="saveToken"
      />
    </div>
  </UCard>
</template>

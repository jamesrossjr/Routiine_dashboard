<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const toast = useToast()
const saved = ref(false)
const loading = ref(false)

// Required for UForm: create a reactive state object
const state = reactive({
  pipedriveToken: ''
})

// Load saved token from cookie when component mounts
onMounted(async () => {
  try {
    const res = await $fetch('/api/pipedrive/tokens')
    if ('token' in res && typeof res.token === 'string') {
      state.pipedriveToken = res.token
    }
  } catch (e) {
    console.warn('Unable to fetch Pipedrive token.', e)
  }
})

// Save token via POST request
async function saveToken() {
  loading.value = true
  try {
    const res = await $fetch('/api/pipedrive/tokens', {
      method: 'POST',
      body: { token: state.pipedriveToken }
    })

    if ('status' in res && res.status === 'success') {
      saved.value = true
      toast.add({
        title: 'Success',
        description: 'Your Pipedrive API token has been saved.',
        color: 'success'
      })
    } else {
      throw new Error('Invalid response from server.')
    }
  } catch (err) {
    console.error('Token save failed:', err)
    toast.add({
      title: 'Error',
      description: 'Failed to save token. Check the console for details.',
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
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pipedrive Integration</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Paste your personal API token from Pipedrive to connect your CRM.
        </p>
      </div>
    </template>

    <UForm :state="state" class="space-y-4" @submit.prevent="saveToken">
      <UFormField label="Pipedrive API Token" name="pipedriveToken">
        <UInput
          v-model="state.pipedriveToken"
          type="text"
          placeholder="Paste your token here"
          icon="i-lucide-key"
        />
      </UFormField>

      <UButton
        type="submit"
        label="Save Token"
        color="primary"
        :loading="loading"
      />

      <div v-if="saved" class="text-green-600 text-sm mt-2">
        ✅ Token saved successfully!
      </div>
    </UForm>
  </UCard>
</template>

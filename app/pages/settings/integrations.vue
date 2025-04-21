<script setup lang="ts">
import { ref, reactive } from 'vue'

const token = ref('')
const saved = ref(false)

// Required state object for <UForm>
const state = reactive({
  token: ''
})

async function saveToken() {
  await $fetch('/api/set-tokens', {
    method: 'POST',
    body: { token: state.token } // use state.token instead of token.value
  })
  saved.value = true
}
</script>


<template>
    <UDashboardPanel title="Integrations">
      <template #body>
        <UForm :state="state" class="space-y-4" @submit.prevent="saveToken">
          <UFormField label="Pipedrive API Token" name="token">
            <UInput v-model="state.token" placeholder="Paste your Pipedrive API token here" />
          </UFormField>
  
          <UButton type="submit" label="Save Token" color="primary" />
          <div v-if="saved" class="text-green-600 mt-2">Token saved successfully!</div>
        </UForm>
      </template>
    </UDashboardPanel>
  </template>
  

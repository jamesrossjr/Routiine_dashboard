<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits(['created'])
const open = ref(false)

const stages = [
  { label: 'Qualification', value: 'qualification' },
  { label: 'Proposal', value: 'proposal' },
  { label: 'Negotiation', value: 'negotiation' },
  { label: 'Closed - Won', value: 'won' },
  { label: 'Closed - Lost', value: 'lost' }
]

const statuses = [
  { label: 'Open', value: 'open' },
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' }
]

const schema = z.object({
  title: z.string().min(2, 'Opportunity title is required'),
  account: z.string().min(2, 'Account is required'),
  value: z.coerce.number().min(1, 'Value must be greater than zero'),
  stage: z.enum(['qualification', 'proposal', 'negotiation', 'won', 'lost']),
  status: z.enum(['open', 'won', 'lost'])
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: '',
  account: '',
  value: 0,
  stage: 'qualification',
  status: 'open'
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('created', {
    id: Math.random().toString(36).slice(2),
    ...event.data
  })

  toast.add({
    title: 'Success',
    description: `Opportunity "${event.data.title}" created.`,
    color: 'success'
  })

  open.value = false
}
</script>

<template>
  <div>
    <UButton label="New Opportunity" icon="i-lucide-plus" @click="open = true" />

    <UModal
      v-model:open="open"
      title="New Opportunity"
      description="Create a new sales opportunity"
    >
      <template #body>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Title" name="title">
            <UInput v-model="state.title" placeholder="E.g. ACME Upgrade Project" />
          </UFormField>

          <UFormField label="Account" name="account">
            <UInput v-model="state.account" placeholder="Client or company name" />
          </UFormField>

          <UFormField label="Value" name="value">
            <UInput type="number" v-model.number="state.value" placeholder="Enter amount in USD" />
          </UFormField>

          <UFormField label="Stage" name="stage">
            <USelect v-model="state.stage" :options="stages" />
          </UFormField>

          <UFormField label="Status" name="status">
            <USelect v-model="state.status" :options="statuses" />
          </UFormField>

          <div class="flex justify-end gap-2 pt-2">
            <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
            <UButton type="submit" label="Create" color="primary" />
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Period, Range } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

const loading = ref(true)
const deals = ref<any[]>([])

async function loadDeals() {
  loading.value = true
  try {
    const res = await $fetch('/api/deals')
    const filtered = res.filter((deal: any) => {
      const wonDate = deal.won_time ? new Date(deal.won_time) : null
      return deal.status === 'won' && wonDate && wonDate >= props.range.start && wonDate <= props.range.end
    })
    deals.value = filtered
  } catch (err) {
    console.error('Failed to load deals:', err)
    deals.value = []
  } finally {
    loading.value = false
  }
}

const dealsClosed = computed(() => deals.value.length)

const revenueGenerated = computed(() =>
  deals.value.reduce((sum, deal) => sum + (deal.value || 0), 0)
)

const avgSalesCycle = computed(() => {
  const durations = deals.value
    .filter(d => d.add_time && d.won_time)
    .map(d => {
      const start = new Date(d.add_time).getTime()
      const end = new Date(d.won_time).getTime()
      return (end - start) / (1000 * 60 * 60 * 24) // days
    })

  if (durations.length === 0) return '—'
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length
  return `${Math.round(avg)} days`
})

const pipelineCoverage = computed(() => {
  // Placeholder: assume quota is $25,000
  const quota = 25000
  if (!revenueGenerated.value) return '—'
  return (revenueGenerated.value / quota).toFixed(1) + 'x'
})

onMounted(loadDeals)
watch(() => [props.period, props.range], loadDeals, { deep: true })
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="space-y-1">
      <div class="text-sm text-gray-500">Deals Closed</div>
      <div class="text-2xl font-bold text-teal-500">{{ dealsClosed }}</div>
    </div>

    <div class="space-y-1">
      <div class="text-sm text-gray-500">Revenue Generated</div>
      <div class="text-2xl font-bold text-teal-500">${{ revenueGenerated.toLocaleString() }}</div>
    </div>

    <div class="space-y-1">
      <div class="text-sm text-gray-500">Pipeline Coverage</div>
      <div class="text-2xl font-bold text-amber-500">{{ pipelineCoverage }}</div>
    </div>

    <div class="space-y-1">
      <div class="text-sm text-gray-500">Avg. Sales Cycle</div>
      <div class="text-2xl font-bold text-sky-500">{{ avgSalesCycle }}</div>
    </div>
  </div>
</template>

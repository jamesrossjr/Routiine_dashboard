<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Period, Range } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

interface Deal {
  id: number
  title: string
  value: number
  update_time: string
  stage_id: number
  status: string
  org_name?: string
}

const deals = ref<Deal[]>([])

const stageWeights: Record<number, number> = {
  1: 10,
  2: 20,
  3: 35,
  4: 50,
  5: 80,
  6: 100
}

function getStageName(stageId: number): string {
  return {
    1: 'Signal Intake',
    2: 'Solution Fit',
    3: 'Proposal',
    4: 'Negotiation',
    5: 'Close & Launch',
    6: 'Post-Sell Success'
  }[stageId] || 'Unknown'
}

function getTimeAgo(dateStr: string): string {
  const now = new Date().getTime()
  const then = new Date(dateStr).getTime()
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function calculateScore(deal: Deal): number {
  const now = Date.now()
  const lastContact = new Date(deal.update_time).getTime()
  const daysSinceLastContact = (now - lastContact) / (1000 * 60 * 60 * 24)

  const base = stageWeights[deal.stage_id] || 20
  const decay = Math.min(daysSinceLastContact * 2, 40)
  const valueBoost = Math.min((deal.value || 0) / 1000, 20)

  return Math.round(Math.max(0, base + valueBoost - decay))
}

const clients = computed(() =>
  deals.value.map(deal => ({
    name: deal.org_name || deal.title || 'Unnamed Deal',
    dealSize: `$${(deal.value || 0).toLocaleString()}`,
    lastContact: getTimeAgo(deal.update_time || ''),
    stage: getStageName(deal.stage_id),
    conversionScore: calculateScore(deal)
  }))
)

function getProgressColor(score: number): string {
  if (score >= 80) return '#10B981' // green
  if (score >= 60) return '#F59E0B' // yellow
  return '#EF4444'                 // red
}

function getRandomWidth(): number {
  return Math.floor(Math.random() * 91) + 10
}

function getDataVisualizationBar(index: number, opacity = 1): string {
  const colors = [
    `rgba(59, 130, 246, ${opacity})`,   // blue
    `rgba(16, 185, 129, ${opacity})`,   // green
    `rgba(249, 115, 22, ${opacity})`    // orange
  ]
  return colors[index % colors.length] || 'rgba(0,0,0,1)'
}

async function loadDeals() {
  try {
    const res = await $fetch<Deal[]>('/api/deals')
    deals.value = res.filter(d => d.status === 'open')
  } catch (e) {
    console.error('Error loading deals:', e)
    deals.value = []
  }
}

onMounted(loadDeals)
watch(() => [props.period, props.range], loadDeals, { deep: true })
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    <div 
      v-for="(client, index) in clients" 
      :key="`${client.name}-${index}`"
      class="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div class="mb-4">
        <h4 class="font-semibold text-gray-900 dark:text-white truncate">{{ client.name }}</h4>
        
        <!-- Progress bar -->
        <div class="mt-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            :style="{
              width: client.conversionScore + '%',
              height: '4px',
              backgroundColor: getProgressColor(client.conversionScore)
            }"
            class="rounded-full transition-all duration-300 ease-in-out"
          />
        </div>
      </div>

      <!-- Decorative data bars -->
      <div class="space-y-1 my-4">
        <div 
          v-for="i in 3" 
          :key="`bar-${index}-${i}`" 
          class="h-3 rounded-full"
          :style="{
            width: getRandomWidth() + '%',
            backgroundColor: getDataVisualizationBar(i - 1)
          }"
        />
      </div>

      <!-- Deal details -->
      <div class="space-y-1 text-sm mt-4">
        <div class="flex justify-between">
          <span class="text-gray-500">Deal Size</span>
          <span class="font-medium">{{ client.dealSize }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Last Contact</span>
          <span class="font-medium">{{ client.lastContact }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Stage</span>
          <span class="font-medium text-xs">{{ client.stage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

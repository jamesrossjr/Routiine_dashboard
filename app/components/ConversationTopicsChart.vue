<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Note {
  content?: string
  add_time?: string
}

const props = defineProps<{
  period: string
  range: { start: Date; end: Date }
}>()

const chartData = ref<{ name: string; value: number }[]>([])
const loading = ref(true)

// Define keywords to extract
const KEYWORDS = ['budget', 'timeline', 'authority', 'need', 'risk']

function extractKeywords(notes: Note[]) {
  const keywordCounts: Record<string, number> = {}

  for (const keyword of KEYWORDS) {
    keywordCounts[keyword] = 0
  }

  for (const note of notes) {
    const content = typeof note.content === 'string' ? note.content.toLowerCase() : ''

    for (const keyword of KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = content.match(regex)
      if (matches?.length) {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + matches.length

      }
    }
  }

  return Object.entries(keywordCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))
}

async function generateChartData() {
  loading.value = true

  try {
    const notes: Note[] = await $fetch('/api/notes')
    const filtered = notes.filter(note => {
      if (!note.add_time) return false
      const createdAt = new Date(note.add_time)
      return createdAt >= props.range.start && createdAt <= props.range.end
    })

    chartData.value = extractKeywords(filtered)
  } catch (err) {
    console.error('Error loading notes:', err)
    chartData.value = []
  } finally {
    loading.value = false
  }
}

const chartJsData = computed(() => ({
  labels: chartData.value.map(item => item.name),
  datasets: [
    {
      label: 'Topics',
      data: chartData.value.map(item => item.value),
      backgroundColor: '#3B82F6',
      borderRadius: 4,
      borderWidth: 0
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#e5e7eb' },
      ticks: { color: '#6B7280', font: { size: 12 } }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#6B7280', font: { size: 12 } }
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'white',
      titleColor: '#111827',
      bodyColor: '#111827',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      cornerRadius: 8,
      boxPadding: 4
    }
  }
}))

onMounted(generateChartData)
watch(() => [props.period, props.range], generateChartData, { deep: true })
</script>

<template>
  <div>
    <USkeleton v-if="loading" class="h-full w-full" />
    <client-only v-else>
      <div class="h-full w-full">
        <BarChart :data="chartJsData" :options="chartOptions" />
      </div>
      <p class="text-xs text-center text-gray-500 mt-2">Frequency of Conversation Topics</p>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { format, startOfWeek } from 'date-fns'

// Props from dashboard
const props = defineProps<{
  period: string
  range: {
    start: Date
    end: Date
  }
}>()

// State
const chartData = ref<{ name: string, Activities: number, Conversions: number }[]>([])
const loading = ref(true)

// Helpers
function getWeekLabel(date: Date) {
  return format(startOfWeek(date, { weekStartsOn: 1 }), 'MMM d')
}

async function generateChartData() {
  loading.value = true

  try {
    const [dealsRes, activitiesRes] = await Promise.all([
      $fetch('/api/deals'),
      $fetch('/api/activities')
    ])

    const deals = dealsRes || []
    const activities = activitiesRes || []

    const grouped: Record<string, { Activities: number; Conversions: number }> = {}

    // Group activities by week
    for (const activity of activities) {
      const activityDate = new Date(activity.add_time)
      if (activityDate >= new Date(props.range.start) && activityDate <= new Date(props.range.end)) {
        const week = getWeekLabel(activityDate)
        if (!grouped[week]) grouped[week] = { Activities: 0, Conversions: 0 }
        grouped[week].Activities++
      }
    }

    // Group won deals by week
    for (const deal of deals) {
      if (deal.status === 'won' && deal.won_time) {
        const wonDate = new Date(deal.won_time)
        if (wonDate >= new Date(props.range.start) && wonDate <= new Date(props.range.end)) {
          const week = getWeekLabel(wonDate)
          if (!grouped[week]) grouped[week] = { Activities: 0, Conversions: 0 }
          grouped[week].Conversions++
        }
      }
    }

    const sortedWeeks = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    chartData.value = sortedWeeks.map(week => ({
  name: week,
  Activities: grouped[week]?.Activities ?? 0,
  Conversions: grouped[week]?.Conversions ?? 0
}))
  } catch (error) {
    console.error('Error loading chart data:', error)
  } finally {
    loading.value = false
  }
}

// Chart.js config
const chartJsData = computed(() => {
  const labels = chartData.value.map(item => item.name)

  return {
    labels,
    datasets: [
      {
        label: 'Activities',
        data: chartData.value.map(item => item.Activities),
        borderColor: '#0DD3B2',
        backgroundColor: 'rgba(13, 211, 178, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Conversions',
        data: chartData.value.map(item => item.Conversions),
        borderColor: '#0EA5E9',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#e5e7eb' },
      ticks: { color: '#6B7280', font: { size: 12 } },
      border: { display: false }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#6B7280', font: { size: 12 } },
      border: { color: '#e5e7eb' }
    }
  },
  plugins: {
    tooltip: {
      backgroundColor: 'white',
      titleColor: '#111827',
      bodyColor: '#111827',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      cornerRadius: 8,
      boxPadding: 4
    },
    legend: {
      labels: {
        color: '#6B7280',
        font: { size: 12 }
      }
    }
  }
}))

// Watch for prop changes
watch(() => [props.period, props.range], generateChartData, { deep: true })

onMounted(() => {
  generateChartData()
})
</script>

<template>
  <div>
    <USkeleton v-if="loading" class="h-full w-full" />

    <client-only v-else>
      <div class="h-full w-full">
        <LineChart
          :data="chartJsData"
          :options="chartOptions"
        />
      </div>
      <p class="text-xs text-center text-gray-500 mt-2">Activity vs Conversion Trend</p>
    </client-only>
  </div>
</template>

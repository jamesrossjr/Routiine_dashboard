<script setup lang="ts">
import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'

// Learning Item Type
type Status = 'positive' | 'neutral' | 'negative'

interface LearningItem {
  id: string
  skill: string
  points: number
  status: Status
  createdAt: Date
  signalId?: string
}

// Store
const learningItems = ref<LearningItem[]>([
  {
    id: nanoid(),
    skill: 'Handled Price Objection',
    points: 3,
    status: 'positive',
    createdAt: new Date()
  },
  {
    id: nanoid(),
    skill: 'Missed Early Framing',
    points: -1,
    status: 'negative',
    createdAt: new Date()
  }
])

// Add a new learning item
function addLearningItem(skill: string, points: number, status: Status, signalId?: string) {
  learningItems.value.unshift({
    id: nanoid(),
    skill,
    points,
    status,
    createdAt: new Date(),
    signalId
  })
}

// Display color
function getStatusColor(status: Status) {
  return {
    positive: 'text-emerald-500',
    negative: 'text-rose-500',
    neutral: 'text-gray-500'
  }[status]
}

// Stat summaries
const totalPoints = computed(() =>
  learningItems.value.reduce((sum, item) => sum + item.points, 0)
)
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center border-b pb-2">
      <h2 class="text-base font-semibold text-gray-800 dark:text-gray-200">Learning Hub</h2>
      <span class="text-sm text-gray-500 dark:text-gray-400">Total Points: {{ totalPoints }}</span>
    </div>

    <div 
      v-for="item in learningItems" 
      :key="item.id"
      class="flex justify-between items-center py-2 border-b border-dashed border-gray-200 dark:border-gray-700"
    >
      <div>
        <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ item.skill }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ new Date(item.createdAt).toLocaleDateString() }}
        </p>
      </div>
      <div :class="[getStatusColor(item.status), 'text-sm font-semibold']">
        {{ item.points > 0 ? `+${item.points}pts` : item.points === 0 ? 'Neutral' : `${item.points}pt` }}
      </div>
    </div>
  </div>
</template>

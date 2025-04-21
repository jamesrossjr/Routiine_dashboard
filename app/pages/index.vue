<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'

// Charts & modules
import ActivityConversionChart from '~/components/ActivityConversionChart.vue'
import ConversationTopicsChart from '~/components/ConversationTopicsChart.vue'
import ConversionPredictions from '~/components/ConversionPredictions.vue'
import LearningHub from '~/components/LearningHub.vue'
import SalesPerformance from '~/components/SalesPerformance.vue'

// Utilities
const { isNotificationsSlideoverOpen } = useDashboard()
const { data: deals, pending } = await useFetch('/api/deals')

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 30 }),
  end: new Date()
})

const period = ref<Period>('weekly')

const dealStats = computed(() => {
  const allDeals = deals.value || []

  const open = allDeals.filter((d: { status: string }) => d.status === 'open').length
  const won = allDeals.filter((d: { status: string }) => d.status === 'won').length
  const lost = allDeals.filter((d: { status: string }) => d.status === 'lost').length
  const totalValue = allDeals.reduce((sum: any, d: { value: any }) => sum + (d.value || 0), 0)

  return {
    open,
    won,
    lost,
    totalValue
  }
})

const quickCreateItems = [[
  {
    label: 'New Opportunity',
    icon: 'i-lucide-briefcase',
    to: '/opportunities'
  },
  {
    label: 'New Task',
    icon: 'i-lucide-check-square',
    to: '/inbox'
  },
  {
    label: 'Connect CRM',
    icon: 'i-lucide-link',
    to: '/settings/integrations'
  }
]]
</script>

<template>
  <UDashboardPanel id="dashboard">
    <!-- Top Navigation -->
    <template #header>
      <UDashboardNavbar title="Routiine Dashboard" :ui="{ title: 'text-xl font-semibold text-primary', right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton color="neutral" variant="ghost" square @click="isNotificationsSlideoverOpen = true">
              <UChip color="primary" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="quickCreateItems">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" color="primary" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <!-- Period & Date Range Filters -->
      <UDashboardToolbar class="border-b border-gray-200 dark:border-gray-800">
        <template #left>
          <HomeDateRangePicker
            v-model="range"
            class="-ms-1"
            :ui="{
              wrapper: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm',
              input: 'text-primary font-medium'
            }"
          />

          <HomePeriodSelect
            v-model="period"
            :range="range"
            :ui="{
              select: 'border border-gray-200 dark:border-gray-800 rounded-lg text-sm',
              option: 'ui-selected:bg-primary-100 ui-selected:text-primary-900 dark:ui-selected:bg-primary-900 dark:ui-selected:text-primary-100'
            }"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <!-- Main Dashboard Body -->
    <template #body>
      <div class="p-4 space-y-6">

        <!-- Charts: Activity vs Conversion + Topics -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UCard class="border border-gray-200 dark:border-gray-800 rounded-xl">
            <template #header>
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Monthly Activity vs Conversion</h3>
              </div>
            </template>
            <div class="p-4">
              <ActivityConversionChart :period="period" :range="range" class="h-72" />
            </div>
          </UCard>

          <UCard class="border border-gray-200 dark:border-gray-800 rounded-xl">
            <template #header>
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Conversation Topics Breakdown</h3>
              </div>
            </template>
            <div class="p-4">
              <ConversationTopicsChart :period="period" :range="range" class="h-72" />
            </div>
          </UCard>
        </div>

        <!-- Learning + Sales Performance -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UCard class="border border-gray-200 dark:border-gray-800 rounded-xl">
            <template #header>
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Learning Hub</h3>
              </div>
            </template>
            <div class="p-4">
              <LearningHub :period="period" :range="range" />
            </div>
          </UCard>

          <UCard class="border border-gray-200 dark:border-gray-800 rounded-xl">
            <template #header>
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Sales Performance</h3>
              </div>
            </template>
            <div class="p-4">
              <SalesPerformance :period="period" :range="range" />
            </div>
          </UCard>
        </div>

        <!-- Conversion Predictions -->
        <UCard class="border border-gray-200 dark:border-gray-800 rounded-xl">
          <template #header>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Conversion Predictions</h3>
            </div>
          </template>
          <div class="p-4">
            <ConversionPredictions :period="period" :range="range" />
          </div>
        </UCard>

      </div>
    </template>
  </UDashboardPanel>
</template>

<style>
:root {
  --color-primary-50: 240, 249, 255;
  --color-primary-100: 224, 242, 254;
  --color-primary-200: 186, 230, 253;
  --color-primary-300: 125, 211, 252;
  --color-primary-400: 56, 189, 248;
  --color-primary-500: 14, 165, 233;
  --color-primary-600: 2, 132, 199;
  --color-primary-700: 3, 105, 161;
  --color-primary-800: 7, 89, 133;
  --color-primary-900: 12, 74, 110;
  --color-primary-950: 8, 47, 73;
}
</style>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel, type Row } from '@tanstack/table-core'
import type { Opportunity } from '~/types'

import OpportunitiesAddModal from '~/components/opportunities/AddModal.vue'
import OpportunitiesBulkActionModal from '~/components/opportunities/BulkActionModal.vue'

const toast = useToast()
const table = useTemplateRef<any>('table')

const columnFilters = ref([{ id: 'account', value: '' }])
const columnVisibility = ref()
const rowSelection = ref({})
const stageFilter = ref('all')
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const { data: rawData, status } = await useFetch<Opportunity[]>('/api/opportunities')

const opportunities = ref<Opportunity[]>([])

watchEffect(() => {
  if (rawData.value) {
    opportunities.value = rawData.value
  }
})

function handleCreated(opportunity: Opportunity) {
  opportunities.value.unshift(opportunity)
  toast.add({
    title: 'Opportunity Created',
    description: `${opportunity.title} added to pipeline.`
  })
}

function getRowItems(row: Row<Opportunity>) {
  return [
    { type: 'label', label: 'Opportunity Actions' },
    {
      label: 'Copy Opportunity ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString())
        toast.add({ title: 'Copied', description: 'ID copied to clipboard' })
      }
    },
    { type: 'separator' },
    { label: 'View Opportunity', icon: 'i-lucide-list' },
    { label: 'View Activity Log', icon: 'i-lucide-clock' },
    { type: 'separator' },
    {
      label: 'Archive Opportunity',
      icon: 'i-lucide-archive',
      color: 'warning',
      onSelect() {
        toast.add({ title: 'Archived', description: 'Opportunity archived.' })
      }
    }
  ]
}

const columns: TableColumn<Opportunity>[] = [
  {
    id: 'select',
    header: ({ table }) => h(resolveComponent('UCheckbox'), {
      modelValue: table.getIsSomePageRowsSelected()
        ? 'indeterminate'
        : table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
        table.toggleAllPageRowsSelected(!!value)
    }),
    cell: ({ row }) => h(resolveComponent('UCheckbox'), {
      modelValue: row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value)
    })
  },
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'account',
    header: 'Account',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.original.account)
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => h('div', {}, [
      h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.title),
      h('p', { class: 'text-sm text-(--ui-text-muted)' }, row.original.description || '')
    ])
  },
  {
    accessorKey: 'stage',
    header: 'Stage',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      variant: 'subtle',
      color: 'primary'
    }, () => row.original.stage)
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => `$${row.original.value.toLocaleString()}`
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = {
        open: 'primary',
        won: 'success',
        lost: 'error'
      }[row.original.status]
      return h(resolveComponent('UBadge'), {
        class: 'capitalize',
        variant: 'solid',
        color
      }, () => row.original.status)
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => h('div', { class: 'text-right' },
      h(resolveComponent('UDropdownMenu'), {
        content: { align: 'end' },
        items: getRowItems(row)
      }, () => h(resolveComponent('UButton'), {
        icon: 'i-lucide-ellipsis-vertical',
        color: 'neutral',
        variant: 'ghost',
        class: 'ml-auto'
      }))
    )
  }
]

watch(() => stageFilter.value, (newVal) => {
  const stageColumn = table.value?.tableApi?.getColumn('stage')
  if (!stageColumn) return
  stageColumn.setFilterValue(newVal === 'all' ? undefined : newVal)
})

// Add proper type annotation to break circular reference
const selectedRowsCount = computed<number>(() => {
  return table.value?.tableApi?.getFilteredSelectedRowModel().rows.length || 0
})
</script>

<template>
  <UDashboardPanel id="opportunities">
    <template #header>
      <UDashboardNavbar title="Opportunities">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <OpportunitiesAddModal @created="handleCreated" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          :model-value="(table?.tableApi?.getColumn('account')?.getFilterValue() as string)"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Filter by account..."
          @update:model-value="table?.tableApi?.getColumn('account')?.setFilterValue($event)"
        />

        <div class="flex items-center gap-1.5">
          <template v-if="selectedRowsCount > 0">
            <OpportunitiesBulkActionModal
              :count="selectedRowsCount"
            >
              <UButton
                label="Bulk Action"
                variant="subtle"
                icon="i-lucide-sparkles"
              />
            </OpportunitiesBulkActionModal>
          </template>

          <USelect
            v-model="stageFilter"
            :items="[
              { label: 'All', value: 'all' },
              { label: 'Qualification', value: 'Qualification' },
              { label: 'Proposal', value: 'Proposal' },
              { label: 'Negotiation', value: 'Negotiation' },
              { label: 'Closed - Won', value: 'Closed - Won' },
              { label: 'Closed - Lost', value: 'Closed - Lost' }
            ]"
            class="min-w-28"
            placeholder="Filter stage"
          />

          <UDropdownMenu
            :items="table?.tableApi?.getAllColumns()?.filter((col: any) => col.getCanHide())?.map((col: any) => ({
              label: upperFirst(col.id),
              type: 'checkbox',
              checked: col.getIsVisible(),
              onUpdateChecked: (checked: boolean) => table?.tableApi?.getColumn(col.id)?.toggleVisibility(!!checked),
              onSelect: (e?: Event) => e?.preventDefault()
            }))"
            :content="{ align: 'end' }"
          >
            <UButton label="Display" color="neutral" variant="outline" trailing-icon="i-lucide-settings-2" />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        :data="opportunities"
        :columns="columns"
        :loading="status === 'pending'"
        class="shrink-0"
      />

      <div class="flex items-center justify-between gap-3 border-t border-(--ui-border) pt-4 mt-auto">
        <div class="text-sm text-(--ui-text-muted)">
          {{ selectedRowsCount }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} selected.
        </div>
        <UPagination
          :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length || 0"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
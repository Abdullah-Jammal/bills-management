<script setup>
import { watch, computed } from 'vue'
import {
  useVueTable,
  getPaginationRowModel,
  getCoreRowModel,
  FlexRender,
} from '@tanstack/vue-table'
import { createColumns } from './columns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import UpdateTransactionForm from '../transaction/UpdateTransactionForm.vue'
import axios from 'axios'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-vue-next'

const props = defineProps({
  data: Array,
  page: Number,
  pageCount: Number,
  isLoading: Boolean,
  isError: Boolean,
})

async function handleDelete(id) {
  try {
    await axios.delete(`http://localhost:3001/transactions/${id}`)
  } catch (err) {
    console.error('Failed to delete transaction:', err)
  }
}

async function handleSave(id, updated) {
  try {
    await axios.put(`http://localhost:3001/transactions/${id}`, updated)
  } catch (err) {
    console.error('Failed to update transaction:', err)
  }
}

const emit = defineEmits(['update:page'])
const columns = createColumns(UpdateTransactionForm, handleDelete, handleSave)

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return columns
  },
  pageCount: props.pageCount,
  state: {
    pagination: {
      pageIndex: props.page - 1,
      pageSize: 5,
    },
  },
  manualPagination: true,
  onPaginationChange: (updater) => {
    const next =
      typeof updater === 'function' ? updater({ pageIndex: props.page - 1, pageSize: 5 }) : updater
    emit('update:page', next.pageIndex + 1)
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

watch(
  () => props.page,
  (newPage) => {
    table.setPagination((prev) => ({
      ...prev,
      pageIndex: newPage - 1,
    }))
  },
)

const paginationRange = computed(() => {
  const total = props.pageCount
  const current = props.page
  const range = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) range.push(i)
  } else {
    const showLeftDots = current > 4
    const showRightDots = current < total - 3

    if (!showLeftDots && showRightDots) {
      for (let i = 1; i <= 5; i++) range.push(i)
      range.push('...')
      range.push(total)
    } else if (showLeftDots && !showRightDots) {
      range.push(1)
      range.push('...')
      for (let i = total - 4; i <= total; i++) range.push(i)
    } else {
      range.push(1)
      range.push('...')
      for (let i = current - 1; i <= current + 1; i++) range.push(i)
      range.push('...')
      range.push(total)
    }
  }

  return range
})

const hasData = computed(() => props.data?.length > 0)
</script>

<template>
  <div class="border rounded-xs bg-white">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="props.isLoading">
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center text-gray-500">
              Loading...
            </TableCell>
          </TableRow>
        </template>

        <template v-else-if="props.isError">
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center text-red-500 font-bold">
              Failed to load data.
            </TableCell>
          </TableRow>
        </template>

        <template v-else-if="hasData">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            class="hover:bg-gray-50 cursor-pointer"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <template v-if="cell.column.id !== 'actions'">
                <RouterLink :to="`/bills/${row.original.billId}`" class="block w-full h-full">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </RouterLink>
              </template>
              <template v-else>
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </template>
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">No results.</TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>

    <div class="flex items-center justify-center py-4 space-x-2 mr-10 mt-6">
      <Button
        variant="outline"
        size="sm"
        :disabled="props.page <= 1"
        class="border-orange-500 text-orange-500 hover:bg-orange-50"
        @click="emit('update:page', props.page - 1)"
      >
        <ArrowBigLeft />
      </Button>

      <template v-for="i in paginationRange" :key="i">
        <span v-if="i === '...'">...</span>
        <Button
          v-else
          variant="outline"
          size="sm"
          @click="emit('update:page', i)"
          :class="[
            i === props.page
              ? 'bg-orange-500 text-white border-orange-500'
              : 'border-orange-500 text-orange-500 hover:bg-orange-50',
          ]"
        >
          {{ i }}
        </Button>
      </template>

      <Button
        variant="outline"
        size="sm"
        :disabled="props.page >= props.pageCount"
        class="border-orange-500 text-orange-500 hover:bg-orange-50"
        @click="emit('update:page', props.page + 1)"
      >
        <ArrowBigRight />
      </Button>
    </div>
  </div>
</template>

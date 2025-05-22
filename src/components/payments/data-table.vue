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
import UpdateBillDialog from '../form/UpdateBillDialog.vue'
import axios from 'axios'

const props = defineProps({
  data: Array,
  page: Number,
  pageCount: Number,
  isLoading: Boolean,
  isError: Boolean,
})

async function handleDelete(id) {
  await axios.delete(`http://localhost:3001/bills/${id}`)
}

async function handleSave(id, updated) {
  await axios.put(`http://localhost:3001/bills/${id}`, updated)
}

const emit = defineEmits(['update:page'])
const columns = createColumns(UpdateBillDialog, handleDelete, handleSave)

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
                <RouterLink :to="`/bills/${row.original.id}`" class="block w-full h-full">
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

    <div class="flex items-center justify-end py-4 space-x-2">
      <Button
        variant="outline"
        size="sm"
        :disabled="props.page <= 1"
        @click="emit('update:page', props.page - 1)"
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="props.page >= props.pageCount"
        @click="emit('update:page', props.page + 1)"
      >
        Next
      </Button>
    </div>
  </div>
</template>

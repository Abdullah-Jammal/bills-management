<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import axios from 'axios'
import DataTable from '../components/payments/data-table.vue'
import { Button } from '@/components/ui/button'
import { getLocalTimeZone } from '@internationalized/date'
import { PlusCircle } from 'lucide-vue-next'
import { fetchBills } from '@/utils/fetchBills'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import BillFilters from '@/components/payments/BillFilters.vue'
import Statistics from '@/components/payments/Statistics.vue'

import { useForm } from 'vee-validate'
import { schema } from '@/types/schema'
import { toTypedSchema } from '@vee-validate/zod'
import CreateBillForm from '@/components/form/CreateBillForm.vue'

const value = ref({ start: null, end: null })

const selectedDateRange = computed(() => {
  if (!value.value.start || !value.value.end) return null
  const startDate = value.value.start.toDate(getLocalTimeZone())
  const endDate = value.value.end.toDate(getLocalTimeZone())
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  }
})

const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const filterPaid = ref('all')
const filterStatus = ref('all')

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    billNumber: '',
    receiver: '',
    amount: 0,
    issuedDate: '',
    station: '',
    executionDate: '',
    status: 'pending',
    isPaid: false,
  },
})

const data = ref([])
const page = ref(1)
const pageSize = ref(5)
const pageCount = ref(0)
const isLoading = ref(false)
const isError = ref(false)

const stats = ref({
  total: 0,
  paidAmount: 0,
  unpaidAmount: 0,
  executed: 0,
  pending: 0,
})

async function getData() {
  isLoading.value = true
  isError.value = false

  try {
    const token = localStorage.getItem('accessToken')
    const {
      paginated,
      totalPages,
      stats: resultStats,
    } = await fetchBills({
      token,
      page: page.value,
      pageSize: pageSize.value,
      search: debouncedSearchQuery.value,
      status: filterStatus.value,
      paid: filterPaid.value,
      dateRange: selectedDateRange.value,
    })

    data.value = paginated
    pageCount.value = totalPages
    stats.value = resultStats
  } catch (err) {
    isError.value = true
    console.error('❌ Failed to fetch data:', err)
  } finally {
    isLoading.value = false
  }
}

watch([page, filterPaid, filterStatus, selectedDateRange], getData, { immediate: true })

let debounceTimer
watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedSearchQuery.value = newVal
    page.value = 1
    getData()
  }, 500)
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const token = localStorage.getItem('accessToken')
    await axios.post('http://localhost:3001/bills', values, {
      headers: { Authorization: `Bearer ${token}` },
    })
    resetForm()
    getData()
  } catch (err) {
    console.error('❌ Failed to create bill:', err)
  }
})
const userEmail = ref('')

onMounted(() => {
  const user = localStorage.getItem('authUser')
  if (user) {
    try {
      const parsedUser = JSON.parse(user)
      userEmail.value = parsedUser.email || ''
    } catch (e) {
      console.error('Invalid authUser JSON:', e)
    }
  }
})
</script>

<template>
  <div class="w-[95%] mx-auto py-10">
    <div class="text-left text-md text-gray-600 mb-2">
      Logged in as: <span class="font-semibold">{{ userEmail }}</span>
    </div>
    <div
      class="flex flex-wrap justify-between items-center mb-6 bg-white px-6 py-5 rounded-md gap-4"
    >
      <BillFilters
        :stats="stats"
        v-model:searchQuery="searchQuery"
        v-model:filterStatus="filterStatus"
        v-model:filterPaid="filterPaid"
        v-model:dateRange="value"
      />

      <Dialog>
        <DialogTrigger>
          <Button class="bg-orange-500 w-48 rounded-xs cursor-pointer"
            ><PlusCircle /> Create Bill</Button
          >
        </DialogTrigger>
        <DialogContent class="dialog-content">
          <DialogHeader>
            <DialogTitle>Create a new bill</DialogTitle>
            <DialogDescription>Fill in the details</DialogDescription>
          </DialogHeader>
          <CreateBillForm @submit="onSubmit" />
        </DialogContent>
      </Dialog>
    </div>

    <Statistics :stats="stats" />

    <DataTable
      :data="data"
      :page="page"
      :pageCount="pageCount"
      :isLoading="isLoading"
      :isError="isError"
      @update:page="page = $event"
    />
  </div>
</template>

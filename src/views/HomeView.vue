<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import DataTable from '../components/payments/data-table.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

const df = new DateFormatter('en-US', { dateStyle: 'medium' })

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

function clearDateRange() {
  value.value = { start: null, end: null }
}

const schema = z.object({
  billNumber: z.string().min(1, 'Required'),
  receiver: z.string().min(1, 'Required'),
  station: z.string().min(1, 'Required'),
  amount: z.coerce.number().min(1, 'Must be positive'),
  issuedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  executionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  status: z.enum(['pending', 'executed']),
  isPaid: z.coerce.boolean(),
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
    const res = await axios.get('http://localhost:3001/bills', {
      headers: { Authorization: `Bearer ${token}` },
    })

    let filtered = res.data

    if (debouncedSearchQuery.value) {
      const q = debouncedSearchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (b) => b.billNumber?.toLowerCase().includes(q) || b.receiver?.toLowerCase().includes(q),
      )
    }

    if (filterPaid.value !== 'all') {
      filtered = filtered.filter((b) => b.isPaid === (filterPaid.value === 'true'))
    }

    if (filterStatus.value !== 'all') {
      filtered = filtered.filter((b) => b.status === filterStatus.value)
    }

    if (selectedDateRange.value) {
      const { start, end } = selectedDateRange.value
      filtered = filtered.filter((b) => {
        const issued = b.issuedDate?.slice(0, 10)
        const exec = b.executionDate?.slice(0, 10)
        return (
          (issued && issued >= start && issued <= end) || (exec && exec >= start && exec <= end)
        )
      })
    }

    const startIndex = (page.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    data.value = filtered.slice(startIndex, endIndex)
    pageCount.value = Math.ceil(filtered.length / pageSize.value)

    stats.value.total = res.data.length
    stats.value.paidAmount = res.data.filter((b) => b.isPaid).reduce((sum, b) => sum + b.amount, 0)
    stats.value.unpaidAmount = res.data
      .filter((b) => !b.isPaid)
      .reduce((sum, b) => sum + b.amount, 0)
    stats.value.executed = res.data.filter((b) => b.status === 'executed').length
    stats.value.pending = res.data.filter((b) => b.status === 'pending').length
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
</script>

<template>
  <div class="w-[90%] mx-auto py-10">
    <div
      class="flex flex-wrap justify-between items-center mb-6 bg-white px-6 py-5 rounded-md gap-4"
    >
      <div class="flex flex-col gap-6">
        <div class="flex gap-6">
          <Input
            v-model="searchQuery"
            class="w-96"
            placeholder="Search bill number or receiver..."
          />
        </div>

        <div class="flex gap-6 items-center">
          <!-- Status Filter -->
          <Select v-model="filterStatus">
            <SelectTrigger class="w-48">
              <span class="text-gray-500" v-if="filterStatus === 'all'">Filter by Bill Status</span>
              <SelectValue v-else />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="executed">Executed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <!-- Paid Filter -->
          <Select v-model="filterPaid">
            <SelectTrigger class="w-52">
              <span class="text-gray-500" v-if="filterPaid === 'all'">Filter by Paid Status</span>
              <SelectValue v-else />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Paid</SelectItem>
                <SelectItem value="false">Unpaid</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <!-- Date Range Picker -->
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="
                  cn(
                    'w-[280px] justify-start text-left font-normal',
                    !value && 'text-muted-foreground',
                  )
                "
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                <template v-if="value.start">
                  <template v-if="value.end">
                    {{ df.format(value.start.toDate(getLocalTimeZone())) }} -
                    {{ df.format(value.end.toDate(getLocalTimeZone())) }}
                  </template>
                  <template v-else>
                    {{ df.format(value.start.toDate(getLocalTimeZone())) }}
                  </template>
                </template>
                <template v-else> Pick a date </template>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <RangeCalendar
                v-model="value"
                initial-focus
                :number-of-months="2"
                @update:start-value="(startDate) => (value.start = startDate)"
              />
              <div class="p-2 flex justify-end border-t">
                <Button size="sm" variant="ghost" @click="clearDateRange">Clear</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <!-- Create Bill Button -->
      <Dialog>
        <DialogTrigger>
          <Button class="bg-orange-500 w-48">Create Bill</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new bill</DialogTitle>
            <DialogDescription>Fill in the details</DialogDescription>
          </DialogHeader>
          <form @submit.prevent="onSubmit" class="space-y-4 mt-4">
            <FormField v-slot="{ componentField }" name="billNumber">
              <FormItem>
                <FormLabel>Bill Number</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="receiver">
              <FormItem>
                <FormLabel>Receiver</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="station">
              <FormItem>
                <FormLabel>Station</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="amount">
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="issuedDate">
              <FormItem>
                <FormLabel>Issued Date</FormLabel>
                <FormControl>
                  <Input type="date" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="executionDate">
              <FormItem>
                <FormLabel>Execution Date</FormLabel>
                <FormControl>
                  <Input type="date" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="status">
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="executed">Executed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="isPaid">
              <FormItem>
                <div class="flex items-center gap-3">
                  <FormLabel>Is Paid?</FormLabel>
                  <FormControl>
                    <input type="checkbox" class="h-4 w-4" v-bind="componentField" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button type="submit" class="w-full bg-orange-500">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Statistics Section -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-sm font-medium">
      <div class="bg-white border p-4 rounded-md text-center">
        <p>Total Bills</p>
        <h2 class="text-xl font-bold text-blue-500">{{ stats.total }}</h2>
      </div>
      <div class="bg-white border p-4 rounded-md text-center">
        <p>Paid Amount</p>
        <h2 class="text-xl font-bold text-green-500">${{ stats.paidAmount }}</h2>
      </div>
      <div class="bg-white border p-4 rounded-md text-center">
        <p>Unpaid Amount</p>
        <h2 class="text-xl font-bold text-red-500">${{ stats.unpaidAmount }}</h2>
      </div>
      <div class="bg-white border p-4 rounded-md text-center">
        <p>Executed Bills</p>
        <h2 class="text-xl font-bold text-indigo-500">{{ stats.executed }}</h2>
      </div>
      <div class="bg-white border p-4 rounded-md text-center">
        <p>Pending Bills</p>
        <h2 class="text-xl font-bold text-yellow-500">{{ stats.pending }}</h2>
      </div>
    </div>

    <!-- Data Table -->
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

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import DataTable from '../components/payments/data-table.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

const schema = z.object({
  title: z.string().min(2, 'Title is too short').max(50),
  amount: z.coerce.number().min(1, 'Amount is required'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
})

const searchQuery = ref('')
const debouncedSearchQuery = ref('')

if (debouncedSearchQuery.value?.trim()) {
  const query = debouncedSearchQuery.value.trim()
  params.append('billNumber_like', query)
  params.append('receiver_like', query)
}

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    title: '',
    amount: '',
    dueDate: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const token = localStorage.getItem('accessToken')

    await axios.post('http://localhost:3001/bills', values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    data.value = await getData()
  } catch (error) {
    console.error('❌ Failed to create bill:', error)
  }
})

const data = ref([])
const page = ref(1)
const pageSize = ref(5)
const pageCount = ref(0)
const isLoading = ref(false)
const isError = ref(false)

async function getData() {
  isLoading.value = true
  isError.value = false

  try {
    const token = localStorage.getItem('accessToken')

    const allParams = new URLSearchParams()
    allParams.append('_page', page.value)
    allParams.append('_limit', pageSize.value)

    const query = debouncedSearchQuery.value.trim()
    let response

    if (query) {
      // Fetch all and filter manually to simulate OR logic
      const fullRes = await axios.get(`http://localhost:3001/bills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const filtered = fullRes.data.filter(
        (bill) =>
          bill.billNumber?.toString().includes(query) ||
          bill.receiver?.toLowerCase().includes(query.toLowerCase()),
      )

      // Paginate manually
      const start = (page.value - 1) * pageSize.value
      const end = start + pageSize.value
      data.value = filtered.slice(start, end)
      pageCount.value = Math.ceil(filtered.length / pageSize.value)
    } else {
      response = await axios.get(`http://localhost:3001/bills?${allParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const totalCount = Number(response.headers['x-total-count'] || 0)
      pageCount.value = Math.ceil(totalCount / pageSize.value)
      data.value = response.data
    }
  } catch (err) {
    isError.value = true
    console.error('Failed to fetch bills:', err)
  } finally {
    isLoading.value = false
  }
}

watch([page, pageSize], getData, { immediate: true })

let debounceTimeout
watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newVal
    page.value = 1
    getData()
  }, 1000)
})
</script>

<template>
  <div class="w-[90%] mx-auto py-10">
    <div class="w-full">
      <div class="flex justify-between mb-8 bg-white py-5 px-6 rounded-xs">
        <div class="flex gap-4">
          <Input
            v-model="searchQuery"
            placeholder="Search by bill number or receiver..."
            class="w-96 rounded-xs"
          />
          <Select>
            <SelectTrigger class="rounded-xs w-52">
              <SelectValue placeholder="Select a bill status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple"> Apple </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger class="rounded-xs w-52">
              <SelectValue placeholder="Select a paid status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple"> Apple </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger class="rounded-xs w-52">
              <SelectValue placeholder="Select a receiver station" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple"> Apple </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Dialog>
            <DialogTrigger>
              <Button class="bg-orange-500 w-48 rounded-xs">Create bill</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new bill</DialogTitle>
                <DialogDescription> Fill in the details to create a new bill. </DialogDescription>
              </DialogHeader>
              <form @submit.prevent="onSubmit" class="space-y-4">
                <FormField v-slot="{ componentField }" name="title">
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter title"
                        v-bind="componentField"
                        class="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="amount">
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        v-bind="componentField"
                        class="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="dueDate">
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" v-bind="componentField" class="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <Button type="submit" class="mt-4 w-full bg-orange-500"> Create Bill </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <DataTable
        :data="data"
        :page="page"
        :pageCount="pageCount"
        :isLoading="isLoading"
        :isError="isError"
        @update:page="page = $event"
      />
    </div>
  </div>
</template>

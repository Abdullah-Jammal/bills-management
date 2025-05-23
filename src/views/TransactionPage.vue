<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import DataTable from '../components/transaction/data-table.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { PlusCircle } from 'lucide-vue-next'

const schema = z.object({
  billId: z.coerce.number().min(1, 'Bill is required'),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  amount: z.coerce.number().min(1, 'Must be a positive number'),
  station: z.string().min(1, 'Required'),
  receiver: z.string().min(1, 'Required'),
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    billId: null,
    paymentDate: '',
    amount: 0,
    receiver: '',
    station: '',
  },
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
    const res = await axios.get('http://localhost:3001/transactions', {
      headers: { Authorization: `Bearer ${token}` },
    })

    const allTransactions = res.data || []
    const start = (page.value - 1) * pageSize.value
    const end = start + pageSize.value

    data.value = allTransactions.slice(start, end)
    pageCount.value = Math.ceil(allTransactions.length / pageSize.value)
  } catch (err) {
    isError.value = true
    console.error('❌ Failed to fetch transactions:', err)
  } finally {
    isLoading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const token = localStorage.getItem('accessToken')
    await axios.post('http://localhost:3001/transactions', values, {
      headers: { Authorization: `Bearer ${token}` },
    })
    resetForm()
    getData()
  } catch (err) {
    console.error('❌ Failed to create transaction:', err)
  }
})

watch([page], getData, { immediate: true })

const userEmail = ref('')
const bills = ref([])

onMounted(async () => {
  const user = localStorage.getItem('authUser')
  if (user) {
    try {
      const parsedUser = JSON.parse(user)
      userEmail.value = parsedUser.email || ''
    } catch (e) {
      console.error('Invalid authUser JSON:', e)
    }
  }

  try {
    const token = localStorage.getItem('accessToken')
    const res = await axios.get('http://localhost:3001/bills', {
      headers: { Authorization: `Bearer ${token}` },
    })
    bills.value = res.data || []
  } catch (e) {
    console.error('❌ Failed to fetch bills:', e)
  }
})
</script>

<template>
  <div class="w-[95%] mx-auto py-10">
    <div class="flex justify-between mb-6">
      <div class="text-left text-md text-gray-600">
        Logged in as: <span class="font-semibold">{{ userEmail }}</span>
      </div>

      <Dialog>
        <DialogTrigger>
          <Button class="bg-orange-500 rounded-xs text-white cursor-pointer"
            ><PlusCircle /> Create Transaction</Button
          >
        </DialogTrigger>
        <DialogContent class="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Transaction</DialogTitle>
            <DialogDescription>Fill in transaction details</DialogDescription>
          </DialogHeader>

          <form @submit.prevent="onSubmit" class="space-y-4 mt-4">
            <FormField v-slot="{ componentField, value }" name="billId">
              <FormItem>
                <FormLabel>Bill</FormLabel>
                <FormControl>
                  <Select
                    v-bind="componentField"
                    :model-value="value"
                    @update:modelValue="componentField.onChange"
                  >
                    <SelectTrigger class="w-full">
                      <SelectValue :placeholder="'Select a bill number'">
                        {{
                          bills.find((b) => b.id === value)?.billNumber || 'Select a bill number'
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="bill in bills" :key="bill.id" :value="bill.id">
                          {{ bill.billNumber }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="paymentDate">
              <FormItem>
                <FormLabel>Payment Date</FormLabel>
                <FormControl><Input type="date" v-bind="componentField" /></FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="receiver">
              <FormItem>
                <FormLabel>Receiver</FormLabel>
                <FormControl><Input type="text" v-bind="componentField" /></FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="station">
              <FormItem>
                <FormLabel>Station Name</FormLabel>
                <FormControl><Input type="text" v-bind="componentField" /></FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="amount">
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl><Input type="number" v-bind="componentField" /></FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button type="submit" class="bg-orange-500 w-full">Create</Button>
          </form>
        </DialogContent>
      </Dialog>
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
</template>

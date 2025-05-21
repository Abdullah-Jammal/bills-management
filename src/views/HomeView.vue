<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { columns } from '../components/payments/columns'
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

// VeeValidate
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

// Form UI Components
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

const schema = z.object({
  title: z.string().min(2, 'Title is too short').max(50),
  amount: z.coerce.number().min(1, 'Amount is required'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
})

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
    const response = await axios.get(
      `http://localhost:3001/bills?_page=${page.value}&_limit=${pageSize.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const totalCount = Number(response.headers['x-total-count'] || 0)
    pageCount.value = Math.ceil(totalCount / pageSize.value)
    data.value = response.data
  } catch (err) {
    isError.value = true
    console.error('Failed to fetch bills:', err)
  } finally {
    isLoading.value = false
  }
}

watch([page, pageSize], getData, { immediate: true })

// onMounted(async () => {
//   data.value = await getData()
// })
</script>

<template>
  <div class="w-[90%] mx-auto py-10">
    <div class="w-full">
      <div class="flex justify-between mb-8 bg-white py-5 px-6 rounded-xs">
        <div>
          <Input placeholder="search by title..." class="flex-wrap w-96 rounded-xs" />
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

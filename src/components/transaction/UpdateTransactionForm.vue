<script setup>
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { watch, ref, onMounted } from 'vue'
import { Pencil } from 'lucide-vue-next'
import axios from 'axios'

const props = defineProps({
  transaction: Object,
  onSave: Function,
})

const schema = z.object({
  billId: z.number().min(1, 'Bill is required'),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  amount: z.coerce.number().min(1, 'Amount must be positive'),
  receiver: z.string().min(1, 'Receiver is required'),
  station: z.string().min(1, 'Station is required'),
})

const bills = ref([])

onMounted(async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const res = await axios.get('http://localhost:3001/bills', {
      headers: { Authorization: `Bearer ${token}` },
    })
    bills.value = res.data
  } catch (err) {
    console.error('Failed to fetch bills:', err)
  }
})

const { handleSubmit, setFieldValue, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    billId: 0,
    paymentDate: '',
    amount: 0,
    receiver: '',
    station: '',
  },
})

watch(
  () => props.transaction,
  (tx) => {
    if (tx) {
      setValues({
        billId: tx.billId,
        paymentDate: tx.paymentDate,
        amount: tx.amount,
        receiver: tx.receiver,
        station: tx.station,
      })
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (values) => {
  await props.onSave(values)
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 h-7 text-xs rounded-xs">
        <Pencil />
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Update Transaction</DialogTitle>
        <DialogDescription>Modify and save transaction details.</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="space-y-4 mt-4">
        <!-- Bill ID Dropdown -->
        <FormField v-slot="{ componentField }" name="billId">
          <FormItem>
            <FormLabel>Bill</FormLabel>
            <FormControl>
              <Select
                :modelValue="componentField.modelValue"
                @update:modelValue="(val) => setFieldValue('billId', Number(val))"
              >
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select bill number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="bill in bills" :key="bill.id" :value="bill.id.toString()">
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
            <FormLabel>Station</FormLabel>
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

        <Button type="submit" class="w-full bg-orange-500">Save Changes</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

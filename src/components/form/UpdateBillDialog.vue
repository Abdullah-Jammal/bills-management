<script setup>
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { FolderCog } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { watch } from 'vue'

const props = defineProps({
  bill: Object,
  onSave: Function,
})

const schema = z.object({
  billNumber: z.string().min(1, 'Required'),
  receiver: z.string().min(1, 'Required'),
  station: z.string().min(1, 'Required'),
  amount: z.coerce.number().min(1, 'Must be positive'),
  issuedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid issued date'),
  executionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid execution date'),
  status: z.enum(['pending', 'executed']),
  isPaid: z.coerce.boolean(),
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
})

watch(
  () => props.bill,
  (bill) => {
    if (bill) resetForm({ values: { ...bill } })
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
      <Button
        class="bg-blue-100 hover:bg-blue-300 text-blue-500 h-7 text-xs rounded-xs cursor-pointer"
      >
        <FolderCog />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update Bill</DialogTitle>
        <DialogDescription>Edit and save the bill information.</DialogDescription>
      </DialogHeader>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="billNumber">
          <FormItem>
            <FormLabel>Bill Number</FormLabel>
            <FormControl><Input type="text" v-bind="componentField" /></FormControl>
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

        <FormField v-slot="{ componentField }" name="issuedDate">
          <FormItem>
            <FormLabel>Issued Date</FormLabel>
            <FormControl><Input type="date" v-bind="componentField" /></FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="executionDate">
          <FormItem>
            <FormLabel>Execution Date</FormLabel>
            <FormControl><Input type="date" v-bind="componentField" /></FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="status">
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl><Input v-bind="componentField" /></FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="isPaid">
          <FormItem>
            <FormLabel>Is Paid?</FormLabel>
            <FormControl>
              <input type="checkbox" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full bg-blue-600">Save Changes</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

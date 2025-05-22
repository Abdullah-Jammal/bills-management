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
  title: z.string().min(2, 'Title is too short').max(50),
  amount: z.coerce.number().min(1, 'Amount is required'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
})

watch(
  () => props.bill,
  (bill) => {
    if (bill) {
      resetForm({ values: { ...bill } })
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
      <Button
        class="bg-blue-100 hover:bg-blue-300 text-blue-500 h-7 text-xs rounded-xs cursor-pointer"
        ><FolderCog
      /></Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update Bill</DialogTitle>
        <DialogDescription>Edit the fields and save.</DialogDescription>
      </DialogHeader>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
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
        <FormField v-slot="{ componentField }" name="dueDate">
          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <FormControl>
              <Input type="date" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit" class="w-full bg-blue-600">Save Changes</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

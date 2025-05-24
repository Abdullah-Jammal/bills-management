<script setup>
import Input from '../ui/input/Input.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '../ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4 mt-4">
    <div class="flex gap-6">
      <FormField v-slot="{ componentField }" name="billNumber">
        <FormItem class="flex-grow">
          <FormLabel>Bill Number</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="rounded-xs" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="receiver">
        <FormItem class="flex-grow">
          <FormLabel>Receiver</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="rounded-xs" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="flex gap-6">
      <FormField v-slot="{ componentField }" name="station">
        <FormItem class="flex-grow">
          <FormLabel>Station</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="rounded-xs" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="amount">
        <FormItem class="flex-grow">
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <Input type="number" v-bind="componentField" class="rounded-xs" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

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

    <div class="flex gap-6 items-center">
      <FormField v-slot="{ componentField }" name="status">
        <FormItem class="flex-grow">
          <FormLabel>Status</FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent class="w-full">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="executed">Executed</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="isPaid">
        <FormItem class="flex-grow mt-4">
          <div class="flex items-center gap-3">
            <FormLabel>is paid : </FormLabel>
            <FormControl>
              <input type="checkbox" class="h-4 w-4" v-bind="componentField" />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <Button type="submit" class="w-52 mt-6 bg-orange-500 cursor-pointer">Create</Button>
  </form>
</template>

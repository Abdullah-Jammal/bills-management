<script setup>
import { Search } from 'lucide-vue-next'
import { watch, ref } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { CalendarIcon, BrushCleaning } from 'lucide-vue-next'

const props = defineProps({
  searchQuery: String,
  filterStatus: String,
  filterPaid: String,
  dateRange: Object,
})

const emit = defineEmits([
  'update:searchQuery',
  'update:filterStatus',
  'update:filterPaid',
  'update:dateRange',
])

const localSearch = ref(props.searchQuery)

watch(localSearch, (val) => emit('update:searchQuery', val))
watch(
  () => props.searchQuery,
  (val) => (localSearch.value = val),
)

const df = new DateFormatter('en-US', { dateStyle: 'medium' })

function clearDateRange() {
  emit('update:dateRange', { start: null, end: null })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex gap-6">
      <div class="relative w-[100%]">
        <Input
          v-model="localSearch"
          placeholder="Search bill number or receiver..."
          class="pl-3 w-full"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Search class="w-4 h-4" />
        </span>
      </div>
    </div>

    <div class="flex gap-6 flex-wrap items-center">
      <Select
        :modelValue="props.filterStatus"
        @update:modelValue="(val) => emit('update:filterStatus', val)"
      >
        <SelectTrigger class="w-48">
          <span class="text-gray-500" v-if="props.filterStatus === 'all'"
            >Filter by Bill Status</span
          >
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

      <Select
        :modelValue="props.filterPaid"
        @update:modelValue="(val) => emit('update:filterPaid', val)"
      >
        <SelectTrigger class="w-52">
          <span class="text-gray-500" v-if="props.filterPaid === 'all'">Filter by Paid Status</span>
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

      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            :class="cn('w-[280px] justify-start text-left font-normal text-gray-500')"
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            <template v-if="props.dateRange?.start">
              <template v-if="props.dateRange?.end">
                {{ df.format(props.dateRange.start.toDate(getLocalTimeZone())) }} -
                {{ df.format(props.dateRange.end.toDate(getLocalTimeZone())) }}
              </template>
              <template v-else>
                {{ df.format(props.dateRange.start.toDate(getLocalTimeZone())) }}
              </template>
            </template>
            <template v-else> filter by execution date </template>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <RangeCalendar
            :modelValue="props.dateRange"
            @update:modelValue="(val) => emit('update:dateRange', val)"
            initial-focus
            :number-of-months="2"
          />
          <div class="p-3 flex justify-end border-t">
            <Button size="sm" class="border-2 bg-orange-500 cursor-pointer" @click="clearDateRange"
              >Clear <BrushCleaning
            /></Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>

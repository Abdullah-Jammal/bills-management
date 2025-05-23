<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import DetailItem from '@/components/DetailItem.vue'

const route = useRoute()
const bill = ref(null)
const isLoading = ref(true)
const isError = ref(false)

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3001/bills/${route.params.id}`)
    bill.value = response.data
  } catch (err) {
    console.error('Failed to fetch bill details:', err)
    isError.value = true
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="p-12 w-[80%]">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">🧾 Bill Details</h1>

    <div v-if="isLoading" class="text-gray-500">Loading...</div>
    <div v-else-if="isError" class="text-red-500 font-semibold">
      ❌ Failed to load bill details.
    </div>

    <div
      v-else-if="bill"
      class="bg-white rounded-xl shadow-md p-8 space-y-6 border border-gray-200"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DetailItem label="Bill Number" :value="bill.billNumber" />
        <DetailItem label="Receiver" :value="bill.receiver" />
        <DetailItem label="Amount" :value="`$${bill.amount}`" />

        <DetailItem
          label="Status"
          :value="bill.status"
          badge
          :badgeColor="bill.status === 'executed' ? 'bg-blue-500' : 'bg-yellow-500'"
        />
        <DetailItem
          label="Paid"
          :value="bill.isPaid ? 'Paid' : 'Unpaid'"
          badge
          :badgeColor="bill.isPaid ? 'bg-green-500' : 'bg-red-500'"
        />

        <DetailItem label="Issuing Date" :value="bill.issuedDate" />
        <DetailItem label="Execution Date" :value="bill.executionDate" />
        <DetailItem label="Receiving Station" :value="bill.station" />
      </div>
    </div>
  </div>
</template>

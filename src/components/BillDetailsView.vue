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
    const res = await axios.get(
      `http://localhost:3001/bills/${route.params.id}?_embed=transactions`,
    )
    bill.value = res.data
  } catch (err) {
    console.error('Failed to fetch bill details:', err)
    isError.value = true
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="p-12 w-[80%] mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">🧾 Bill Details</h1>

    <div v-if="isLoading" class="text-gray-500">Loading...</div>
    <div v-else-if="isError" class="text-red-500 font-semibold">Failed to load bill details.</div>

    <div
      v-else-if="bill"
      class="bg-white rounded-xl shadow-md p-8 space-y-8 border border-gray-200"
    >
      <!-- Bill Properties -->
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

      <div v-if="bill.transactions?.length" class="pt-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">💳 Payment Transactions</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-left text-gray-700 border rounded-md shadow-sm">
            <thead class="bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th scope="col" class="px-6 py-3">#</th>
                <th scope="col" class="px-6 py-3">Payment Date</th>
                <th scope="col" class="px-6 py-3">Amount</th>
                <th scope="col" class="px-6 py-3">Station</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(tx, index) in bill.transactions"
                :key="tx.id"
                class="border-t hover:bg-gray-50 transition"
              >
                <td class="px-6 py-3 font-medium">{{ index + 1 }}</td>
                <td class="px-6 py-3">{{ tx.paymentDate }}</td>
                <td class="px-6 py-3 font-semibold text-green-600">${{ tx.amount }}</td>
                <td class="px-6 py-3 font-semibold text-gray-600">{{ tx.station }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="text-sm text-gray-500 pt-4">No transactions recorded for this bill.</div>
    </div>
  </div>
</template>

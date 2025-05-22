<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

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
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Bill Details</h1>

    <div v-if="isLoading" class="text-gray-500">Loading...</div>
    <div v-else-if="isError" class="text-red-500 font-semibold">Failed to load bill details.</div>

    <div v-else-if="bill" class="space-y-3 bg-white p-5 rounded shadow">
      <p><strong>Bill Number:</strong> {{ bill.billNumber || 'N/A' }}</p>
      <p><strong>Receiver:</strong> {{ bill.receiver || 'N/A' }}</p>
      <p><strong>Amount:</strong> ${{ bill.amount }}</p>
      <p><strong>Paid:</strong> {{ bill.paid ? 'Yes' : 'No' }}</p>
      <p><strong>Status:</strong> {{ bill.status || 'Pending' }}</p>
      <p><strong>Issuing Date:</strong> {{ bill.issuingDate || 'N/A' }}</p>
      <p><strong>Execution Date:</strong> {{ bill.executionDate || 'N/A' }}</p>
      <p><strong>Receiving Station:</strong> {{ bill.station || 'N/A' }}</p>
    </div>
  </div>
</template>

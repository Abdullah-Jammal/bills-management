<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const bill = ref(null)

onMounted(async () => {
  const response = await axios.get(`http://localhost:3001/bills/${route.params.id}`)
  bill.value = response.data
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Bill Details</h1>
    <div v-if="bill" class="mt-4 space-y-2">
      <p><strong>Title:</strong> {{ bill.title }}</p>
      <p><strong>Amount:</strong> ${{ bill.amount }}</p>
      <p><strong>Due Date:</strong> {{ bill.dueDate }}</p>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

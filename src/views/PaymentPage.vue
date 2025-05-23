<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import DataTable from '../components/transaction/data-table.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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
    const res = await axios.get('http://localhost:3001/transactions', {
      headers: { Authorization: `Bearer ${token}` },
    })

    const allTransactions = res.data || []
    const start = (page.value - 1) * pageSize.value
    const end = start + pageSize.value

    data.value = allTransactions.slice(start, end)
    pageCount.value = Math.ceil(allTransactions.length / pageSize.value)
  } catch (err) {
    isError.value = true
    console.error('❌ Failed to fetch transactions:', err)
  } finally {
    isLoading.value = false
  }
}

watch([page], getData, { immediate: true })

const userEmail = ref('')
onMounted(() => {
  const user = localStorage.getItem('authUser')
  if (user) {
    try {
      const parsedUser = JSON.parse(user)
      userEmail.value = parsedUser.email || ''
    } catch (e) {
      console.error('Invalid authUser JSON:', e)
    }
  }
})
</script>

<template>
  <div class="w-[90%] mx-auto py-10">
    <div class="text-left text-md text-gray-600 mb-2">
      Logged in as: <span class="font-semibold">{{ userEmail }}</span>
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
</template>

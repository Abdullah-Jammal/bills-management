<script setup>
const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="grid lg:grid-cols-5 md:grid-cols-2 gap-4 mb-8 text-sm font-medium">
    <div class="bg-white border p-4 rounded-md text-center">
      <p>Total Bills</p>
      <h2 class="text-xl font-bold text-blue-500">{{ props.stats.total }}</h2>
    </div>
    <div class="bg-white border p-4 rounded-md text-center">
      <p>Paid Amount</p>
      <h2 class="text-xl font-bold text-green-500">${{ props.stats.paidAmount }}</h2>
    </div>
    <div class="bg-white border p-4 rounded-md text-center">
      <p>Unpaid Amount</p>
      <h2 class="text-xl font-bold text-red-500">${{ props.stats.unpaidAmount }}</h2>
    </div>
    <div class="bg-white border p-4 rounded-md text-center">
      <p>Executed Bills</p>
      <h2 class="text-xl font-bold text-indigo-500">{{ props.stats.executed }}</h2>
    </div>
    <div class="bg-white border p-4 rounded-md text-center">
      <p>Pending Bills</p>
      <h2 class="text-xl font-bold text-yellow-500">{{ props.stats.pending }}</h2>
    </div>
  </div>
</template>

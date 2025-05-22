<template>
  <div>
    <p class="text-sm text-gray-500 mb-1">{{ label }}</p>
    <div
      v-if="badge"
      :class="[
        'inline-block px-3 py-1 rounded-full text-xs font-semibold text-white capitalize',
        badgeColor,
      ]"
    >
      {{ value || 'N/A' }}
    </div>
    <p v-else class="text-gray-900 font-semibold">{{ value || 'N/A' }}</p>
  </div>
</template>

<script setup>
// import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: String,
  badge: Boolean,
  badgeColor: String, // Pass full tailwind class like 'bg-yellow-500'
})
</script>

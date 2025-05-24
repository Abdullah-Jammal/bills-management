<script setup>
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const auth = useAuthStore()
</script>
<template>
  <SidebarProvider>
    <AppSidebar v-if="auth.isLoggedIn" />
    <main class="w-full min-h-screen bg-gray-100">
      <SidebarTrigger v-if="auth.isLoggedIn" />
      <router-view />
    </main>
  </SidebarProvider>
</template>

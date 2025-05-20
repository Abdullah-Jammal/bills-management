<script setup>
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const auth = useAuthStore()
// localStorage.clear()
</script>

<template>
  <SidebarProvider>
    <AppSidebar v-if="auth.isLoggedIn" />
    <main>
      <SidebarTrigger />
      <router-view />
    </main>
  </SidebarProvider>
</template>

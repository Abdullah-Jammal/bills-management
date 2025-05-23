<script lang="ts" setup>
import { Home, HandCoins } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { LogOut } from 'lucide-vue-next'
import { Button } from './ui/button'
import { useAuthStore } from '@/stores/auth'

const items = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Transactions', url: '/payment', icon: HandCoins },
]

const auth = useAuthStore()
</script>
<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Bills Management System</SidebarGroupLabel>
        <SidebarGroupContent class="flex flex-col justify-between h-[94vh]">
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton asChild>
                <RouterLink :to="item.url" class="flex items-center gap-2">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <Button class="bg-red-500 cursor-pointer" @click.prevent="auth.logout">
            <LogOut /> Logout
          </Button>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

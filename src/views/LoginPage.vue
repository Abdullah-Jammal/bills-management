<script setup lang="js">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const router = useRouter()
const username = ref('')
const password = ref('')

async function login() {
  const fakeToken = 'myAccessToken123'

  localStorage.setItem('accessToken', fakeToken)
  router.push('/')
}
</script>
<template>
  <div
    class="flex items-center justify-center min-h-screen min-w-screen"
    style="background-color: #f0f2f5"
  >
    <Card class="w-[40%]">
      <CardHeader>
        <CardTitle class="text-2xl font-semibold">Welcome to Bills Management System </CardTitle>
        <CardDescription class="text-gray-600">
          Please login with your credentials to securely access and manage your bills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <Input v-model="username" placeholder="Username" />
          <Input v-model="password" placeholder="Password" type="password" />
          <Button @click="login" class="w-full bg-orange-500 cursor-pointer"> Login </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

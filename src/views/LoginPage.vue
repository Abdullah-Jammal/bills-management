<script setup lang="js">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')

async function login() {
  try {
    const res = await axios.post('http://localhost:3001/login', {
      email: username.value,
      password: password.value,
    })

    if (res.data.accessToken) {
      auth.login(res.data)
      router.push('/')
    } else {
      alert('Invalid login')
    }
  } catch (err) {
    console.error(err)
    alert('Login failed')
  }
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

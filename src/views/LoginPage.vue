<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Label } from '@/components/ui/label'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const isFormValid = computed(() => email.value.trim() !== '' && password.value.trim() !== '')

async function login() {
  if (!isFormValid.value) {
    error.value = 'Please fill in both email and password.'
    return
  }

  loading.value = true

  try {
    const res = await axios.post('http://localhost:3001/login', {
      email: email.value,
      password: password.value,
    })

    if (res.data.accessToken) {
      auth.login(res.data)
      loading.value = false
      router.push('/')
    } else {
      error.value = 'Access token missing.'
    }
  } catch (err) {
    console.error(err)
    error.value = err.response?.data || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div
    class="flex items-center justify-center min-h-screen min-w-screen"
    style="background-color: #f0f2f5"
  >
    <Card class="lg:w-[40%] sm:w-[90%]">
      <CardHeader>
        <CardTitle class="text-2xl font-semibold text-center"
          >Welcome to Bills Management System
        </CardTitle>
        <CardDescription class="text-gray-600 text-center max-w-80 mx-auto">
          Please login with your credentials to securely access and manage bills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <Label class="mb-[8px]">Email</Label>
          <Input v-model="email" placeholder="email" />
          <Label class="mb-[8px]">Password</Label>
          <Input v-model="password" placeholder="Password" type="password" />
          <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
          <Button
            @click="login"
            :disabled="loading"
            class="w-full bg-orange-500 cursor-pointer disabled:opacity-50"
          >
            Login
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

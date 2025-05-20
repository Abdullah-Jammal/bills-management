import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(!!localStorage.getItem('accessToken'))

  function login(token) {
    localStorage.setItem('accessToken', token)
    isLoggedIn.value = true
  }

  function logout() {
    localStorage.removeItem('accessToken')
    isLoggedIn.value = false
  }

  return { isLoggedIn, login, logout }
})

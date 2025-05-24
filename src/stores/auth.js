import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(!!localStorage.getItem('accessToken'))
  const token = ref(localStorage.getItem('accessToken') || '')
  const user = ref(JSON.parse(localStorage.getItem('authUser') || 'null'))

  function login(authResponse) {
    token.value = authResponse.accessToken
    user.value = authResponse.user
    isLoggedIn.value = true

    localStorage.setItem('accessToken', token.value)
    localStorage.setItem('authUser', JSON.stringify(user.value))
  }

  function logout() {
    localStorage.clear()
    window.location.reload()
  }

  return { isLoggedIn, token, user, login, logout }
})

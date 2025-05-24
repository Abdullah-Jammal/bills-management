import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '@/views/LoginPage.vue'
import PaymentPage from '@/views/TransactionPage.vue'
import BillDetailsView from '../components/BillDetailsView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
  {
    path: '/transactions',
    name: 'transactions',
    component: PaymentPage,
    meta: { requiresAuth: true },
  },
  { path: '/login', name: 'login', component: LoginPage },
  {
    path: '/bills/:id',
    name: 'BillDetails',
    meta: { requiresAuth: true },
    component: BillDetailsView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'

let routes = [
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home
    // component: () => import('../views/Home.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

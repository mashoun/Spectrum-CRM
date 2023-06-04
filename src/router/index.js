import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'profile',
      component: () => import('../views/Profile.vue')
    },
    {
      path: '/Agents',
      name: 'agents',
      component: () => import('../views/Agents.vue')
    },
    {
      path: '/Feedbacks',
      name: 'Feedbacks',
      component: () => import('../views/Feedbacks.vue')
    },
    {
      path: '/Properties',
      name: 'Properties',
      component: () => import('../views/Properties.vue')
    },
  ]
})

export default router

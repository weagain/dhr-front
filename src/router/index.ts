import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AppLayout from '../layouts/AppLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'turntable' },
  },
  {
    name: 'turntable',
    path: '/turntable',
    redirect: '/turntable/index',
    component: AppLayout,
    children: [
      {
        name: 'turntable-index',
        path: 'index/:address?/:chain?',
        component: () => import('../pages/turntable/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      document.querySelector('.app-layout__page')?.scrollTo(0, 0)
    }
  },
  routes,
})

export default router

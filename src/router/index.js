import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/video',
      name: 'My Videos',
      component: () => import('@/views/MyVideoView.vue'),
    },
    {
      path: '/video/upload',
      name: 'Video Upload',
      component: () => import('@/views/VideoUploadView.vue')
    },
    {
      path: '/notice',
      name: 'Notice',
      component: () => import('@/views/NoticeView.vue'),
    },
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '首页', icon: 'DataAnalysis', affix: true }
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('@/views/user/UserList.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'users/:id',
        name: 'UserDetail',
        component: () => import('@/views/user/UserDetail.vue'),
        meta: { title: '用户详情', icon: 'User', hidden: true }
      },
      {
        path: 'courses',
        name: 'CourseList',
        component: () => import('@/views/course/CourseList.vue'),
        meta: { title: '课程管理', icon: 'VideoPlay' }
      },
      {
        path: 'courses/create',
        name: 'CourseCreate',
        component: () => import('@/views/course/CourseEditor.vue'),
        meta: { title: '创建课程', icon: 'VideoPlay', hidden: true }
      },
      {
        path: 'courses/edit/:id',
        name: 'CourseEdit',
        component: () => import('@/views/course/CourseEditor.vue'),
        meta: { title: '编辑课程', icon: 'VideoPlay', hidden: true }
      },
      {
        path: 'courses/preview/:id',
        name: 'CoursePreview',
        component: () => import('@/views/course/CoursePreview.vue'),
        meta: { title: '课程预览', icon: 'VideoPlay', hidden: true }
      },
      {
        path: 'media',
        name: 'MediaLibrary',
        component: () => import('@/views/media/MediaLibrary.vue'),
        meta: { title: '图片素材', icon: 'Picture' }
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('@/views/profile/AdminProfile.vue'),
        meta: { title: '个人中心', icon: 'User', hidden: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 视频后台管理系统` : '视频后台管理系统'
  
  // 简单的登录验证（实际项目中应该更完善）
  const token = localStorage.getItem('token')
  
  if (to.path !== '/login' && !token) {
    // 未登录且访问的不是登录页，跳转到登录页
    next('/login')
  } else if (to.path === '/login' && token) {
    // 已登录且访问登录页，跳转到首页
    next('/')
  } else {
    next()
  }
})

export default router

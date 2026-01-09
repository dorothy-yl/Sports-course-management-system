<template>
  <div class="sidebar-container">
    <!-- Logo 区域 -->
    <div class="logo-container" :class="{ collapsed: appStore.sidebarCollapsed }">
      <el-icon v-if="appStore.sidebarCollapsed" :size="28" color="#fff">
        <VideoPlay />
      </el-icon>
      <template v-else>
        <el-icon :size="28" color="#fff">
          <VideoPlay />
        </el-icon>
        <span class="logo-title">视频管理</span>
      </template>
    </div>
    
    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="appStore.sidebarCollapsed"
      :unique-opened="true"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      router
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <el-menu-item 
          v-if="!route.meta?.hidden" 
          :index="route.path"
        >
          <el-icon v-if="route.meta?.icon">
            <component :is="route.meta.icon" />
          </el-icon>
          <template #title>{{ route.meta?.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 当前激活的菜单
const activeMenu = computed(() => {
  const { path } = route
  // 如果是编辑或详情页，高亮对应的列表页
  if (path.includes('/courses/edit') || path.includes('/courses/create')) {
    return '/courses'
  }
  if (path.includes('/users/') && path !== '/users') {
    return '/users'
  }
  return path
})

// 获取菜单路由
const menuRoutes = computed(() => {
  const routes = router.getRoutes()
  const mainRoute = routes.find(r => r.path === '/')
  return mainRoute?.children || []
})
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #2b3a4b;
  transition: all 0.3s;
}

.logo-container.collapsed {
  padding: 0;
}

.logo-title {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
}

.el-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

/* 滚动条样式 */
.el-menu::-webkit-scrollbar {
  width: 6px;
}

.el-menu::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.el-menu::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>

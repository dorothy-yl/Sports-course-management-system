<template>
  <el-container class="main-layout">
    <!-- 侧边栏 -->
    <el-aside :width="appStore.sidebarWidth">
      <AppSidebar />
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header height="60px">
        <AppHeader />
      </el-header>
      
      <!-- 标签页栏 -->
      <TagsView />
      
      <!-- 主内容 -->
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import AppSidebar from '@/components/common/AppSidebar.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import TagsView from '@/components/common/TagsView.vue'

const appStore = useAppStore()

// 监听窗口大小变化
const handleResize = () => {
  appStore.checkMobile()
}

onMounted(() => {
  appStore.checkMobile()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.main-layout {
  height: 100vh;
}

/* 页面切换动画 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

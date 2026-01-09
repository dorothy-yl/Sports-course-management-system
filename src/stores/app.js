import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏是否折叠
  const sidebarCollapsed = ref(false)
  
  // 是否为移动端
  const isMobile = ref(false)
  
  // 计算侧边栏宽度
  const sidebarWidth = computed(() => {
    return sidebarCollapsed.value ? '64px' : '200px'
  })
  
  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  // 检查是否为移动端
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value) {
      sidebarCollapsed.value = true
    }
  }
  
  // 设置侧边栏状态
  const setSidebarCollapsed = (collapsed) => {
    sidebarCollapsed.value = collapsed
  }
  
  return {
    sidebarCollapsed,
    isMobile,
    sidebarWidth,
    toggleSidebar,
    checkMobile,
    setSidebarCollapsed
  }
})

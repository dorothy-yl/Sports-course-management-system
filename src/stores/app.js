import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏是否折叠
  const sidebarCollapsed = ref(false)
  
  // 是否为移动端
  const isMobile = ref(false)
  
  // 标签页列表
  const visitedViews = ref([])
  
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
  
  // 添加标签页
  const addVisitedView = (view) => {
    // 检查是否已存在
    const exists = visitedViews.value.some(v => v.path === view.path)
    if (!exists) {
      visitedViews.value.push({
        path: view.path,
        title: view.meta?.title || '未命名',
        name: view.name,
        meta: view.meta
      })
    }
  }
  
  // 删除标签页
  const delVisitedView = (view) => {
    const index = visitedViews.value.findIndex(v => v.path === view.path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
    return [...visitedViews.value]
  }
  
  // 删除其他标签页
  const delOthersViews = (view) => {
    visitedViews.value = visitedViews.value.filter(v => {
      return v.path === view.path || v.meta?.affix
    })
  }
  
  // 删除所有标签页
  const delAllViews = () => {
    visitedViews.value = visitedViews.value.filter(v => v.meta?.affix)
  }
  
  // 删除左侧标签页
  const delLeftViews = (view) => {
    const index = visitedViews.value.findIndex(v => v.path === view.path)
    if (index > -1) {
      visitedViews.value = visitedViews.value.filter((v, i) => {
        return i >= index || v.meta?.affix
      })
    }
  }
  
  // 删除右侧标签页
  const delRightViews = (view) => {
    const index = visitedViews.value.findIndex(v => v.path === view.path)
    if (index > -1) {
      visitedViews.value = visitedViews.value.filter((v, i) => {
        return i <= index || v.meta?.affix
      })
    }
  }
  
  return {
    sidebarCollapsed,
    isMobile,
    sidebarWidth,
    visitedViews,
    toggleSidebar,
    checkMobile,
    setSidebarCollapsed,
    addVisitedView,
    delVisitedView,
    delOthersViews,
    delAllViews,
    delLeftViews,
    delRightViews
  }
})

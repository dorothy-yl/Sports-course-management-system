<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path }"
        :class="{ active: isActive(tag) }"
        class="tags-view-item"
        @contextmenu.prevent="openContextMenu(tag, $event)"
      >
        <span class="tag-title">{{ tag.title }}</span>
        <el-icon
          v-if="!isAffix(tag)"
          class="tag-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Close } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const selectedTag = ref(null)

// 访问的标签页
const { visitedViews } = appStore

// 判断是否是当前激活的标签
const isActive = (tag) => {
  return tag.path === route.path
}

// 判断是否是固定标签
const isAffix = (tag) => {
  return tag.meta?.affix
}

// 关闭选中的标签
const closeSelectedTag = (view) => {
  const views = appStore.delVisitedView(view)
  if (isActive(view)) {
    toLastView(views, view)
  }
}

// 跳转到最后一个标签
const toLastView = (views, view) => {
  const latestView = views.slice(-1)[0]
  if (latestView) {
    router.push(latestView.path)
  } else {
    // 如果没有标签了，跳转到首页
    router.push('/')
  }
}

// 打开右键菜单
const openContextMenu = (tag, event) => {
  selectedTag.value = tag
  // 右键菜单功能可以通过 el-dropdown 实现，这里暂不实现
}

// 添加标签
const addTags = () => {
  if (route.meta?.title) {
    appStore.addVisitedView(route)
  }
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    addTags()
  },
  { immediate: true }
)
</script>

<style scoped>
.tags-view-container {
  height: 40px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

.tags-view-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 6px;
  overflow-x: auto;
}

/* 隐藏滚动条但保持可滚动 */
.tags-view-wrapper::-webkit-scrollbar {
  height: 0;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  height: 28px;
  line-height: 28px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 10px;
  font-size: 12px;
  border-radius: 3px;
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.3s;
}

.tags-view-item:hover {
  color: #409eff;
  border-color: #409eff;
}

.tags-view-item.active {
  background-color: #409eff;
  color: #fff;
  border-color: #409eff;
}

.tags-view-item.active::before {
  content: '';
  background: #fff;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  margin-right: 5px;
}

.tag-title {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-close {
  width: 14px;
  height: 14px;
  margin-left: 5px;
  border-radius: 50%;
  transition: all 0.3s;
}

.tag-close:hover {
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
}

.tags-view-item.active .tag-close:hover {
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}
</style>

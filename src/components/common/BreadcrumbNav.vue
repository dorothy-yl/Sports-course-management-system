<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item 
      v-for="(item, index) in breadcrumbs" 
      :key="item.path"
      :to="index < breadcrumbs.length - 1 ? item.path : undefined"
    >
      {{ item.meta?.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  
  // 如果第一项不是首页，添加首页
  if (matched.length > 0 && matched[0].path !== '/') {
    return matched
  }
  
  return matched
})
</script>

<style scoped>
.el-breadcrumb {
  font-size: 14px;
}
</style>

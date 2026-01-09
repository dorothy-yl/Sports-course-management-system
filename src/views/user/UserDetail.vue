<template>
  <div class="user-detail-container">
    <el-page-header @back="handleBack" content="用户详情" />
    
    <el-card class="page-card" style="margin-top: 20px" v-loading="loading">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="昵称">
          {{ userInfo?.nickname }}
        </el-descriptions-item>
        
        <el-descriptions-item label="性别">
          {{ getGenderName(userInfo?.gender) }}
        </el-descriptions-item>
        
        <el-descriptions-item label="生日">
          {{ formatDateOnly(userInfo?.birthday) }}
        </el-descriptions-item>
        
        <el-descriptions-item label="年龄">
          {{ calculateAge(userInfo?.birthday) }} 岁
        </el-descriptions-item>
        
        <el-descriptions-item label="身高">
          {{ userInfo?.height }} cm
        </el-descriptions-item>
        
        <el-descriptions-item label="体重">
          {{ userInfo?.weight }} kg
        </el-descriptions-item>
        
        <el-descriptions-item label="地区">
          <el-tag :type="userInfo?.region === 'domestic' ? 'success' : 'info'">
            {{ getRegionName(userInfo?.region) }}
          </el-tag>
        </el-descriptions-item>
        
        <el-descriptions-item label="VIP状态">
          <el-tag :type="userInfo?.isVip ? 'success' : 'info'">
            {{ userInfo?.isVip ? 'VIP用户' : '普通用户' }}
          </el-tag>
        </el-descriptions-item>
        
        <el-descriptions-item label="VIP到期时间" v-if="userInfo?.isVip">
          {{ formatDate(userInfo?.vipExpireDate) }}
        </el-descriptions-item>
        
        <el-descriptions-item label="登录方式" :span="2">
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <el-tag
              v-for="method in userInfo?.loginMethods"
              :key="method.type"
              type="info"
            >
              {{ getLoginMethodName(method.type) }}: {{ method.identifier }}
            </el-tag>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserDetail } from '@/api/user'
import { formatDate, formatDateOnly, getGenderName, getRegionName } from '@/utils/format'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const userInfo = ref(null)

// 计算年龄
const calculateAge = (birthday) => {
  if (!birthday) return '-'
  return dayjs().diff(dayjs(birthday), 'year')
}

// 获取登录方式名称
const getLoginMethodName = (type) => {
  const map = {
    'phone': '手机号',
    'email': '邮箱',
    'apple': 'Apple',
    'wechat': '微信',
    'google': 'Google',
    'facebook': 'Facebook',
    'iconsole': 'I console'
  }
  return map[type] || type
}

// 获取用户详情
const fetchUserDetail = async () => {
  loading.value = true
  try {
    // const res = await getUserDetail(route.params.id)
    // userInfo.value = res
    
    // 模拟数据
    userInfo.value = {
      id: route.params.id,
      nickname: '张三',
      gender: 'male',
      birthday: '1990-05-15',
      height: 175,
      weight: 70,
      region: 'domestic',
      loginMethods: [
        { type: 'phone', identifier: '13800138000' },
        { type: 'wechat', identifier: 'wx_zhangsan' }
      ],
      isVip: true,
      vipExpireDate: dayjs().add(6, 'month').toISOString()
    }
  } catch (error) {
    ElMessage.error('获取用户详情失败')
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  fetchUserDetail()
})
</script>

<style scoped>
.user-detail-container {
  height: 100%;
}
</style>

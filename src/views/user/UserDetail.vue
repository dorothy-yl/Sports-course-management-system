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
        
        <el-descriptions-item label="地址" :span="2">
          {{ formatAddress(userInfo?.address) }}
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
import { formatDate, formatDateOnly, getGenderName } from '@/utils/format'
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

// 格式化地址
const formatAddress = (address) => {
  if (!address) return '-'
  
  if (address.type === 'domestic') {
    // 国内：[省] - [市] - [区/县] - [详细地址]
    const parts = [address.province, address.city, address.district, address.detail].filter(Boolean)
    return parts.join(' - ')
  } else {
    // 国外：[国家] - [城市/州]
    const parts = [address.country, address.city].filter(Boolean)
    return parts.join(' - ')
  }
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
      address: {
        type: 'domestic',
        province: '北京市',
        city: '北京',
        district: '朝阳区',
        detail: 'XX街道88号'
      },
      loginMethods: [
        { type: 'phone', identifier: '13800138000' },
        { type: 'wechat', identifier: 'wx_zhangsan' }
      ]
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

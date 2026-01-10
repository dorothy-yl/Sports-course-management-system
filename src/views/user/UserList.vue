<template>
  <div class="user-list-container">
    <el-card class="page-card">
      <!-- 搜索和操作栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索昵称、邮箱、手机号"
            style="width: 250px"
            clearable
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="filterRegionType"
            placeholder="地区类型"
            style="width: 120px"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="item in REGION_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
      </div>
    </el-card>
    
    <!-- 用户列表 -->
    <el-card class="page-card">
      <el-table
        v-loading="loading"
        :data="userList"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="100" align="center" />
        
        <el-table-column prop="nickname" label="昵称" width="100" show-overflow-tooltip />
        
        <el-table-column label="性别" width="100" align="center">
          <template #default="{ row }">
            {{ getGenderName(row.gender) }}
          </template>
        </el-table-column>
        
        <el-table-column label="年龄" width="100" align="center">
          <template #default="{ row }">
            {{ calculateAge(row.birthday) }}
          </template>
        </el-table-column>
        
        <el-table-column label="身高/体重" width="160" align="center">
          <template #default="{ row }">
            {{ row.height }}cm / {{ row.weight }}kg
          </template>
        </el-table-column>
        
        <el-table-column label="地区" width="490" align="center">
          <template #default="{ row }">
            {{ formatAddress(row.address) }}
          </template>
        </el-table-column>
        
        <el-table-column label="登录方式" width="400">
          <template #default="{ row }">
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              <el-tag
                v-for="method in row.loginMethods"
                :key="method.type"
                size="small"
                type="info"
              >
                {{ getLoginMethodName(method.type) }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button type="primary" size="small" link @click="handleView(row)">
                查看
              </el-button>
              <el-button type="primary" size="small" link @click="handleEdit(row)">
                修改
              </el-button>
              <el-button type="danger" size="small" link @click="handleDelete(row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </el-card>
    
    <!-- 用户详情/编辑对话框 -->
    <UserDialog
      v-model:visible="dialogVisible"
      :user-id="currentUserId"
      :mode="dialogMode"
      @refresh="handleSearch"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, deleteUser } from '@/api/user'
import { formatDate, getGenderName } from '@/utils/format'
import { REGION_TYPE_OPTIONS } from '@/constants'
import UserDialog from './UserDialog.vue'
import dayjs from 'dayjs'

const router = useRouter()

const loading = ref(false)
const userList = ref([])
const searchKeyword = ref('')
const filterRegionType = ref('')
const dialogVisible = ref(false)
const dialogMode = ref('view')
const currentUserId = ref('')

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

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

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value,
      regionType: filterRegionType.value
    }
    
    // 模拟数据（实际应调用 API）
    // const res = await getUserList(params)
    // userList.value = res.list
    // pagination.total = res.total
    
    // 模拟数据
    const mockData = generateMockUsers()
    userList.value = mockData.slice(
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize
    )
    pagination.total = mockData.length
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 生成模拟用户数据
const generateMockUsers = () => {
  const users = []
  const genders = ['male', 'female']
  const names = ['张三', '李四', '王五', '赵六', 'John', 'Jane', 'Mike', 'Lucy']
  const provinces = ['北京市', '上海市', '广东省', '浙江省', '江苏省']
  const cities = ['北京', '上海', '广州', '杭州', '南京']
  const districts = ['朝阳区', '浦东新区', '天河区', '西湖区', '玄武区']
  const countries = ['美国', '加拿大', '英国', '澳大利亚', '日本']
  const foreignCities = ['纽约', '多伦多', '伦敦', '悉尼', '东京']
  
  for (let i = 1; i <= 50; i++) {
    const isDomestic = i % 2 === 1
    
    const loginMethods = []
    if (isDomestic) {
      loginMethods.push({ type: 'phone', identifier: `138${String(i).padStart(8, '0')}` })
      if (i % 3 === 0) loginMethods.push({ type: 'wechat', identifier: `wx_${i}` })
    } else {
      loginMethods.push({ type: 'email', identifier: `user${i}@example.com` })
      if (i % 3 === 0) loginMethods.push({ type: 'google', identifier: `google_${i}` })
    }
    
    // 生成地址
    const address = isDomestic ? {
      type: 'domestic',
      province: provinces[i % provinces.length],
      city: cities[i % cities.length],
      district: districts[i % districts.length],
      detail: `XX街道${i}号`
    } : {
      type: 'international',
      country: countries[i % countries.length],
      city: foreignCities[i % foreignCities.length]
    }
    
    users.push({
      id: `user-${i}`,
      nickname: `${names[i % names.length]}${i}`,
      gender: genders[i % 2],
      birthday: `199${i % 10}-0${(i % 9) + 1}-15`,
      height: 160 + (i % 30),
      weight: 50 + (i % 40),
      address,
      loginMethods
    })
  }
  
  return users
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchUserList()
}

// 查看用户
const handleView = (user) => {
  currentUserId.value = user.id
  dialogMode.value = 'view'
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (user) => {
  currentUserId.value = user.id
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

// 删除用户
const handleDelete = (user) => {
  ElMessageBox.confirm(
    `确定要删除用户"${user.nickname}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // await deleteUser(user.id)
      ElMessage.success('删除成功')
      fetchUserList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-list-container {
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.toolbar-left {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .toolbar-left {
    width: 100%;
    flex-direction: column;
  }
}
</style>

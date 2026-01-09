<template>
  <div class="admin-profile-container">
    <el-row :gutter="20">
      <el-col :xs="24" :md="8">
        <el-card class="profile-card">
          <div class="profile-header">
            <AvatarUpload 
              v-model="adminInfo.avatar"
              :size="100"
              @success="handleAvatarSuccess"
            />
            <h2 class="profile-name">{{ adminInfo.nickname }}</h2>
            <p class="profile-email">{{ adminInfo.email }}</p>
          </div>
          
          <el-divider />
          
          <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-value">{{ stats.managedUsers }}</div>
              <div class="stat-label">管理用户数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.managedCourses }}</div>
              <div class="stat-label">管理课程数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.uploadedImages }}</div>
              <div class="stat-label">上传图片数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :md="16">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
              <el-button
                v-if="!isEditing"
                type="primary"
                size="small"
                @click="handleEdit"
              >
                编辑
              </el-button>
              <div v-else>
                <el-button size="small" @click="handleCancel">取消</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="handleSave"
                  :loading="saving"
                >
                  保存
                </el-button>
              </div>
            </div>
          </template>
          
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item label="用户名">
              <el-input v-model="adminInfo.username" disabled />
            </el-form-item>
            
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="formData.nickname"
                :disabled="!isEditing"
                placeholder="请输入昵称"
              />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="formData.email"
                :disabled="!isEditing"
                placeholder="请输入邮箱"
              />
            </el-form-item>
            
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="formData.phone"
                :disabled="!isEditing"
                placeholder="请输入手机号"
              />
            </el-form-item>
          </el-form>
        </el-card>
        
        <el-card class="password-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>修改密码</span>
            </div>
          </template>
          
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
          >
            <el-form-item label="原密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入原密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleChangePassword" :loading="changingPassword">
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { required, email, phone } from '@/utils/validate'
import { useUserStore } from '@/stores/user'
import { getAdminInfo, updateAdminInfo, changePassword, updateAvatar } from '@/api/user'
import AvatarUpload from '@/components/upload/AvatarUpload.vue'

const userStore = useUserStore()

const formRef = ref(null)
const passwordFormRef = ref(null)
const isEditing = ref(false)
const saving = ref(false)
const changingPassword = ref(false)

const adminInfo = reactive({
  id: 1,
  username: 'admin',
  nickname: '管理员',
  email: 'admin@example.com',
  phone: '13800138000',
  avatar: ''
})

const stats = reactive({
  managedUsers: 12580,
  managedCourses: 468,
  uploadedImages: 1256
})

const formData = reactive({
  nickname: '',
  email: '',
  phone: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  nickname: [required('请输入昵称')],
  email: [required('请输入邮箱'), email],
  phone: [phone]
}

const passwordRules = {
  oldPassword: [required('请输入原密码')],
  newPassword: [
    required('请输入新密码'),
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    required('请确认新密码'),
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 编辑
const handleEdit = () => {
  isEditing.value = true
  Object.assign(formData, adminInfo)
}

// 取消
const handleCancel = () => {
  isEditing.value = false
}

// 保存
const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    saving.value = true
    try {
      // 调用 API 保存个人信息
      await updateAdminInfo(formData)
      
      // 更新本地信息
      Object.assign(adminInfo, formData)
      
      // 更新 store 中的用户信息
      if (userStore.userInfo) {
        Object.assign(userStore.userInfo, formData)
      }
      
      isEditing.value = false
      ElMessage.success('保存成功')
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error(error.message || '保存失败')
    } finally {
      saving.value = false
    }
  })
}

// 头像上传成功
const handleAvatarSuccess = async (avatarUrl) => {
  try {
    // 保存头像到服务器
    await updateAvatar({ avatar: avatarUrl })
    
    // 更新 store 中的用户信息
    if (userStore.userInfo) {
      userStore.userInfo.avatar = avatarUrl
    }
    
    ElMessage.success('头像已更新')
  } catch (error) {
    console.error('保存头像失败:', error)
    ElMessage.error('保存头像失败')
  }
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    changingPassword.value = true
    try {
      // 调用 API 修改密码
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      })
      
      ElMessage.success('密码修改成功')
      
      // 清空表单
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      passwordFormRef.value.resetFields()
      
    } catch (error) {
      console.error('密码修改失败:', error)
      ElMessage.error(error.message || '密码修改失败')
    } finally {
      changingPassword.value = false
    }
  })
}

// 加载管理员信息
const loadAdminInfo = async () => {
  try {
    // 优先从 store 获取
    if (userStore.userInfo) {
      Object.assign(adminInfo, userStore.userInfo)
    }
    
    // 从服务器获取最新信息
    const response = await getAdminInfo()
    if (response.data) {
      Object.assign(adminInfo, response.data)
      // 同步更新 store
      if (userStore.userInfo) {
        Object.assign(userStore.userInfo, response.data)
      }
    }
  } catch (error) {
    console.error('加载管理员信息失败:', error)
    // 如果获取失败，使用默认值或 store 中的值
  }
}

onMounted(() => {
  loadAdminInfo()
})
</script>

<style scoped>
.admin-profile-container {
  padding-bottom: 20px;
}

.profile-card {
  text-align: center;
}

.profile-header {
  padding: 20px 0;
}

.profile-name {
  margin: 20px 0 10px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.profile-email {
  color: #666;
  font-size: 14px;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

</style>

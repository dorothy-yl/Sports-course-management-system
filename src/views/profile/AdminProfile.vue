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
          
       
        </el-card>
      </el-col>
      
      <el-col :xs="24" :md="16">
        <el-card class="info-card">
          <el-tabs v-model="activeTab">
            
            <el-tab-pane label="基本资料" name="userinfo">
              <div class="tab-content">
                <el-form
                  ref="formRef"
                  :model="formData"
                  :rules="rules"
                  label-width="100px"
                  class="profile-form"
                >
                 
                  
                  <el-form-item label="昵称" prop="nickname">
                    <el-input
                      v-model="formData.nickname"
                      placeholder="请输入昵称"
                    />
                  </el-form-item>
                  
                  <el-form-item label="邮箱" prop="email">
                    <el-input
                      v-model="formData.email"
                      placeholder="请输入邮箱"
                    />
                  </el-form-item>
                  
                  <el-form-item label="手机号" prop="phone">
                    <el-input
                      v-model="formData.phone"
                      placeholder="请输入手机号"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleSave" :loading="saving">
                      保存
                    </el-button>
                    <el-button @click="handleCancel">关闭</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>

            <el-tab-pane label="修改密码" name="resetPwd">
              <div class="tab-content">
                <el-form
                  ref="passwordFormRef"
                  :model="passwordForm"
                  :rules="passwordRules"
                  label-width="100px"
                  class="profile-form"
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
                      确认修改
                    </el-button>
                    <el-button @click="resetPwdForm">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>

          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { required, email, phone } from '@/utils/validate'
import { resolveAssetUrl } from '@/utils/format'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
// 确保这个 AvatarUpload 组件路径是正确的，或者替换为您自己的上传组件逻辑
import AvatarUpload from '@/components/upload/AvatarUpload.vue' 
import { getAdminInfo, updateAdminInfo, changePassword } from '@/api/user'

const userStore = useUserStore()
const router = useRouter()

// === 新增：控制当前激活的 Tab ===
const activeTab = ref('userinfo')

const formRef = ref(null)
const passwordFormRef = ref(null)
const saving = ref(false)
const changingPassword = ref(false)
const isEditing = ref(false)

const adminInfo = reactive({
  id: 1,
  username: 'admin',
  nickname: '小仙女',
  email: 'yi ang yang ya@example.com',
  phone: '167758258',
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
  // 将当前信息复制到表单中
  Object.assign(formData, {
    nickname: adminInfo.nickname,
    email: adminInfo.email,
    phone: adminInfo.phone
  })
}

// 取消
const handleCancel = () => {
  isEditing.value = false
  syncFormFromAdmin()
  if (formRef.value) formRef.value.clearValidate()
  router.push('/')
}

// 保存个人信息
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
      
      userStore.setUserInfo({
        ...(userStore.userInfo || {}),
        ...formData
      })
      
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

const syncFormFromAdmin = () => {
  Object.assign(formData, {
    nickname: adminInfo.nickname || '',
    email: adminInfo.email || '',
    phone: adminInfo.phone || ''
  })
}

// 头像上传成功
const handleAvatarSuccess = (avatarUrl) => {
  const resolvedAvatar = resolveAssetUrl(avatarUrl)
  adminInfo.avatar = resolvedAvatar

  const nextUserInfo = {
    ...(userStore.userInfo || {}),
    avatar: resolvedAvatar
  }
  userStore.setUserInfo(nextUserInfo)
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
      resetPwdForm()
      
    } catch (error) {
      console.error('密码修改失败:', error)
      // 这里的错误信息处理非常重要，确保显示 "旧密码错误"
      const msg = error.msg || (error.response?.data?.msg) || '密码修改失败'
      ElMessage.error(msg)
    } finally {
      changingPassword.value = false
    }
  })
}

// 重置密码表单
const resetPwdForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  if (passwordFormRef.value) passwordFormRef.value.resetFields()
}

// 加载管理员信息
const loadAdminInfo = async () => {
  try {
    // 优先从 store 获取
    if (userStore.userInfo) {
      Object.assign(adminInfo, userStore.userInfo)
      if (adminInfo.avatar) {
        adminInfo.avatar = resolveAssetUrl(adminInfo.avatar)
      }
      syncFormFromAdmin()
    }
    
    // 从服务器获取最新信息
    const response = await getAdminInfo()
    if (response.data) {
      const nextInfo = {
        ...response.data,
        avatar: resolveAssetUrl(response.data.avatar)
      }
      Object.assign(adminInfo, nextInfo)
      userStore.setUserInfo({
        ...(userStore.userInfo || {}),
        ...nextInfo
      })
      syncFormFromAdmin()
    }
  } catch (error) {
    console.error('加载管理员信息失败:', error)
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

.profile-card, .info-card {
  height: 100%;
}

/* 左侧卡片样式 */
.profile-header {
  padding: 20px 0;
  text-align: center;
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

/* Tabs 内容区域样式 */
.tab-content {
  padding: 20px 0;
}

.profile-form {
  max-width: 500px; /* 限制表单宽度，在大屏上更好看 */
}
</style>
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        
        <h1 class="login-title">欢迎登录</h1>
      </div>
      
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="code">
          <div class="code-input-wrapper">
            <el-input
              v-model="loginForm.code"
              placeholder="请输入验证码"
              size="large"
              maxlength="4"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
            <div class="code-image" @click="getCode">
              <img v-if="codeUrl" :src="codeUrl" alt="验证码" />
              <span v-else>获取验证码</span>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="logging"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { required } from '@/utils/validate'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const logging = ref(false)
const codeUrl = ref('')  // 验证码图片URL

const loginForm = reactive({
  username: '',
  password: '',
  code: '',      // 验证码
  uuid: ''       // 验证码uuid
})

const rules = {
  username: [required('请输入账号')],
  password: [required('请输入密码')],
  code: [required('请输入验证码')]
}

// 获取验证码
const getCode = async () => {
  try {
    const response = await fetch('http://192.168.1.127:1001/captchaImage')
    
    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`)
    }
    
    const data = await response.json()
    console.log('GET 请求成功：', data)
    
    // 设置验证码图片
    codeUrl.value = "data:image/gif;base64," + data.img
    
    // 设置验证码UUID
    if (data.uuid) {
      loginForm.uuid = data.uuid
    }
  } catch (error) {
    console.error('GET 请求失败：', error)
    ElMessage.error('获取验证码失败：' + error.message)
  }
}

// 页面加载时获取验证码
onMounted(() => {
  getCode()
})

const handleLogin = async () => {
  // 验证必填项
  if (!loginForm.username) {
    ElMessage.warning('请输入账号')
    return
  }
  if (!loginForm.password) {
    ElMessage.warning('请输入密码')
    return
  }
  if (!loginForm.code) {
    ElMessage.warning('请输入验证码')
    return
  }
  if (!loginForm.uuid) {
    ElMessage.warning('验证码已失效，请刷新验证码')
    getCode()
    return
  }
  
  logging.value = true
  console.log('登录表单数据：', loginForm)

  try {
    // 提交登录请求到后端
    const response = await fetch('http://192.168.1.127:1001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginForm)
    })

    if (!response.ok) {
      throw new Error('请求失败：' + response.status)
    }

    // 解析后端返回的数据
    const data = await response.json()
    console.log('后端返回的完整数据：', data)

    const { code, msg, token } = data

    if (code === 200) {
      console.log('登录成功，token：', token)
      ElMessage.success('登录成功')
      
      // 存储 token 到 store
      userStore.setToken(token)
      
      // 跳转到首页
      router.push('/')
    } else {
      ElMessage.error(msg || '登录失败')
      // 登录失败后刷新验证码
      getCode()
      loginForm.code = ''
    }
  } catch (error) {
    console.error('POST 请求失败：', error)
    ElMessage.error('登录失败：' + error.message)
    // 请求失败后刷新验证码
    getCode()
    loginForm.code = ''
  } finally {
    logging.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('@/assets/images/background.png') no-repeat center center;
  background-size: cover;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  margin: 20px 0 10px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.login-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-form {
  margin-top: 20px;
}

.login-tips {
  margin-top: 20px;
}

.code-input-wrapper {
  display: flex;
  gap: 12px;
  width: 100%;
}

.code-input-wrapper .el-input {
  flex: 1;
}

.code-image {
  width: 120px;
  height: 40px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.code-image:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.code-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.code-image span {
  font-size: 12px;
  color: #909399;
}

@media screen and (max-width: 768px) {
  .login-box {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .code-image {
    width: 100px;
  }
}
</style>

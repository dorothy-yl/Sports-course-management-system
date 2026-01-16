import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token
    const token = localStorage.getItem('token')
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // FormData 让浏览器/axios 自动设置 multipart boundary
    if (config.data instanceof FormData) {
      if (config.headers && typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type')
      } else if (config.headers) {
        delete config.headers['Content-Type']
      }
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * Token 过期处理函数
 * 清除所有缓存并跳转到登录页
 */
const handleTokenExpired = () => {
  const userStore = useUserStore()
  
  // 清除 Pinia store 中的用户信息和 token
  userStore.clearUserInfo()
  
  // 清除 localStorage 中的所有相关数据
  localStorage.removeItem('token')
  // 如果还有其他用户相关的 localStorage 数据，也在这里清除
  // localStorage.removeItem('userInfo')
  // localStorage.removeItem('username')
  
  // 清除 sessionStorage 中的所有相关数据（如果有）
  sessionStorage.clear()
  // 或者只清除特定的 sessionStorage 项
  // sessionStorage.removeItem('token')
  // sessionStorage.removeItem('userInfo')
  
  // 显示提示信息
  ElMessage.error('登录状态已过期，请重新登录')
  
  // 跳转到登录页
  router.push('/login').catch(() => {
    // 忽略路由跳转的重复导航错误
  })
}

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    console.log(data)
    
    // 检查业务 code 是否表示 Token 失效
    // 这里预留了判断逻辑的位置，根据实际后端返回的 code 值进行调整
    // 例如：如果后端返回 code === 401 或 code === 1001 等表示 Token 失效
    // 常见的 Token 失效 code 值：401, 1001, 1002, -1 等，请根据实际情况修改
    if (data.code === 401 || data.code === 1001) {
      // 如果后端返回的业务 code 表示 Token 失效，执行退出登录流程
      handleTokenExpired()
      return Promise.reject(new Error('Token 已过期'))
    }
    
    // 根据实际后端返回格式调整
    if (data.code === 200 || data.success) {
      return data
    }
    
    ElMessage.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error) => {
    console.error('响应错误:', error)
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // HTTP 401 状态码，表示未授权/Token 过期
          handleTokenExpired()
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          // 检查错误响应中的业务 code 是否也表示 Token 失效
          // 有些后端可能在非 401 状态码下也返回 Token 失效的业务 code
          if (data?.code === 401 || data?.code === 1001) {
            handleTokenExpired()
          } else {
            ElMessage.error(data?.message || error.response.data?.message || '请求失败')
          }
      }
    } else {
      // 网络错误或其他错误
      ElMessage.error('网络错误，请检查网络连接')
    }
    
    return Promise.reject(error)
  }
)

export default request

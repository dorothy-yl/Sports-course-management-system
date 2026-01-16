import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))
  
  // token
  const token = ref(localStorage.getItem('token') || '')
  
  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
    if (info) {
      localStorage.setItem('userInfo', JSON.stringify(info))
    } else {
      localStorage.removeItem('userInfo')
    }
  }
  
  // 设置 token
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }
  
  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
  
  // 登录
  const login = async (credentials) => {
    // 这里应该调用登录 API
    // const res = await loginApi(credentials)
    // setToken(res.token)
    // setUserInfo(res.userInfo)
    
    // 模拟登录
    const mockToken = 'mock-token-' + Date.now()
    const mockUser = {
      id: '1',
      username: 'admin',
      nickname: '管理员',
      email: 'admin@example.com'
    }
    
    setToken(mockToken)
    setUserInfo(mockUser)
    
    return mockUser
  }
  
  // 登出
  const logout = () => {
    clearUserInfo()
  }
  
  return {
    userInfo,
    token,
    setUserInfo,
    setToken,
    clearUserInfo,
    login,
    logout
  }
})

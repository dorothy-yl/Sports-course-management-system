import request from './request'

// 获取用户列表
export const getUserList = (params) => {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

// 获取用户详情
export const getUserDetail = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

// 创建用户
export const createUser = (data) => {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

// 更新用户
export const updateUser = (id, data) => {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export const deleteUser = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

// 切换 VIP 状态
export const toggleVipStatus = (id, isVip) => {
  return request({
    url: `/users/${id}/vip`,
    method: 'put',
    data: { isVip }
  })
}

// 获取用户统计数据
export const getUserStats = () => {
  return request({
    url: '/users/stats',
    method: 'get'
  })
}

// 个人信息
export const getAdminInfo = () => {
  return request({
    url: '/iConsoleProAdmin/system/user/profile',
    method: 'get'
  })
}

// 修改用户
export const updateAdminInfo = (data) => {
  return request({
    url: '/iConsoleProAdmin/system/user/profile',
    method: 'put',
    data
  })
}

// 修改密码
export const changePassword = (data) => {
  return request({
    url: '/iConsoleProAdmin/system/user/profile/updatePwd',
    method: 'put',
    data
  })
}

// 头像上传
export const updateAvatar = (file) => {
  const formData = new FormData()
  formData.append('avatarfile', file)
  
  return request({
    url: '/iConsoleProAdmin/system/user/profile/avatar',
    method: 'post',
    data: formData
  })
}
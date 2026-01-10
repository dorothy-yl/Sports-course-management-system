import request from './request'

// 获取课程列表
export const getCourseList = (params) => {
  // 参数映射：前端参数转换为后端所需格式
  const mappedParams = {
    deviceType: params.deviceType || 0,
    langCode: params.langCode || 0,
    pageNum: params.page || 1,
    pageSize: params.pageSize || 10,
    type: params.type || 0
  }
  
  return request({
    url: '/system/course/getCourse',
    method: 'get',
    params: mappedParams
  })
}

// 获取课程详情
export const getCourseDetail = (id) => {
  return request({
    url: `/courses/${id}`,
    method: 'get'
  })
}

// 创建课程
export const createCourse = (data) => {
  return request({
    url: '/courses',
    method: 'post',
    data
  })
}

// 更新课程
export const updateCourse = (id, data) => {
  return request({
    url: `/courses/${id}`,
    method: 'put',
    data
  })
}

// 删除课程
export const deleteCourse = (id) => {
  return request({
    url: `/courses/${id}`,
    method: 'delete'
  })
}

// 获取课程统计数据
export const getCourseStats = () => {
  return request({
    url: '/courses/stats',
    method: 'get'
  })
}

// 获取课程热度排行
export const getCourseHotRanking = () => {
  return request({
    url: '/courses/hot-ranking',
    method: 'get'
  })
}

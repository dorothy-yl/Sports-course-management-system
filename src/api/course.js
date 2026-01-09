import request from './request'

// 获取课程列表
export const getCourseList = (params) => {
  return request({
    url: '/courses',
    method: 'get',
    params
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

import dayjs from 'dayjs'

// 格式化时间
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '-'
  return dayjs(date).format(format)
}

// 格式化日期
export const formatDateOnly = (date) => {
  return formatDate(date, 'YYYY-MM-DD')
}

// 格式化秒数为时分秒
export const formatSeconds = (seconds) => {
  if (!seconds && seconds !== 0) return '-'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

// 格式化文件大小
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 获取课程类型中文名
export const getCourseTypeName = (type) => {
  const map = {
    0: '跑步机课程',
    1: '脚踏车课程',
    2: '划船机课程',
    3: '力量训练',
    4: 'HIIT训练',
    5: '瑜伽',
    6: '冥想',
    7: '其他'
  }
  return map[type] || '未知类型'
}

// 获取性别中文名
export const getGenderName = (gender) => {
  const map = {
    'male': '男',
    'female': '女',
    'other': '其他'
  }
  return map[gender] || gender
}


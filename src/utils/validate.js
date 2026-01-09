// 表单验证规则

// 必填验证
export const required = (message = '此项为必填项') => ({
  required: true,
  message,
  trigger: 'blur'
})

// 邮箱验证
export const email = {
  type: 'email',
  message: '请输入正确的邮箱格式',
  trigger: 'blur'
}

// 手机号验证
export const phone = {
  pattern: /^1[3-9]\d{9}$/,
  message: '请输入正确的手机号',
  trigger: 'blur'
}

// 数字范围验证
export const numberRange = (min, max, message) => ({
  type: 'number',
  min,
  max,
  message: message || `请输入 ${min} 到 ${max} 之间的数字`,
  trigger: 'blur'
})

// URL验证
export const url = {
  type: 'url',
  message: '请输入正确的URL格式',
  trigger: 'blur'
}

// 验证时间段不重叠
export const validateTimeSegments = (segments) => {
  for (let i = 0; i < segments.length; i++) {
    for (let j = i + 1; j < segments.length; j++) {
      const seg1 = segments[i]
      const seg2 = segments[j]
      
      // 检查是否重叠
      if (
        (seg1.startTime < seg2.endTime && seg1.endTime > seg2.startTime) ||
        (seg2.startTime < seg1.endTime && seg2.endTime > seg1.startTime)
      ) {
        return false
      }
    }
  }
  return true
}

// 验证单个时间段
export const validateSegment = (segment) => {
  if (segment.startTime >= segment.endTime) {
    return '结束时间必须大于开始时间'
  }
  if (segment.startTime < 0) {
    return '开始时间不能小于0'
  }
  return true
}

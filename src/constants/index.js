// 课程类型
export const COURSE_TYPES = {
  TREADMILL: 'Treadmill',
  CYCLING: 'Cycling',
  ROWING: 'Rowing'
}

export const COURSE_TYPE_OPTIONS = [
  { label: '跑步机课程', value: 'Treadmill' },
  { label: '脚踏车课程', value: 'Cycling' },
  { label: '划船机课程', value: 'Rowing' }
]

// 性别
export const GENDER_OPTIONS = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '其他', value: 'other' }
]

// 地区
export const REGION_OPTIONS = [
  { label: '国内', value: 'domestic' },
  { label: '国外', value: 'international' }
]

// 国内登录方式
export const DOMESTIC_LOGIN_METHODS = [
  { label: '手机号', value: 'phone' },
  { label: 'Apple登录', value: 'apple' },
  { label: '邮箱', value: 'email' },
  { label: '微信', value: 'wechat' },
  { label: 'I console（扫码）', value: 'iconsole' }
]

// 国外登录方式
export const INTERNATIONAL_LOGIN_METHODS = [
  { label: '邮箱', value: 'email' },
  { label: 'Apple登录', value: 'apple' },
  { label: 'Google', value: 'google' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'I console（扫码）', value: 'iconsole' }
]

// 获取对应地区的登录方式
export const getLoginMethodsByRegion = (region) => {
  return region === 'domestic' ? DOMESTIC_LOGIN_METHODS : INTERNATIONAL_LOGIN_METHODS
}

// 图片分类
export const IMAGE_CATEGORIES = [
  { label: '课程封面', value: 'course_cover' },
  { label: 'Banner', value: 'banner' },
  { label: '其他', value: 'other' }
]

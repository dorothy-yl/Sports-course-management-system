// 课程类型
export const COURSE_TYPES = {
  TREADMILL: 0,
  CYCLING: 1,
  ROWING: 2,
  STRENGTH: 3,
  HIIT: 4,
  YOGA: 5,
  MEDITATION: 6,
  OTHER: 7
}

export const COURSE_TYPE_OPTIONS = [
  { label: '跑步机', value: 0 },
  { label: '脚踏车', value: 1 },
  { label: '划船机', value: 2 }

]

export const COURSE_TYPE_NAMES = {
  0: '燃脂',
  1: '健步走',
  2: '跑走结合',
  3: '基础',
  4: 'HIIT',
  5: '冲刺',
  6: '耐力',
  7: '高强度',
  8: '恢复'
}
// 性别
export const GENDER_OPTIONS = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '其他', value: 'other' }
]

// 地区类型
export const REGION_TYPE_OPTIONS = [
  { label: '国内', value: 'domestic' },
  { label: '国外', value: 'international' }
]

// 中国省份
export const CHINA_PROVINCES = [
  '北京市', '天津市', '上海市', '重庆市',
  '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
  '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '海南省',
  '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省',
  '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
  '香港特别行政区', '澳门特别行政区'
]

// 常见国家
export const COUNTRIES = [
  '美国', '加拿大', '英国', '法国', '德国', '意大利', '西班牙',
  '澳大利亚', '新西兰', '日本', '韩国', '新加坡', '马来西亚',
  '泰国', '印度', '俄罗斯', '巴西', '阿根廷', '其他'
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

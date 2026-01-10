<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="700px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="formData.nickname"
          placeholder="请输入昵称"
          :disabled="mode === 'view'"
        />
      </el-form-item>
      
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="formData.gender"
          placeholder="请选择性别"
          style="width: 100%"
          :disabled="mode === 'view'"
        >
          <el-option
            v-for="item in GENDER_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="formData.birthday"
          type="date"
          placeholder="请选择生日"
          style="width: 100%"
          :disabled="mode === 'view'"
        />
      </el-form-item>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="身高(cm)" prop="height">
            <el-input-number
              v-model="formData.height"
              :min="100"
              :max="250"
              style="width: 100%"
              :disabled="mode === 'view'"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="体重(kg)" prop="weight">
            <el-input-number
              v-model="formData.weight"
              :min="30"
              :max="200"
              style="width: 100%"
              :disabled="mode === 'view'"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="地区类型" prop="addressType">
        <el-radio-group
          v-model="formData.addressType"
          :disabled="mode === 'view'"
          @change="handleAddressTypeChange"
        >
          <el-radio label="domestic">国内</el-radio>
          <el-radio label="international">国外</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <!-- 国内地址 -->
      <template v-if="formData.addressType === 'domestic'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="省" prop="province">
              <el-select
                v-model="formData.province"
                placeholder="请选择省份"
                style="width: 100%"
                :disabled="mode === 'view'"
                filterable
              >
                <el-option
                  v-for="item in CHINA_PROVINCES"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="市" prop="city">
              <el-input
                v-model="formData.city"
                placeholder="请输入城市"
                :disabled="mode === 'view'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="区/县" prop="district">
              <el-input
                v-model="formData.district"
                placeholder="请输入区/县"
                :disabled="mode === 'view'"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="详细地址" prop="detail">
              <el-input
                v-model="formData.detail"
                placeholder="请输入详细地址"
                :disabled="mode === 'view'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      
      <!-- 国外地址 -->
      <template v-else>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="国家" prop="country">
              <el-select
                v-model="formData.country"
                placeholder="请选择国家"
                style="width: 100%"
                :disabled="mode === 'view'"
                filterable
              >
                <el-option
                  v-for="item in COUNTRIES"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="城市/州" prop="city">
              <el-input
                v-model="formData.city"
                placeholder="请输入城市或州"
                :disabled="mode === 'view'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    
    <template #footer v-if="mode === 'edit'">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserDetail, updateUser } from '@/api/user'
import { GENDER_OPTIONS, CHINA_PROVINCES, COUNTRIES } from '@/constants'
import { required } from '@/utils/validate'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'view' // view, edit
  }
})

const emit = defineEmits(['update:visible', 'refresh'])

const formRef = ref(null)
const loading = ref(false)
const submitting = ref(false)

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const dialogTitle = computed(() => {
  return props.mode === 'view' ? '用户详情' : '编辑用户'
})

const formData = reactive({
  nickname: '',
  gender: '',
  birthday: '',
  height: 170,
  weight: 60,
  addressType: 'domestic',
  // 国内地址字段
  province: '',
  city: '',
  district: '',
  detail: '',
  // 国外地址字段
  country: ''
})

const rules = {
  nickname: [required('请输入昵称')],
  gender: [required('请选择性别')],
  birthday: [required('请选择生日')],
  height: [required('请输入身高')],
  weight: [required('请输入体重')],
  addressType: [required('请选择地区类型')]
}

// 地区类型变更处理
const handleAddressTypeChange = () => {
  // 清空地址字段
  formData.province = ''
  formData.city = ''
  formData.district = ''
  formData.detail = ''
  formData.country = ''
}

// 获取用户详情
const fetchUserDetail = async () => {
  if (!props.userId) return
  
  loading.value = true
  try {
    // const res = await getUserDetail(props.userId)
    // 将地址对象展开到表单数据
    // Object.assign(formData, res)
    
    // 模拟数据
    const mockData = {
      nickname: '张三',
      gender: 'male',
      birthday: '1990-05-15',
      height: 175,
      weight: 70,
      address: {
        type: 'domestic',
        province: '北京市',
        city: '北京',
        district: '朝阳区',
        detail: 'XX街道88号'
      }
    }
    
    // 展开地址数据
    formData.nickname = mockData.nickname
    formData.gender = mockData.gender
    formData.birthday = mockData.birthday
    formData.height = mockData.height
    formData.weight = mockData.weight
    formData.addressType = mockData.address.type
    
    if (mockData.address.type === 'domestic') {
      formData.province = mockData.address.province
      formData.city = mockData.address.city
      formData.district = mockData.address.district
      formData.detail = mockData.address.detail
    } else {
      formData.country = mockData.address.country
      formData.city = mockData.address.city
    }
  } catch (error) {
    ElMessage.error('获取用户详情失败')
  } finally {
    loading.value = false
  }
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      // 构造地址对象
      const address = formData.addressType === 'domestic' ? {
        type: 'domestic',
        province: formData.province,
        city: formData.city,
        district: formData.district,
        detail: formData.detail
      } : {
        type: 'international',
        country: formData.country,
        city: formData.city
      }
      
      const submitData = {
        nickname: formData.nickname,
        gender: formData.gender,
        birthday: formData.birthday,
        height: formData.height,
        weight: formData.weight,
        address
      }
      
      // await updateUser(props.userId, submitData)
      ElMessage.success('保存成功')
      dialogVisible.value = false
      emit('refresh')
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      submitting.value = false
    }
  })
}

// 监听对话框打开
watch(
  () => props.visible,
  (val) => {
    if (val) {
      fetchUserDetail()
    }
  }
)
</script>

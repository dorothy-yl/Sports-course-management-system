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
      
      <el-form-item label="地区" prop="region">
        <el-select
          v-model="formData.region"
          placeholder="请选择地区"
          style="width: 100%"
          :disabled="mode === 'view'"
        >
          <el-option
            v-for="item in REGION_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="VIP状态" prop="isVip">
        <el-switch
          v-model="formData.isVip"
          :disabled="mode === 'view'"
        />
      </el-form-item>
      
      <el-form-item label="VIP到期" v-if="formData.isVip" prop="vipExpireDate">
        <el-date-picker
          v-model="formData.vipExpireDate"
          type="date"
          placeholder="请选择到期日期"
          style="width: 100%"
          :disabled="mode === 'view'"
        />
      </el-form-item>
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
import { GENDER_OPTIONS, REGION_OPTIONS } from '@/constants'
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
  region: '',
  isVip: false,
  vipExpireDate: ''
})

const rules = {
  nickname: [required('请输入昵称')],
  gender: [required('请选择性别')],
  birthday: [required('请选择生日')],
  height: [required('请输入身高')],
  weight: [required('请输入体重')],
  region: [required('请选择地区')]
}

// 获取用户详情
const fetchUserDetail = async () => {
  if (!props.userId) return
  
  loading.value = true
  try {
    // const res = await getUserDetail(props.userId)
    // Object.assign(formData, res)
    
    // 模拟数据
    Object.assign(formData, {
      nickname: '张三',
      gender: 'male',
      birthday: '1990-05-15',
      height: 175,
      weight: 70,
      region: 'domestic',
      isVip: true,
      vipExpireDate: '2025-12-31'
    })
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
      // await updateUser(props.userId, formData)
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

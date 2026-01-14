<template>
  <div class="course-tips-container">
    <el-page-header @back="handleBack" content="课程提示详情" />
    
    <el-card class="page-card" style="margin-top: 20px" v-loading="loading">
      <div class="toolbar">
        <div class="course-info" v-if="courseName">
          <h2>{{ courseName }}</h2>
        </div>
        <el-button type="primary" @click="handleAddTip">新增提示</el-button>
      </div>
      
      <el-table
        :data="tipsList"
        stripe
        style="width: 100%"
        border
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="courseName" label="课程名称" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="duration" label="时长" width="100" align="center" />
        <el-table-column prop="stage" label="阶段" width="100" align="center" />
        <el-table-column prop="stageTips" label="阶段提示" min-width="200" align="center" show-overflow-tooltip />
        <el-table-column prop="stageTipsEn" label="阶段提示(英文)" min-width="200" align="center" show-overflow-tooltip />
        <el-table-column prop="time" label="开始-结束时间" width="150" align="center" />
        <el-table-column prop="startTime" label="开始时间(分)" width="120" align="center" />
        <el-table-column prop="startTimeSeconds" label="开始时间(秒)" width="120" align="center" />
        <el-table-column prop="tipTime" label="提示时间(分)" width="120" align="center" />
        <el-table-column prop="tipTimeSeconds" label="提示时间(秒)" width="120" align="center" />
        <el-table-column prop="speed" label="时速" width="100" align="center" />
        <el-table-column prop="slope" label="坡度" width="100" align="center" />
        <el-table-column prop="resistance" label="阻力" width="100" align="center" />
        <el-table-column prop="power" label="功率" width="100" align="center" />
        <el-table-column prop="tempo" label="桨频" width="100" align="center" />
        <el-table-column prop="segment" label="片段" width="100" align="center" />
        <el-table-column prop="set" label="组数" width="100" align="center" />
        <el-table-column prop="interval" label="间隔" width="100" align="center" />
        <el-table-column prop="state" label="状态" width="100" align="center" />
      </el-table>
      
      <div v-if="!loading && tipsList.length === 0" class="empty-state">
        <el-empty description="暂无提示数据" />
      </div>
    </el-card>

    <!-- 新增课程提示弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增课程提示"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="formData.courseName" placeholder="请输入课程名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时长" prop="duration">
              <el-input v-model="formData.duration" placeholder="请输入时长，如：1min" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="阶段" prop="stage">
              <el-input v-model="formData.stage" placeholder="请输入阶段，如：热身、跑步、放松" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="阶段提示" prop="stageTips">
              <el-input v-model="formData.stageTips" placeholder="请输入阶段提示" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="阶段提示(英文)" prop="stageTipsEn">
              <el-input v-model="formData.stageTipsEn" placeholder="请输入阶段提示(英文)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始-结束时间" prop="time">
              <el-input v-model="formData.time" placeholder="如：00:42-01:51" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间(分)" prop="startTime">
              <el-input v-model="formData.startTime" placeholder="如：00:42" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间(秒)" prop="startTimeSeconds">
              <el-input-number v-model="formData.startTimeSeconds" :min="0" placeholder="请输入秒数" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="提示时间(分)" prop="tipTime">
              <el-input v-model="formData.tipTime" placeholder="如：01:51" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提示时间(秒)" prop="tipTimeSeconds">
              <el-input-number v-model="formData.tipTimeSeconds" :min="0" placeholder="请输入秒数" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="时速" prop="speed">
              <el-input-number v-model="formData.speed" :min="0" :precision="0" placeholder="请输入时速" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="坡度" prop="slope">
              <el-input-number v-model="formData.slope" :min="0" placeholder="请输入坡度" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="阻力" prop="resistance">
              <el-input-number v-model="formData.resistance" :min="0" placeholder="请输入阻力" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="功率" prop="power">
              <el-input v-model="formData.power" placeholder="请输入功率" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="桨频" prop="tempo">
              <el-input v-model="formData.tempo" placeholder="请输入桨频" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="片段" prop="segment">
              <el-input v-model="formData.segment" placeholder="请输入片段" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="组数" prop="set">
              <el-input v-model="formData.set" placeholder="请输入组数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="间隔" prop="interval">
              <el-input v-model="formData.interval" placeholder="请输入间隔" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-input v-model="formData.state" placeholder="请输入状态" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProCourseTips, addCourseTip } from '@/api/course'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const tipsList = ref([])
const courseName = ref('')
const dialogVisible = ref(false)
const formRef = ref(null)
const submitting = ref(false)

// 表单数据
const formData = reactive({
  courseId: null,
  courseName: '',
  duration: '',
  stage: '',
  stageTips: '',
  stageTipsEn: '',
  time: '',
  startTime: '',
  startTimeSeconds: null,
  tipTime: '',
  tipTimeSeconds: null,
  speed: null,
  slope: null,
  resistance: null,
  power: '',
  tempo: '',
  segment: '',
  set: '',
  interval: '',
  state: ''
})

// 表单验证规则
const formRules = {
  courseName: [
    { required: true, message: '课程名称不能为空', trigger: 'blur' }
  ],
  stage: [
    { required: true, message: '阶段不能为空', trigger: 'blur' }
  ],
  duration: [
    {
      pattern: /^\d+min$/,
      message: '格式错误，请输入如 \'1min\'',
      trigger: 'blur'
    }
  ],
  startTime: [
    {
      pattern: /^\d{2}:\d{2}$/,
      message: '格式错误，请输入如 \'00:42\'',
      trigger: 'blur'
    }
  ],
  tipTime: [
    {
      pattern: /^\d{2}:\d{2}$/,
      message: '格式错误，请输入如 \'00:42\'',
      trigger: 'blur'
    }
  ],
  time: [
    {
      pattern: /^\d{2}:\d{2}-\d{2}:\d{2}$/,
      message: '格式错误，请输入如 \'00:42-01:51\'',
      trigger: 'blur'
    }
  ]
}

// 获取课程提示数据
const fetchCourseTips = async () => {
  const courseId = route.params.id
  if (!courseId) {
    ElMessage.error('课程ID不存在')
    router.back()
    return
  }
  
  loading.value = true
  try {
    const res = await getProCourseTips(parseInt(courseId))
    console.log('课程提示数据：', res)
    
    if (res && res.data && Array.isArray(res.data)) {
      tipsList.value = res.data
      if (res.data.length > 0 && res.data[0].courseName) {
        courseName.value = res.data[0].courseName
      }
    } else if (res && Array.isArray(res)) {
      tipsList.value = res
      if (res.length > 0 && res[0].courseName) {
        courseName.value = res[0].courseName
      }
    } else {
      tipsList.value = []
      ElMessage.warning('暂无提示数据')
    }
  } catch (error) {
    console.error('获取课程提示失败:', error)
    ElMessage.error('获取课程提示失败')
    tipsList.value = []
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
}

// 打开新增弹窗
const handleAddTip = () => {
  const courseId = route.params.id
  if (!courseId) {
    ElMessage.error('课程ID不存在')
    return
  }
  
  // 重置表单
  Object.assign(formData, {
    courseId: parseInt(courseId),
    courseName: courseName.value || '',
    duration: '',
    stage: '',
    stageTips: '',
    stageTipsEn: '',
    time: '',
    startTime: '',
    startTimeSeconds: null,
    tipTime: '',
    tipTimeSeconds: null,
    speed: null,
    slope: null,
    resistance: null,
    power: '',
    tempo: '',
    segment: '',
    set: '',
    interval: '',
    state: ''
  })
  
  dialogVisible.value = true
  
  // 清除表单验证
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 取消
const handleCancel = () => {
  dialogVisible.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    // 表单验证 - 必须通过所有校验才能提交
    // validate() 方法在验证失败时会 reject，成功时 resolve
    await formRef.value.validate()
    
    submitting.value = true
    
    // 确保 courseId 是整数
    const courseId = parseInt(formData.courseId)
    if (!courseId || isNaN(courseId)) {
      ElMessage.error('课程ID无效')
      return
    }
    
    // 构建提交数据，确保数据类型正确
    const submitData = {
      courseId: courseId
    }
    
    // 字符串类型字段（去除首尾空格，空字符串不传递）
    const stringFields = ['courseName', 'duration', 'stage', 'stageTips', 'stageTipsEn', 'time', 'startTime', 'tipTime', 'power', 'tempo', 'segment', 'set', 'interval', 'state']
    stringFields.forEach(field => {
      const value = formData[field]
      if (value && typeof value === 'string' && value.trim()) {
        submitData[field] = value.trim()
      }
    })
    
    // 整数类型字段（确保是整数，0 也是有效值）
    const integerFields = ['startTimeSeconds', 'tipTimeSeconds', 'speed', 'slope', 'resistance']
    integerFields.forEach(field => {
      const value = formData[field]
      if (value !== null && value !== undefined && value !== '') {
        const numValue = Number(value)
        if (!isNaN(numValue)) {
          // 转换为整数（向下取整）
          submitData[field] = Math.floor(numValue)
        }
      }
    })
    
    // 调试：打印提交的数据
    console.log('提交的课程提示数据：', submitData)
    
    // 调用API
    const response = await addCourseTip(submitData)
    console.log('API 响应：', response)
    
    ElMessage.success('新增成功')
    dialogVisible.value = false
    
    // 刷新列表
    await fetchCourseTips()
  } catch (error) {
    // 表单验证失败时，validate() 会 reject，但没有 error.response
    // 此时 Element Plus 会自动显示字段错误提示，我们不需要额外处理
    if (error.response) {
      // 这是 API 请求错误，显示错误信息
      console.error('新增课程提示失败:', error)
      console.error('错误详情:', error.response)
      
      let errorMessage = '新增失败，请重试'
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      ElMessage.error(errorMessage)
    }
    // 如果是表单验证失败（没有 error.response），Element Plus 已自动显示错误，这里不做处理
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  // 获取课程提示数据
  fetchCourseTips()
})
</script>

<style scoped>
.course-tips-container {
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.course-info {
  flex: 1;
}

.course-info h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media screen and (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .course-info h2 {
    font-size: 20px;
  }
}
</style>

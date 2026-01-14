<template>
  <div class="course-tips-container">
    <el-page-header @back="handleBack" content="课程提示详情" />
    
    <el-card class="page-card" style="margin-top: 20px" v-loading="loading">
      <div class="toolbar">
        <div class="course-info" v-if="courseName">
          <h2>{{ courseName }}</h2>
        </div>
        <div class="toolbar-buttons">
          <el-button type="success" @click="handleBatchAdd">批量添加</el-button>
          <el-button type="primary" @click="handleAddTip">新增提示</el-button>
          <el-button type="danger" :icon="Delete" @click="handleClearAll" :disabled="tipsList.length === 0">清空全部</el-button>
        </div>
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
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleUpdate(row)">修改</el-button>
            <el-button type="primary" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div v-if="!loading && tipsList.length === 0" class="empty-state">
        <el-empty description="暂无提示数据" />
      </div>
    </el-card>

    <!-- 查看提示详情弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="提示详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border v-loading="viewLoading">
        <el-descriptions-item label="课程名称">{{ viewData.courseName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="时长">{{ viewData.duration || '-' }}</el-descriptions-item>
        <el-descriptions-item label="阶段">{{ viewData.stage || '-' }}</el-descriptions-item>
        <el-descriptions-item label="阶段提示">{{ viewData.stageTips || '-' }}</el-descriptions-item>
        <el-descriptions-item label="阶段提示(英文)">{{ viewData.stageTipsEn || '-' }}</el-descriptions-item>
        <el-descriptions-item label="开始-结束时间">{{ viewData.time || '-' }}</el-descriptions-item>
        <el-descriptions-item label="开始时间(分)">{{ viewData.startTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="开始时间(秒)">{{ viewData.startTimeSeconds ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="提示时间(分)">{{ viewData.tipTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="提示时间(秒)">{{ viewData.tipTimeSeconds ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="时速">{{ viewData.speed ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="坡度">{{ viewData.slope ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="阻力">{{ viewData.resistance ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="功率">{{ viewData.power || '-' }}</el-descriptions-item>
        <el-descriptions-item label="桨频">{{ viewData.tempo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="片段">{{ viewData.segment || '-' }}</el-descriptions-item>
        <el-descriptions-item label="组数">{{ viewData.set || '-' }}</el-descriptions-item>
        <el-descriptions-item label="间隔">{{ viewData.interval || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ viewData.state || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增/修改课程提示弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
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

    <!-- 批量添加课程提示弹窗 -->
    <el-dialog
      v-model="batchDialogVisible"
      title="批量添加课程提示"
      width="90%"
      :close-on-click-modal="false"
      top="5vh"
    >
      <div class="batch-add-container">
        <!-- Excel 导入区域 -->
        <div class="excel-import-section">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleExcelChange"
            :show-file-list="false"
            accept=".xlsx,.xls"
            style="margin-bottom: 20px"
          >
            <template #trigger>
              <el-button type="primary">
                <el-icon><Upload /></el-icon>
                导入 Excel 文件
              </el-button>
            </template>
          </el-upload>
          <span class="import-tip">支持 .xlsx 和 .xls 格式，请确保 Excel 文件包含：阶段、时长、开始时间、提示时间、时速、坡度、阻力 等列</span>
        </div>

        <!-- 批量编辑表格 -->
        <div class="batch-table-section">
          <div class="table-toolbar">
            <el-button type="primary" @click="handleAddRow">+ 添加一行</el-button>
            <span class="row-count">共 {{ batchList.length }} 行</span>
          </div>
          <el-table
            :data="batchList"
            stripe
            border
            style="width: 100%"
            max-height="500"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="阶段" min-width="120" align="center">
              <template #default="{ row, $index }">
                <el-input
                  v-model="row.stage"
                  placeholder="请输入阶段"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="时长" min-width="120" align="center">
              <template #default="{ row, $index }">
                <el-input
                  v-model="row.duration"
                  placeholder="如：1min"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="开始时间" min-width="120" align="center">
              <template #default="{ row, $index }">
                <el-input
                  v-model="row.startTime"
                  placeholder="如：00:42"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="提示时间" min-width="120" align="center">
              <template #default="{ row, $index }">
                <el-input
                  v-model="row.tipTime"
                  placeholder="如：01:51"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="时速" min-width="100" align="center">
              <template #default="{ row, $index }">
                <el-input-number
                  v-model="row.speed"
                  :min="0"
                  :precision="0"
                  placeholder="时速"
                  size="small"
                  style="width: 100%"
                />
              </template>
            </el-table-column>
            <el-table-column label="坡度" min-width="100" align="center">
              <template #default="{ row, $index }">
                <el-input-number
                  v-model="row.slope"
                  :min="0"
                  placeholder="坡度"
                  size="small"
                  style="width: 100%"
                />
              </template>
            </el-table-column>
            <el-table-column label="阻力" min-width="100" align="center">
              <template #default="{ row, $index }">
                <el-input-number
                  v-model="row.resistance"
                  :min="0"
                  placeholder="阻力"
                  size="small"
                  style="width: 100%"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center" fixed="right">
              <template #default="{ row, $index }">
                <el-button
                  type="danger"
                  link
                  @click="handleDeleteRow($index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleBatchCancel">取消</el-button>
          <el-button type="primary" @click="handleBatchSubmit" :loading="batchSubmitting">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Delete } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'
import { getProCourseTips, addCourseTip, getCourseTipById, deleteCourseTipById, updateCourseTip, batchAddCourseTip, clearCourseTips } from '@/api/course'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const tipsList = ref([])
const courseName = ref('')
const dialogVisible = ref(false)
const formRef = ref(null)
const submitting = ref(false)
const viewDialogVisible = ref(false)
const viewLoading = ref(false)
const viewData = ref({})
const dialogTitle = ref('新增课程提示')
const isEditMode = ref(false)

// 批量添加相关
const batchDialogVisible = ref(false)
const batchList = ref([])
const batchSubmitting = ref(false)
const uploadRef = ref(null)

// 表单数据
const formData = reactive({
  id: undefined,
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
  
  // 设置为新增模式
  isEditMode.value = false
  dialogTitle.value = '新增课程提示'
  
  // 重置表单
  Object.assign(formData, {
    id: undefined,
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

// 打开修改弹窗
const handleUpdate = (row) => {
  if (!row || !row.id) {
    ElMessage.error('提示ID不存在')
    return
  }
  
  // 设置为修改模式
  isEditMode.value = true
  dialogTitle.value = '修改课程提示'
  
  // 深拷贝当前行数据并赋值给表单
  const courseId = route.params.id
  Object.assign(formData, {
    id: row.id,
    courseId: row.courseId || parseInt(courseId),
    courseName: row.courseName || courseName.value || '',
    duration: row.duration || '',
    stage: row.stage || '',
    stageTips: row.stageTips || '',
    stageTipsEn: row.stageTipsEn || '',
    time: row.time || '',
    startTime: row.startTime || '',
    startTimeSeconds: row.startTimeSeconds ?? null,
    tipTime: row.tipTime || '',
    tipTimeSeconds: row.tipTimeSeconds ?? null,
    speed: row.speed ?? null,
    slope: row.slope ?? null,
    resistance: row.resistance ?? null,
    power: row.power || '',
    tempo: row.tempo || '',
    segment: row.segment || '',
    set: row.set || '',
    interval: row.interval || '',
    state: row.state || ''
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
    
    // 如果是修改模式，必须包含 id 字段，并确保是整数类型
    if (isEditMode.value && formData.id) {
      const tipId = parseInt(formData.id)
      if (!isNaN(tipId) && tipId > 0) {
        submitData.id = tipId
      } else {
        ElMessage.error('提示ID无效')
        submitting.value = false
        return
      }
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
    
    // 根据是否有 id 判断是新增还是修改
    let response
    if (isEditMode.value && submitData.id) {
      // 修改模式
      response = await updateCourseTip(submitData)
      console.log('修改API 响应：', response)
      ElMessage.success('修改成功')
    } else {
      // 新增模式
      response = await addCourseTip(submitData)
      console.log('新增API 响应：', response)
      ElMessage.success('新增成功')
    }
    
    dialogVisible.value = false
    
    // 刷新列表
    await fetchCourseTips()
  } catch (error) {
    // 表单验证失败时，validate() 会 reject，但没有 error.response
    // 此时 Element Plus 会自动显示字段错误提示，我们不需要额外处理
    if (error.response) {
      // 这是 API 请求错误，显示错误信息
      const action = isEditMode.value ? '修改' : '新增'
      console.error(`${action}课程提示失败:`, error)
      console.error('错误详情:', error.response)
      
      let errorMessage = `${action}失败，请重试`
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

// 查看提示详情
const handleView = async (row) => {
  if (!row || !row.id) {
    ElMessage.error('提示ID不存在')
    return
  }
  
  viewLoading.value = true
  viewDialogVisible.value = true
  
  try {
    const res = await getCourseTipById(row.id)
    console.log('提示详情数据：', res)
    
    if (res && res.data) {
      viewData.value = res.data
    } else if (res) {
      viewData.value = res
    } else {
      viewData.value = {}
      ElMessage.warning('未获取到提示详情')
    }
  } catch (error) {
    console.error('获取提示详情失败:', error)
    ElMessage.error('获取提示详情失败')
    viewData.value = {}
  } finally {
    viewLoading.value = false
  }
}

// 删除提示
const handleDelete = async (row) => {
  if (!row || !row.id) {
    ElMessage.error('提示ID不存在')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      '是否确认删除这条提示内容？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 用户确认删除
    const res = await deleteCourseTipById(row.id)
    console.log('删除响应：', res)
    
    ElMessage.success('删除成功')
    
    // 刷新列表
    await fetchCourseTips()
  } catch (error) {
    // 用户取消删除时，ElMessageBox.confirm 会 reject，但不应该显示错误
    if (error !== 'cancel') {
      console.error('删除提示失败:', error)
      let errorMessage = '删除失败，请重试'
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      ElMessage.error(errorMessage)
    }
  }
}

// 打开批量添加弹窗
const handleBatchAdd = () => {
  const courseId = route.params.id
  if (!courseId) {
    ElMessage.error('课程ID不存在')
    return
  }
  
  // 初始化 5 行空数据
  batchList.value = Array.from({ length: 5 }, () => ({
    stage: '',
    duration: '',
    startTime: '',
    tipTime: '',
    speed: null,
    slope: null,
    resistance: null
  }))
  
  batchDialogVisible.value = true
}

// 添加一行
const handleAddRow = () => {
  batchList.value.push({
    stage: '',
    duration: '',
    startTime: '',
    tipTime: '',
    speed: null,
    slope: null,
    resistance: null
  })
}

// 删除一行
const handleDeleteRow = (index) => {
  if (batchList.value.length <= 1) {
    ElMessage.warning('至少保留一行数据')
    return
  }
  batchList.value.splice(index, 1)
}

// Excel 文件变化处理
const handleExcelChange = (file) => {
  const fileReader = new FileReader()
  fileReader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      
      // 读取第一个工作表
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // 转换为 JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      if (!jsonData || jsonData.length === 0) {
        ElMessage.warning('Excel 文件为空或格式不正确')
        return
      }
      
      // 映射 Excel 列到数据字段
      // 支持多种可能的列名
      const mappedData = jsonData.map(row => {
        const item = {
          stage: row['阶段'] || row['stage'] || row['Stage'] || '',
          duration: row['时长'] || row['duration'] || row['Duration'] || '',
          startTime: row['开始时间'] || row['startTime'] || row['StartTime'] || row['开始时间(分)'] || '',
          tipTime: row['提示时间'] || row['tipTime'] || row['TipTime'] || row['提示时间(分)'] || '',
          speed: row['时速'] || row['speed'] || row['Speed'] || null,
          slope: row['坡度'] || row['slope'] || row['Slope'] || null,
          resistance: row['阻力'] || row['resistance'] || row['Resistance'] || null
        }
        
        // 处理数字类型
        if (item.speed !== null && item.speed !== undefined && item.speed !== '') {
          item.speed = Number(item.speed)
          if (isNaN(item.speed)) item.speed = null
        }
        if (item.slope !== null && item.slope !== undefined && item.slope !== '') {
          item.slope = Number(item.slope)
          if (isNaN(item.slope)) item.slope = null
        }
        if (item.resistance !== null && item.resistance !== undefined && item.resistance !== '') {
          item.resistance = Number(item.resistance)
          if (isNaN(item.resistance)) item.resistance = null
        }
        
        return item
      })
      
      batchList.value = mappedData
      ElMessage.success(`成功导入 ${mappedData.length} 条数据`)
    } catch (error) {
      console.error('Excel 解析失败:', error)
      ElMessage.error('Excel 文件解析失败，请检查文件格式')
    }
  }
  
  fileReader.readAsArrayBuffer(file.raw)
}

// 取消批量添加
const handleBatchCancel = () => {
  batchDialogVisible.value = false
  batchList.value = []
}

// 批量提交
const handleBatchSubmit = async () => {
  const courseId = route.params.id
  if (!courseId) {
    ElMessage.error('课程ID不存在')
    return
  }
  
  // 校验数组是否为空
  if (!batchList.value || batchList.value.length === 0) {
    ElMessage.warning('请至少添加一条数据')
    return
  }
  
  // 过滤掉完全空的行
  const validList = batchList.value.filter(item => {
    return item.stage || item.duration || item.startTime || item.tipTime || 
           item.speed !== null || item.slope !== null || item.resistance !== null
  })
  
  if (validList.length === 0) {
    ElMessage.warning('请至少填写一条有效数据')
    return
  }
  
  // 为每条数据添加 courseId 和 courseName
  const courseIdNum = parseInt(courseId)
  const submitData = validList.map(item => {
    const dataItem = {
      courseId: courseIdNum,
      courseName: courseName.value || ''
    }
    
    // 只添加有值的字段
    if (item.stage) dataItem.stage = item.stage.trim()
    if (item.duration) dataItem.duration = item.duration.trim()
    if (item.startTime) dataItem.startTime = item.startTime.trim()
    if (item.tipTime) dataItem.tipTime = item.tipTime.trim()
    if (item.speed !== null && item.speed !== undefined && item.speed !== '') {
      dataItem.speed = Math.floor(Number(item.speed))
    }
    if (item.slope !== null && item.slope !== undefined && item.slope !== '') {
      dataItem.slope = Number(item.slope)
    }
    if (item.resistance !== null && item.resistance !== undefined && item.resistance !== '') {
      dataItem.resistance = Math.floor(Number(item.resistance))
    }
    
    return dataItem
  })
  
  batchSubmitting.value = true
  try {
    console.log('批量提交数据：', submitData)
    const response = await batchAddCourseTip(submitData)
    console.log('批量添加API 响应：', response)
    
    ElMessage.success(`批量添加成功，共添加 ${submitData.length} 条数据`)
    batchDialogVisible.value = false
    batchList.value = []
    
    // 刷新列表
    await fetchCourseTips()
  } catch (error) {
    console.error('批量添加失败:', error)
    let errorMessage = '批量添加失败，请重试'
    if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    ElMessage.error(errorMessage)
  } finally {
    batchSubmitting.value = false
  }
}

// 清空全部提示
const handleClearAll = async () => {
  const courseId = route.params.id
  if (!courseId) {
    ElMessage.error('课程ID不存在')
    return
  }
  
  // 如果列表为空，不应该执行（虽然按钮已禁用，但作为双重保护）
  if (tipsList.value.length === 0) {
    ElMessage.warning('当前没有可清空的数据')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      '确定要清空当前课程的所有提示内容吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 用户确认清空
    const courseIdNum = parseInt(courseId)
    const res = await clearCourseTips(courseIdNum)
    console.log('清空响应：', res)
    
    ElMessage.success('清空成功')
    
    // 刷新列表（此时表格应变为空）
    await fetchCourseTips()
  } catch (error) {
    // 用户取消清空时，ElMessageBox.confirm 会 reject，但不应该显示错误
    if (error !== 'cancel') {
      console.error('清空提示失败:', error)
      let errorMessage = '清空失败，请重试'
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      ElMessage.error(errorMessage)
    }
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

.toolbar-buttons {
  display: flex;
  gap: 10px;
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

.batch-add-container {
  padding: 10px 0;
}

.excel-import-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.import-tip {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

.batch-table-section {
  margin-top: 20px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.row-count {
  color: #909399;
  font-size: 14px;
}
</style>

<template>
  <div class="course-editor-container">
    <el-page-header @back="handleBack" :content="isEdit ? '编辑课程' : '新增课程'" />
    
    <el-card class="page-card" style="margin-top: 20px">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <!-- 基础信息 -->
        <el-divider content-position="left">基础信息</el-divider>
        
        <el-form-item label="课程名称" prop="courseName">
          <el-input
            v-model="formData.courseName"
            placeholder="请输入课程名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="设备类型" prop="deviceType">
          <el-select
            v-model="formData.deviceType"
            placeholder="请选择设备类型"
            style="width: 100%"
            @change="handleTypeChange"
          >
            <el-option
              v-for="item in COURSE_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="课程类型" prop="courseType">
          <el-select
            v-model="formData.courseType"
            placeholder="请选择课程类型"
            style="width: 100%"
          >
            <el-option label="燃脂" :value="0" />
            <el-option label="健步走" :value="1" />
            <el-option label="跑走结合" :value="2" />
            <el-option label="基础" :value="3" />
            <el-option label="HIIT" :value="4" />
            <el-option label="冲刺" :value="5" />
            <el-option label="耐力" :value="6" />
            <el-option label="高强度" :value="7" />
            <el-option label="恢复" :value="8" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="语言编码" prop="langCode">
          <el-select
            v-model="formData.langCode"
            placeholder="请选择语言编码"
            style="width: 100%"
          >
            <el-option label="中文" :value="0" />
            <el-option label="英文" :value="1" />
          </el-select>
        </el-form-item>
        
        <el-divider content-position="left">媒体资源</el-divider>
        
        <el-form-item label="封面图片URL" prop="coverImage">
          <el-input
            v-model="formData.coverImage"
            placeholder="请输入封面图片URL"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="封面视频URL" prop="coverVideo">
          <el-input
            v-model="formData.coverVideo"
            placeholder="请输入封面视频URL"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="课程视频URL" prop="videoUrl">
          <el-input
            v-model="formData.videoUrl"
            placeholder="请输入课程视频URL"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-divider content-position="left">课程详情</el-divider>
        
        <el-form-item label="课程介绍" prop="introduce">
          <el-input
            v-model="formData.introduce"
            type="textarea"
            :rows="4"
            placeholder="请输入课程介绍"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="训练目标" prop="trainingObjectives">
          <el-input
            v-model="formData.trainingObjectives"
            type="textarea"
            :rows="4"
            placeholder="请输入训练目标"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="训练时间" prop="trainingTime">
          <el-input
            v-model="formData.trainingTime"
            placeholder="例如：30分钟"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="适用人群" prop="userGroup">
          <el-input
            v-model="formData.userGroup"
            placeholder="请输入适用人群"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? '保存' : '确定' }}
          </el-button>
          <el-button @click="handleBack">取消</el-button>
          <el-button v-if="isEdit" type="info" @click="handlePreview">预览</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCourseDetail, createCourse, updateCourse, addProCourse, updateSysCourse } from '@/api/course'
import { COURSE_TYPE_OPTIONS } from '@/constants'
import { required } from '@/utils/validate'
import SegmentEditor from '@/components/course/SegmentEditor.vue'
import ImageUpload from '@/components/upload/ImageUpload.vue'
import VideoUpload from '@/components/upload/VideoUpload.vue'

const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const submitting = ref(false)

const isEdit = computed(() => !!route.params.id)

const formData = reactive({
  proCourseId: null,
  detailId: null,
  courseName: '',
  courseType: '',
  deviceType: '',
  coverImage: '',
  coverVideo: '',
  videoUrl: '',
  introduce: '',
  langCode: 0,
  trainingObjectives: '',
  trainingTime: '',
  userGroup: '',
  segments: []
})

const rules = {
  courseName: [required('请输入课程名称')],
  courseType: [required('请选择课程类型')],
  deviceType: [required('请选择设备类型')],
  coverImage: [required('请输入封面图片URL')],
  coverVideo: [required('请输入封面视频URL')],
  videoUrl: [required('请输入课程视频URL')],
  introduce: [required('请输入课程介绍')],
  langCode: [required('请选择语言编码')],
  trainingObjectives: [required('请输入训练目标')],
  trainingTime: [required('请输入训练时间')],
  userGroup: [required('请输入适用人群')]
}

// 设备类型改变时，清空分段数据
const handleTypeChange = () => {
  formData.segments = []
}

// 获取课程详情
const fetchCourseDetail = async () => {
  try {
    // 尝试从路由 state 获取数据（从列表页传递过来的）
    const stateData = history.state.courseData
    
    if (stateData) {
      // 映射列表页的数据到表单字段
      Object.assign(formData, {
        proCourseId: stateData.id,
        detailId: stateData.detailId || 0,
        courseName: stateData.title || '',
        courseType: stateData.type || '',
        deviceType: stateData.deviceType || '',
        coverImage: stateData.thumbnailUrl || '',
        coverVideo: stateData.coverVideo || '',
        videoUrl: stateData.videoUrl || '',
        introduce: stateData.introduction || '',
        langCode: stateData.langCode || 0,
        trainingObjectives: stateData.trainingObjectives || '',
        trainingTime: stateData.trainingTime || stateData.duration || '',
        userGroup: stateData.userGroup || '',
        segments: stateData.segments || []
      })
    } else {
      // 如果没有 state 数据，尝试调用 API
      const res = await getCourseDetail(route.params.id)
      if (res) {
        Object.assign(formData, {
          proCourseId: res.proCourseId,
          detailId: res.detailId || 0,
          courseName: res.courseName || '',
          courseType: res.courseType || '',
          deviceType: res.deviceType || '',
          coverImage: res.coverImage || '',
          coverVideo: res.coverVideo || '',
          videoUrl: res.videoUrl || '',
          introduce: res.introduce || '',
          langCode: res.langCode || 0,
          trainingObjectives: res.trainingObjectives || '',
          trainingTime: res.trainingTime || res.duration || '',
          userGroup: res.userGroup || '',
          segments: res.segments || []
        })
      }
    }
  } catch (error) {
    console.error('获取课程详情失败:', error)
    ElMessage.error('获取课程详情失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      if (isEdit.value) {
        // 更新课程 - 使用新的 updateSysCourse 接口
        const requestData = {
          proCourseId: formData.proCourseId,
          detailId: formData.detailId || 0,
          courseName: formData.courseName,
          courseType: formData.courseType,
          deviceType: formData.deviceType,
          coverImage: formData.coverImage,
          coverVideo: formData.coverVideo,
          videoUrl: formData.videoUrl,
          introduce: formData.introduce,
          langCode: formData.langCode,
          trainingObjectives: formData.trainingObjectives,
          trainingTime: formData.trainingTime,
          userGroup: formData.userGroup
        }
        
        await updateSysCourse(requestData)
        ElMessage.success('更新成功')
      } else {
        // 创建新课程 - 使用 addProCourse 接口
        const requestData = {
          courseName: formData.courseName,
          courseType: formData.courseType,
          deviceType: formData.deviceType,
          coverImage: formData.coverImage,
          coverVideo: formData.coverVideo,
          videoUrl: formData.videoUrl,
          introduce: formData.introduce,
          langCode: formData.langCode,
          trainingObjectives: formData.trainingObjectives,
          trainingTime: formData.trainingTime,
          userGroup: formData.userGroup
        }
        
        await addProCourse(requestData)
        ElMessage.success('创建成功')
      }
      
      router.push('/courses')
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitting.value = false
    }
  })
}

// 返回
const handleBack = () => {
  router.back()
}

// 预览
const handlePreview = () => {
  router.push(`/courses/preview/${route.params.id}`)
}

onMounted(() => {
  if (isEdit.value) {
    fetchCourseDetail()
  }
})
</script>

<style scoped>
.course-editor-container {
  height: 100%;
}

.el-form {
  max-width: 1000px;
}
</style>

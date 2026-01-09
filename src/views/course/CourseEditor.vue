<template>
  <div class="course-editor-container">
    <el-page-header @back="handleBack" :content="isEdit ? '编辑课程' : '创建课程'" />
    
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
        
        <el-form-item label="课程标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入课程标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="课程类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择课程类型"
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
        
        <el-form-item label="视频文件" prop="videoUrl">
          <VideoUpload v-model="formData.videoUrl" />
        </el-form-item>
        
        <el-form-item label="缩略图" prop="thumbnailUrl">
          <ImageUpload v-model="formData.thumbnailUrl" />
        </el-form-item>
        
        <!-- 分段设置 -->
        <el-divider content-position="left">分段设置</el-divider>
        
        <el-form-item label="" prop="segments">
          <SegmentEditor
            v-model="formData.segments"
            :course-type="formData.type"
          />
        </el-form-item>
        
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? '保存' : '创建' }}
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
import { getCourseDetail, createCourse, updateCourse } from '@/api/course'
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
  title: '',
  type: '',
  videoUrl: '',
  thumbnailUrl: '',
  segments: []
})

const rules = {
  title: [required('请输入课程标题')],
  type: [required('请选择课程类型')],
  videoUrl: [required('请上传视频文件')],
  thumbnailUrl: [required('请上传缩略图')],
  segments: [
    {
      validator: (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error('请至少添加一个分段'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 课程类型改变时，清空分段数据
const handleTypeChange = () => {
  formData.segments = []
}

// 获取课程详情
const fetchCourseDetail = async () => {
  try {
    // const res = await getCourseDetail(route.params.id)
    // Object.assign(formData, res)
    
    // 模拟数据
    const mockCourse = {
      id: route.params.id,
      title: '模拟课程 - 入门基础训练',
      type: 'Treadmill',
      videoUrl: 'https://example.com/video/1.mp4',
      thumbnailUrl: 'https://picsum.photos/400/240?random=1',
      segments: [
        {
          id: 'seg-1',
          startTime: 0,
          endTime: 300,
          speed: 5,
          incline: 0
        },
        {
          id: 'seg-2',
          startTime: 300,
          endTime: 900,
          speed: 8,
          incline: 2
        },
        {
          id: 'seg-3',
          startTime: 900,
          endTime: 1200,
          speed: 6,
          incline: 1
        }
      ]
    }
    
    Object.assign(formData, mockCourse)
  } catch (error) {
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
      // 计算总时长
      const duration = Math.max(...formData.segments.map(s => s.endTime))
      
      const data = {
        ...formData,
        duration
      }
      
      if (isEdit.value) {
        // await updateCourse(route.params.id, data)
        ElMessage.success('更新成功')
      } else {
        // await createCourse(data)
        ElMessage.success('创建成功')
      }
      
      router.push('/courses')
    } catch (error) {
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

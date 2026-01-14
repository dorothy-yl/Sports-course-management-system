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
        <!-- 新增模式：只显示4个必填字段 -->
        <template v-if="!isEdit">
          <el-divider content-position="left">基础信息</el-divider>
          
          <el-form-item label="设备类型" prop="deviceType">
            <el-select
              v-model="formData.deviceType"
              placeholder="请选择设备类型"
              style="width: 100%"
            >
              <el-option label="跑步机" :value="0" />
              <el-option label="脚踏车" :value="1" />
              <el-option label="划船机" :value="2" />
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
        </template>
        
        <!-- 编辑模式：显示所有字段 -->
        <template v-else>
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
          
          <el-divider content-position="left">课程描述</el-divider>
          
          <el-form-item label="副标题">
            <el-input
              v-model="formData.theSubtitle"
              placeholder="请输入副标题"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="热量值">
            <el-input
              v-model="formData.caloriesValue"
              placeholder="请输入热量值"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          
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
          
          <el-form-item label="简要特点">
            <el-input
              v-model="formData.briefFeatures"
              type="textarea"
              :rows="3"
              placeholder="请输入简要特点"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="课程特色">
            <el-input
              v-model="formData.courseFeatures"
              type="textarea"
              :rows="3"
              placeholder="请输入课程特色"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-divider content-position="left">训练信息</el-divider>
          
          <el-form-item label="训练时间" prop="trainingTime">
            <el-input
              v-model="formData.trainingTime"
              placeholder="例如：30分钟"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="训练频率">
            <el-input
              v-model="formData.trainingFrequency"
              placeholder="请输入训练频率"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="身体反应">
            <el-input
              v-model="formData.bodyReaction"
              type="textarea"
              :rows="3"
              placeholder="请输入身体反应"
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
          
          <el-form-item label="训练原则">
            <el-input
              v-model="formData.trainingPrinciples"
              type="textarea"
              :rows="3"
              placeholder="请输入训练原则"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="训练方法">
            <el-input
              v-model="formData.trainingMethods"
              type="textarea"
              :rows="3"
              placeholder="请输入训练方法"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="训练过程">
            <el-input
              v-model="formData.trainingProcess"
              type="textarea"
              :rows="3"
              placeholder="请输入训练过程"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="培训效果">
            <el-input
              v-model="formData.trainingEffect"
              type="textarea"
              :rows="3"
              placeholder="请输入培训效果"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-divider content-position="left">适用人群</el-divider>
          
          <el-form-item label="适用人群" prop="userGroup">
            <el-input
              v-model="formData.userGroup"
              type="textarea"
              :rows="3"
              placeholder="请输入适用人群"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="禁忌人群">
            <el-input
              v-model="formData.tabooGroups"
              type="textarea"
              :rows="3"
              placeholder="请输入禁忌人群"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-divider content-position="left">器材与锻炼部位</el-divider>
          
          <el-form-item label="锻炼部位">
            <el-input
              v-model="formData.exerciseSite"
              placeholder="请输入锻炼部位"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="必需器材">
            <el-input
              v-model="formData.requiredEquipment"
              type="textarea"
              :rows="3"
              placeholder="请输入必需器材"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="推荐器材">
            <el-input
              v-model="formData.recommendedEquipment"
              type="textarea"
              :rows="3"
              placeholder="请输入推荐器材"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-divider content-position="left">建议与反馈</el-divider>
          
          <el-form-item label="课程建议">
            <el-input
              v-model="formData.courseAdvice"
              type="textarea"
              :rows="3"
              placeholder="请输入课程建议"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="安全提示">
            <el-input
              v-model="formData.safetyTips"
              type="textarea"
              :rows="3"
              placeholder="请输入安全提示"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="系列特点">
            <el-input
              v-model="formData.seriesFeatures"
              type="textarea"
              :rows="3"
              placeholder="请输入系列特点"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="课程反馈">
            <el-input
              v-model="formData.courseFeedback"
              type="textarea"
              :rows="3"
              placeholder="请输入课程反馈"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="特别备注">
            <el-input
              v-model="formData.specialRemarks"
              type="textarea"
              :rows="3"
              placeholder="请输入特别备注"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </template>
        
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
  segments: [],
  // 课程描述相关字段
  theSubtitle: '',
  caloriesValue: '',
  briefFeatures: '',
  courseFeatures: '',
  // 训练信息相关字段
  trainingFrequency: '',
  bodyReaction: '',
  trainingPrinciples: '',
  trainingMethods: '',
  trainingProcess: '',
  trainingEffect: '',
  // 适用人群相关字段
  tabooGroups: '',
  // 器材与部位相关字段
  exerciseSite: '',
  requiredEquipment: '',
  recommendedEquipment: '',
  // 建议与反馈相关字段
  courseAdvice: '',
  safetyTips: '',
  seriesFeatures: '',
  courseFeedback: '',
  specialRemarks: ''
})

// 动态验证规则：新增模式只验证4个必填字段，编辑模式验证全部字段
const rules = computed(() => {
  if (isEdit.value) {
    // 编辑模式：所有必填字段
    return {
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
  } else {
    // 新增模式：只验证4个字段
    return {
      deviceType: [required('请选择设备类型')],
      coverImage: [required('请输入封面图片URL')],
      coverVideo: [required('请输入封面视频URL')],
      videoUrl: [required('请输入课程视频URL')]
    }
  }
})

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
        introduce:stateData.introduce || '',
        langCode: stateData.langCode || 0,
        trainingObjectives: stateData.trainingObjectives || '',
        trainingTime: stateData.trainingTime || stateData.duration || '',
        userGroup: stateData.userGroup || '',
        segments: stateData.segments || [],
        // 课程描述相关字段
        theSubtitle: stateData.theSubtitle || '',
        caloriesValue: stateData.caloriesValue || '',
        briefFeatures: stateData.briefFeatures || '',
        courseFeatures: stateData.courseFeatures || '',
        // 训练信息相关字段
        trainingFrequency: stateData.trainingFrequency || '',
        bodyReaction: stateData.bodyReaction || '',
        trainingPrinciples: stateData.trainingPrinciples || '',
        trainingMethods: stateData.trainingMethods || '',
        trainingProcess: stateData.trainingProcess || '',
        trainingEffect: stateData.trainingEffect || '',
        // 适用人群相关字段
        tabooGroups: stateData.tabooGroups || '',
        // 器材与部位相关字段
        exerciseSite: stateData.exerciseSite || '',
        requiredEquipment: stateData.requiredEquipment || '',
        recommendedEquipment: stateData.recommendedEquipment || '',
        // 建议与反馈相关字段
        courseAdvice: stateData.courseAdvice || '',
        safetyTips: stateData.safetyTips || '',
        seriesFeatures: stateData.seriesFeatures || '',
        courseFeedback: stateData.courseFeedback || '',
        specialRemarks: stateData.specialRemarks || ''
      })
    } else {
      // 如果没有 state 数据，尝试调用 API
      // 需要传递完整的参数对象，并从 query 中获取必要参数
      const params = {
        courseId: parseInt(route.params.id),
        deviceType: route.query.deviceType || 0,
        langCode: route.query.langCode || 0
      }
      
      console.log('编辑页面 API 参数：', params)
      
      const res = await getCourseDetail(params)
      
      console.log('编辑页面 API 返回：', res)
      
      // 检查返回数据结构，从 res.data 中提取数据
      if (res && res.code === 200 && res.data) {
        const data = res.data
        
        console.log('编辑页面映射数据：', data)
        
        Object.assign(formData, {
          proCourseId: data.proCourseId,
          detailId: data.detailId || 0,
          courseName: data.courseName || '',
          courseType: data.courseType || '',
          deviceType: data.deviceType || '',
          coverImage: data.coverImage || '',
          coverVideo: data.coverVideo || '',
          videoUrl: data.videoUrl || '',
          introduce: data.introduce || '',
          langCode: data.langCode || 0,
          trainingObjectives: data.trainingObjectives || '',
          trainingTime: data.trainingTime || data.duration || '',
          userGroup: data.userGroup || '',
          segments: data.segments || [],
          // 课程描述相关字段
          theSubtitle: data.theSubtitle || '',
          caloriesValue: data.caloriesValue || '',
          briefFeatures: data.briefFeatures || '',
          courseFeatures: data.courseFeatures || '',
          // 训练信息相关字段
          trainingFrequency: data.trainingFrequency || '',
          bodyReaction: data.bodyReaction || '',
          trainingPrinciples: data.trainingPrinciples || '',
          trainingMethods: data.trainingMethods || '',
          trainingProcess: data.trainingProcess || '',
          trainingEffect: data.trainingEffect || '',
          // 适用人群相关字段
          tabooGroups: data.tabooGroups || data.taboGroups || '',
          // 器材与部位相关字段
          exerciseSite: data.exerciseSite || '',
          requiredEquipment: data.requiredEquipment || '',
          recommendedEquipment: data.recommendedEquipment || '',
          // 建议与反馈相关字段
          courseAdvice: data.courseAdvice || '',
          safetyTips: data.safetyTips || '',
          seriesFeatures: data.seriesFeatures || '',
          courseFeedback: data.courseFeedback || '',
          specialRemarks: data.specialRemarks || ''
        })
      } else {
        console.warn('API 返回数据格式不正确或无数据')
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
          userGroup: formData.userGroup,
          // 课程描述相关字段
          theSubtitle: formData.theSubtitle,
          caloriesValue: formData.caloriesValue,
          briefFeatures: formData.briefFeatures,
          courseFeatures: formData.courseFeatures,
          // 训练信息相关字段
          trainingFrequency: formData.trainingFrequency,
          bodyReaction: formData.bodyReaction,
          trainingPrinciples: formData.trainingPrinciples,
          trainingMethods: formData.trainingMethods,
          trainingProcess: formData.trainingProcess,
          trainingEffect: formData.trainingEffect,
          // 适用人群相关字段
          tabooGroups: formData.tabooGroups,
          // 器材与部位相关字段
          exerciseSite: formData.exerciseSite,
          requiredEquipment: formData.requiredEquipment,
          recommendedEquipment: formData.recommendedEquipment,
          // 建议与反馈相关字段
          courseAdvice: formData.courseAdvice,
          safetyTips: formData.safetyTips,
          seriesFeatures: formData.seriesFeatures,
          courseFeedback: formData.courseFeedback,
          specialRemarks: formData.specialRemarks
        }
        
        await updateSysCourse(requestData)
        ElMessage.success('更新成功')
      } else {
        // 创建新课程 - 使用 addProCourse 接口，只提交4个必填字段
        const requestData = {
          deviceType: formData.deviceType,
          coverImage: formData.coverImage,
          coverVideo: formData.coverVideo,
          videoUrl: formData.videoUrl
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
  router.push({
    path: `/courses/preview/${route.params.id}`,
    query: {
      id: route.params.id,
      deviceType: formData.deviceType,
      langCode: formData.langCode
    }
  })
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

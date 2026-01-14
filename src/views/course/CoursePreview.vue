<template>
  <div class="course-preview-container">
    <el-page-header @back="handleBack" content="课程详情" />
    
    <el-card class="page-card" style="margin-top: 20px" v-loading="loading">
      <!-- 视频播放器 -->
      <div class="video-player">
        <video
          v-if="courseInfo.videoUrl && courseInfo.videoUrl.trim() !== ''"
          :src="courseInfo.videoUrl"
          controls
          style="width: 100%; border-radius: 8px"
          @error="handleVideoError"
        ></video>
        <div v-else class="no-video">
          <el-icon :size="60" color="#ccc">
            <VideoPlay />
          </el-icon>
          <p>暂无视频</p>
        </div>
        <!-- 显示视频URL用于调试 -->
        <div v-if="courseInfo.videoUrl" style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px; font-size: 12px; color: #666; word-break: break-all;">
          <strong>视频地址：</strong>{{ courseInfo.videoUrl }}
        </div>
      </div>
      
      <!-- 课程信息 -->
      <div class="course-info">
        <h2>{{ courseInfo.title }}</h2>
        <div class="course-meta">
          <el-tag :type="getCourseTypeTag(courseInfo.type)">
            {{ getCourseTypeName(courseInfo.type) }}
          </el-tag>
          <span class="meta-item">
            <el-icon><Clock /></el-icon>
            总时长：{{ courseInfo.duration || '-' }}
          </span>
        </div>
      </div>

      <!-- 详细信息展示区域 -->
      <el-divider />
      
      <!-- 课程描述卡片 -->
      <el-card class="detail-card" v-if="courseInfo.introduce || courseInfo.theSubtitle || courseInfo.caloriesValue || courseInfo.briefFeatures || courseInfo.courseFeatures">
        <template #header>
          <div class="card-header">
            <span>课程描述</span>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="副标题" v-if="courseInfo.theSubtitle">
            {{ courseInfo.theSubtitle }}
          </el-descriptions-item>
          <el-descriptions-item label="热量值" v-if="courseInfo.caloriesValue">
            {{ courseInfo.caloriesValue }}
          </el-descriptions-item>
          <el-descriptions-item label="课程介绍" v-if="courseInfo.introduce">
            <div class="text-content">{{ courseInfo.introduce }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="简要特点" v-if="courseInfo.briefFeatures">
            <div class="text-content">{{ courseInfo.briefFeatures }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="课程特色" v-if="courseInfo.courseFeatures">
            <div class="text-content">{{ courseInfo.courseFeatures }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 训练信息卡片 -->
      <el-card class="detail-card" v-if="courseInfo.trainingTime || courseInfo.trainingFrequency || courseInfo.trainingObjectives || courseInfo.trainingPrinciples || courseInfo.trainingMethods || courseInfo.trainingProcess || courseInfo.bodyReaction || courseInfo.trainingEffect">
        <template #header>
          <div class="card-header">
            <span>训练信息</span>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="训练时间" v-if="courseInfo.trainingTime">
            {{ courseInfo.trainingTime }}
          </el-descriptions-item>
          <el-descriptions-item label="训练频率" v-if="courseInfo.trainingFrequency">
            {{ courseInfo.trainingFrequency }}
          </el-descriptions-item>
          <el-descriptions-item label="身体反应" v-if="courseInfo.bodyReaction">
            <div class="text-content">{{ courseInfo.bodyReaction }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="训练目标" v-if="courseInfo.trainingObjectives">
            <div class="text-content">{{ courseInfo.trainingObjectives }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="训练原则" v-if="courseInfo.trainingPrinciples">
            <div class="text-content">{{ courseInfo.trainingPrinciples }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="训练方法" v-if="courseInfo.trainingMethods">
            <div class="text-content">{{ courseInfo.trainingMethods }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="训练过程" v-if="courseInfo.trainingProcess">
            <div class="text-content">{{ courseInfo.trainingProcess }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="培训效果" v-if="courseInfo.trainingEffect">
            <div class="text-content">{{ courseInfo.trainingEffect }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 适用人群卡片 -->
      <el-card class="detail-card" v-if="courseInfo.userGroup || courseInfo.tabooGroups">
        <template #header>
          <div class="card-header">
            <span>适用人群</span>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="适用人群" v-if="courseInfo.userGroup">
            <div class="text-content">{{ courseInfo.userGroup }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="禁忌人群" v-if="courseInfo.tabooGroups">
            <div class="text-content">{{ courseInfo.tabooGroups }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 器材与部位卡片 -->
      <el-card class="detail-card" v-if="courseInfo.exerciseSite || courseInfo.requiredEquipment || courseInfo.recommendedEquipment">
        <template #header>
          <div class="card-header">
            <span>器材与锻炼部位</span>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="锻炼部位" v-if="courseInfo.exerciseSite">
            {{ courseInfo.exerciseSite }}
          </el-descriptions-item>
          <el-descriptions-item label="必需器材" v-if="courseInfo.requiredEquipment">
            <div class="text-content">{{ courseInfo.requiredEquipment }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="推荐器材" v-if="courseInfo.recommendedEquipment">
            <div class="text-content">{{ courseInfo.recommendedEquipment }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 建议与反馈卡片 -->
      <el-card class="detail-card" v-if="courseInfo.courseAdvice || courseInfo.safetyTips || courseInfo.seriesFeatures || courseInfo.courseFeedback || courseInfo.specialRemarks">
        <template #header>
          <div class="card-header">
            <span>建议与反馈</span>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="课程建议" v-if="courseInfo.courseAdvice">
            <div class="text-content">{{ courseInfo.courseAdvice }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="安全提示" v-if="courseInfo.safetyTips">
            <div class="text-content">{{ courseInfo.safetyTips }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="系列特点" v-if="courseInfo.seriesFeatures">
            <div class="text-content">{{ courseInfo.seriesFeatures }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="课程反馈" v-if="courseInfo.courseFeedback">
            <div class="text-content">{{ courseInfo.courseFeedback }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="特别备注" v-if="courseInfo.specialRemarks">
            <div class="text-content">{{ courseInfo.specialRemarks }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCourseDetail } from '@/api/course'
import { getCourseTypeName } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const loading = ref(false)

const courseInfo = reactive({
  title: '',
  type: '',
  videoUrl: '',
  thumbnailUrl: '',
  duration: 0,
  // 详细信息字段
  theSubtitle: '',
  caloriesValue: '',
  introduce: '',
  trainingTime: '',
  trainingPrinciples: '',
  trainingObjectives: '',
  trainingMethods: '',
  trainingFrequency: '',
  userGroup: '',
  tabooGroups: '',
  seriesFeatures: '',
  courseAdvice: '',
  courseFeedback: '',
  safetyTips: '',
  exerciseSite: '',
  recommendedEquipment: '',
  requiredEquipment: '',
  briefFeatures: '',
  trainingProcess: '',
  specialRemarks: '',
  // 新增字段
  bodyReaction: '',
  trainingEffect: '',
  courseFeatures: ''
})

// 获取课程类型标签颜色
const getCourseTypeTag = (type) => {
  const map = {
    'Treadmill': 'success',
    'Cycling': 'warning',
    'Rowing': 'info',
    0: 'success',  // 跑步机
    1: 'warning',  // 动感单车
    2: 'info'      // 划船机
  }
  return map[type] || 'info'
}

// 获取课程详情
const fetchCourseDetail = async () => {
  
  loading.value = true
  try {
    var params = {
    courseId:parseInt(route.query.id),
    deviceType: route.query.deviceType,
    langCode: route.query.langCode,
      
    }
     console.log('参数：'+JSON.stringify (params))
    const res = await getCourseDetail(params)
    console.log('课程详情接口返回:', res)
    console.log('课程ID:', route.params.id)
    console.log('数据:', res.code==200)
    
    if (res.code==200) {
      // 严格查找ID匹配的课程
      const data = res.data
      console.log('数据:', data)
      
      // 如果找不到匹配的课程，显示错误并返回
      if (!data) {
        console.error(`错误：未找到ID为 ${route.params.id} 的课程`)
        console.log('后端返回的所有课程ID:', res.rows.map(r => r.proCourseId))
        ElMessage.error(`未找到对应的课程（ID: ${route.params.id}）`)
        router.back()
        return
      }
      
      console.log(`✅ 成功找到匹配的课程，ID: ${data.proCourseId}`)

      
      console.log('后端返回的完整课程数据:', data)
      console.log('视频URL (videoUrl):', data.videoUrl)
      console.log('视频URL1 (videoUrl1):', data.videoUrl1)
      console.log('封面视频 (coverVideo):', data.coverVideo)
      console.log('检查"建议与反馈"相关字段:', {
        courseAdvice: data.courseAdvice,
        safetyTips: data.safetyTips,
        courseFeedback: data.courseFeedback,
        seriesFeatures: data.seriesFeatures,
        specialRemarks: data.specialRemarks
      })
      
      // 映射后端字段到前端字段
      Object.assign(courseInfo, {
        id: data.proCourseId,
        title: data.courseName || '未命名课程',
        type: data.courseType,
        videoUrl: data.videoUrl || data.videoUrl1 || data.coverVideo || '',
        thumbnailUrl: data.coverImage,
        coverVideo: data.coverVideo,
        duration: data.duration,
        // 详细信息字段映射
        theSubtitle: data.theSubtitle || null,
        caloriesValue: data.caloriesValue || null,
        introduce: data.introduce || null,
        trainingTime: data.trainingTime || null,
        trainingPrinciples: data.trainingPrinciples || null,
        trainingObjectives: data.trainingObjectives || null,
        trainingMethods: data.trainingMethods || null,
        trainingFrequency: data.trainingFrequency || null,
        userGroup: data.userGroup || null,
        tabooGroups: data.tabooGroups || data.taboGroups || null,
        seriesFeatures: data.seriesFeatures || null,
        courseAdvice: data.courseAdvice || null,
        courseFeedback: data.courseFeedback || null,
        safetyTips: data.safetyTips || null,
        exerciseSite: data.exerciseSite || null,
        recommendedEquipment: data.recommendedEquipment || null,
        requiredEquipment: data.requiredEquipment || null,
        briefFeatures: data.briefFeatures || null,
        trainingProcess: data.trainingProcess || null,
        specialRemarks: data.specialRemarks || null,
        // 新增字段映射
        bodyReaction: data.bodyReaction || null,
        trainingEffect: data.trainingEffect || null,
        courseFeatures: data.courseFeatures || null
      })
      
      // 输出映射后的课程信息，便于调试
      console.log('映射后的课程信息:', courseInfo)
      console.log('视频URL最终值:', courseInfo.videoUrl)
      
      // 统计各个卡片将显示的字段数量
      const cardStats = {
        
        课程描述: [courseInfo.introduce, courseInfo.theSubtitle, courseInfo.caloriesValue, courseInfo.briefFeatures, courseInfo.courseFeatures].filter(v => v).length,
        训练信息: [courseInfo.trainingTime, courseInfo.trainingFrequency, courseInfo.trainingObjectives, courseInfo.trainingPrinciples, courseInfo.trainingMethods, courseInfo.trainingProcess, courseInfo.bodyReaction, courseInfo.trainingEffect].filter(v => v).length,
        适用人群: [courseInfo.userGroup, courseInfo.tabooGroups].filter(v => v).length,
        器材与部位: [courseInfo.exerciseSite, courseInfo.requiredEquipment, courseInfo.recommendedEquipment].filter(v => v).length,
        建议与反馈: [courseInfo.courseAdvice, courseInfo.safetyTips, courseInfo.seriesFeatures, courseInfo.courseFeedback, courseInfo.specialRemarks].filter(v => v).length
      }
      console.log('各卡片显示的字段数量:', cardStats)
      
      if (!courseInfo.videoUrl) {
        console.warn('警告：课程没有可用的视频URL')
      }
    } else {
      console.log('接口返回数据为空')
      ElMessage.warning('未找到课程详情')
    }
  } catch (error) {
    console.error('获取课程详情失败:', error)
    ElMessage.error('获取课程详情失败')
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
}

// 视频加载错误处理
const handleVideoError = (event) => {
  console.error('视频加载失败:', courseInfo.videoUrl)
  ElMessage.error('视频加载失败，请检查视频地址是否有效')
}


onMounted(() => {
  fetchCourseDetail()
})
</script>

<style scoped>
.course-preview-container {
  height: 100%;
}

.video-player {
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.no-video {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #999;
}

.course-info {
  margin-top: 20px;
}

.course-info h2 {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}
/* 详细信息卡片样式 */
.detail-card {
  margin-top: 20px;
}

.detail-card .card-header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.text-content {
  line-height: 1.8;
  color: #666;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .course-info h2 {
    font-size: 20px;
  }
  
  .detail-card {
    margin-top: 16px;
  }
  
  .detail-card :deep(.el-descriptions__label) {
    width: 100px;
    font-size: 13px;
  }
  
  .detail-card :deep(.el-descriptions__content) {
    font-size: 13px;
  }
}

/* 优化描述列表样式 */
.detail-card :deep(.el-descriptions__label) {
  background-color: #fafafa;
  font-weight: 600;
  color: #606266;
}

.detail-card :deep(.el-descriptions__content) {
  color: #666;
}
</style>

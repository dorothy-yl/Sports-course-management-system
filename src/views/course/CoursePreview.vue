<template>
  <div class="course-preview-container">
    <el-page-header @back="handleBack" content="课程预览" />
    
    <el-card class="page-card" style="margin-top: 20px" v-loading="loading">
      <el-row :gutter="20">
        <el-col :xs="24" :md="16">
          <!-- 视频播放器 -->
          <div class="video-player">
            <video
              v-if="courseInfo.videoUrl"
              :src="courseInfo.videoUrl"
              controls
              style="width: 100%; border-radius: 8px"
            ></video>
            <div v-else class="no-video">
              <el-icon :size="60" color="#ccc">
                <VideoPlay />
              </el-icon>
              <p>暂无视频</p>
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
                总时长：{{ formatSeconds(courseInfo.duration) }}
              </span>
              <span class="meta-item">
                <el-icon><List /></el-icon>
                分段数：{{ courseInfo.segments?.length || 0 }}
              </span>
            </div>
          </div>
        </el-col>
        
        <el-col :xs="24" :md="8">
          <!-- 分段列表 -->
          <el-card class="segment-card">
            <template #header>
              <div class="card-header">
                <span>课程分段</span>
              </div>
            </template>
            
            <div class="segment-list">
              <div
                v-for="(segment, index) in courseInfo.segments"
                :key="segment.id"
                class="segment-item"
              >
                <div class="segment-header">
                  <span class="segment-title">分段 {{ index + 1 }}</span>
                  <el-tag size="small" type="info">
                    {{ formatSeconds(segment.endTime - segment.startTime) }}
                  </el-tag>
                </div>
                
                <div class="segment-time">
                  {{ formatSeconds(segment.startTime) }} - {{ formatSeconds(segment.endTime) }}
                </div>
                
                <div class="segment-params">
                  <span v-if="segment.speed !== undefined">
                    速度: {{ segment.speed }} km/h
                  </span>
                  <span v-if="segment.incline !== undefined">
                    坡度: {{ segment.incline }}%
                  </span>
                  <span v-if="segment.resistance !== undefined">
                    阻力: {{ segment.resistance }} 级
                  </span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCourseDetail } from '@/api/course'
import { formatSeconds, getCourseTypeName } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const loading = ref(false)

const courseInfo = reactive({
  title: '',
  type: '',
  videoUrl: '',
  thumbnailUrl: '',
  duration: 0,
  segments: []
})

// 获取课程类型标签颜色
const getCourseTypeTag = (type) => {
  const map = {
    'Treadmill': 'success',
    'Cycling': 'warning',
    'Rowing': 'info'
  }
  return map[type] || ''
}

// 获取课程详情
const fetchCourseDetail = async () => {
  loading.value = true
  try {
    // const res = await getCourseDetail(route.params.id)
    // Object.assign(courseInfo, res)
    
    // 模拟数据
    Object.assign(courseInfo, {
      id: route.params.id,
      title: '模拟课程 - 入门基础训练',
      type: 'Treadmill',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://picsum.photos/400/240?random=1',
      duration: 1200,
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
    })
  } catch (error) {
    ElMessage.error('获取课程详情失败')
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
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

.segment-card {
  height: 100%;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
}

.segment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.segment-item {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.segment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.segment-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.segment-time {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.segment-params {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #409eff;
}

@media screen and (max-width: 768px) {
  .course-info h2 {
    font-size: 20px;
  }
}
</style>

<template>
  <div class="segment-editor">
    <div class="segment-header">
      <h3>课程分段设置</h3>
      <el-button type="primary" @click="handleAddSegment">
        <el-icon><Plus /></el-icon>
        添加分段
      </el-button>
    </div>
    
    <div v-if="segments.length === 0" class="empty-state">
      <el-empty description="暂无分段，请添加" />
    </div>
    
    <div v-else class="segment-list">
      <el-card
        v-for="(segment, index) in segments"
        :key="segment.id"
        class="segment-item"
        shadow="hover"
      >
        <div class="segment-item-header">
          <span class="segment-title">分段 {{ index + 1 }}</span>
          <el-button
            type="danger"
            size="small"
            link
            @click="handleRemoveSegment(index)"
          >
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </div>
        
        <el-form label-width="100px" label-position="left">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="开始时间(秒)">
                <el-input-number
                  v-model="segment.startTime"
                  :min="0"
                  :max="segment.endTime - 1"
                  style="width: 100%"
                  @change="validateSegment(index)"
                />
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12">
              <el-form-item label="结束时间(秒)">
                <el-input-number
                  v-model="segment.endTime"
                  :min="segment.startTime + 1"
                  style="width: 100%"
                  @change="validateSegment(index)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-divider />
          
          <el-row :gutter="20">
            <el-col :xs="24" :sm="8" v-if="showSpeed">
              <el-form-item label="速度(km/h)">
                <el-input-number
                  v-model="segment.speed"
                  :min="0"
                  :max="30"
                  :precision="1"
                  :step="0.5"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="8" v-if="showIncline">
              <el-form-item label="坡度(%)">
                <el-input-number
                  v-model="segment.incline"
                  :min="0"
                  :max="15"
                  :precision="1"
                  :step="0.5"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="8" v-if="showResistance">
              <el-form-item label="阻力(级)">
                <el-input-number
                  v-model="segment.resistance"
                  :min="1"
                  :max="20"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <div class="segment-info">
            <el-tag type="info" size="small">
              时长：{{ formatSeconds(segment.endTime - segment.startTime) }}
            </el-tag>
          </div>
        </el-form>
      </el-card>
    </div>
    
    <div v-if="segments.length > 0" class="segment-summary">
      <el-alert
        :title="`总计 ${segments.length} 个分段，总时长 ${totalDuration}`"
        type="info"
        :closable="false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { formatSeconds } from '@/utils/format'
import { validateSegment as validateSegmentUtil, validateTimeSegments } from '@/utils/validate'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  courseType: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const segments = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 根据课程类型显示不同参数
const showSpeed = computed(() => ['Treadmill', 'Cycling'].includes(props.courseType))
const showIncline = computed(() => props.courseType === 'Treadmill')
const showResistance = computed(() => ['Cycling', 'Rowing'].includes(props.courseType))

// 总时长
const totalDuration = computed(() => {
  if (segments.value.length === 0) return '0分0秒'
  const maxEndTime = Math.max(...segments.value.map(s => s.endTime || 0))
  return formatSeconds(maxEndTime)
})

// 添加分段
const handleAddSegment = () => {
  const lastSegment = segments.value[segments.value.length - 1]
  const startTime = lastSegment ? lastSegment.endTime : 0
  
  const newSegment = {
    id: `segment-${Date.now()}`,
    startTime,
    endTime: startTime + 300, // 默认5分钟
    speed: props.courseType === 'Treadmill' || props.courseType === 'Cycling' ? 5 : undefined,
    incline: props.courseType === 'Treadmill' ? 0 : undefined,
    resistance: props.courseType === 'Cycling' || props.courseType === 'Rowing' ? 5 : undefined
  }
  
  segments.value = [...segments.value, newSegment]
}

// 删除分段
const handleRemoveSegment = (index) => {
  segments.value = segments.value.filter((_, i) => i !== index)
}

// 验证单个分段
const validateSegment = (index) => {
  const segment = segments.value[index]
  const result = validateSegmentUtil(segment)
  
  if (result !== true) {
    ElMessage.warning(result)
    return false
  }
  
  return true
}

// 监听分段变化，验证时间段不重叠
watch(
  () => segments.value,
  (newSegments) => {
    if (newSegments.length > 1) {
      if (!validateTimeSegments(newSegments)) {
        ElMessage.warning('时间段不能重叠')
      }
    }
  },
  { deep: true }
)
</script>

<style scoped>
.segment-editor {
  width: 100%;
}

.segment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.segment-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.empty-state {
  padding: 40px 0;
}

.segment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.segment-item {
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.segment-item:hover {
  border-color: #409eff;
}

.segment-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.segment-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.segment-info {
  margin-top: 10px;
}

.segment-summary {
  margin-top: 20px;
}
</style>

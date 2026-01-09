<template>
  <div class="avatar-upload">
    <div class="avatar-container">
      <el-avatar 
        :size="size" 
        :icon="UserFilled" 
        :src="avatarUrl"
        class="avatar"
      />
      <el-upload
        class="upload-trigger"
        :action="uploadAction"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        accept="image/*"
        :disabled="uploading"
      >
        <div class="avatar-overlay">
          <el-icon v-if="!uploading" class="camera-icon">
            <Camera />
          </el-icon>
          <el-icon v-else class="camera-icon is-loading">
            <Loading />
          </el-icon>
          <span>{{ uploading ? '上传中...' : '上传头像' }}</span>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, Camera, Loading } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 100
  },
  maxSize: {
    type: Number,
    default: 2 // MB
  }
})

const emit = defineEmits(['update:modelValue', 'success', 'error'])

const uploading = ref(false)
const uploadAction = import.meta.env.VITE_API_BASE_URL + '/media/upload/image'

const avatarUrl = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLtMaxSize) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB`)
    return false
  }
  
  uploading.value = true
  return true
}

const handleSuccess = (response, file) => {
  uploading.value = false
  
  try {
    // 根据实际后端返回格式调整
    const url = response.data?.url || response.url
    
    // 如果没有真实的后端，使用模拟数据
    if (!url && file.raw) {
      avatarUrl.value = URL.createObjectURL(file.raw)
    } else {
      avatarUrl.value = url
    }
    
    ElMessage.success('头像上传成功')
    emit('success', avatarUrl.value)
  } catch (error) {
    console.error('处理头像失败:', error)
    ElMessage.error('处理头像失败')
    emit('error', error)
  }
}

const handleError = (error) => {
  uploading.value = false
  ElMessage.error('头像上传失败，请重试')
  emit('error', error)
}
</script>

<style scoped>
.avatar-upload {
  display: inline-block;
}

.avatar-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  display: block;
}

.upload-trigger {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  font-size: 12px;
  gap: 4px;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.camera-icon {
  font-size: 24px;
}

.camera-icon.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.el-upload) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

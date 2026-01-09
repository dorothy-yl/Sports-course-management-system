<template>
  <div class="video-upload">
    <el-upload
      :action="uploadAction"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      accept="video/*"
      :disabled="uploading"
    >
      <div v-if="videoUrl && !uploading" class="video-preview">
        <video :src="videoUrl" controls style="width: 100%; height: 100%"></video>
        <div class="video-overlay">
          <el-icon class="overlay-icon" @click.stop="handleRemove">
            <Delete />
          </el-icon>
        </div>
      </div>
      
      <div v-else class="upload-placeholder">
        <el-icon v-if="!uploading" class="upload-icon">
          <VideoPlay />
        </el-icon>
        <div v-else class="upload-progress">
          <el-progress
            type="circle"
            :percentage="uploadProgress"
            :width="80"
          />
          <div class="progress-text">上传中...</div>
        </div>
        <template v-if="!uploading">
          <div class="upload-text">点击上传视频</div>
          <div class="upload-hint">支持 MP4、AVI、MOV 等格式，大小不超过 500MB</div>
        </template>
      </div>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadVideo } from '@/api/media'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const uploading = ref(false)
const uploadProgress = ref(0)
const uploadAction = import.meta.env.VITE_API_BASE_URL + '/media/upload/video'

const videoUrl = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const beforeUpload = (file) => {
  const isVideo = file.type.startsWith('video/')
  const isLt500M = file.size / 1024 / 1024 < 500

  if (!isVideo) {
    ElMessage.error('只能上传视频文件')
    return false
  }
  if (!isLt500M) {
    ElMessage.error('视频大小不能超过 500MB')
    return false
  }
  
  uploading.value = true
  uploadProgress.value = 0
  return true
}

const handleProgress = (event) => {
  uploadProgress.value = Math.round(event.percent)
}

const handleSuccess = (response) => {
  uploading.value = false
  uploadProgress.value = 0
  
  // 根据实际后端返回格式调整
  // videoUrl.value = response.data?.url || response.url
  
  // 模拟上传成功
  videoUrl.value = 'https://www.w3schools.com/html/mov_bbb.mp4'
  ElMessage.success('上传成功')
}

const handleError = () => {
  uploading.value = false
  uploadProgress.value = 0
  ElMessage.error('上传失败，请重试')
}

const handleRemove = () => {
  videoUrl.value = ''
}
</script>

<style scoped>
.video-upload {
  width: 400px;
  height: 240px;
}

:deep(.el-upload) {
  width: 100%;
  height: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

:deep(.el-upload:hover) {
  border-color: #409eff;
}

.video-preview {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.video-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.overlay-icon {
  font-size: 24px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.overlay-icon:hover {
  background-color: rgba(255, 0, 0, 0.8);
  transform: scale(1.1);
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c939d;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #409eff;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.progress-text {
  font-size: 14px;
  color: #606266;
}

.upload-text {
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 500;
}

.upload-hint {
  font-size: 12px;
  color: #a8abb2;
  text-align: center;
  padding: 0 20px;
}

@media screen and (max-width: 768px) {
  .video-upload {
    width: 100%;
    height: 200px;
  }
}
</style>

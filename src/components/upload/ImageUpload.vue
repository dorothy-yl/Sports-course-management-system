<template>
  <div class="image-upload">
    <el-upload
      :action="uploadAction"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      accept="image/*"
      :disabled="uploading"
    >
      <div v-if="imageUrl" class="image-preview">
        <el-image
          :src="imageUrl"
          fit="cover"
          style="width: 100%; height: 100%"
          :preview-src-list="[imageUrl]"
        />
        <div class="image-overlay">
          <el-icon class="overlay-icon" @click.stop="handleRemove">
            <Delete />
          </el-icon>
          <el-icon class="overlay-icon">
            <ZoomIn />
          </el-icon>
        </div>
      </div>
      
      <div v-else class="upload-placeholder">
        <el-icon v-if="!uploading" class="upload-icon">
          <Plus />
        </el-icon>
        <el-icon v-else class="upload-icon is-loading">
          <Loading />
        </el-icon>
        <div class="upload-text">{{ uploading ? '上传中...' : '点击上传' }}</div>
        <div class="upload-hint">支持 JPG、PNG、GIF 格式，大小不超过 5MB</div>
      </div>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadImage } from '@/api/media'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'course_cover'
  }
})

const emit = defineEmits(['update:modelValue'])

const uploading = ref(false)
const uploadAction = import.meta.env.VITE_API_BASE_URL + '/media/upload/image'

const imageUrl = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  
  uploading.value = true
  return true
}

const handleSuccess = (response) => {
  uploading.value = false
  
  // 根据实际后端返回格式调整
  // imageUrl.value = response.data?.url || response.url
  
  // 模拟上传成功
  imageUrl.value = URL.createObjectURL(new Blob())
  ElMessage.success('上传成功')
}

const handleError = () => {
  uploading.value = false
  ElMessage.error('上传失败，请重试')
}

const handleRemove = () => {
  imageUrl.value = ''
}
</script>

<style scoped>
.image-upload {
  width: 200px;
  height: 120px;
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

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.overlay-icon {
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.overlay-icon:hover {
  transform: scale(1.2);
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
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-icon.is-loading {
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

.upload-text {
  font-size: 14px;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #a8abb2;
  text-align: center;
  padding: 0 10px;
}
</style>

<template>
  <div class="media-library-container">
    <el-card class="page-card">
      <!-- 操作栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-select
            v-model="filterCategory"
            placeholder="选择分类"
            style="width: 150px"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="item in IMAGE_CATEGORIES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
        
        <div class="toolbar-right">
          <el-upload
            :action="uploadAction"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            accept="image/*"
            multiple
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              上传图片
            </el-button>
          </el-upload>
        </div>
      </div>
    </el-card>
    
    <!-- 图片列表 -->
    <el-card class="page-card">
      <el-empty v-if="imageList.length === 0" description="暂无图片" />
      
      <div v-else class="image-grid" v-loading="loading">
        <div
          v-for="image in imageList"
          :key="image.id"
          class="image-item"
        >
          <div class="image-wrapper">
            <el-image
              :src="image.url"
              fit="cover"
              class="image"
              :preview-src-list="imageList.map(img => img.url)"
              :initial-index="imageList.findIndex(img => img.id === image.id)"
            />
            
            <div class="image-overlay">
              <div class="image-actions">
                <el-button
                  type="primary"
                  circle
                  @click="handleCopyUrl(image)"
                >
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
                
                <el-button
                  type="danger"
                  circle
                  @click="handleDelete(image)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
          
          <div class="image-info">
            <div class="image-category">
              <el-tag size="small" type="info">
                {{ getCategoryName(image.category) }}
              </el-tag>
            </div>
            <div class="image-time">
              {{ formatDate(image.createdAt, 'YYYY-MM-DD') }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div v-if="imageList.length > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[12, 24, 48, 96]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getImageList, uploadImage, deleteImage } from '@/api/media'
import { formatDate } from '@/utils/format'
import { IMAGE_CATEGORIES } from '@/constants'
import { useClipboard } from '@vueuse/core'

const loading = ref(false)
const imageList = ref([])
const filterCategory = ref('')
const uploadAction = import.meta.env.VITE_API_BASE_URL + '/uploadCourse'

const pagination = reactive({
  page: 1,
  pageSize: 12,
  total: 0
})

// 获取分类名称
const getCategoryName = (category) => {
  const item = IMAGE_CATEGORIES.find(c => c.value === category)
  return item?.label || category
}

// 获取图片列表
const fetchImageList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      category: filterCategory.value
    }
    
    // 模拟数据（实际应调用 API）
    // const res = await getImageList(params)
    // imageList.value = res.list
    // pagination.total = res.total
    
    // 模拟数据
    const mockData = generateMockImages()
    imageList.value = mockData.slice(
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize
    )
    pagination.total = mockData.length
  } catch (error) {
    ElMessage.error('获取图片列表失败')
  } finally {
    loading.value = false
  }
}

// 生成模拟图片数据
const generateMockImages = () => {
  const images = []
  const categories = ['course_cover', 'banner', 'other']
  
  for (let i = 1; i <= 36; i++) {
    images.push({
      id: `image-${i}`,
      url: `https://picsum.photos/300/200?random=${i}`,
      category: categories[i % 3],
      createdAt: new Date(Date.now() - i * 86400000).toISOString()
    })
  }
  
  return images
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchImageList()
}

// 上传前验证
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
  
  return true
}

// 上传成功
const handleUploadSuccess = () => {
  ElMessage.success('上传成功')
  fetchImageList()
}

// 复制图片 URL
const handleCopyUrl = async (image) => {
  try {
    // 使用 Clipboard API
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(image.url)
      ElMessage.success('图片链接已复制到剪贴板')
    } else {
      // 降级方案
      const textarea = document.createElement('textarea')
      textarea.value = image.url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      ElMessage.success('图片链接已复制到剪贴板')
    }
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 删除图片
const handleDelete = (image) => {
  ElMessageBox.confirm(
    '确定要删除这张图片吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // await deleteImage(image.id)
      ElMessage.success('删除成功')
      fetchImageList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

onMounted(() => {
  fetchImageList()
})
</script>

<style scoped>
.media-library-container {
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.toolbar-left {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  gap: 10px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.image-item {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.image-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f5f7fa;
}

.image {
  width: 100%;
  height: 100%;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
}

.image-actions {
  display: flex;
  gap: 12px;
}

.image-info {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-time {
  font-size: 12px;
  color: #909399;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .toolbar-left,
  .toolbar-right {
    width: 100%;
  }
  
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}
</style>

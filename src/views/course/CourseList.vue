<template>
  <div class="course-list-container">
    <el-card class="page-card">
      <!-- 搜索和操作栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-select
            v-model="filterDeviceType"
            placeholder="设备类型"
            style="width: 200px"
            clearable
            @change="handleSearch"
          >
            <template #prefix>
              <el-icon><Paperclip /></el-icon>
            </template>
            <el-option label="跑步机" :value="0" />
            <el-option label="脚踏车" :value="1" />
            <el-option label="划船机" :value="2" />
          </el-select>
          
          <el-select
            v-model="filterType"
            placeholder="课程类型"
            style="width: 200px"
            clearable
            @change="handleSearch"
          >
          <template #prefix>
            <el-icon><Reading /></el-icon>
            </template>
            <el-option
              v-for="item in COURSE_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

           <el-select
            v-model="filterLangCode"
            placeholder="语言编码"
            style="width: 150px"
            clearable
            @change="handleSearch"
          >
           <template #prefix>
            <el-icon><Service /></el-icon>
             </template>
             <el-option label="中文" :value="0" />
             <el-option label="英文" :value="1" />
          </el-select>
        
        </div>
        
        <div class="toolbar-right">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新建课程
          </el-button>
        </div>
      </div>
    </el-card>
    
    <!-- 课程列表 -->
    <el-card class="page-card">
      <el-table
        v-loading="loading"
        :data="courseList"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="80"  align="center"/>
        
        <el-table-column label="缩略图" width="200" align="center" >
          <template #default="{ row }">
            <el-image
              v-if="row.thumbnailUrl"
              :src="row.thumbnailUrl"
              fit="cover"
              style="width: 80px; height: 50px; border-radius: 4px"
              :preview-src-list="[row.thumbnailUrl]"
            />
            <span v-else class="no-image">无图片</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="title" label="课程标题" min-width="180" align="center" show-overflow-tooltip />
        
        <el-table-column label="课程类型" width="150" align="center">
          <template #default="{ row }">
            <el-tag :type="getCourseTypeTag(row.type)">
              {{ getCourseTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="总时长" width="150">
          <template #default="{ row }">
            {{ formatSeconds(row.duration) }}
          </template>
        </el-table-column>
        
        <el-table-column label="分段数" width="100" align="center">
          <template #default="{ row }">
            {{ row.segments?.length || 0 }}
          </template>
        </el-table-column>
        
        <el-table-column label="创建时间" width="200" align="center">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button type="primary" size="small" link @click="handlePreview(row)">
                查看
              </el-button>
              <el-button type="primary" size="small" link @click="handleEdit(row)">
                修改
              </el-button>
              <el-button type="danger" size="small" link @click="handleDelete(row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCourseList, deleteCourse } from '@/api/course'
import { formatDate, formatSeconds, getCourseTypeName } from '@/utils/format'
import { COURSE_TYPE_OPTIONS } from '@/constants'

const router = useRouter()

const loading = ref(false)
const courseList = ref([])
const searchKeyword = ref('')
const filterType = ref('')
const filterDeviceType = ref('')
const filterLangCode = ref('')

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 获取课程类型标签颜色
const getCourseTypeTag = (type) => {
  const map = {
    0: 'success',   // 跑步机
    1: 'warning',   // 脚踏车
    2: 'info',      // 划船机
    3: 'danger',    // 力量训练
    4: '',          // HIIT训练
    5: 'success',   // 瑜伽
    6: 'info',      // 冥想
    7: ''           // 其他
  }
  return map[type] || ''
}

// 获取课程列表
const fetchCourseList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      deviceType: filterDeviceType.value,
      langCode: filterLangCode.value,
      type: filterType.value
    }
    
    const res = await getCourseList(params)
    
    // 适配后端返回的数据结构
    if (res && res.rows) {
      // 映射后端字段到前端字段
      courseList.value = res.rows.map(item => ({
        id: item.proCourseId,
        title: item.courseName,
        type: item.courseType,
        videoUrl: item.videoUrl1,
        thumbnailUrl: item.coverImage,
        coverVideo: item.coverVideo,
        duration: item.duration,
        segments: [], // 后端可能没有返回 segments，需要单独获取
        createdAt: item.createTime,
        updatedAt: item.createTime,
        // 保留其他可能用到的字段
        courseAdvice: item.courseAdvice,
        taboGroups: item.taboGroups,
        userGroup: item.userGroup,
        caloriesValue: item.caloriesValue,
        introduction: item.introduction
      }))
      pagination.total = res.total
    } else {
      courseList.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
    courseList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchCourseList()
}

// 新建课程
const handleCreate = () => {
  router.push('/courses/create')
}

// 预览课程
const handlePreview = (course) => {
  router.push(`/courses/preview/${course.id}`)
}

// 编辑课程
const handleEdit = (course) => {
  router.push(`/courses/edit/${course.id}`)
}

// 删除课程
const handleDelete = (course) => {
  ElMessageBox.confirm(
    `确定要删除课程"${course.title}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // await deleteCourse(course.id)
      ElMessage.success('删除成功')
      fetchCourseList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

onMounted(() => {
  fetchCourseList()
})
</script>

<style scoped>
.course-list-container {
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

.no-image {
  color: #999;
  font-size: 12px;
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
  
  .toolbar-left {
    flex-direction: column;
  }
}
</style>

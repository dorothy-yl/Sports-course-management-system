<template>
  <div class="course-list-container">
    <el-card class="page-card">
      <!-- 搜索和操作栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索课程标题"
            style="width: 250px"
            clearable
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="filterType"
            placeholder="课程类型"
            style="width: 150px"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="item in COURSE_TYPE_OPTIONS"
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
        <el-table-column type="index" label="序号" width="60" />
        
        <el-table-column label="缩略图" width="120">
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
        
        <el-table-column prop="title" label="课程标题" min-width="200" show-overflow-tooltip />
        
        <el-table-column label="课程类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getCourseTypeTag(row.type)">
              {{ getCourseTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="总时长" width="100">
          <template #default="{ row }">
            {{ formatSeconds(row.duration) }}
          </template>
        </el-table-column>
        
        <el-table-column label="分段数" width="100">
          <template #default="{ row }">
            {{ row.segments?.length || 0 }}
          </template>
        </el-table-column>
        
        <el-table-column label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button type="primary" size="small" link @click="handlePreview(row)">
                预览
              </el-button>
              <el-button type="primary" size="small" link @click="handleEdit(row)">
                编辑
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

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
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

// 获取课程列表
const fetchCourseList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value,
      type: filterType.value
    }
    
    // 模拟数据（实际应调用 API）
    // const res = await getCourseList(params)
    // courseList.value = res.list
    // pagination.total = res.total
    
    // 模拟数据
    const mockData = generateMockCourses()
    courseList.value = mockData.slice(
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize
    )
    pagination.total = mockData.length
  } catch (error) {
    ElMessage.error('获取课程列表失败')
  } finally {
    loading.value = false
  }
}

// 生成模拟课程数据
const generateMockCourses = () => {
  const types = ['Treadmill', 'Cycling', 'Rowing']
  const courses = []
  
  for (let i = 1; i <= 25; i++) {
    courses.push({
      id: `course-${i}`,
      title: `课程 ${i} - ${['入门基础', '进阶训练', '高级挑战', '专业特训'][i % 4]}`,
      type: types[i % 3],
      videoUrl: `https://example.com/video/${i}.mp4`,
      thumbnailUrl: `https://picsum.photos/200/120?random=${i}`,
      duration: 1800 + i * 60,
      segments: [
        { id: `seg-${i}-1`, startTime: 0, endTime: 600, speed: 5, incline: 0 },
        { id: `seg-${i}-2`, startTime: 600, endTime: 1200, speed: 8, incline: 2 }
      ],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return courses
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

<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #ecf5ff">
              <el-icon :size="32" color="#409eff">
                <User />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff0e6">
              <el-icon :size="32" color="#fa8c16">
                <Location />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.domesticUsers }}</div>
              <div class="stat-label">国内用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f0f9ff">
              <el-icon :size="32" color="#13c2c2">
                <VideoPlay />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalCourses }}</div>
              <div class="stat-label">课程总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f6ffed">
              <el-icon :size="32" color="#52c41a">
                <TrendCharts />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.todayViews }}</div>
              <div class="stat-label">今日观看数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>课程类型分布</span>
            </div>
          </template>
          <div ref="courseTypePieRef" class="chart" style="height: 300px"></div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>课程热度排行 TOP 10</span>
            </div>
          </template>
          <div ref="courseHotBarRef" class="chart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="charts-row">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势（近30天）</span>
            </div>
          </template>
          <div ref="userGrowthLineRef" class="chart" style="height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getUserStats } from '@/api/user'
import { getCourseStats, getCourseHotRanking } from '@/api/course'
import dayjs from 'dayjs'

const courseTypePieRef = ref(null)
const courseHotBarRef = ref(null)
const userGrowthLineRef = ref(null)

let courseTypePieChart = null
let courseHotBarChart = null
let userGrowthLineChart = null

const stats = reactive({
  totalUsers: 0,
  domesticUsers: 0,
  totalCourses: 0,
  todayViews: 0
})

// 获取统计数据
const fetchStats = async () => {
  try {
    // const [userStatsRes, courseStatsRes] = await Promise.all([
    //   getUserStats(),
    //   getCourseStats()
    // ])
    
    // 模拟数据
    stats.totalUsers = 12580
    stats.domesticUsers = 8923
    stats.totalCourses = 468
    stats.todayViews = 8923
  } catch (error) {
    console.error('获取统计数据失败', error)
  }
}

// 初始化课程类型分布饼图
const initCourseTypePie = () => {
  if (!courseTypePieRef.value) return
  
  courseTypePieChart = echarts.init(courseTypePieRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        name: '课程类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 185, name: '跑步机课程', itemStyle: { color: '#5470c6' } },
          { value: 156, name: '脚踏车课程', itemStyle: { color: '#91cc75' } },
          { value: 127, name: '划船机课程', itemStyle: { color: '#fac858' } }
        ]
      }
    ]
  }
  
  courseTypePieChart.setOption(option)
}

// 初始化课程热度排行柱状图
const initCourseHotBar = () => {
  if (!courseHotBarRef.value) return
  
  courseHotBarChart = echarts.init(courseHotBarRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: [
        '课程10', '课程9', '课程8', '课程7', '课程6',
        '课程5', '课程4', '课程3', '课程2', '课程1'
      ]
    },
    series: [
      {
        name: '观看次数',
        type: 'bar',
        data: [1520, 1680, 1890, 2100, 2350, 2580, 2890, 3200, 3580, 4200],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        }
      }
    ]
  }
  
  courseHotBarChart.setOption(option)
}

// 初始化用户增长趋势折线图
const initUserGrowthLine = () => {
  if (!userGrowthLineRef.value) return
  
  userGrowthLineChart = echarts.init(userGrowthLineRef.value)
  
  // 生成近30天的日期
  const dates = []
  const newUsers = []
  const totalUsers = []
  
  for (let i = 29; i >= 0; i--) {
    dates.push(dayjs().subtract(i, 'day').format('MM-DD'))
    newUsers.push(Math.floor(Math.random() * 100) + 50)
    totalUsers.push(12000 + (29 - i) * 20)
  }
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增用户', '累计用户']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: [
      {
        type: 'value',
        name: '新增用户',
        position: 'left'
      },
      {
        type: 'value',
        name: '累计用户',
        position: 'right'
      }
    ],
    series: [
      {
        name: '新增用户',
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        data: newUsers,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(58, 77, 233, 0.3)' },
            { offset: 1, color: 'rgba(58, 77, 233, 0.05)' }
          ])
        },
        itemStyle: {
          color: '#3a4de9'
        }
      },
      {
        name: '累计用户',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: totalUsers,
        itemStyle: {
          color: '#00c292'
        }
      }
    ]
  }
  
  userGrowthLineChart.setOption(option)
}

// 响应式处理
const handleResize = () => {
  courseTypePieChart?.resize()
  courseHotBarChart?.resize()
  userGrowthLineChart?.resize()
}

onMounted(async () => {
  await fetchStats()
  await nextTick()
  
  initCourseTypePie()
  initCourseHotBar()
  initUserGrowthLine()
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  courseTypePieChart?.dispose()
  courseHotBarChart?.dispose()
  userGrowthLineChart?.dispose()
})
</script>

<style scoped>
.dashboard-container {
  padding-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 100%;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.chart {
  width: 100%;
}

@media screen and (max-width: 768px) {
  .stat-content {
    gap: 12px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-icon .el-icon {
    font-size: 24px !important;
  }
  
  .stat-value {
    font-size: 22px;
  }
  
  .stat-label {
    font-size: 12px;
  }
}
</style>

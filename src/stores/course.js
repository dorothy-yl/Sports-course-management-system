import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCourseStore = defineStore('course', () => {
  // 课程列表
  const courseList = ref([])
  
  // 当前编辑的课程
  const currentCourse = ref(null)
  
  // 加载状态
  const loading = ref(false)
  
  // 设置课程列表
  const setCourseList = (list) => {
    courseList.value = list
  }
  
  // 设置当前课程
  const setCurrentCourse = (course) => {
    currentCourse.value = course
  }
  
  // 添加课程
  const addCourse = (course) => {
    courseList.value.unshift(course)
  }
  
  // 更新课程
  const updateCourse = (id, updatedCourse) => {
    const index = courseList.value.findIndex(c => c.id === id)
    if (index !== -1) {
      courseList.value[index] = { ...courseList.value[index], ...updatedCourse }
    }
  }
  
  // 删除课程
  const removeCourse = (id) => {
    const index = courseList.value.findIndex(c => c.id === id)
    if (index !== -1) {
      courseList.value.splice(index, 1)
    }
  }
  
  // 清空当前课程
  const clearCurrentCourse = () => {
    currentCourse.value = null
  }
  
  // 设置加载状态
  const setLoading = (status) => {
    loading.value = status
  }
  
  return {
    courseList,
    currentCourse,
    loading,
    setCourseList,
    setCurrentCourse,
    addCourse,
    updateCourse,
    removeCourse,
    clearCurrentCourse,
    setLoading
  }
})

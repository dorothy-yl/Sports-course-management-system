<template>
  <div class="course-form">
    <el-form
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="课程标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入课程标题"
        />
      </el-form-item>
      
      <el-form-item label="课程类型" prop="type">
        <el-select
          v-model="formData.type"
          placeholder="请选择课程类型"
          style="width: 100%"
        >
          <el-option
            v-for="item in COURSE_TYPE_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="视频URL" prop="videoUrl">
        <el-input
          v-model="formData.videoUrl"
          placeholder="请输入视频URL"
        />
      </el-form-item>
      
      <el-form-item label="缩略图URL" prop="thumbnailUrl">
        <el-input
          v-model="formData.thumbnailUrl"
          placeholder="请输入缩略图URL"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { COURSE_TYPE_OPTIONS } from '@/constants'
import { required } from '@/utils/validate'

const formData = reactive({
  title: '',
  type: '',
  videoUrl: '',
  thumbnailUrl: ''
})

const rules = {
  title: [required('请输入课程标题')],
  type: [required('请选择课程类型')],
  videoUrl: [required('请输入视频URL')],
  thumbnailUrl: [required('请输入缩略图URL')]
}
</script>

<style scoped>
.course-form {
  width: 100%;
}
</style>

<template>
  <div class="user-form">
    <el-form
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="formData.nickname"
          placeholder="请输入昵称"
        />
      </el-form-item>
      
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="formData.gender"
          placeholder="请选择性别"
          style="width: 100%"
        >
          <el-option
            v-for="item in GENDER_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="formData.birthday"
          type="date"
          placeholder="请选择生日"
          style="width: 100%"
        />
      </el-form-item>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="身高" prop="height">
            <el-input-number
              v-model="formData.height"
              :min="100"
              :max="250"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="体重" prop="weight">
            <el-input-number
              v-model="formData.weight"
              :min="30"
              :max="200"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="地区" prop="region">
        <el-select
          v-model="formData.region"
          placeholder="请选择地区"
          style="width: 100%"
        >
          <el-option
            v-for="item in REGION_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { GENDER_OPTIONS, REGION_OPTIONS } from '@/constants'
import { required } from '@/utils/validate'

const formData = reactive({
  nickname: '',
  gender: '',
  birthday: '',
  height: 170,
  weight: 60,
  region: ''
})

const rules = {
  nickname: [required('请输入昵称')],
  gender: [required('请选择性别')],
  birthday: [required('请选择生日')],
  height: [required('请输入身高')],
  weight: [required('请输入体重')],
  region: [required('请选择地区')]
}
</script>

<style scoped>
.user-form {
  width: 100%;
}
</style>

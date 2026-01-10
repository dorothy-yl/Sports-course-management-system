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
      
      <el-form-item label="地区类型" prop="addressType">
        <el-radio-group v-model="formData.addressType">
          <el-radio label="domestic">国内</el-radio>
          <el-radio label="international">国外</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <!-- 国内地址 -->
      <template v-if="formData.addressType === 'domestic'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="省" prop="province">
              <el-select
                v-model="formData.province"
                placeholder="请选择省份"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="item in CHINA_PROVINCES"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="市" prop="city">
              <el-input
                v-model="formData.city"
                placeholder="请输入城市"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="区/县" prop="district">
              <el-input
                v-model="formData.district"
                placeholder="请输入区/县"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="详细地址" prop="detail">
              <el-input
                v-model="formData.detail"
                placeholder="请输入详细地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      
      <!-- 国外地址 -->
      <template v-else>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="国家" prop="country">
              <el-select
                v-model="formData.country"
                placeholder="请选择国家"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="item in COUNTRIES"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="城市/州" prop="city">
              <el-input
                v-model="formData.city"
                placeholder="请输入城市或州"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { GENDER_OPTIONS, CHINA_PROVINCES, COUNTRIES } from '@/constants'
import { required } from '@/utils/validate'

const formData = reactive({
  nickname: '',
  gender: '',
  birthday: '',
  height: 170,
  weight: 60,
  addressType: 'domestic',
  // 国内地址字段
  province: '',
  city: '',
  district: '',
  detail: '',
  // 国外地址字段
  country: ''
})

const rules = {
  nickname: [required('请输入昵称')],
  gender: [required('请选择性别')],
  birthday: [required('请选择生日')],
  height: [required('请输入身高')],
  weight: [required('请输入体重')],
  addressType: [required('请选择地区类型')]
}
</script>

<style scoped>
.user-form {
  width: 100%;
}
</style>

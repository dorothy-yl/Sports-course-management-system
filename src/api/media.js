import request from './request'

// 上传图片
export const uploadImage = (file, category) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', category)
  
  return request({
    url: '/media/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 上传视频
export const uploadVideo = (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/media/upload/video',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percent)
      }
    }
  })
}

sports-management/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/              # 静态资源
│   │   ├── images/
│   │   └── styles/
│   │       └── global.css   # 全局样式
│   ├── components/          # 公共组件
│   │   ├── common/
│   │   │   ├── AppHeader.vue       # 顶部导航栏
│   │   │   ├── AppSidebar.vue      # 侧边栏菜单
│   │   │   └── BreadcrumbNav.vue   # 面包屑导航
│   │   ├── course/
│   │   │   ├── CourseForm.vue      # 课程基础信息表单
│   │   │   └── SegmentEditor.vue   # 分段视频编辑器
│   │   ├── user/
│   │   │   └── UserForm.vue        # 用户信息表单
│   │   └── upload/
│   │       ├── ImageUpload.vue     # 图片上传组件
│   │       └── VideoUpload.vue     # 视频上传组件
│   ├── layouts/
│   │   └── MainLayout.vue          # 主布局组件
│   ├── views/                      # 页面组件
│   │   ├── Dashboard.vue           # 数据概览
│   │   ├── user/
│   │   │   ├── UserList.vue        # 用户列表
│   │   │   └── UserDetail.vue      # 用户详情
│   │   ├── course/
│   │   │   ├── CourseList.vue      # 课程列表
│   │   │   ├── CourseEditor.vue    # 课程编辑器
│   │   │   └── CoursePreview.vue   # 课程预览
│   │   ├── media/
│   │   │   └── MediaLibrary.vue    # 图片素材库
│   │   ├── profile/
│   │   │   └── AdminProfile.vue    # 管理员个人中心
│   │   └── Login.vue               # 登录页
│   ├── router/
│   │   └── index.js                # 路由配置
│   ├── stores/                     # Pinia 状态管理
│   │   ├── user.js                 # 用户状态
│   │   ├── course.js               # 课程状态
│   │   └── app.js                  # 应用全局状态（侧边栏折叠等）
│   ├── api/                        # API 接口
│   │   ├── request.js              # Axios 封装
│   │   ├── user.js
│   │   ├── course.js
│   │   └── media.js
│   ├── utils/                      # 工具函数
│   │   ├── validate.js             # 表单验证
│   │   └── format.js               # 数据格式化
│   ├── constants/                  # 常量定义
│   │   └── index.js                # 课程类型、登录方式等枚举
│   ├── App.vue
│   └── main.js
├── .env.development                # 开发环境配置
├── .env.production                 # 生产环境配置
├── vite.config.js
├── package.json
└── README.md
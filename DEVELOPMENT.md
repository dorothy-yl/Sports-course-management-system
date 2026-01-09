# 开发指南

## 项目概述

这是一个基于 Vue 3 + Vite + Element Plus 构建的视频课程后台管理系统，支持用户管理、课程管理（含分段视频编辑）、图片素材库等功能。

## 技术栈

- **前端框架**: Vue 3.4+ (Composition API)
- **构建工具**: Vite 5.0+
- **UI 组件库**: Element Plus 2.5+
- **状态管理**: Pinia 2.1+
- **路由管理**: Vue Router 4.2+
- **HTTP 客户端**: Axios 1.6+
- **图表库**: ECharts 5.4+
- **日期处理**: Day.js 1.11+

## 项目结构

```
src/
├── api/                    # API 接口封装
│   ├── request.js         # Axios 请求封装
│   ├── user.js            # 用户相关 API
│   ├── course.js          # 课程相关 API
│   └── media.js           # 媒体相关 API
├── assets/                # 静态资源
│   └── styles/
│       └── global.css     # 全局样式
├── components/            # 公共组件
│   ├── common/           # 通用组件
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── BreadcrumbNav.vue
│   ├── course/           # 课程相关组件
│   │   ├── CourseForm.vue
│   │   └── SegmentEditor.vue
│   ├── user/             # 用户相关组件
│   │   └── UserForm.vue
│   └── upload/           # 上传组件
│       ├── ImageUpload.vue
│       └── VideoUpload.vue
├── constants/            # 常量定义
│   └── index.js
├── layouts/              # 布局组件
│   └── MainLayout.vue
├── router/               # 路由配置
│   └── index.js
├── stores/               # Pinia 状态管理
│   ├── app.js
│   ├── user.js
│   └── course.js
├── utils/                # 工具函数
│   ├── validate.js
│   └── format.js
├── views/                # 页面组件
│   ├── Dashboard.vue
│   ├── Login.vue
│   ├── course/
│   │   ├── CourseList.vue
│   │   ├── CourseEditor.vue
│   │   └── CoursePreview.vue
│   ├── user/
│   │   ├── UserList.vue
│   │   ├── UserDetail.vue
│   │   └── UserDialog.vue
│   ├── media/
│   │   └── MediaLibrary.vue
│   └── profile/
│       └── AdminProfile.vue
├── App.vue
└── main.js
```

## 核心功能

### 1. 用户管理
- 用户列表展示（分页、搜索、筛选）
- 用户详情查看
- 用户信息编辑
- VIP 状态快速切换
- 支持国内/国外不同登录方式

### 2. 课程管理
- 课程列表展示
- 课程创建/编辑
- 分段视频编辑器
  - 动态添加/删除分段
  - 每个分段独立的运动参数（速度、坡度、阻力）
  - 时间段重叠验证
- 课程预览
- 支持三种课程类型：跑步机、脚踏车、划船机

### 3. 图片素材库
- 图片网格展示
- 图片上传（支持多张）
- 图片预览
- 图片链接复制
- 图片删除
- 分类管理

### 4. Dashboard
- 统计卡片（总用户数、VIP 用户数、课程总数、今日观看数）
- ECharts 图表
  - 课程类型分布（饼图）
  - 课程热度排行（柱状图）
  - 用户增长趋势（折线图）

### 5. 个人中心
- 管理员信息展示
- 个人信息编辑
- 密码修改

## 响应式设计

- 使用 Element Plus 的响应式栅格系统
- 断点设置：
  - xs: < 768px (手机)
  - sm: ≥ 768px (平板)
  - md: ≥ 992px (桌面)
  - lg: ≥ 1200px (大屏)
- 侧边栏自动折叠（< 768px）
- 表格和表单自适应布局

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

项目将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## API 集成

当前项目使用模拟数据，要集成真实后端 API：

1. 修改 `.env.development` 和 `.env.production` 中的 `VITE_API_BASE_URL`
2. 在 `src/api/` 目录下的文件中取消注释实际 API 调用
3. 根据后端返回格式调整 `src/api/request.js` 中的响应拦截器

## 状态管理

使用 Pinia 管理全局状态：

- **app store**: 应用状态（侧边栏折叠、移动端检测）
- **user store**: 用户信息和认证状态
- **course store**: 课程数据缓存

## 路由守卫

在 `src/router/index.js` 中实现了简单的登录验证：
- 未登录用户访问非登录页时跳转到登录页
- 已登录用户访问登录页时跳转到首页

## 登录测试

测试账号：
- 用户名：admin
- 密码：任意密码

## 最佳实践

1. **组件化开发**: 将复用的 UI 部分抽离为组件
2. **API 封装**: 统一的 API 调用接口，便于维护
3. **常量管理**: 枚举值统一在 constants 目录定义
4. **工具函数**: 格式化、验证等通用逻辑抽离到 utils
5. **响应式设计**: 使用 Element Plus 的栅格系统和媒体查询
6. **类型安全**: 虽然是 JavaScript 项目，但在注释中说明了数据结构

## 注意事项

1. 图片和视频上传功能需要配置实际的上传服务器
2. ECharts 图表数据当前为模拟数据，需接入真实统计接口
3. 路由守卫的认证逻辑较简单，实际项目中应加强安全性
4. 建议添加错误边界和全局错误处理
5. 生产环境建议启用 gzip 压缩和 CDN 加速

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

建议使用最新版本的现代浏览器。

## 许可证

MIT

# 全栈网站项目

一个现代化的全栈网站，使用 React + Node.js + MongoDB 构建，具有美观的界面和完整的功能。

## 🚀 技术栈

### 后端
- **Node.js** - JavaScript 运行时
- **Express.js** - Web 框架
- **MongoDB** - 数据库
- **Mongoose** - ODM
- **JWT** - 身份验证
- **bcryptjs** - 密码加密

### 前端
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **React Router** - 路由管理
- **Axios** - HTTP 客户端
- **Heroicons** - 图标库
- **Framer Motion** - 动画库

## 📁 项目结构

```
fullstack-website/
├── client/                 # React 前端
│   ├── public/
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── contexts/       # React Context
│   │   ├── pages/          # 页面组件
│   │   └── ...
│   └── package.json
├── server/                 # Node.js 后端
│   ├── models/            # 数据模型
│   ├── routes/            # API 路由
│   ├── middleware/        # 中间件
│   └── package.json
└── package.json           # 根目录配置
```

## 🛠️ 安装和运行

### 1. 安装依赖

```bash
# 安装所有依赖（根目录、前端、后端）
npm run install-all
```

### 2. 配置环境变量

复制 `server/.env.example` 到 `server/.env` 并配置：

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fullstack-website
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### 3. 启动 MongoDB

确保 MongoDB 服务正在运行：

```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 4. 启动应用

```bash
# 同时启动前端和后端
npm run dev

# 或者分别启动
npm run server  # 启动后端 (端口 5000)
npm run client  # 启动前端 (端口 3000)
```

## 🌟 功能特性

### 用户功能
- ✅ 用户注册和登录
- ✅ JWT 身份验证
- ✅ 用户资料管理
- ✅ 密码加密存储

### 内容管理
- ✅ 创建和编辑文章
- ✅ 文章标签系统
- ✅ 文章点赞功能
- ✅ 评论系统
- ✅ 文章搜索和分页

### 界面设计
- ✅ 响应式设计
- ✅ 现代化 UI
- ✅ 深色/浅色主题支持
- ✅ 流畅的动画效果
- ✅ 移动端优化

### 技术特性
- ✅ TypeScript 类型安全
- ✅ RESTful API 设计
- ✅ 错误处理机制
- ✅ 数据验证
- ✅ 安全性最佳实践

## 📱 页面说明

### 公开页面
- **首页** (`/`) - 展示最新文章和网站介绍
- **登录** (`/login`) - 用户登录页面
- **注册** (`/register`) - 用户注册页面
- **文章详情** (`/post/:id`) - 查看文章详情和评论

### 需要登录的页面
- **仪表板** (`/dashboard`) - 用户个人中心
- **写文章** (`/create-post`) - 创建新文章
- **个人资料** (`/profile`) - 管理用户资料

## 🔧 API 接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 用户接口
- `GET /api/users/:id` - 获取用户信息
- `PUT /api/users/:id` - 更新用户信息

### 文章接口
- `GET /api/posts` - 获取文章列表（分页）
- `GET /api/posts/:id` - 获取文章详情
- `POST /api/posts` - 创建文章
- `PUT /api/posts/:id` - 更新文章
- `DELETE /api/posts/:id` - 删除文章
- `POST /api/posts/:id/like` - 点赞/取消点赞
- `POST /api/posts/:id/comments` - 添加评论

## 🎨 界面预览

### 首页
- 现代化的 Hero 区域
- 文章卡片网格布局
- 响应式设计

### 登录/注册
- 简洁的表单设计
- 实时验证反馈
- 社交登录选项

### 仪表板
- 数据统计卡片
- 文章管理界面
- 快速操作面板

### 文章详情
- 清晰的阅读体验
- 评论互动功能
- 相关文章推荐

## 🚀 部署指南

### 开发环境
1. 克隆项目
2. 安装依赖：`npm run install-all`
3. 配置环境变量
4. 启动 MongoDB
5. 运行：`npm run dev`

### 生产环境
1. 构建前端：`npm run build`
2. 配置生产环境变量
3. 使用 PM2 管理 Node.js 进程
4. 配置 Nginx 反向代理
5. 使用 MongoDB Atlas 或自建 MongoDB

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有开源项目的贡献者，特别是：
- React 团队
- Express.js 团队
- Tailwind CSS 团队
- MongoDB 团队

---

**开始你的全栈开发之旅！** 🎉
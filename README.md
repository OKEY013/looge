# Looge 幸运团购 H5 APP

<img src="https://github.com/user-attachments/assets/23272b89-826a-4e7e-a358-62552233b093" alt="Looge Homepage" width="600">

Looge是一个基于Vue 3的现代化幸运团购H5应用，提供多区域团购抽奖、VIP会员制度、多语言支持等功能。

## 📱 功能特性

### 🎯 核心功能
- **7个拼团区域**: 10K、30K、80K、150K、300K、600K、1M区，每区60分钟一轮
- **实时进度条**: 每分钟递增5%，到达100%自动开奖
- **多语言支持**: 中文、英文、西班牙语无缝切换
- **VIP会员制度**: VIP用户享有分红权益
- **现代化UI**: 白色到天蓝色渐变主题，移动端优化

### 💎 用户体验
- **响应式设计**: 完美适配手机、平板等移动设备
- **流畅动画**: CSS3动画效果，提升用户体验
- **实时更新**: 进度条、参与人数实时更新
- **安全认证**: 用户登录验证，保护用户数据

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- MySQL 8.0+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/OKEY013/looge.git
cd looge
```

2. **安装前端依赖**
```bash
cd frontend
npm install
```

3. **安装后端依赖**
```bash
cd ../backend
npm install
```

4. **配置数据库**
```bash
# 创建MySQL数据库
mysql -u root -p
CREATE DATABASE looge;

# 导入数据库结构
mysql -u root -p looge < database/schema.mysql8.sql
```

5. **配置环境变量**
```bash
# 复制环境配置文件
cd backend
cp .env.example .env

# 编辑配置文件，设置数据库连接等
nano .env
```

6. **启动项目**
```bash
# 启动后端服务 (端口 3001)
cd backend
npm start

# 启动前端开发服务器 (端口 5173)
cd ../frontend
npm run dev
```

7. **访问应用**
- 前端地址: http://localhost:5173
- 后端API: http://localhost:3001/api

## 📖 使用说明

### 基本操作
1. **选择语言**: 点击右上角语言选择器切换中文/英文/西班牙语
2. **浏览拼团**: 主页点击"团购抽奖"查看所有拼团区域
3. **登录注册**: 点击"登录"或"注册"创建账户
4. **参与拼团**: 登录后点击"参与拼团"按钮加入抽奖

### 拼团区域说明
- **10000区** (¥10,000): iPhone 15 Pro
- **30000区** (¥30,000): MacBook Air M2
- **80000区** (¥80,000): Tesla Model 3 配件包
- **150000区** (¥150,000): 劳力士手表
- **300000区** (¥300,000): 奔驰C级轿车首付
- **600000区** (¥600,000): BMW X5 首付
- **1000000区** (¥1,000,000): 海景别墅首付

### 拼团规则
- 每个区域60分钟一轮抽奖
- 进度条每分钟增长5%
- 达到100%后自动开奖
- 未中奖用户可申请退款（扣除广告费0.001%-100%）
- VIP用户享有分红权益

## 🛠️ 技术架构

### 前端技术栈
- **Vue 3**: 渐进式JavaScript框架
- **Vite**: 现代化构建工具
- **Vue Router 4**: 路由管理
- **Vue I18n**: 国际化支持
- **CSS3**: 现代化样式和动画

### 后端技术栈
- **Node.js**: 服务器运行时
- **Express.js**: Web应用框架
- **MySQL 8.0**: 关系型数据库
- **JSON Web Token**: 用户认证
- **bcryptjs**: 密码加密

### 项目结构
```
looge/
├── frontend/          # Vue 3 前端应用
│   ├── src/
│   │   ├── pages/     # 页面组件
│   │   ├── components/# 公共组件
│   │   ├── router/    # 路由配置
│   │   ├── i18n/      # 国际化配置
│   │   └── assets/    # 静态资源
│   └── package.json
├── backend/           # Node.js 后端API
│   ├── src/
│   │   ├── controllers/# 控制器
│   │   ├── models/    # 数据模型
│   │   ├── routes/    # 路由定义
│   │   └── utils/     # 工具函数
│   └── package.json
├── database/          # 数据库结构
│   └── schema.mysql8.sql
└── README.md
```

## 🎨 设计特色

### 视觉设计
- **白色到天蓝色渐变**: 清新现代的视觉风格
- **玻璃态效果**: 半透明卡片设计，增强层次感
- **流畅动画**: 悬浮、点击等交互动画
- **响应式布局**: 自适应不同屏幕尺寸

### 用户体验
- **直观操作**: 简洁明了的界面设计
- **实时反馈**: 进度条、倒计时等实时更新
- **多语言**: 支持全球用户使用
- **移动优先**: 专为移动设备优化

## 🚧 开发计划

### 即将推出
- [ ] 用户钱包功能（充值、提现、余额）
- [ ] 奖品处理机制（80%回收或邮寄）
- [ ] 邀请码系统（6位数字）
- [ ] 管理员后台
- [ ] 三级返利制度
- [ ] 实时推送通知

### 长期规划
- [ ] 移动端APP版本
- [ ] 支付系统集成
- [ ] 大数据分析
- [ ] AI智能推荐
- [ ] 区块链技术集成

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

该项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目地址: [https://github.com/OKEY013/looge](https://github.com/OKEY013/looge)
- 问题反馈: [Issues](https://github.com/OKEY013/looge/issues)

---

**Looge团队** - 让幸运触手可及！ 🍀
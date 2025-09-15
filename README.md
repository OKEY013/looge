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

### 💰 完整功能列表
- ✅ **多语言切换**: 中文/英文/西班牙语
- ✅ **用户注册**: 6位数字邀请码系统
- ✅ **拼团抽奖**: 7个价格区间，自动开奖
- ✅ **奖品领取与回收**: 80%价格回收机制
- ✅ **钱包系统**: 充值/提现/余额/交易明细
- ✅ **三级返利**: 0.5%/1.0%/2.0%返利比例
- ✅ **VIP分红**: VIP用户平台收益分红
- ✅ **管理员后台**: 完整的管理功能
- ✅ **跑马灯公告**: 实时公告系统
- ✅ **轮播图管理**: 首页轮播图
- ✅ **邀请分享**: 二维码分享邀请
- ✅ **团队明细**: 邀请统计和分红
- ✅ **物流信息**: 奖品邮寄管理
- ✅ **API接口**: 完整前后端分离

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
CREATE DATABASE looge_db;

# 导入数据库结构
mysql -u root -p looge_db < database/schema.mysql8.sql
```

5. **配置环境变量**
```bash
# 复制环境配置文件
cd backend
cp .env.example .env

# 编辑配置文件，设置数据库连接等
nano .env
```

示例 `.env` 配置：
```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration (MySQL 8.0)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=looge_db
DB_USER=root
DB_PASS=your_password
DB_DIALECT=mysql

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# System Settings
COMMISSION_LEVEL1_RATE=0.5
COMMISSION_LEVEL2_RATE=1.0
COMMISSION_LEVEL3_RATE=2.0
PRIZE_RECYCLE_RATE=80
REFUND_FEE_RATE=0.3
VIP_THRESHOLD=1000

# Frontend URL
FRONTEND_URL=http://your-domain.com
```

6. **配置前端环境**
```bash
cd ../frontend
echo "VITE_API_BASE_URL=http://your-domain.com:3001/api" > .env
```

7. **构建前端**
```bash
cd frontend
npm run build
```

8. **启动后端服务**
```bash
cd ../backend
npm start
```

9. **部署前端**
```bash
# 将 frontend/dist 目录内容部署到 Web 服务器
# 例如：复制到 Nginx 网站目录
cp -r frontend/dist/* /var/www/html/
```

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
- 未中奖用户可申请退款（扣除0.3%手续费）
- VIP用户享有分红权益

### 邀请返利系统
- **一级返利**: 0.5% - 直接邀请用户的消费返利
- **二级返利**: 1.0% - 间接邀请用户的消费返利  
- **三级返利**: 2.0% - 三级邀请用户的消费返利
- **VIP分红**: VIP用户分享平台总收益

## 🛠️ 技术架构

### 前端技术栈
- **Vue 3**: 渐进式JavaScript框架
- **Vite**: 现代化构建工具
- **Vue Router 4**: 路由管理
- **Vue I18n**: 国际化支持
- **Axios**: HTTP客户端
- **QRCode**: 二维码生成
- **CSS3**: 现代化样式和动画

### 后端技术栈
- **Node.js**: 服务器运行时
- **Express.js**: Web应用框架
- **MySQL 8.0**: 关系型数据库
- **Sequelize**: ORM数据库映射
- **JSON Web Token**: 用户认证
- **bcryptjs**: 密码加密
- **Multer**: 文件上传处理

### 数据库设计
```sql
-- 核心表结构
- user: 用户表（邀请关系、VIP状态）
- group: 拼团表（团购区域）
- group_record: 拼团记录（参与记录）
- prize: 奖品表（奖品信息）
- prize_claim: 奖品领取（邮寄/回收）
- wallet_transaction: 钱包交易（充值/提现/返利）
- commission_record: 返利记录（三级返利）
- vip_dividend: VIP分红记录
- invite_code: 邀请码表（6位数字）
- carousel: 轮播图表
- shipping: 物流信息表
- system_config: 系统配置表
```

### 项目结构
```
looge/
├── frontend/          # Vue 3 前端应用
│   ├── src/
│   │   ├── pages/     # 页面组件
│   │   │   ├── Home.vue        # 首页
│   │   │   ├── Login.vue       # 登录
│   │   │   ├── Register.vue    # 注册
│   │   │   ├── GroupPurchase.vue # 拼团
│   │   │   ├── Wallet.vue      # 钱包
│   │   │   ├── Invite.vue      # 邀请
│   │   │   ├── Profile.vue     # 个人中心
│   │   │   ├── VIP.vue         # VIP
│   │   │   ├── Admin.vue       # 管理后台
│   │   │   └── ...
│   │   ├── components/# 公共组件
│   │   ├── router/    # 路由配置
│   │   ├── api/       # API接口
│   │   ├── i18n/      # 国际化配置
│   │   └── assets/    # 静态资源
│   └── package.json
├── backend/           # Node.js 后端API
│   ├── src/
│   │   ├── controllers/# 控制器
│   │   │   ├── userController.js
│   │   │   ├── walletController.js
│   │   │   ├── inviteController.js
│   │   │   ├── carouselController.js
│   │   │   └── ...
│   │   ├── models/    # 数据模型
│   │   ├── routes/    # 路由定义
│   │   ├── services/  # 业务服务
│   │   └── utils/     # 工具函数
│   ├── uploads/       # 文件上传目录
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

## 🔧 API 接口文档

### 用户相关
- `POST /api/user/login` - 用户登录
- `POST /api/user/register` - 用户注册
- `GET /api/user/profile` - 获取用户信息
- `POST /api/user/vip` - 购买VIP

### 钱包相关
- `GET /api/wallet/balance` - 获取余额
- `GET /api/wallet/transactions` - 交易记录
- `POST /api/wallet/recharge` - 充值
- `POST /api/wallet/withdraw` - 提现

### 邀请相关
- `GET /api/invite/generate` - 生成邀请码
- `POST /api/invite/validate` - 验证邀请码
- `GET /api/invite/stats` - 邀请统计
- `GET /api/invite/list` - 邀请列表

### 拼团相关
- `GET /api/group/list` - 拼团列表
- `POST /api/group/join` - 参与拼团

### 管理相关
- `GET /api/carousel/list` - 轮播图列表
- `POST /api/carousel` - 创建轮播图
- `PUT /api/carousel/:id` - 更新轮播图
- `DELETE /api/carousel/:id` - 删除轮播图

## 🚀 生产部署

### 使用Docker部署
```bash
# 创建Docker网络
docker network create looge-network

# 启动MySQL数据库
docker run -d \
  --name looge-mysql \
  --network looge-network \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=looge_db \
  -v mysql_data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.0

# 导入数据库结构
docker exec -i looge-mysql mysql -uroot -pyour_password looge_db < database/schema.mysql8.sql

# 启动后端服务
docker build -t looge-backend ./backend
docker run -d \
  --name looge-backend \
  --network looge-network \
  -p 3001:3001 \
  -v $(pwd)/backend/uploads:/app/uploads \
  looge-backend

# 启动前端服务（使用Nginx）
docker build -t looge-frontend ./frontend
docker run -d \
  --name looge-frontend \
  -p 80:80 \
  looge-frontend
```

### 手动部署
1. **服务器环境**：CentOS 7+/Ubuntu 18+
2. **安装依赖**：Node.js 16+、MySQL 8.0、Nginx
3. **配置Nginx**：反向代理和静态文件服务
4. **PM2管理**：后端进程管理和自动重启
5. **SSL证书**：HTTPS安全访问

### 性能优化
- 启用Gzip压缩
- 配置CDN加速
- 数据库连接池
- Redis缓存
- 图片懒加载

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
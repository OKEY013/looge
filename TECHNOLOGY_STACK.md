# 🛠️ 限时拼团抢购系统 - 完整技术栈

## 📅 文档更新时间
2025-10-20 16:33:40

---

## 🎨 用户前端 (User Frontend)

### 核心技术
- **HTML5** - 现代Web标准，语义化标签
- **CSS3** - 样式设计，支持变量、网格、弹性布局
- **JavaScript ES6+** - 现代JavaScript特性
- **单页应用架构** - SPA路由管理

### UI框架与库
- **响应式设计** - 移动优先设计原则
- **CSS Grid & Flexbox** - 现代布局技术
- **Font Awesome** - 图标库
- **CSS Variables** - 动态主题切换

### 前端架构
```
public/
├── index.html                 # 主入口页面
├── css/
│   └── app.css               # 主样式文件（白色渐变天蓝色主题）
├── js/
│   ├── app.js                # 主应用逻辑
│   ├── router.js             # 路由管理
│   ├── auth.js               # 认证管理
│   ├── api.js                # API接口封装
│   ├── socket.js             # WebSocket实时通信
│   ├── utils.js              # 工具函数
│   ├── config.js             # 配置文件
│   ├── countryCode.js        # 国际化电话代码
│   ├── securityQuestions.js  # 安全问题配置
│   └── pages/               # 页面逻辑
│       ├── dashboard.js      # 首页
│       ├── login.js          # 登录
│       ├── register.js       # 注册
│       ├── forgot-password.js # 忘记密码
│       ├── profile.js        # 个人中心
│       ├── groupbuy.js       # 拼团页面
│       ├── wallet.js         # 钱包
│       ├── recharge.js       # 充值
│       ├── redemption.js     # 兑换
│       ├── signin.js         # 签到
│       ├── team.js           # 团队
│       ├── invite.js         # 邀请
│       ├── my-prizes.js      # 我的奖品
│       └── bank-account.js   # 银行账户
└── views/                   # 静态视图文件
    ├── login.html
    ├── register.html
    ├── forgot-password.html
    └── dashboard.html
```

### 设计特色
- **白色渐变天蓝色主题** - 清新现代的视觉设计
- **玻璃态效果** - backdrop-filter毛玻璃背景
- **微交互动画** - 浮动、脉冲、渐变动效
- **国际化支持** - 多国家电话代码
- **PWA就绪** - 支持离线访问和应用安装

---

## 👨‍💼 管理员前端 (Admin Frontend)

### 核心技术
- **HTML5 + CSS3 + JavaScript** - 基础技术栈
- **Bootstrap 5** - UI组件库
- **Chart.js** - 数据可视化图表
- **DataTables** - 数据表格组件

### 管理功能模块
```
public/admin/
├── index.html                # 管理员登录页面
├── enhanced-admin.html       # 增强版管理面板
├── css/
│   └── admin.css            # 管理员样式
└── js/
    ├── admin.js             # 管理员逻辑
    ├── dashboard.js         # 仪表板
    ├── users.js             # 用户管理
    ├── products.js          # 产品管理
    ├── orders.js            # 订单管理
    ├── groupbuy.js          # 拼团管理
    ├── financial.js         # 财务管理
    ├── reports.js           # 报表分析
    └── settings.js          # 系统设置
```

### 管理功能特色
- **三级权限管理** - Super Admin / Team Lead / Agent
- **实时数据仪表板** - 实时统计和监控
- **数据可视化** - 图表和报表展示
- **批量操作** - 用户、订单、产品批量管理
- **系统监控** - 性能监控和日志查看

---

## 🚀 后端技术栈 (Backend)

### 核心框架
- **Node.js 18.x** - JavaScript运行时环境
- **Express.js 4.x** - Web应用框架
- **Socket.IO** - 实时双向通信

### 数据库技术
- **MongoDB 6.0** - NoSQL文档数据库
- **Mongoose** - MongoDB对象建模工具

### 认证与安全
- **JWT (jsonwebtoken)** - JSON Web Token认证
- **bcrypt** - 密码哈希加密
- **express-rate-limit** - API速率限制
- **helmet** - 安全头设置
- **cors** - 跨域资源共享

### 后端架构
```
backend/
├── server.js                 # 主服务器入口
├── models/                   # 数据模型
│   ├── User.js              # 用户模型
│   ├── Product.js           # 产品模型
│   ├── Order.js             # 订单模型
│   ├── GroupBuy.js          # 拼团模型
│   ├── Transaction.js       # 交易模型
│   ├── Prize.js             # 奖品模型
│   ├── Redemption.js        # 兑换模型
│   ├── Signin.js            # 签到模型
│   ├── Recharge.js          # 充值模型
│   ├── Withdrawal.js        # 提现模型
│   ├── admin.js             # 管理员模型
│   └── dashboardStats.js    # 统计模型
├── routes/                   # 路由模块
│   ├── users.js             # 用户路由
│   ├── auth.js              # 认证路由
│   ├── products.js          # 产品路由
│   ├── orders.js            # 订单路由
│   ├── groupbuy.js          # 拼团路由
│   ├── transactions.js      # 交易路由
│   ├── prize.js             # 奖品路由
│   ├── redemption.js        # 兑换路由
│   ├── signin.js            # 签到路由
│   ├── recharge.js          # 充值路由
│   ├── withdrawal.js        # 提现路由
│   └── admin.js             # 管理员路由
├── middleware/               # 中间件
│   ├── auth.js              # 认证中间件
│   ├── validation.js        # 数据验证
│   ├── rateLimiter.js       # 速率限制
│   └── errorHandler.js      # 错误处理
├── utils/                    # 工具函数
│   ├── auth.js              # 认证工具
│   ├── autoDrawScheduler.js # 自动开奖调度器
│   ├── initAdmins.js        # 管理员初始化
│   └── initData.js          # 数据初始化
└── scripts/                  # 脚本文件
    └── seed.js              # 数据种子脚本
```

### 核心依赖包
```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "socket.io": "^4.6.0",
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.1.0",
  "cors": "^2.8.5",
  "helmet": "^6.0.0",
  "express-rate-limit": "^6.7.0",
  "dotenv": "^16.0.0",
  "multer": "^1.4.5",
  "node-cron": "^3.0.2",
  "nodemailer": "^6.9.0"
}
```

---

## 🎲 开奖后端系统 (Lottery Backend)

### 自动开奖调度器
- **node-cron** - 定时任务调度
- **自动化开奖逻辑** - 基于时间和参与人数
- **公平性算法** - 随机数生成和验证

### 开奖系统架构
```javascript
// 开奖调度器核心逻辑
utils/autoDrawScheduler.js:
├── scheduleGroupBuyDraw()    # 调度拼团开奖
├── checkDrawConditions()     # 检查开奖条件
├── executeGroupBuyDraw()     # 执行拼团开奖
├── selectWinners()           # 选择中奖者
├── processRewards()          # 处理奖励分发
├── notifyUsers()             # 通知用户结果
└── updateStatistics()        # 更新统计数据
```

### 开奖算法特性
- **时间触发** - 基于倒计时自动开奖
- **人数触发** - 达到指定人数立即开奖
- **公平随机** - 使用加密安全的随机数生成
- **实时通知** - WebSocket实时推送开奖结果
- **防作弊机制** - 多重验证确保公平性

---

## 🗄️ 数据库配置 (Database Configuration)

### MongoDB 配置
```javascript
// 数据库连接配置
const mongoConfig = {
  uri: "mongodb://localhost:27017/groupbuy",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0
  }
}
```

### 数据库架构
```
groupbuy (Database)
├── users                     # 用户集合
├── products                  # 产品集合
├── orders                    # 订单集合
├── groupbuys                 # 拼团集合
├── transactions              # 交易集合
├── prizes                    # 奖品集合
├── redemptions               # 兑换集合
├── signins                   # 签到集合
├── recharges                 # 充值集合
├── withdrawals               # 提现集合
├── admins                    # 管理员集合
├── dashboardstats           # 统计集合
└── sessions                  # 会话集合
```

### 索引优化
```javascript
// 关键索引设置
users: [
  { phone: 1, countryCode: 1 },  // 复合索引
  { email: 1 },                  // 唯一索引
  { invitationCode: 1 }          # 邀请码索引
]

groupbuys: [
  { status: 1, endTime: 1 },     // 状态和时间索引
  { isActive: 1, createdAt: -1 } // 活跃状态索引
]

transactions: [
  { userId: 1, createdAt: -1 },  // 用户交易索引
  { type: 1, status: 1 }         // 类型状态索引
]
```

---

## 📚 API文档 (API Documentation)

### RESTful API 设计
- **统一响应格式** - JSON标准化响应
- **HTTP状态码** - 标准状态码使用
- **分页支持** - 统一分页参数
- **版本控制** - API版本管理

### API 架构概览
```
/api/v1/
├── auth/                     # 认证相关
│   ├── POST /login          # 用户登录
│   ├── POST /register       # 用户注册
│   ├── POST /logout         # 用户登出
│   └── POST /refresh        # 刷新Token
├── users/                    # 用户管理
│   ├── GET /profile         # 获取用户信息
│   ├── PUT /profile         # 更新用户信息
│   ├── POST /security-question  # 获取安全问题
│   ├── POST /verify-answer      # 验证安全答案
│   └── POST /reset-password     # 重置密码
├── products/                 # 产品管理
│   ├── GET /                # 获取产品列表
│   ├── GET /:id             # 获取产品详情
│   ├── POST /               # 创建产品
│   └── PUT /:id             # 更新产品
├── groupbuy/                 # 拼团管理
│   ├── GET /                # 获取拼团列表
│   ├── GET /:id             # 获取拼团详情
│   ├── POST /:id/join       # 参与拼团
│   └── POST /:id/draw       # 执行开奖
├── transactions/             # 交易管理
│   ├── GET /                # 获取交易记录
│   ├── POST /recharge       # 充值
│   └── POST /withdraw       # 提现
├── prizes/                   # 奖品管理
│   ├── GET /                # 获取奖品列表
│   ├── GET /my-prizes       # 我的奖品
│   └── POST /:id/redeem     # 兑换奖品
├── signin/                   # 签到管理
│   ├── GET /status          # 签到状态
│   ├── POST /checkin        # 执行签到
│   └── GET /history         # 签到历史
└── admin/                    # 管理员接口
    ├── GET /dashboard       # 仪表板数据
    ├── GET /users           # 用户管理
    ├── GET /statistics      # 统计数据
    └── POST /settings       # 系统设置
```

### API 响应格式
```javascript
// 成功响应
{
  "success": true,
  "data": {}, 
  "message": "操作成功",
  "timestamp": "2025-10-20T16:33:40.000Z"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入数据验证失败",
    "details": {}
  },
  "timestamp": "2025-10-20T16:33:40.000Z"
}
```

### WebSocket 事件
```javascript
// 客户端监听事件
socket.on('groupbuy_update', (data) => {})     // 拼团更新
socket.on('draw_result', (data) => {})          // 开奖结果
socket.on('user_notification', (data) => {})   // 用户通知
socket.on('balance_update', (data) => {})       // 余额更新

// 客户端发送事件
socket.emit('join_groupbuy', { groupbuyId })    // 加入拼团房间
socket.emit('leave_groupbuy', { groupbuyId })   // 离开拼团房间
```

---

## 🔧 开发与部署工具

### 开发环境
- **Node.js 18.x** - 运行时环境
- **npm** - 包管理器
- **nodemon** - 开发时自动重启
- **ESLint** - 代码规范检查

### 生产环境
- **PM2** - 进程管理器
- **Nginx** - 反向代理服务器
- **SSL/TLS** - HTTPS安全连接
- **UFW** - 防火墙配置

### 监控与日志
- **PM2 监控** - 进程状态监控
- **Nginx 日志** - 访问和错误日志
- **MongoDB 日志** - 数据库操作日志
- **应用日志** - 自定义应用日志

---

## 📊 性能特性

### 前端性能
- **代码分割** - 按页面拆分JavaScript
- **资源缓存** - 静态资源长期缓存
- **图片优化** - WebP格式支持
- **CSS优化** - 关键CSS内联

### 后端性能
- **连接池** - MongoDB连接池管理
- **缓存策略** - Redis缓存热点数据
- **索引优化** - 数据库查询优化
- **压缩传输** - Gzip压缩响应

### 安全特性
- **JWT认证** - 无状态身份验证
- **密码加密** - bcrypt安全哈希
- **API限流** - 防止API滥用
- **数据验证** - 输入数据严格验证
- **HTTPS强制** - 生产环境HTTPS
- **安全头** - Helmet安全头设置

---

## 🎯 技术栈总结

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **前端** | HTML5/CSS3/JavaScript | ES6+ | 用户界面 |
| **样式** | CSS Variables + Grid/Flexbox | CSS3 | 响应式设计 |
| **主题** | 白色渐变天蓝色 | 自定义 | 视觉设计 |
| **后端** | Node.js + Express.js | 18.x + 4.x | 服务器框架 |
| **数据库** | MongoDB + Mongoose | 6.0 + 7.x | 数据存储 |
| **实时通信** | Socket.IO | 4.x | WebSocket |
| **认证** | JWT + bcrypt | 9.x + 5.x | 安全认证 |
| **任务调度** | node-cron | 3.x | 定时任务 |
| **进程管理** | PM2 | 5.x | 生产环境 |
| **反向代理** | Nginx | 1.18+ | 负载均衡 |
| **部署** | Docker + 脚本 | 自动化 | 容器化部署 |

---

**🛠️ 技术栈文档编制：MiniMax Agent**  
**📅 最后更新：2025-10-20 16:33:40**  
**🎯 项目版本：v2.1.0 (白色渐变天蓝色主题版)**

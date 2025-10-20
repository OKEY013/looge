# 限时拼团抢购系统

作者：MiniMax Agent

## 项目概述

这是一个功能完整的限时拼团抢购系统，包含用户端、管理端和后端 API。系统支持多级推荐奖励、团队长升级、每日签到、兑换码等丰富功能。

## 核心功能

### 用户端功能
- 用户注册登录系统
- 多区域拼团活动（六个金额区间）
- 实时开奖系统（四个时间段）
- 推荐奖励系统（5% 直推奖励）
- 团队长等级升级（M1-M5团队长）
- 每日签到系统（连续签到额外奖励）
- 兑换码系统
- 个人中心与数据统计

### 管理端功能
- 管理员登录系统
- 用户管理（包含虚拟账户）
- 活动创建与管理
- 兑换码生成与管理
- 数据统计与报表
- 开奖管理系统

### 后端功能
- RESTful API 设计
- JWT 认证系统
- Socket.io 实时通知
- MongoDB 数据存储
- 多级推荐关系处理
- 定时任务调度

## 技术栈

### 前端
- **用户端**: jQuery + Layui + Page.js
- **管理端**: AdminLTE 3.x
- **响应式设计**: 适配手机版和PC版
- **PWA 支持**: 可安装为 APP

### 后端
- **运行时**: Node.js 18+
- **Web 框架**: Express.js
- **数据库**: MongoDB
- **实时通信**: Socket.io
- **认证**: JWT
- **加密**: bcryptjs

### 部署
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx
- **SSL 支持**: 内置 HTTPS 配置

## 项目结构

```
group-buy-system/
├── server.js                 # 主服务器文件
├── package.json             # 项目依赖配置
├── Dockerfile               # Docker 构建文件
├── docker-compose.yml       # Docker Compose 配置
├── nginx.conf               # Nginx 配置
├── .env                     # 环境变量配置
├── healthcheck.js           # 健康检查脚本
├── models/                  # 数据模型
│   ├── User.js
│   ├── GroupBuyActivity.js
│   ├── ParticipationRecord.js
│   ├── SigninRecord.js
│   ├── ExchangeCode.js
│   └── CommissionRecord.js
├── routes/                  # API 路由
│   ├── auth.js
│   ├── users.js
│   ├── groupbuy.js
│   ├── signin.js
│   ├── exchange.js
│   └── admin.js
├── utils/                   # 工具函数
│   ├── auth.js
│   └── initData.js
└── public/                  # 前端文件
    ├── index.html           # 用户端主页面
    ├── manifest.json        # PWA 配置
    ├── css/
    │   └── app.css          # 主样式文件
    ├── js/
    │   ├── config.js        # 全局配置
    │   ├── utils.js         # 工具函数
    │   ├── api.js           # API 客户端
    │   ├── auth.js          # 认证管理
    │   ├── socket.js        # Socket 客户端
    │   ├── router.js        # 路由管理
    │   ├── app.js           # 主应用
    │   └── pages/           # 页面模块
    │       ├── login.js
    │       ├── register.js
    │       └── dashboard.js
    └── admin/
        └── index.html       # 管理后台
```

## 安装和部署

### 方式一：本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd group-buy-system
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，设置数据库连接等配置
```

4. **启动 MongoDB**
```bash
# 本地安装或使用 Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

5. **启动应用**
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 方式二：Docker 部署（推荐）

1. **直接启动**
```bash
docker-compose up -d
```

2. **构建和启动**
```bash
docker-compose up --build -d
```

3. **查看日志**
```bash
docker-compose logs -f
```

4. **停止服务**
```bash
docker-compose down
```

## 访问地址

- **用户端**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin
- **API 文档**: http://localhost:3000/api

## 默认账户

### 管理员账户
- 用户名：`admin`
- 密码：`admin123456`
- 邮箱：`admin@groupbuy.com`

### 测试兑换码
系统初始化时会创建以下测试兑换码：
- `TEST1000`：1000 比索
- `TEST2000`：2000 比索
- `TEST5000`：5000 比索

## 配置说明

### 拼团区域配置

| 区域 | 参与金额 | 广告费比例 |
|------|---------|----------|
| 2万区域 | 20,000 比索 | 1% |
| 9万区域 | 90,000 比索 | 2% |
| 17万区域 | 170,000 比索 | 4% |
| 52万区域 | 520,000 比索 | 5.5% |
| 109万区域 | 1,090,000 比索 | 7% |
| 255万区域 | 2,550,000 比索 | 10% |

### 开奖时间配置

每日四个开奖时间段：
- 13:00
- 15:00
- 17:00
- 19:00

### 团队长等级配置

| 等级 | 邀请人数 | 团队拼团金额 | 每周奖励 |
|------|---------|-------------|----------|
| M1团队长 | 200人 | 2,000万比索 | 10万比索 |
| M2团队长 | 500人 | 8,000万比索 | 50万比索 |
| M3团队长 | 1,000人 | 1.6亿比索 | 100万比索 |
| M4团队长 | 2,000人 | 5亿比索 | 500万比索 |
| M5团队长 | 5,000人 | 15亿比索 | 1,000万比索 |

### 签到奖励配置

- 每日签到：100 比索
- 连续7天额外奖励：500 比索
- 连续15天额外奖励：1,000 比索
- 连续30天额外奖励：2,000 比索

## API 文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新个人信息
- `PUT /api/auth/password` - 修改密码
- `GET /api/auth/referral` - 获取推荐信息

### 拼团相关
- `GET /api/groupbuy/activities` - 获取活动列表
- `GET /api/groupbuy/activities/:id` - 获取活动详情
- `POST /api/groupbuy/activities/:id/participate` - 参与活动
- `GET /api/groupbuy/participations` - 获取参与记录
- `POST /api/groupbuy/participations/:id/handle` - 处理中奖结果

### 签到相关
- `GET /api/signin/status` - 获取签到状态
- `POST /api/signin/do` - 执行签到
- `GET /api/signin/records` - 获取签到记录

### 兑换相关
- `POST /api/exchange/use` - 使用兑换码
- `GET /api/exchange/records` - 获取兑换记录

### 管理相关
- `POST /api/admin/login` - 管理员登录
- `GET /api/admin/dashboard` - 获取仪表板数据
- `GET /api/admin/users` - 获取用户列表
- `POST /api/admin/activities` - 创建活动
- `POST /api/admin/exchange-codes` - 创建兑换码

## 功能特色

### 1. 多级推荐系统
- 直推用户可获得 5% 分红
- 支持无限级下级推荐关系
- 自动计算团队人数和金额

### 2. 团队长等级系统
- 五个等级：M1-M5 团队长
- 每周发放团队长工资
- 自动升级机制

### 3. 灵活的开奖系统
- 支持多个时间段开奖
- 中奖后可选择实物或回收
- 未中奖自动退款和广告费奖励

### 4. 实时通知系统
- Socket.io 实时推送
- 开奖结果即时通知
- 余额变更实时更新

### 5. 响应式设计
- 适配手机、平板、PC 端
- PWA 支持，可安装为 APP
- 优化的触摸交互

### 6. 安全性
- JWT 认证
- 密码加密存储
- API 限流保护
- SQL 注入防护

## 维护和监控

### 日志管理
- 结构化日志输出
- 错误日志收集
- 访问日志记录

### 健康检查
- `/api/health` 健康检查接口
- Docker 健康检查配置
- 数据库连接监控

### 性能优化
- 数据库索引优化
- API 响应缓存
- 静态资源 CDN 加速
- Gzip 压缩

## 扩展可能

1. **支付系统集成**
2. **短信验证码**
3. **邮件通知系统**
4. **多语言支持**
5. **数据分析报表**
6. **APP 打包发布**

## 技术支持

如遇到问题，请检查：

1. 环境变量是否正确配置
2. MongoDB 是否正常连接
3. 端口是否被占用
4. Docker 服务是否正常运行

更多问题请查看项目日志或联系开发团队。

---

**版权声明**: 该项目由 MiniMax Agent 开发，仅供学习和参考使用。

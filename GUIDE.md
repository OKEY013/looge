# 限时拼团抢购系统 - 运行指南

## 快速开始

### 第一步：克隆项目
```bash
git clone <your-repository-url>
cd group-buy-system
```

### 第二步：选择部署方式

#### 方式 A：Docker 部署（推荐）
```bash
# 直接启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app
```

#### 方式 B：本地开发
```bash
# 安装依赖
npm install

# 启动 MongoDB服务
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# 开发模式启动
npm run dev
```

### 第三步：访问系统

等待约 30-60 秒系统初始化完成后：

- **用户端**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin

## 登录信息

### 管理员账户
- **用户名**: admin
- **密码**: admin123456

### 测试用户注册
在用户端可以注册新账户，手机号格式：`+54xxxxxxxxxx`

### 测试兑换码
- `TEST1000` - 1000 比索
- `TEST2000` - 2000 比索
- `TEST5000` - 5000 比索

## 功能测试流程

### 1. 用户注册和登录
1. 访问 http://localhost:3000
2. 点击“立即注册”
3. 填写注册信息（注意手机号格式）
4. 注册成功后自动登录

### 2. 每日签到
1. 点击底部导航“签到”
2. 点击“立即签到”按钮
3. 获得 100 比索奖励

### 3. 兑换码使用
1. 点击快捷操作“兑换中心”
2. 输入测试兑换码（如 TEST1000）
3. 点击兑换获得余额

### 4. 参与拼团
1. 点击底部导航“拼团”
2. 选择一个区域（如 2万区域）
3. 点击参与活动
4. 等待开奖时间

### 5. 管理后台操作
1. 访问 http://localhost:3000/admin
2. 使用管理员账户登录
3. 查看仪表板数据
4. 管理用户和活动

## 常用命令

### Docker 相关
```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 重新构建并启动
docker-compose up --build -d

# 查看服务状态
docker-compose ps

# 查看应用日志
docker-compose logs -f app

# 查看数据库日志
docker-compose logs -f mongo

# 清理所有数据（注意：会删除所有数据）
docker-compose down -v
```

### 本地开发
```bash
# 安装依赖
npm install

# 开发模式（自动重启）
npm run dev

# 生产模式
npm start

# 运行测试
npm test
```

### 数据库操作
```bash
# 进入 MongoDB 容器
docker exec -it group-buy-system_mongo_1 mongosh

# 连接数据库
use groupbuy

# 查看所有集合
show collections

# 查看用户数据
db.users.find().pretty()

# 查看活动数据
db.groupbuyactivities.find().pretty()
```

## 环境变量说明

主要配置项（.env 文件）：

```env
# 应用配置
NODE_ENV=development
PORT=3000

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/groupbuy

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# 管理员账户
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123456
ADMIN_EMAIL=admin@groupbuy.com

# 系统设置
DEFAULT_DAILY_SIGNIN_REWARD=100
REFERRAL_COMMISSION_RATE=0.05

# 开奖时间
DRAW_TIMES=13:00,15:00,17:00,19:00
```

## 故障排查

### 常见问题

1. **无法访问网站**
   - 检查端口 3000 是否被占用
   - 检查 Docker 服务是否正常运行
   ```bash
   docker-compose ps
   netstat -an | grep 3000
   ```

2. **数据库连接失败**
   - 检查 MongoDB 是否启动
   - 检查连接地址是否正确
   ```bash
   docker-compose logs mongo
   ```

3. **管理员无法登录**
   - 检查账户密码是否正确
   - 等待系统初始化完成（约 30-60 秒）

4. **前端资源加载失败**
   - 检查网络连接
   - 刷新浏览器缓存

### 日志查看

```bash
# 查看应用日志
docker-compose logs app

# 实时查看日志
docker-compose logs -f app

# 查看最近 100 行日志
docker-compose logs --tail=100 app
```

### 性能监控

```bash
# 查看容器资源使用
docker stats

# 查看系统资源
top
htop  # 需要安装
```

## 安全说明

### 默认安全措施
- JWT Token 认证
- 密码 bcrypt 加密
- API 限流保护
- XSS 防护
- CSRF 防护

### 生产环境建议
1. **修改默认密码**
   ```bash
   # 修改 .env 文件中的以下项目
   JWT_SECRET=your-production-secret-key
   ADMIN_PASSWORD=your-strong-password
   ```

2. **配置 HTTPS**
   - 使用 Let's Encrypt 证书
   - 配置反向代理

3. **限制网络访问**
   - 使用防火墙
   - 只开放必要端口

4. **定期备份**
   ```bash
   # 数据库备份
   docker exec mongodb mongodump --out /backup
   
   # 数据库还原
   docker exec mongodb mongorestore /backup
   ```

## 更新和维护

### 代码更新
```bash
# 拉取最新代码
git pull origin main

# 重新构建并部署
docker-compose up --build -d
```

### 数据库维护
```bash
# 数据库索引优化
docker exec mongodb mongosh --eval "db.runCommand({reIndex: 'users'})"

# 数据清理（清理 30 天前的旧数据）
docker exec mongodb mongosh --eval "db.signinrecords.deleteMany({createdAt: {\$lt: new Date(Date.now() - 30*24*60*60*1000)}})"
```

## 联系支持

如果您在使用过程中遇到问题：

1. 检查本指南的故障排查部分
2. 查看系统日志信息
3. 检查系统资源使用情况
4. 联系开发团队获取支持

---

祝您使用愉快！🎉

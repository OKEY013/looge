# 限时拼团抢购系统 - 部署指南

**版本:** 1.0.0  
**更新时间:** 2025-10-20  
**作者:** MiniMax Agent

## 🚀 快速部署

### 系统要求

**服务器环境:**
- **操作系统:** Linux (Ubuntu 20.04+ 推荐)
- **Node.js:** 16.x 或更高版本
- **MongoDB:** 4.4 或更高版本
- **内存:** 最少 2GB RAM (推荐 4GB+)
- **存储:** 最少 20GB 可用空间
- **网络:** 稳定的互联网连接

**域名与SSL:**
- 一个已备案的域名
- SSL 证书（推荐使用 Let's Encrypt）

---

## 📦 安装步骤

### 1. 服务器环境准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要软件
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 2. 安装 MongoDB

```bash
# 导入 MongoDB GPG 密钥
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# 添加 MongoDB 仓库
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 安装 MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# 启动 MongoDB 服务
sudo systemctl start mongod
sudo systemctl enable mongod

# 验证安装
sudo systemctl status mongod
```

### 3. 安装 PM2 进程管理器

```bash
# 全局安装 PM2
sudo npm install -g pm2

# 设置 PM2 开机自启
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### 4. 部署应用代码

```bash
# 创建应用目录
sudo mkdir -p /var/www/groupbuy-system
sudo chown $USER:$USER /var/www/groupbuy-system

# 进入应用目录
cd /var/www/groupbuy-system

# 上传项目文件（通过 git 或直接上传）
# 方式1: 通过 git（如果你有代码仓库）
# git clone https://your-repo-url.git .

# 方式2: 直接上传项目文件包到此目录

# 安装依赖
npm install --production

# 安装 node-cron（如果不在 package.json 中）
npm install node-cron

# 复制配置文件
cp .env.example .env
```

### 5. 配置环境变量

```bash
# 编辑环境配置文件
nano .env
```

**环境变量配置示例:**
```env
# 应用配置
NODE_ENV=production
PORT=3000
APP_NAME="限时拼团抢购系统"

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/groupbuy_production

# JWT 密钥（请生成强密码）
JWT_SECRET=your-super-secret-jwt-key-here-change-this

# API 限流配置
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# 文件上传配置
UPLOAD_PATH=/var/www/groupbuy-system/uploads
MAX_FILE_SIZE=10485760

# 邮件配置（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 短信配置（可选）
SMS_API_KEY=your-sms-api-key
SMS_API_SECRET=your-sms-api-secret

# 域名配置
DOMAIN=your-domain.com
API_BASE_URL=https://your-domain.com/api
```

### 6. 创建上传目录和设置权限

```bash
# 创建上传目录
mkdir -p uploads/avatars uploads/products uploads/banners

# 设置权限
chmod 755 uploads
chmod 755 uploads/avatars uploads/products uploads/banners

# 确保 Node.js 有写入权限
sudo chown -R $USER:$USER /var/www/groupbuy-system
```

### 7. 启动应用

```bash
# 使用 PM2 启动应用
pm2 start ecosystem.config.js

# 查看应用状态
pm2 status

# 查看日志
pm2 logs

# 保存 PM2 配置
pm2 save
```

---

## 🌐 Nginx 配置

### 1. 创建 Nginx 配置文件

```bash
sudo nano /etc/nginx/sites-available/groupbuy-system
```

**Nginx 配置示例:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头部
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 文件上传大小限制
    client_max_body_size 10M;
    
    # 静态文件
    location /uploads/ {
        alias /var/www/groupbuy-system/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # API 请求代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Socket.IO WebSocket 支持
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 前端文件
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

### 2. 启用 Nginx 配置

```bash
# 启用站点配置
sudo ln -s /etc/nginx/sites-available/groupbuy-system /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 3. 获取 SSL 证书

```bash
# 使用 Certbot 获取 Let's Encrypt 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 测试自动续期
sudo certbot renew --dry-run
```

---

## 🗄️ 数据库配置

### 1. MongoDB 安全配置

```bash
# 连接到 MongoDB
mongosh

# 创建管理员用户
use admin
db.createUser({
  user: "admin",
  pwd: "your-strong-password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

# 创建应用数据库用户
use groupbuy_production
db.createUser({
  user: "groupbuy_user",
  pwd: "your-app-password",
  roles: [ { role: "readWrite", db: "groupbuy_production" } ]
})

# 退出
exit
```

### 2. 启用 MongoDB 认证

```bash
# 编辑 MongoDB 配置
sudo nano /etc/mongod.conf
```

**添加以下配置:**
```yaml
security:
  authorization: enabled
```

```bash
# 重启 MongoDB
sudo systemctl restart mongod
```

### 3. 更新应用数据库连接

```bash
# 更新 .env 文件中的数据库连接
nano .env
```

```env
MONGODB_URI=mongodb://groupbuy_user:your-app-password@localhost:27017/groupbuy_production
```

---

## 🔧 应用初始化

### 1. 数据库初始化

```bash
# 重启应用以应用新的数据库配置
pm2 restart all

# 查看应用日志确认启动成功
pm2 logs --lines 50
```

### 2. 访问管理后台

应用启动后，系统会自动创建初始管理员账号：

**超级管理员账号:**
- 用户名: `superadmin`
- 密码: `admin123456`
- 访问地址: `https://your-domain.com/admin`

**⚠️ 重要:** 首次登录后请立即修改密码！

### 3. 系统配置检查

访问以下URL进行系统检查：
- 健康检查: `https://your-domain.com/api/health`
- 管理后台: `https://your-domain.com/admin`
- 用户前端: `https://your-domain.com`

---

## 🔄 维护与监控

### 1. 日志管理

```bash
# 查看 PM2 日志
pm2 logs

# 查看特定应用日志
pm2 logs groupbuy-system

# 清理日志
pm2 flush

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. 应用更新

```bash
# 进入应用目录
cd /var/www/groupbuy-system

# 备份数据库（推荐）
mongodump --uri="mongodb://groupbuy_user:your-app-password@localhost:27017/groupbuy_production" --out ./backup/$(date +%Y%m%d_%H%M%S)

# 更新代码
git pull origin main
# 或者上传新的文件

# 安装新依赖
npm install --production

# 重启应用
pm2 restart all
```

### 3. 数据库备份

```bash
# 创建备份脚本
nano /home/$USER/backup_db.sh
```

**备份脚本内容:**
```bash
#!/bin/bash
BACKUP_DIR="/home/$USER/db_backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="groupbuy_production"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
mongodump --uri="mongodb://groupbuy_user:your-app-password@localhost:27017/$DB_NAME" --out "$BACKUP_DIR/$DATE"

# 压缩备份
cd $BACKUP_DIR
tar -czf "$DATE.tar.gz" "$DATE"
rm -rf "$DATE"

# 删除7天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "数据库备份完成: $BACKUP_DIR/$DATE.tar.gz"
```

```bash
# 设置执行权限
chmod +x /home/$USER/backup_db.sh

# 添加到定时任务（每天凌晨2点执行）
crontab -e
# 添加以下行：
0 2 * * * /home/$USER/backup_db.sh
```

### 4. 性能监控

```bash
# 安装 PM2 监控
pm2 install pm2-server-monit

# 查看系统资源使用
pm2 monit

# 查看详细统计
pm2 show groupbuy-system
```

---

## 🛡️ 安全配置

### 1. 防火墙配置

```bash
# 启用 UFW 防火墙
sudo ufw enable

# 允许必要端口
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# 只允许本地访问 MongoDB
sudo ufw deny 27017
sudo ufw allow from 127.0.0.1 to any port 27017

# 查看防火墙状态
sudo ufw status verbose
```

### 2. 系统更新

```bash
# 设置自动安全更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. 应用安全

**重要安全建议:**
1. 定期更新 JWT_SECRET
2. 启用 API 限流
3. 定期更新依赖包
4. 监控异常登录
5. 定期备份数据

---

## 📋 故障排除

### 常见问题解决

**1. 应用无法启动**
```bash
# 检查端口占用
sudo netstat -tlnp | grep :3000

# 检查环境变量
pm2 show groupbuy-system

# 查看详细错误日志
pm2 logs --err
```

**2. 数据库连接失败**
```bash
# 检查 MongoDB 状态
sudo systemctl status mongod

# 测试数据库连接
mongosh "mongodb://groupbuy_user:your-app-password@localhost:27017/groupbuy_production"
```

**3. SSL 证书问题**
```bash
# 检查证书状态
sudo certbot certificates

# 手动续期证书
sudo certbot renew --force-renewal
```

**4. 性能问题**
```bash
# 检查系统资源
htop
df -h
free -m

# 查看 Node.js 内存使用
pm2 monit
```

---

## 📞 技术支持

如果在部署过程中遇到问题，请检查：

1. **系统要求是否满足**
2. **环境变量是否正确配置**
3. **端口是否被占用**
4. **防火墙设置是否正确**
5. **数据库连接是否正常**

**日志文件位置:**
- 应用日志: `pm2 logs`
- Nginx 日志: `/var/log/nginx/`
- MongoDB 日志: `/var/log/mongodb/mongod.log`

---

**部署指南维护者:** MiniMax Agent  
**最后更新:** 2025-10-20 15:51:05

🎉 **恭喜！您的限时拼团抢购系统已成功部署！**
# 限时拼团抢购系统 - 快速安装指南

## 📦 项目包下载完成

**系统状态：** ✅ 生产就绪

---

## 🚀 快速部署步骤

### 1. 解压项目文件
```bash
unzip project-release.zip
cd project-directory
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
编辑 `.env` 文件，设置你的 MongoDB 数据库连接：
```
MONGODB_URI=mongodb://localhost:27017/groupbuy_system
JWT_SECRET=your-secret-key
PORT=3000
```

### 4. 启动服务
```bash
npm start
```

### 5. 访问系统
- **用户端：** http://localhost:3000
- **管理端：** http://localhost:3000/admin

---

## 👤 默认管理员账户

### 超级管理员
- **用户名：** superadmin
- **密码：** admin123
- **昵称：** 超级管理员

### 团队负责人
- **用户名：** teamleader
- **密码：** leader123  
- **昵称：** 团队负责人

### 代理
- **用户名：** agent
- **密码：** agent123
- **昵称：** 代理

---

## 📚 重要文档

1. **COMPLETE_API_DOCUMENTATION.md** - 完整API文档
2. **DEPLOYMENT_GUIDE.md** - 详细部署指南
3. **PROJECT_FINAL_SUMMARY.md** - 项目功能总结

---

## 🔧 技术特性

- ✅ 三级管理员权限系统
- ✅ 用户拼团抢购功能
- ✅ 实时开奖通知
- ✅ 邀请推广系统
- ✅ 签到奖励机制
- ✅ 财务管理系统
- ✅ 奖品兑换回收
- ✅ SPA单页面应用架构

---

**开发者：** MiniMax Agent  
**最后更新：** 2025-10-20 16:00:58
# 限时拼团抢购系统 - API接口概览

**版本:** 1.0.0  
**更新时间:** 2025-10-20  
**作者:** MiniMax Agent

## 🌟 系统概述

### 基础信息
- **Base URL:** `http://your-server-ip/api`
- **数据格式:** JSON
- **认证方式:** JWT Bearer Token
- **字符编码:** UTF-8

### 通用响应格式
```json
{
  "success": true|false,
  "message": "响应消息",
  "data": {} // 成功时包含具体数据
}
```

---

## 🔐 认证系统 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 用户注册 | POST | `/auth/register` | 新用户注册，支持推荐码 |
| 用户登录 | POST | `/auth/login` | 用户登录获取Token |
| 刷新令牌 | POST | `/auth/refresh` | 刷新JWT令牌 |
| 管理员登录 | POST | `/admin/login` | 管理员登录 |

### 用户注册示例
```json
// 请求
{
  "username": "testuser",
  "email": "test@example.com", 
  "phone": "13800138000",
  "password": "password123",
  "referralCode": "ABC123"  // 可选
}

// 响应
{
  "success": true,
  "data": {
    "user": { /* 用户信息 */ },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 👤 用户管理 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取用户信息 | GET | `/users/profile` | 获取当前用户详细信息 |
| 更新用户信息 | PUT | `/users/profile` | 更新用户资料 |
| 获取余额记录 | GET | `/users/balance-records` | 余额变动历史 |
| 获取分红记录 | GET | `/users/dividends` | 分红收益记录 |
| 获取团队信息 | GET | `/users/team` | 团队成员和业绩 |
| 用户充值 | POST | `/users/recharge` | 用户账户充值 |

---

## 🎯 拼团活动 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取活动列表 | GET | `/activities` | 所有进行中的拼团活动 |
| 获取活动详情 | GET | `/activities/:id` | 单个活动详细信息 |
| 参与拼团 | POST | `/activities/:id/participate` | 参与指定活动 |
| 获取参与记录 | GET | `/activities/my-participations` | 我的参与记录 |
| 开奖处理 | POST | `/activities/:id/draw` | 活动开奖（系统调用） |

### 参与拼团示例
```json
// 请求
{
  "participationCount": 10,  // 参与次数
  "paymentMethod": "balance" // 支付方式
}

// 响应  
{
  "success": true,
  "data": {
    "participationId": "participation_id",
    "remainingBalance": 1500.00,
    "numbers": [1, 15, 23, 45, 67, 89, 92, 156, 234, 567]
  }
}
```

---

## 📦 产品管理 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取产品列表 | GET | `/products` | 所有产品信息 |
| 获取产品详情 | GET | `/products/:id` | 单个产品详情 |
| 创建产品 | POST | `/products` | 创建新产品（管理员） |
| 更新产品 | PUT | `/products/:id` | 更新产品信息（管理员） |
| 删除产品 | DELETE | `/products/:id` | 删除产品（管理员） |

---

## 🎁 奖品管理 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取奖品列表 | GET | `/prizes` | 所有奖品信息 |
| 获取中奖记录 | GET | `/prizes/winners` | 中奖历史记录 |
| 发放奖品 | POST | `/prizes/:id/distribute` | 发放奖品（管理员） |
| 奖品配置 | POST | `/prizes/config` | 配置奖品规则（管理员） |

---

## 💰 财务管理 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取财务报表 | GET | `/finance/reports` | 财务数据统计 |
| 分红计算 | POST | `/finance/calculate-dividends` | 计算团队分红 |
| 分红发放 | POST | `/finance/distribute-dividends` | 发放分红（管理员） |
| 提现申请 | POST | `/finance/withdrawal` | 用户提现申请 |
| 提现审核 | PUT | `/finance/withdrawal/:id` | 提现审核（管理员） |

---

## ✅ 签到系统 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 每日签到 | POST | `/checkin/daily` | 用户每日签到 |
| 获取签到记录 | GET | `/checkin/records` | 签到历史记录 |
| 签到奖励配置 | GET | `/checkin/rewards` | 签到奖励规则 |

---

## 🎫 兑换码系统 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 兑换码使用 | POST | `/redemption/redeem` | 使用兑换码 |
| 生成兑换码 | POST | `/redemption/generate` | 生成兑换码（管理员） |
| 兑换记录 | GET | `/redemption/records` | 兑换历史记录 |

---

## 🔧 管理员专用 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 用户管理 | GET/POST/PUT/DELETE | `/admin/users/*` | 用户增删改查 |
| 活动管理 | GET/POST/PUT/DELETE | `/admin/activities/*` | 活动管理 |
| 系统设置 | GET/PUT | `/admin/settings` | 系统参数配置 |
| 数据统计 | GET | `/admin/statistics` | 各类数据统计 |
| 权限管理 | GET/POST/PUT | `/admin/permissions` | 管理员权限配置 |

---

## 📊 实时通信 (WebSocket)

### 连接地址
```
ws://your-server-ip:3000/socket.io/
```

### 事件类型
| 事件名 | 说明 | 数据格式 |
|--------|------|----------|
| `activity_update` | 活动状态更新 | `{activityId, status, participantCount}` |
| `draw_result` | 开奖结果推送 | `{activityId, winners, results}` |
| `balance_change` | 余额变动通知 | `{userId, newBalance, changeAmount}` |

---

## ⚠️ 错误码说明

| 错误码 | HTTP状态 | 说明 |
|--------|----------|------|
| 10001 | 400 | 参数错误 |
| 10002 | 401 | 未登录或token无效 |
| 10003 | 403 | 权限不足 |
| 10004 | 404 | 资源不存在 |
| 20001 | 400 | 余额不足 |
| 20002 | 400 | 活动已结束 |
| 20003 | 400 | 超出参与限制 |
| 30001 | 500 | 系统内部错误 |

---

## 🚀 快速开始示例

### 1. 用户注册登录
```bash
# 注册
curl -X POST http://your-server/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","phone":"13800138000","password":"123456"}'

# 登录
curl -X POST http://your-server/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test","password":"123456"}'
```

### 2. 获取活动列表
```bash
curl -X GET http://your-server/api/activities \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. 参与拼团活动
```bash
curl -X POST http://your-server/api/activities/ACTIVITY_ID/participate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"participationCount":5,"paymentMethod":"balance"}'
```

---

## 📝 注意事项

1. **认证必需**: 除了注册和登录接口，其他接口都需要在请求头中包含有效的JWT token
2. **权限控制**: 管理员接口需要相应的管理员权限
3. **参数验证**: 所有请求参数都会进行严格验证
4. **频率限制**: 部分接口有调用频率限制，请合理使用
5. **WebSocket**: 实时功能需要建立WebSocket连接

---

## 📞 技术支持

如需更详细的API文档，请查看完整版本：<filepath>COMPLETE_API_DOCUMENTATION.md</filepath>

**联系方式:** MiniMax Agent 开发团队
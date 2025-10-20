# 限时拼团抢购系统 API 接口文档

## 📖 目录
- [认证接口](#认证接口)
- [用户接口](#用户接口)
- [拼团接口](#拼团接口)
- [签到接口](#签到接口)
- [充值提现接口](#充值提现接口)
- [奖品接口](#奖品接口)
- [管理员接口](#管理员接口)

---

## 🔐 认证接口

### 用户注册
```http
POST /api/auth/register
```

**请求参数：**
```json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "phone": "string",
  "referralCode": "string", // 可选
  "firstName": "string",
  "lastName": "string"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "_id": "userId",
      "username": "testuser",
      "email": "test@example.com",
      "balance": 0,
      "referralCode": "ABC123"
    },
    "token": "JWT_TOKEN"
  }
}
```

### 用户登录
```http
POST /api/auth/login
```

**请求参数：**
```json
{
  "login": "username_or_email",
  "password": "string"
}
```

### 获取当前用户信息
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

### 更新个人资料
```http
PUT /api/auth/profile
```
**Headers:** `Authorization: Bearer <token>`

**请求参数：**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "avatar": "string"
}
```

### 修改密码
```http
PUT /api/auth/password
```
**Headers:** `Authorization: Bearer <token>`

**请求参数：**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

---

## 👥 用户接口

### 获取用户资料
```http
GET /api/users/profile
```
**Headers:** `Authorization: Bearer <token>`

### 获取余额变动记录
```http
GET /api/users/balance-records
```
**Headers:** `Authorization: Bearer <token>`

**查询参数：**
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `type`: 记录类型 (recharge, withdrawal, commission, etc.)

### 获取分红记录
```http
GET /api/users/commission-records
```
**Headers:** `Authorization: Bearer <token>`

### 获取团队统计
```http
GET /api/users/team-stats
```
**Headers:** `Authorization: Bearer <token>`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "directReferrals": 15,
    "totalTeamSize": 156,
    "teamLevel": "银牌会员",
    "totalEarnings": 12500.00,
    "monthlyEarnings": 2800.00
  }
}
```

### 获取直推用户
```http
GET /api/users/direct-referrals
```
**Headers:** `Authorization: Bearer <token>`

---

## 🎯 拼团接口

### 获取活动列表
```http
GET /api/groupbuy/activities
```
**Headers:** `Authorization: Bearer <token>`

**查询参数：**
- `page`: 页码
- `limit`: 每页数量
- `status`: 活动状态 (active, completed, pending)
- `area`: 区域类型

**响应示例：**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "_id": "activityId",
        "title": "iPhone 15 Pro Max 拼团",
        "area": "52万区域",
        "participationFee": 100,
        "totalParticipants": 2580,
        "maxWinners": 5,
        "status": "active",
        "drawTime": "2025-10-21T10:00:00.000Z",
        "prizeInfo": {
          "name": "iPhone 15 Pro Max",
          "value": 8999,
          "image": "/images/iphone15.jpg"
        }
      }
    ],
    "pagination": {
      "current": 1,
      "pageSize": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### 获取活动详情
```http
GET /api/groupbuy/activities/:id
```
**Headers:** `Authorization: Bearer <token>`

### 参与活动
```http
POST /api/groupbuy/activities/:id/participate
```
**Headers:** `Authorization: Bearer <token>`

**响应示例：**
```json
{
  "success": true,
  "message": "参与成功",
  "data": {
    "newBalance": 2400.00,
    "participationFee": 100,
    "participationId": "participationId"
  }
}
```

### 获取参与记录
```http
GET /api/groupbuy/participations
```
**Headers:** `Authorization: Bearer <token>`

### 处理中奖结果
```http
POST /api/groupbuy/participations/:id/handle
```
**Headers:** `Authorization: Bearer <token>`

**请求参数：**
```json
{
  "choice": "delivery" // 或 "recycle"
}
```

### 获取开奖结果
```http
GET /api/groupbuy/draw-results
```
**Headers:** `Authorization: Bearer <token>`

### 获取统计信息
```http
GET /api/groupbuy/stats
```
**Headers:** `Authorization: Bearer <token>`

---

## 📅 签到接口

### 获取签到状态
```http
GET /api/signin/status
```
**Headers:** `Authorization: Bearer <token>`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "hasSignedToday": false,
    "currentStreak": 5,
    "totalSignins": 45,
    "nextReward": 10.00,
    "streakBonus": 2.0
  }
}
```

### 执行签到
```http
POST /api/signin/do
```
**Headers:** `Authorization: Bearer <token>`

**响应示例：**
```json
{
  "success": true,
  "message": "签到成功",
  "data": {
    "reward": 12.00,
    "newBalance": 2512.00,
    "streak": 6,
    "nextReward": 10.00
  }
}
```

### 获取签到记录
```http
GET /api/signin/records
```
**Headers:** `Authorization: Bearer <token>`

---

## 💰 充值提现接口

### 创建充值订单
```http
POST /api/recharge/create
```
**Headers:** `Authorization: Bearer <token>`

**请求参数：**
```json
{
  "amount": 1000,
  "method": "bank_transfer", // 或 "online_payment"
  "bankAccount": "accountId" // 银行转账时必需
}
```

### 获取充值记录
```http
GET /api/recharge/records
```
**Headers:** `Authorization: Bearer <token>`

### 提交充值凭证
```http
POST /api/recharge/:id/submit-proof
```
**Headers:** `Authorization: Bearer <token>`

**请求参数：**
```json
{
  "proofImage": "base64_image_data",
  "transactionRef": "BANK_REF_123",
  "remarks": "备注信息"
}
```

### 申请提现
```http
POST /api/withdrawal/create
```
**Headers:** `Authorization: Bearer <token>`

**请求参数：**
```json
{
  "amount": 500,
  "bankAccountId": "accountId",
  "password": "user_password"
}
```

### 获取提现记录
```http
GET /api/withdrawal/records
```
**Headers:** `Authorization: Bearer <token>`

---

## 🎁 奖品接口

### 获取我的奖品
```http
GET /api/prize/my-prizes
```
**Headers:** `Authorization: Bearer <token>`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "prizes": [
      {
        "_id": "prizeId",
        "prizeName": "iPhone 15 Pro Max",
        "prizeValue": 8999,
        "userChoice": "pending",
        "status": "pending",
        "wonAt": "2025-10-20T15:30:00.000Z",
        "activity": {
          "title": "iPhone拼团活动",
          "area": "52万区域"
        }
      }
    ]
  }
}
```

### 处理奖品选择
```http
POST /api/prize/:id/handle
```
**Headers:** `Authorization: Bearer <token>`

**请求参数：**
```json
{
  "choice": "delivery", // 或 "recycle"
  "deliveryInfo": { // 选择发货时必需
    "recipientName": "张三",
    "phone": "+86138****8888",
    "address": "详细地址",
    "city": "上海市",
    "province": "上海",
    "postalCode": "200000"
  }
}
```

---

## 🏦 银行账户接口

### 获取银行账户列表
```http
GET /api/bank-account/list
```
**Headers:** `Authorization: Bearer <token>`

### 添加银行账户
```http
POST /api/bank-account/add
```
**Headers:** `Authorization: Bearer <token>`

**请求参数：**
```json
{
  "bankName": "中国银行",
  "accountNumber": "6217****1234",
  "accountHolder": "张三",
  "branchName": "上海分行",
  "isDefault": true
}
```

### 设置默认账户
```http
PUT /api/bank-account/:id/set-default
```
**Headers:** `Authorization: Bearer <token>`

### 删除银行账户
```http
DELETE /api/bank-account/:id
```
**Headers:** `Authorization: Bearer <token>`

---

## 🎫 兑换码接口

### 使用兑换码
```http
POST /api/redemption/use
```
**Headers:** `Authorization: Bearer <token>`

**请求参数：**
```json
{
  "code": "GIFT2025ABC"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "兑换成功",
  "data": {
    "reward": 100.00,
    "newBalance": 2600.00,
    "codeType": "balance_bonus",
    "description": "新用户奖励"
  }
}
```

### 获取兑换记录
```http
GET /api/redemption/records
```
**Headers:** `Authorization: Bearer <token>`

---

## 🛠️ 管理员接口

### 管理员登录
```http
POST /api/admin/login
```

**请求参数：**
```json
{
  "username": "admin",
  "password": "admin_password"
}
```

### 获取仪表板数据
```http
GET /api/admin/dashboard
```
**Headers:** `Authorization: Bearer <admin_token>`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1250,
      "active": 856,
      "virtual": 50
    },
    "activities": {
      "total": 45,
      "active": 8,
      "completed": 37
    },
    "participations": {
      "total": 12580,
      "wins": 450,
      "winRate": "3.58"
    },
    "financial": {
      "totalAmount": 1258000
    }
  }
}
```

### 用户管理
```http
GET /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
```
**Headers:** `Authorization: Bearer <admin_token>`

### 活动管理
```http
POST /api/admin/activities      # 创建活动
PUT /api/admin/activities/:id   # 更新活动
DELETE /api/admin/activities/:id # 删除活动
POST /api/admin/activities/:id/draw # 执行开奖
```
**Headers:** `Authorization: Bearer <admin_token>`

### 创建活动示例
```http
POST /api/admin/activities
```

**请求参数：**
```json
{
  "title": "iPhone 15 Pro Max 拼团",
  "area": "52万区域",
  "participationFee": 100,
  "maxWinners": 5,
  "startTime": "2025-10-21T00:00:00.000Z",
  "endTime": "2025-10-21T23:59:59.000Z",
  "drawTime": "2025-10-22T10:00:00.000Z",
  "prizeInfo": {
    "name": "iPhone 15 Pro Max",
    "description": "全新未拆封",
    "value": 8999,
    "image": "/images/iphone15.jpg"
  },
  "cycleCount": 1
}
```

### 手动开奖
```http
POST /api/admin/activities/:id/draw
```
**Headers:** `Authorization: Bearer <admin_token>`

**请求参数：**
```json
{
  "adminPassword": "admin_password",
  "winnerIds": ["userId1", "userId2", "userId3"]
}
```

### 兑换码管理
```http
POST /api/admin/exchange-codes     # 创建兑换码
GET /api/admin/exchange-codes      # 获取兑换码列表
PUT /api/admin/exchange-codes/:id  # 更新兑换码
DELETE /api/admin/exchange-codes/:id # 删除兑换码
```
**Headers:** `Authorization: Bearer <admin_token>`

### 充值管理
```http
GET /api/admin/recharge-records    # 获取充值记录
POST /api/admin/recharge/:id/approve # 审核通过
POST /api/admin/recharge/:id/reject  # 审核拒绝
```
**Headers:** `Authorization: Bearer <admin_token>`

### 提现管理
```http
GET /api/admin/withdrawal-records   # 获取提现记录
POST /api/admin/withdrawal/:id/approve # 审核通过
POST /api/admin/withdrawal/:id/reject  # 审核拒绝
```
**Headers:** `Authorization: Bearer <admin_token>`

---

## 📊 响应状态码

- `200` - 成功
- `400` - 请求参数错误
- `401` - 未授权/登录过期
- `403` - 权限不足
- `404` - 资源不存在
- `500` - 服务器内部错误

## 🔒 认证机制

所有需要认证的接口都需要在请求头中包含 JWT Token：
```
Authorization: Bearer <your_jwt_token>
```

## 📝 错误响应格式

```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息" // 仅开发环境
}
```

## ⚡ Socket.io 实时事件

### 连接认证
```javascript
socket.emit('join', userId);
```

### 监听事件
- `balance_update` - 余额变动通知
- `commission_received` - 分红到账通知
- `withdrawal_completed` - 提现完成通知
- `activity_started` - 新活动开始通知
- `draw_completed` - 开奖结果通知

### 事件数据格式
```javascript
// 余额更新
socket.on('balance_update', (data) => {
  // data: { newBalance, change, reason }
});

// 分红通知
socket.on('commission_received', (data) => {
  // data: { amount, type, fromUser }
});
```

---

*API 文档版本: v1.0 | 最后更新: 2025-10-20*
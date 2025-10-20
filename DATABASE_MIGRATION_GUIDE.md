# 数据库迁移指南：从MongoDB到PostgreSQL

**版本:** 1.0.0  
**更新时间:** 2025-10-20  
**作者:** MiniMax Agent

---

## 🎯 迁移概述

本指南说明如何将限时拼团抢购系统从MongoDB迁移到PostgreSQL，以及为什么选择PostgreSQL作为新的数据库解决方案。

---

## 🤔 为什么选择PostgreSQL？

### MongoDB vs PostgreSQL 对比

| 特性 | MongoDB | PostgreSQL | 选择理由 |
|------|---------|------------|----------|
| **数据模型** | 文档型 (NoSQL) | 关系型 (SQL) | ✅ 拼团业务有复杂关系 |
| **数据一致性** | 最终一致性 | ACID事务 | ✅ 财务数据需要强一致性 |
| **查询能力** | 有限的聚合查询 | 强大的SQL查询 | ✅ 复杂统计分析需求 |
| **数据完整性** | 应用层控制 | 数据库层约束 | ✅ 减少数据错误风险 |
| **性能** | 读写性能好 | 查询优化更强 | ✅ 复杂查询性能更佳 |
| **扩展性** | 水平扩展容易 | 垂直扩展为主 | ⚖️ 业务规模适中 |
| **生态成熟度** | 相对较新 | 历史悠久 | ✅ 工具和资源更丰富 |

### PostgreSQL的具体优势

#### 1. **强大的关系型特性**
```sql
-- 支持复杂的外键关系
ALTER TABLE participations 
ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id);

-- 支持事务处理
BEGIN;
UPDATE users SET balance = balance - 100 WHERE id = 1;
INSERT INTO balance_records (user_id, amount, type) VALUES (1, -100, 'participation');
COMMIT;
```

#### 2. **丰富的数据类型**
```sql
-- 原生支持JSON/JSONB
permissions JSONB,
gallery_images JSONB,

-- 原生支持数组
numbers INTEGER[],
tags TEXT[],

-- 网络地址类型
last_login_ip INET,

-- 时间戳类型
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### 3. **强大的查询能力**
```sql
-- 复杂的统计查询
SELECT 
    u.username,
    COUNT(p.id) as total_participations,
    SUM(p.total_fee) as total_spending,
    AVG(p.total_fee) as avg_spending
FROM users u
LEFT JOIN participations p ON u.id = p.user_id
WHERE p.participated_at >= '2025-01-01'
GROUP BY u.id, u.username
HAVING COUNT(p.id) > 5
ORDER BY total_spending DESC;
```

---

## 📊 数据结构对比

### MongoDB集合 → PostgreSQL表

#### 用户数据
```javascript
// MongoDB Document
{
  _id: ObjectId("..."),
  username: "testuser",
  email: "test@example.com",
  balance: 1000.50,
  vipLevel: 1,
  referralCode: "ABC123",
  participationHistory: [
    { activityId: "...", amount: 100, date: "..." }
  ],
  createdAt: ISODate("...")
}
```

```sql
-- PostgreSQL表结构
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    vip_level INTEGER DEFAULT 0,
    referral_code VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 参与记录单独表
CREATE TABLE participations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_id INTEGER REFERENCES group_buy_activities(id),
    total_fee DECIMAL(15,2),
    participated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 数据关系优化

#### MongoDB（嵌套文档）
```javascript
{
  _id: "activity_001",
  title: "iPhone 15 Pro拼团",
  participants: [
    {
      userId: "user_001",
      numbers: [1, 15, 23],
      amount: 200
    },
    {
      userId: "user_002", 
      numbers: [45, 67],
      amount: 200
    }
  ]
}
```

#### PostgreSQL（规范化关系）
```sql
-- 活动表
CREATE TABLE group_buy_activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    participation_fee DECIMAL(15,2) NOT NULL
);

-- 参与表（独立管理）
CREATE TABLE participations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_id INTEGER REFERENCES group_buy_activities(id),
    numbers INTEGER[] NOT NULL,
    total_fee DECIMAL(15,2) NOT NULL
);
```

---

## 🔄 迁移策略

### 阶段1：数据导出
```bash
# 从MongoDB导出数据
mongoexport --db=groupbuy --collection=users --out=users.json
mongoexport --db=groupbuy --collection=activities --out=activities.json
mongoexport --db=groupbuy --collection=participations --out=participations.json
```

### 阶段2：数据转换
```python
# 数据转换脚本示例
import json
import psycopg2

def migrate_users():
    # 读取MongoDB导出的JSON
    with open('users.json', 'r') as f:
        users = [json.loads(line) for line in f]
    
    # 连接PostgreSQL
    conn = psycopg2.connect(
        host="localhost",
        database="groupbuy_system", 
        user="groupbuy_user",
        password="GroupBuy2025!"
    )
    cur = conn.cursor()
    
    for user in users:
        # 转换数据格式
        cur.execute("""
            INSERT INTO users (username, email, balance, vip_level, referral_code, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            user['username'],
            user['email'], 
            user.get('balance', 0),
            user.get('vipLevel', 0),
            user.get('referralCode'),
            user['createdAt']
        ))
    
    conn.commit()
    cur.close()
    conn.close()
```

### 阶段3：数据验证
```sql
-- 验证数据完整性
SELECT 
    (SELECT COUNT(*) FROM users) as user_count,
    (SELECT COUNT(*) FROM group_buy_activities) as activity_count,
    (SELECT COUNT(*) FROM participations) as participation_count;

-- 验证数据关系
SELECT COUNT(*) FROM participations p
LEFT JOIN users u ON p.user_id = u.id  
WHERE u.id IS NULL; -- 应该返回0
```

---

## ⚡ 性能优化

### 索引策略
```sql
-- 主要查询索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_participations_user_id ON participations(user_id);
CREATE INDEX idx_participations_activity_id ON participations(activity_id);
CREATE INDEX idx_balance_records_user_id ON balance_records(user_id);
CREATE INDEX idx_balance_records_created_at ON balance_records(created_at);

-- 复合索引优化
CREATE INDEX idx_participations_user_activity ON participations(user_id, activity_id);
CREATE INDEX idx_activities_status_time ON group_buy_activities(status, start_time);
```

### 查询优化
```sql
-- 使用视图简化复杂查询
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.username,
    u.balance,
    COUNT(p.id) as total_participations,
    COALESCE(SUM(p.total_fee), 0) as total_spending
FROM users u
LEFT JOIN participations p ON u.id = p.user_id
GROUP BY u.id, u.username, u.balance;
```

---

## 🔧 应用层修改

### 数据库连接配置
```javascript
// 旧的MongoDB连接
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/groupbuy');

// 新的PostgreSQL连接
const { Pool } = require('pg');
const pool = new Pool({
  user: 'groupbuy_user',
  host: 'localhost',
  database: 'groupbuy_system',
  password: 'GroupBuy2025!',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 查询语句改写
```javascript
// MongoDB查询
const users = await User.find({
  balance: { $gte: 1000 },
  vipLevel: { $in: [1, 2, 3] }
}).limit(10);

// PostgreSQL查询
const query = `
  SELECT * FROM users 
  WHERE balance >= $1 
  AND vip_level = ANY($2)
  LIMIT 10
`;
const users = await pool.query(query, [1000, [1, 2, 3]]);
```

### 事务处理
```javascript
// PostgreSQL事务示例
async function participateActivity(userId, activityId, count) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 扣除余额
    await client.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [participationFee * count, userId]
    );
    
    // 记录参与
    await client.query(
      'INSERT INTO participations (user_id, activity_id, participation_count, total_fee) VALUES ($1, $2, $3, $4)',
      [userId, activityId, count, participationFee * count]
    );
    
    // 记录余额变动
    await client.query(
      'INSERT INTO balance_records (user_id, type, amount, description) VALUES ($1, $2, $3, $4)',
      [userId, 'participation_fee', -participationFee * count, '参与拼团活动']
    );
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

---

## 📋 迁移检查清单

### 准备阶段
- [ ] 备份现有MongoDB数据
- [ ] 安装PostgreSQL 14
- [ ] 创建数据库和用户
- [ ] 执行表结构创建脚本

### 数据迁移
- [ ] 导出MongoDB集合数据
- [ ] 编写数据转换脚本
- [ ] 执行数据导入
- [ ] 验证数据完整性
- [ ] 检查数据关系约束

### 应用修改
- [ ] 更新数据库连接配置
- [ ] 重写查询语句
- [ ] 添加事务处理
- [ ] 更新错误处理
- [ ] 修改数据模型

### 测试验证
- [ ] 单元测试更新
- [ ] 集成测试执行
- [ ] 性能测试对比
- [ ] 功能完整性测试
- [ ] 压力测试验证

### 部署上线
- [ ] 更新部署脚本
- [ ] 配置生产环境
- [ ] 数据库性能调优
- [ ] 监控告警配置
- [ ] 回滚预案准备

---

## 🚨 注意事项

### 数据类型差异
- **ObjectId → SERIAL**: MongoDB的ObjectId转换为PostgreSQL的自增ID
- **ISODate → TIMESTAMP**: 时间格式标准化
- **嵌套对象 → JSONB**: 复杂对象使用JSONB存储
- **数组 → ARRAY**: 利用PostgreSQL原生数组类型

### 查询语法差异
- **聚合管道 → SQL JOIN**: 复杂查询使用SQL连接
- **$操作符 → SQL函数**: 查询操作符转换为SQL函数
- **文档查询 → 关系查询**: 查询思维转换

### 性能考虑
- **索引策略**: 重新设计索引策略
- **查询优化**: 利用PostgreSQL查询优化器
- **连接池**: 合理配置连接池大小
- **缓存策略**: 适当添加查询缓存

---

## 📈 预期收益

### 数据一致性提升
- **事务支持**: 确保财务数据完整性
- **外键约束**: 防止数据关系错误
- **检查约束**: 业务规则数据库层面控制

### 查询性能提升
- **复杂查询**: SQL查询能力更强
- **统计分析**: 原生支持复杂统计
- **索引优化**: 更精确的查询计划

### 开发效率提升
- **SQL标准**: 通用的查询语言
- **工具丰富**: 更多管理和监控工具
- **文档完善**: 更丰富的学习资源

### 运维成本降低
- **备份恢复**: 更成熟的备份策略
- **监控工具**: 丰富的监控方案
- **故障排查**: 更好的诊断工具

---

## 🎯 总结

从MongoDB迁移到PostgreSQL是一个明智的技术选择，特别是对于拼团抢购这种涉及复杂业务关系和财务数据的系统。PostgreSQL提供了：

- **更强的数据一致性保障**
- **更丰富的查询和分析能力** 
- **更成熟的生态系统**
- **更好的开发和运维体验**

迁移虽然需要一定的工作量，但长期来看将显著提升系统的稳定性、性能和可维护性。
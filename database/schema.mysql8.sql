-- 适配 MySQL 8：
-- 1) 将保留字 user 的表名使用反引号
-- 2) message 表补充 type 字段
-- 3) team 表补充 rebate_level1/2/3 字段

-- 用户表
CREATE TABLE `user` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account VARCHAR(32) NOT NULL,
  password VARCHAR(64) NOT NULL,
  nickname VARCHAR(32),
  invite_code VARCHAR(6) NOT NULL,
  inviter_id INT,
  team_id INT,
  balance DECIMAL(12,2) DEFAULT 0,
  is_vip TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 管理员表
CREATE TABLE admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account VARCHAR(32) NOT NULL,
  password VARCHAR(64) NOT NULL,
  nickname VARCHAR(32),
  level TINYINT NOT NULL DEFAULT 2, -- 0最高 1一级 2二级
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 奖品表
CREATE TABLE prize (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  value DECIMAL(12,2),
  recycle_rate DECIMAL(5,2),
  product_id INT,
  status VARCHAR(16),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 拼团表
CREATE TABLE `group` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32) NOT NULL,
  product_id INT,
  open_time DATETIME,
  group_count INT,
  status VARCHAR(16),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 拼团参与记录表
CREATE TABLE group_record (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT,
  user_id INT,
  is_winner TINYINT(1) DEFAULT 0,
  amount DECIMAL(12,2),
  ad_fee DECIMAL(12,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 财务表
CREATE TABLE finance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  type VARCHAR(16), -- 充值/提现/分红/返利/扣款
  amount DECIMAL(12,2),
  status VARCHAR(16),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 团队表
CREATE TABLE team (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32),
  leader_id INT,
  level VARCHAR(8), -- M1/M2/M3/M4
  bonus_rate DECIMAL(5,2),
  rebate_level1 DECIMAL(5,2) DEFAULT 0.5,
  rebate_level2 DECIMAL(5,2) DEFAULT 1.0,
  rebate_level3 DECIMAL(5,2) DEFAULT 2.0,
  member_count INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 产品表
CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64),
  image VARCHAR(128),
  group_count INT,
  open_time DATETIME,
  status VARCHAR(16),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 消息表
CREATE TABLE message (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(64),
  content TEXT,
  type VARCHAR(16) DEFAULT 'marquee',
  is_read TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 抽奖区域配置表
CREATE TABLE lottery_zone (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  group_size INT DEFAULT 100,
  prize_value DECIMAL(12,2),
  prize_name VARCHAR(64),
  recycle_rate DECIMAL(5,2) DEFAULT 80.00,
  ad_fee_rate DECIMAL(5,4) DEFAULT 0.3000,
  status VARCHAR(16) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认抽奖区域
INSERT INTO lottery_zone (name, amount, group_size, prize_value, prize_name, recycle_rate, ad_fee_rate) VALUES
('10K区', 100.00, 100, 10000.00, 'iPhone 15 Pro', 80.00, 0.3000),
('30K区', 300.00, 100, 30000.00, 'MacBook Air', 80.00, 0.5000),
('80K区', 800.00, 100, 80000.00, 'MacBook Pro 16"', 80.00, 1.0000),
('150K区', 1500.00, 100, 150000.00, '劳力士手表', 80.00, 2.0000),
('300K区', 3000.00, 100, 300000.00, '奔驰C级', 80.00, 5.0000),
('600K区', 6000.00, 100, 600000.00, '宝马5系', 80.00, 10.0000),
('1M区', 10000.00, 100, 1000000.00, '奔驰S级', 80.00, 20.0000);

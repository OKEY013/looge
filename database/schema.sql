-- 用户表
CREATE TABLE user (
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
  member_count INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  rebate_level1 DECIMAL(5,2) DEFAULT 0.5,
  rebate_level2 DECIMAL(5,2) DEFAULT 1.0,
  rebate_level3 DECIMAL(5,2) DEFAULT 2.0
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
  is_read TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(16) DEFAULT 'marquee'
);

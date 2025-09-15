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

-- 轮播图表
CREATE TABLE carousel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(64),
  image_url VARCHAR(255) NOT NULL,
  link_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  status TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 钱包交易记录表
CREATE TABLE wallet_transaction (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('recharge', 'withdraw', 'commission', 'refund', 'prize', 'fee') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  balance_before DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  transaction_id VARCHAR(64),
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 邀请码表
CREATE TABLE invite_code (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(6) UNIQUE NOT NULL,
  user_id INT,
  is_used TINYINT(1) DEFAULT 0,
  used_by INT,
  used_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 三级返利记录表
CREATE TABLE commission_record (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  from_user_id INT NOT NULL,
  level TINYINT NOT NULL, -- 1, 2, 3
  amount DECIMAL(12,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  source_amount DECIMAL(12,2) NOT NULL,
  source_type ENUM('group_purchase', 'recharge') NOT NULL,
  status ENUM('pending', 'paid') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME
);

-- VIP分红记录表
CREATE TABLE vip_dividend (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  period VARCHAR(16) NOT NULL, -- 分红期间，如 2024-01
  amount DECIMAL(12,2) NOT NULL,
  total_profit DECIMAL(12,2) NOT NULL, -- 总利润
  vip_count INT NOT NULL, -- VIP人数
  status ENUM('pending', 'paid') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME
);

-- 物流信息表
CREATE TABLE shipping (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  prize_id INT NOT NULL,
  recipient_name VARCHAR(32) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  tracking_number VARCHAR(64),
  shipping_status ENUM('pending', 'shipped', 'delivered', 'returned') DEFAULT 'pending',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 奖品领取记录表
CREATE TABLE prize_claim (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  group_record_id INT NOT NULL,
  prize_id INT NOT NULL,
  claim_type ENUM('shipping', 'recycle') NOT NULL,
  recycle_amount DECIMAL(12,2), -- 回收金额（80%）
  shipping_id INT, -- 物流信息ID
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 系统配置表
CREATE TABLE system_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(64) UNIQUE NOT NULL,
  config_value TEXT,
  description VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE `user` ADD CONSTRAINT fk_user_inviter FOREIGN KEY (inviter_id) REFERENCES `user`(id);
ALTER TABLE `user` ADD CONSTRAINT fk_user_team FOREIGN KEY (team_id) REFERENCES team(id);
ALTER TABLE group_record ADD CONSTRAINT fk_group_record_group FOREIGN KEY (group_id) REFERENCES `group`(id);
ALTER TABLE group_record ADD CONSTRAINT fk_group_record_user FOREIGN KEY (user_id) REFERENCES `user`(id);
ALTER TABLE finance ADD CONSTRAINT fk_finance_user FOREIGN KEY (user_id) REFERENCES `user`(id);
ALTER TABLE team ADD CONSTRAINT fk_team_leader FOREIGN KEY (leader_id) REFERENCES `user`(id);
ALTER TABLE `group` ADD CONSTRAINT fk_group_product FOREIGN KEY (product_id) REFERENCES product(id);
ALTER TABLE message ADD CONSTRAINT fk_message_user FOREIGN KEY (user_id) REFERENCES `user`(id);
ALTER TABLE wallet_transaction ADD CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES `user`(id);
ALTER TABLE invite_code ADD CONSTRAINT fk_invite_user FOREIGN KEY (user_id) REFERENCES `user`(id);
ALTER TABLE invite_code ADD CONSTRAINT fk_invite_used_by FOREIGN KEY (used_by) REFERENCES `user`(id);
ALTER TABLE commission_record ADD CONSTRAINT fk_commission_user FOREIGN KEY (user_id) REFERENCES `user`(id);
ALTER TABLE commission_record ADD CONSTRAINT fk_commission_from_user FOREIGN KEY (from_user_id) REFERENCES `user`(id);
ALTER TABLE vip_dividend ADD CONSTRAINT fk_dividend_user FOREIGN KEY (user_id) REFERENCES `user`(id);
ALTER TABLE shipping ADD CONSTRAINT fk_shipping_user FOREIGN KEY (user_id) REFERENCES `user`(id);
ALTER TABLE shipping ADD CONSTRAINT fk_shipping_prize FOREIGN KEY (prize_id) REFERENCES prize(id);
ALTER TABLE prize_claim ADD CONSTRAINT fk_claim_user FOREIGN KEY (user_id) REFERENCES `user`(id);
ALTER TABLE prize_claim ADD CONSTRAINT fk_claim_group_record FOREIGN KEY (group_record_id) REFERENCES group_record(id);
ALTER TABLE prize_claim ADD CONSTRAINT fk_claim_prize FOREIGN KEY (prize_id) REFERENCES prize(id);
ALTER TABLE prize_claim ADD CONSTRAINT fk_claim_shipping FOREIGN KEY (shipping_id) REFERENCES shipping(id);

-- 添加索引优化性能
CREATE INDEX idx_user_invite_code ON `user`(invite_code);
CREATE INDEX idx_user_inviter_id ON `user`(inviter_id);
CREATE INDEX idx_group_record_group_id ON group_record(group_id);
CREATE INDEX idx_group_record_user_id ON group_record(user_id);
CREATE INDEX idx_wallet_transaction_user_id ON wallet_transaction(user_id);
CREATE INDEX idx_wallet_transaction_type ON wallet_transaction(type);
CREATE INDEX idx_commission_user_id ON commission_record(user_id);
CREATE INDEX idx_commission_from_user_id ON commission_record(from_user_id);
CREATE INDEX idx_message_user_id ON message(user_id);
CREATE INDEX idx_message_type ON message(type);

-- 插入初始化数据
INSERT INTO system_config (config_key, config_value, description) VALUES
('commission_level1_rate', '0.5', '一级返利比例(%)'),
('commission_level2_rate', '1.0', '二级返利比例(%)'),
('commission_level3_rate', '2.0', '三级返利比例(%)'),
('prize_recycle_rate', '80', '奖品回收比例(%)'),
('refund_fee_rate', '0.3', '退款手续费比例(%)'),
('vip_threshold', '1000', 'VIP门槛金额'),
('group_duration', '60', '拼团时长(分钟)'),
('group_progress_step', '5', '进度条每分钟增长百分比');

-- 插入默认管理员账户 (密码: admin123)
INSERT INTO admin (account, password, nickname, level) VALUES
('admin', '$2a$10$D8YlPb4YQa8QfLWf.D1E3u8PxL9KcZLxGfD8yHd1fD2dF7sA5kJ9C', '系统管理员', 0);

-- 插入测试奖品数据
INSERT INTO prize (name, value, recycle_rate, status) VALUES
('iPhone 15 Pro', 10000.00, 80.00, 'active'),
('MacBook Air M2', 30000.00, 80.00, 'active'),
('Tesla Model 3 配件包', 80000.00, 80.00, 'active'),
('劳力士手表', 150000.00, 80.00, 'active'),
('奔驰C级轿车首付', 300000.00, 80.00, 'active'),
('BMW X5 首付', 600000.00, 80.00, 'active'),
('海景别墅首付', 1000000.00, 80.00, 'active');

-- 插入测试产品数据
INSERT INTO product (name, image, group_count, status) VALUES
('10000区', '/images/iphone15pro.jpg', 60, 'active'),
('30000区', '/images/macbook.jpg', 60, 'active'),
('80000区', '/images/tesla.jpg', 60, 'active'),
('150000区', '/images/rolex.jpg', 60, 'active'),
('300000区', '/images/benz.jpg', 60, 'active'),
('600000区', '/images/bmw.jpg', 60, 'active'),
('1000000区', '/images/villa.jpg', 60, 'active');

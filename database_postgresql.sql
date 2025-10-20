-- ================================================================
-- 限时拼团抢购系统 PostgreSQL 数据库设计
-- 版本: 1.0.0
-- 作者: MiniMax Agent
-- 创建时间: 2025-10-20
-- ================================================================

-- 删除已存在的数据库和用户（如果存在）
DROP DATABASE IF EXISTS groupbuy_system;
DROP USER IF EXISTS groupbuy_user;

-- 创建数据库用户
CREATE USER groupbuy_user WITH PASSWORD 'GroupBuy2025!';

-- 创建数据库
CREATE DATABASE groupbuy_system 
    WITH OWNER = groupbuy_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'zh_CN.UTF-8'
    LC_CTYPE = 'zh_CN.UTF-8'
    TEMPLATE = template0;

-- 连接到新创建的数据库
\c groupbuy_system;

-- 给用户授权
GRANT ALL PRIVILEGES ON DATABASE groupbuy_system TO groupbuy_user;

-- ================================================================
-- 1. 用户表 (users)
-- ================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(50) NOT NULL,
    
    -- 用户基本信息
    nickname VARCHAR(100),
    avatar_url TEXT,
    real_name VARCHAR(50),
    id_card VARCHAR(18),
    
    -- 财务信息
    balance DECIMAL(15,2) DEFAULT 0.00,
    frozen_balance DECIMAL(15,2) DEFAULT 0.00,
    total_recharge DECIMAL(15,2) DEFAULT 0.00,
    total_withdrawal DECIMAL(15,2) DEFAULT 0.00,
    
    -- VIP等级
    vip_level INTEGER DEFAULT 0,
    vip_expire_at TIMESTAMP,
    
    -- 推荐系统
    referral_code VARCHAR(20) UNIQUE,
    parent_user_id INTEGER,
    referral_path TEXT, -- 推荐路径，格式：1,5,23
    
    -- 统计信息
    total_participations INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    
    -- 状态字段
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, banned
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- 时间字段
    last_login_at TIMESTAMP,
    last_login_ip INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (parent_user_id) REFERENCES users(id)
);

-- 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_parent_user_id ON users(parent_user_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ================================================================
-- 2. 管理员表 (admins)
-- ================================================================
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(50) NOT NULL,
    
    -- 管理员信息
    nickname VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    
    -- 权限等级
    role VARCHAR(20) NOT NULL, -- super_admin, team_leader, agent
    parent_admin_id INTEGER,
    
    -- 权限配置（JSON格式）
    permissions JSONB,
    
    -- 状态
    status VARCHAR(20) DEFAULT 'active', -- active, suspended
    
    -- 时间字段
    last_login_at TIMESTAMP,
    last_login_ip INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (parent_admin_id) REFERENCES admins(id)
);

-- 管理员表索引
CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_role ON admins(role);
CREATE INDEX idx_admins_parent_admin_id ON admins(parent_admin_id);

-- ================================================================
-- 3. 产品表 (products)
-- ================================================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    
    -- 产品基本信息
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    
    -- 产品图片
    main_image_url TEXT,
    gallery_images JSONB, -- 产品图片数组
    
    -- 产品价值
    market_price DECIMAL(15,2) NOT NULL,
    cost_price DECIMAL(15,2),
    
    -- 产品属性
    specifications JSONB, -- 产品规格参数
    tags TEXT[], -- 产品标签数组
    
    -- 库存管理
    stock_quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0, -- 预留库存
    
    -- 状态
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, out_of_stock
    
    -- 时间字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 产品表索引
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at);

-- ================================================================
-- 4. 拼团活动表 (group_buy_activities)
-- ================================================================
CREATE TABLE group_buy_activities (
    id SERIAL PRIMARY KEY,
    
    -- 活动基本信息
    title VARCHAR(200) NOT NULL,
    description TEXT,
    product_id INTEGER NOT NULL,
    
    -- 活动配置
    participation_fee DECIMAL(15,2) NOT NULL, -- 参团费用
    max_participants INTEGER NOT NULL, -- 最大参与人数
    min_participants INTEGER DEFAULT 10, -- 最少开奖人数
    
    -- 中奖配置
    winner_count INTEGER NOT NULL, -- 中奖人数
    prize_distribution JSONB, -- 奖品分配规则
    
    -- 时间配置
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    draw_time TIMESTAMP, -- 开奖时间
    
    -- 活动状态
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, drawing, completed, cancelled
    current_participants INTEGER DEFAULT 0,
    
    -- 开奖结果
    winning_numbers INTEGER[],
    draw_result JSONB, -- 开奖详细结果
    
    -- 创建信息
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (created_by) REFERENCES admins(id)
);

-- 拼团活动表索引
CREATE INDEX idx_activities_product_id ON group_buy_activities(product_id);
CREATE INDEX idx_activities_status ON group_buy_activities(status);
CREATE INDEX idx_activities_start_time ON group_buy_activities(start_time);
CREATE INDEX idx_activities_end_time ON group_buy_activities(end_time);

-- ================================================================
-- 5. 参与记录表 (participations)
-- ================================================================
CREATE TABLE participations (
    id SERIAL PRIMARY KEY,
    
    -- 关联信息
    user_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    
    -- 参与详情
    participation_count INTEGER NOT NULL, -- 参与次数
    numbers INTEGER[] NOT NULL, -- 参与号码数组
    total_fee DECIMAL(15,2) NOT NULL, -- 总费用
    
    -- 支付信息
    payment_method VARCHAR(20) NOT NULL, -- balance, wechat, alipay
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_transaction_id VARCHAR(100),
    
    -- 中奖信息
    is_winner BOOLEAN DEFAULT FALSE,
    winning_numbers INTEGER[], -- 中奖号码
    prize_value DECIMAL(15,2),
    prize_status VARCHAR(20), -- pending, distributed, received
    
    -- 时间字段
    participated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_at TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (activity_id) REFERENCES group_buy_activities(id)
);

-- 参与记录表索引
CREATE INDEX idx_participations_user_id ON participations(user_id);
CREATE INDEX idx_participations_activity_id ON participations(activity_id);
CREATE INDEX idx_participations_is_winner ON participations(is_winner);
CREATE INDEX idx_participations_participated_at ON participations(participated_at);

-- ================================================================
-- 6. 余额变动记录表 (balance_records)
-- ================================================================
CREATE TABLE balance_records (
    id SERIAL PRIMARY KEY,
    
    -- 用户信息
    user_id INTEGER NOT NULL,
    
    -- 变动信息
    type VARCHAR(50) NOT NULL, -- recharge, withdrawal, participation_fee, winning_prize, dividend, refund
    amount DECIMAL(15,2) NOT NULL, -- 正数为收入，负数为支出
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    
    -- 描述信息
    description TEXT,
    reference_type VARCHAR(50), -- participation, activity, withdrawal
    reference_id INTEGER,
    
    -- 时间字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 余额变动记录表索引
CREATE INDEX idx_balance_records_user_id ON balance_records(user_id);
CREATE INDEX idx_balance_records_type ON balance_records(type);
CREATE INDEX idx_balance_records_created_at ON balance_records(created_at);

-- ================================================================
-- 7. 分红记录表 (dividend_records)
-- ================================================================
CREATE TABLE dividend_records (
    id SERIAL PRIMARY KEY,
    
    -- 分红信息
    user_id INTEGER NOT NULL,
    dividend_type VARCHAR(50) NOT NULL, -- direct_referral, team_performance, vip_bonus
    amount DECIMAL(15,2) NOT NULL,
    
    -- 来源信息
    source_user_id INTEGER, -- 分红来源用户
    source_activity_id INTEGER, -- 来源活动
    calculation_detail JSONB, -- 计算详情
    
    -- 分红周期
    period_start DATE,
    period_end DATE,
    
    -- 状态
    status VARCHAR(20) DEFAULT 'pending', -- pending, distributed, cancelled
    distributed_at TIMESTAMP,
    
    -- 时间字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (source_user_id) REFERENCES users(id),
    FOREIGN KEY (source_activity_id) REFERENCES group_buy_activities(id)
);

-- 分红记录表索引
CREATE INDEX idx_dividend_records_user_id ON dividend_records(user_id);
CREATE INDEX idx_dividend_records_type ON dividend_records(dividend_type);
CREATE INDEX idx_dividend_records_period ON dividend_records(period_start, period_end);

-- ================================================================
-- 8. 签到记录表 (checkin_records)
-- ================================================================
CREATE TABLE checkin_records (
    id SERIAL PRIMARY KEY,
    
    -- 用户信息
    user_id INTEGER NOT NULL,
    
    -- 签到信息
    checkin_date DATE NOT NULL,
    consecutive_days INTEGER DEFAULT 1,
    
    -- 奖励信息
    reward_type VARCHAR(50), -- balance, vip_days, points
    reward_amount DECIMAL(15,2),
    reward_description TEXT,
    
    -- 时间字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (user_id) REFERENCES users(id),
    
    -- 唯一约束
    UNIQUE(user_id, checkin_date)
);

-- 签到记录表索引
CREATE INDEX idx_checkin_records_user_id ON checkin_records(user_id);
CREATE INDEX idx_checkin_records_date ON checkin_records(checkin_date);

-- ================================================================
-- 9. 兑换码表 (redemption_codes)
-- ================================================================
CREATE TABLE redemption_codes (
    id SERIAL PRIMARY KEY,
    
    -- 兑换码信息
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- balance, vip_days, product
    
    -- 奖励配置
    reward_value DECIMAL(15,2),
    reward_description TEXT,
    reward_config JSONB,
    
    -- 使用限制
    max_uses INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    expire_at TIMESTAMP,
    
    -- 状态
    status VARCHAR(20) DEFAULT 'active', -- active, expired, exhausted
    
    -- 创建信息
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (created_by) REFERENCES admins(id)
);

-- 兑换码表索引
CREATE INDEX idx_redemption_codes_code ON redemption_codes(code);
CREATE INDEX idx_redemption_codes_status ON redemption_codes(status);
CREATE INDEX idx_redemption_codes_expire_at ON redemption_codes(expire_at);

-- ================================================================
-- 10. 兑换记录表 (redemption_records)
-- ================================================================
CREATE TABLE redemption_records (
    id SERIAL PRIMARY KEY,
    
    -- 关联信息
    user_id INTEGER NOT NULL,
    redemption_code_id INTEGER NOT NULL,
    
    -- 兑换信息
    redeemed_value DECIMAL(15,2),
    description TEXT,
    
    -- 时间字段
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (redemption_code_id) REFERENCES redemption_codes(id)
);

-- 兑换记录表索引
CREATE INDEX idx_redemption_records_user_id ON redemption_records(user_id);
CREATE INDEX idx_redemption_records_code_id ON redemption_records(redemption_code_id);
CREATE INDEX idx_redemption_records_redeemed_at ON redemption_records(redeemed_at);

-- ================================================================
-- 11. 提现申请表 (withdrawal_requests)
-- ================================================================
CREATE TABLE withdrawal_requests (
    id SERIAL PRIMARY KEY,
    
    -- 用户信息
    user_id INTEGER NOT NULL,
    
    -- 提现信息
    amount DECIMAL(15,2) NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    actual_amount DECIMAL(15,2) NOT NULL, -- 实际到账金额
    
    -- 提现方式
    withdrawal_method VARCHAR(50) NOT NULL, -- bank_card, alipay, wechat
    account_info JSONB NOT NULL, -- 账户信息（加密存储）
    
    -- 审核信息
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, completed
    reviewer_id INTEGER,
    review_note TEXT,
    reviewed_at TIMESTAMP,
    
    -- 处理信息
    processed_at TIMESTAMP,
    transaction_id VARCHAR(100),
    
    -- 时间字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reviewer_id) REFERENCES admins(id)
);

-- 提现申请表索引
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_withdrawal_requests_created_at ON withdrawal_requests(created_at);

-- ================================================================
-- 12. 系统设置表 (system_settings)
-- ================================================================
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    
    -- 设置信息
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    
    -- 描述信息
    title VARCHAR(200),
    description TEXT,
    category VARCHAR(100),
    
    -- 是否可编辑
    is_editable BOOLEAN DEFAULT TRUE,
    
    -- 时间字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 系统设置表索引
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_category ON system_settings(category);

-- ================================================================
-- 13. 系统日志表 (system_logs)
-- ================================================================
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    
    -- 日志信息
    level VARCHAR(20) NOT NULL, -- info, warning, error
    action VARCHAR(100) NOT NULL,
    message TEXT,
    details JSONB,
    
    -- 用户信息
    user_id INTEGER,
    admin_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    
    -- 时间字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- 系统日志表索引
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_action ON system_logs(action);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);

-- ================================================================
-- 权限设置
-- ================================================================

-- 给用户授予所有表的权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO groupbuy_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO groupbuy_user;

-- ================================================================
-- 插入初始数据
-- ================================================================

-- 插入系统设置
INSERT INTO system_settings (setting_key, setting_value, setting_type, title, description, category) VALUES
('system_name', '限时拼团抢购系统', 'string', '系统名称', '系统显示名称', '基本设置'),
('min_withdrawal_amount', '100.00', 'number', '最小提现金额', '用户单次提现的最小金额', '财务设置'),
('withdrawal_fee_rate', '0.01', 'number', '提现手续费率', '提现手续费率（0.01 = 1%）', '财务设置'),
('max_daily_withdrawal', '10000.00', 'number', '每日最大提现额度', '用户每日最大提现金额', '财务设置'),
('referral_bonus_rate', '0.1', 'number', '推荐奖励比例', '直推奖励比例', '推荐设置'),
('team_bonus_rate', '0.05', 'number', '团队奖励比例', '团队业绩奖励比例', '推荐设置'),
('vip_upgrade_threshold', '10000.00', 'number', 'VIP升级门槛', 'VIP等级升级的消费门槛', 'VIP设置'),
('max_participation_per_activity', '100', 'number', '单活动最大参与次数', '用户单个活动最大参与次数', '活动设置');

-- 插入超级管理员
INSERT INTO admins (username, password_hash, salt, nickname, role, permissions) VALUES
('admin', '已加密的密码哈希', '随机盐值', '超级管理员', 'super_admin', '{"all": true}');

-- ================================================================
-- 创建视图
-- ================================================================

-- 用户统计视图
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.username,
    u.balance,
    u.total_participations,
    u.total_wins,
    u.total_earnings,
    u.vip_level,
    COUNT(DISTINCT p.id) as current_month_participations,
    COALESCE(SUM(p.total_fee), 0) as current_month_spending
FROM users u
LEFT JOIN participations p ON u.id = p.user_id 
    AND p.participated_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY u.id, u.username, u.balance, u.total_participations, u.total_wins, u.total_earnings, u.vip_level;

-- 活动统计视图
CREATE VIEW activity_statistics AS
SELECT 
    a.id,
    a.title,
    a.status,
    a.current_participants,
    a.max_participants,
    a.participation_fee,
    COALESCE(SUM(p.total_fee), 0) as total_revenue,
    COUNT(DISTINCT p.user_id) as unique_participants
FROM group_buy_activities a
LEFT JOIN participations p ON a.id = p.activity_id
GROUP BY a.id, a.title, a.status, a.current_participants, a.max_participants, a.participation_fee;

-- ================================================================
-- 创建触发器函数
-- ================================================================

-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加更新时间戳触发器
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_activities_updated_at
    BEFORE UPDATE ON group_buy_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- 完成提示
-- ================================================================
\echo '数据库创建完成！'
\echo '数据库名称: groupbuy_system'
\echo '用户名称: groupbuy_user'
\echo '表数量: 13个主表 + 2个视图'
\echo '请使用以下连接信息:'
\echo 'Host: localhost'
\echo 'Port: 5432'
\echo 'Database: groupbuy_system'
\echo 'Username: groupbuy_user'
\echo 'Password: GroupBuy2025!'
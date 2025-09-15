// 财务流水筛选与导出API
const { Parser } = require('json2csv');
exports.list = async (req, res) => {
  const { userId, type, status, start, end, exportCsv } = req.query;
  const where = {};
  if (userId) where.user_id = userId;
  if (type) where.type = type;
  if (status) where.status = status;
  if (start || end) where.created_at = {};
  if (start) where.created_at['$gte'] = new Date(start);
  if (end) where.created_at['$lte'] = new Date(end);
  const records = await Finance.findAll({ where, order: [['created_at', 'DESC']] });
  if (exportCsv === '1') {
    const parser = new Parser();
    const csv = parser.parse(records.map(r => r.toJSON()));
    res.header('Content-Type', 'text/csv');
    res.attachment('finance.csv');
    return res.send(csv);
  }
  res.json({ data: records });
};
const Finance = require('../models/finance');
const logger = require('../utils/logger');
const User = require('../models/user');

// 获取财务记录
exports.list = async (req, res) => {
  const userId = req.user.id;
  const records = await Finance.findAll({ where: { user_id: userId } });
  res.json({ data: records });
};

// 用户充值
exports.recharge = async (req, res) => {
  logger.action(`用户${userId}充值${amount}`);
  const userId = req.user.id;
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: '充值金额无效' });
  const user = await User.findByPk(userId);
  user.balance += amount;
  await user.save();
  await Finance.create({ user_id: userId, type: '充值', amount, status: '已到账' });
  res.json({ success: true, balance: user.balance });
};

// 用户提现（需审核，简化为直接扣款）
exports.withdraw = async (req, res) => {
  logger.action(`用户${userId}申请提现${amount}`);
  const userId = req.user.id;
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: '提现金额无效' });
  const user = await User.findByPk(userId);
  if (user.balance < amount) return res.status(400).json({ error: '余额不足' });
  user.balance -= amount;
  await user.save();
  await Finance.create({ user_id: userId, type: '提现', amount: -amount, status: '待审核' });
  res.json({ success: true, balance: user.balance });
};

// 分红发放（团队分红/推荐返利，管理员接口，简化为直接发放）
exports.bonus = async (req, res) => {
  const { userId, amount, type } = req.body;
  logger.action(`管理员发放分红/返利给用户${userId}，金额${amount}`);
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  user.balance += amount;
  await user.save();
  await Finance.create({ user_id: userId, type: type || '分红', amount, status: '已发放' });
  res.json({ success: true });
};

// 管理员删除财务记录
exports.delete = async (req, res) => {
  const { id } = req.body;
  logger.action(`管理员删除财务记录${id}`);
  const record = await Finance.findByPk(id);
  if (!record) return res.status(404).json({ error: '记录不存在' });
  await record.destroy();
  res.json({ success: true });
};

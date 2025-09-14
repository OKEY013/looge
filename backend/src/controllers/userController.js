const User = require('../models/user');
const { sign } = require('../utils/jwt');
const validate = require('../utils/validate');
const bcrypt = require('bcryptjs');

// 用户登录
exports.login = async (req, res) => {
  const { account, password } = req.body;
  const user = await User.findOne({ where: { account } });
  if (!user) return res.status(400).json({ error: '账号不存在' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: '密码错误' });
  const token = sign({ id: user.id, account: user.account });
  res.json({ token, data: user });
};

// 用户注册
exports.register = async (req, res) => {
  const regErr = validate.requireFields(req.body, ['account', 'password', 'inviteCode']);
  if (regErr) return res.status(400).json({ error: regErr });
  const loginErr = validate.requireFields(req.body, ['account', 'password']);
  if (loginErr) return res.status(400).json({ error: loginErr });
  const { account, password, inviteCode } = req.body;
  if (!/^[0-9]{6}$/.test(inviteCode)) return res.status(400).json({ error: '邀请码必须为6位数字' });
  const exist = await User.findOne({ where: { account } });
  if (exist) return res.status(400).json({ error: '账号已存在' });
  const hash = await bcrypt.hash(password, 10);
  await User.create({ account, password: hash, invite_code: inviteCode });
  res.json({ success: true });
};

// 获取用户信息
exports.profile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ data: user });
};

// VIP购买
exports.buyVIP = async (req, res) => {
  const vipErr = validate.requireFields(req.body, ['userId']);
  if (vipErr) return res.status(400).json({ error: vipErr });
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  user.is_vip = true;
  await user.save();
  res.json({ success: true, isVIP: true });
};

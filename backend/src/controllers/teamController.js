const User = require('../models/user');
const Finance = require('../models/finance');
// 团队成员列表
exports.memberList = async (req, res) => {
  const { teamId } = req.query;
  if (!teamId) return res.status(400).json({ error: '缺少teamId' });
  const members = await User.findAll({ where: { team_id: teamId }, order: [['created_at', 'DESC']] });
  res.json({ data: members });
};
// 团队分红统计
exports.bonusStat = async (req, res) => {
  const { teamId } = req.query;
  if (!teamId) return res.status(400).json({ error: '缺少teamId' });
  const members = await User.findAll({ where: { team_id: teamId } });
  const stat = [];
  for (const m of members) {
    const bonus = await Finance.sum('amount', { where: { user_id: m.id, type: '团队分红', status: '已发放' } });
    stat.push({ userId: m.id, account: m.account, nickname: m.nickname, bonus });
  }
  res.json({ data: stat });
};
const Team = require('../models/team');

exports.info = async (req, res) => {
  // TODO: 获取团队信息
  const teams = await Team.findAll();
  res.json({ data: teams });
};

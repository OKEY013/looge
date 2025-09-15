const Group = require('../models/group');
const logger = require('../utils/logger');
const GroupRecord = require('../models/group_record');
const User = require('../models/user');
const Prize = require('../models/prize');
const Finance = require('../models/finance');

// 获取拼团列表
exports.list = async (req, res) => {
  const groups = await Group.findAll();
  res.json({ data: groups });
};

// 用户参与拼团
exports.join = async (req, res) => {
  const userId = req.user.id;
  const { groupId } = req.body;
  logger.action(`用户${userId}参与拼团${groupId}`);
  const group = await Group.findByPk(groupId);
  if (!group) return res.status(404).json({ error: '拼团不存在' });
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  // 扣款（假设每次金额固定，实际可根据group配置）
  const amount = 9.9;
  if (user.balance < amount) return res.status(400).json({ error: '余额不足' });
  user.balance -= amount;
  await user.save();
  // 广告费（千分之3）
  const adFee = +(amount * 0.003).toFixed(2);
  // 记录参与
  await GroupRecord.create({ group_id: groupId, user_id: userId, amount, ad_fee: adFee });
  await Finance.create({ user_id: userId, type: '拼团', amount: -amount, status: '已扣款' });
  // 开奖逻辑：中奖人数模式
  // 查询本轮所有参与者
  const records = await GroupRecord.findAll({ where: { group_id: groupId } });
  // 中奖人数（可从group表配置，默认1人）
  const winnerCount = group.winner_count || 1;
    let popupMiss = [];
    let popupMissDetails = [];
  const specifiedWinners = group.specified_winners ? group.specified_winners.split(',') : [];
  let isWinner = false;
  if (specifiedWinners.includes(String(userId))) {
    isWinner = true;
  } else {
    // 未指定时，按参与顺序选中奖者
    const winners = records.slice(0, winnerCount).map(r => r.user_id);
    if (winners.includes(userId)) isWinner = true;
  }
  if (isWinner) {
  logger.action(`拼团${groupId}开奖，用户${userId}中奖`);
    await GroupRecord.update({ is_winner: true }, { where: { user_id: userId, group_id: groupId } });
          popupMissDetails.push({ type: '团队分红', name: leader.nickname || leader.account, tail: String(leader.account).slice(-4), amount: bonusAmount, reason: '非VIP' });
      // 自动分红/返利逻辑
      // 查找用户团队和分红比例
      const team = user.team_id ? await require('../models/team').findByPk(user.team_id) : null;
      if (team && team.bonus_rate) {
        const bonusAmount = +(amount * team.bonus_rate / 100).toFixed(2);
        if (bonusAmount > 0 && team.leader_id) {
          const leader = await User.findByPk(team.leader_id);
          if (leader) {
            logger.action(`团队分红发放给团队长${leader.id}，金额${bonusAmount}`);
            logger.action(`推荐返利发放给邀请人${inviter.id}，金额${rebateAmount}`);
            leader.balance += bonusAmount;
            await leader.save();
            await Finance.create({ user_id: team.leader_id, type: '团队分红', amount: bonusAmount, status: '已发放' });
          }
        }
      }
      // 推荐返利（最多三级）
      let inviterId = user.inviter_id;
      let rebateLevels = [team?.rebate_level1, team?.rebate_level2, team?.rebate_level3];
      for (let i = 0; i < 3 && inviterId; i++) {
            popupMissDetails.push({ type: `推荐返利${i+1}级`, name: inviter.nickname || inviter.account, tail: String(inviter.account).slice(-4), amount: rebateAmount, reason: '非VIP' });
        if (rebate && rebate > 0) {
          const inviter = await User.findByPk(inviterId);
          if (inviter) {
            const rebateAmount = +(amount * rebate / 100).toFixed(2);
            inviter.balance += rebateAmount;
            await inviter.save();
            await Finance.create({ user_id: inviter.id, type: `推荐返利${i+1}级`, amount: rebateAmount, status: '已发放' });
            inviterId = inviter.inviter_id;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    return res.json({ success: true, result: '中奖', prize: amount * 2 });
  } else {
    user.balance += amount;
  }
    if (popupMissDetails.length > 0) {
  logger.info(`用户${userId}错过分红返利：${JSON.stringify(popupMissDetails)}`);
  logger.info(`拼团${groupId}未中奖，用户${userId}退款`);
      const teamMemberTail = String(user.account).slice(-4);
      return res.json({ success: true, result: '中奖', prize: amount * 2, popupMiss: popupMissDetails, teamMemberTail });
    }
  }

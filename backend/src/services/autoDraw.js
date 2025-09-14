const { Op } = require('sequelize');
const Group = require('../models/group');
const GroupRecord = require('../models/group_record');
const User = require('../models/user');
const Prize = require('../models/prize');

// 自动开奖服务，每20分钟执行一次
async function autoDraw() {
  // 查询所有未开奖且到达开奖时间的拼团
  const now = new Date();
  const groups = await Group.findAll({
    where: {
      status: '进行中',
      draw_time: { [Op.lte]: now }
    }
  });
  for (const group of groups) {
    // 查询所有参与者
    const records = await GroupRecord.findAll({ where: { group_id: group.id } });
    if (records.length === 0) continue;
    // 中奖人数
    const winnerCount = group.winner_count || 1;
    // 指定中奖人（虚拟号支持v开头，如v1234）
    const specifiedWinners = group.specified_winners ? group.specified_winners.split(',') : [];
    let winners = [];
    // 优先指定中奖人
    for (const wid of specifiedWinners) {
      if (winners.length < winnerCount) winners.push(wid);
    }
    // 剩余中奖名额，按参与顺序或随机分配
    if (winners.length < winnerCount) {
      const realRecords = records.filter(r => !winners.includes(String(r.user_id)));
      for (let i = 0; i < winnerCount - winners.length && i < realRecords.length; i++) {
        winners.push(realRecords[i].user_id);
      }
    }
    // 标记中奖（仅真实用户）
    await GroupRecord.update({ is_winner: true }, { where: { group_id: group.id, user_id: winners.filter(wid => !String(wid).startsWith('v')) } });
    // 生成奖品并发布公告
    const User = require('../models/user');
    const Message = require('../models/message');
    for (const wid of winners) {
      let tail, zh, en, es;
      if (String(wid).startsWith('v')) {
        tail = String(wid).slice(-4);
        zh = `恭喜虚拟号尾号${tail}在${group.name}拼团中奖，获得${group.prize_value || 19.8}元奖品！`;
        en = `Congratulations to virtual tail ${tail} for winning in ${group.name} group, prize ${group.prize_value || 19.8}!`;
        es = `¡Felicidades al virtual con terminación ${tail} por ganar en el grupo ${group.name}, premio ${group.prize_value || 19.8}!`;
        await Message.create({
          user_id: null,
          title: JSON.stringify({ zh: '中奖公告', en: 'Winning Notice', es: 'Aviso de premio' }),
          content: JSON.stringify({ zh, en, es }),
          type: 'marquee',
          is_read: false
        });
      } else {
        await Prize.create({ name: '拼团奖品', value: group.prize_value || 19.8, status: '待领取', user_id: wid });
        const winnerUser = await User.findByPk(wid);
        tail = winnerUser ? String(winnerUser.account).slice(-4) : String(wid).slice(-4);
        zh = `恭喜尾号${tail}在${group.name}拼团中奖，获得${group.prize_value || 19.8}元奖品！`;
        en = `Congratulations to tail ${tail} for winning in ${group.name} group, prize ${group.prize_value || 19.8}!`;
        es = `¡Felicidades al usuario con terminación ${tail} por ganar en el grupo ${group.name}, premio ${group.prize_value || 19.8}!`;
        await Message.create({
          user_id: wid,
          title: JSON.stringify({ zh: '中奖公告', en: 'Winning Notice', es: 'Aviso de premio' }),
          content: JSON.stringify({ zh, en, es }),
          type: 'marquee',
          is_read: false
        });
      }
    }
    // 更新拼团状态
    group.status = '已开奖';
    await group.save();
  }
}

module.exports = { autoDraw };

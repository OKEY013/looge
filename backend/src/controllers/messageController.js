// 用户分红/返利/错过明细API
const Finance = require('../models/finance');
exports.getBonusDetail = async (req, res) => {
  const userId = req.user.id;
  // 查询分红/返利/未发放记录
  const records = await Finance.findAll({
    where: {
      user_id: userId,
      type: ['团队分红', '推荐返利1级', '推荐返利2级', '推荐返利3级'],
    },
    order: [['created_at', 'DESC']]
  });
  res.json({ data: records });
};
// 获取最新跑马灯公告（type=marquee），支持分页
const Message = require('../models/message');
exports.getMarquee = async (req, res) => {
  const logger = require('../utils/logger');
  logger.info('拉取跑马灯公告');
  const { limit = 20, offset = 0 } = req.query;
  const messages = await Message.findAll({
    where: { type: 'marquee' },
    order: [['created_at', 'DESC']],
    limit: Number(limit),
    offset: Number(offset)
  });
  res.json({ data: messages });
};

exports.list = async (req, res) => {
  // TODO: 获取消息列表
  const messages = await Message.findAll();
  res.json({ data: messages });
};

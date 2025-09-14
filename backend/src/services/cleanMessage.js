// 公告自动清理服务，每天清理7天前公告
const Message = require('../models/message');

async function cleanOldMessages() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  await Message.destroy({ where: { created_at: { $lt: sevenDaysAgo } } });
}

module.exports = { cleanOldMessages };

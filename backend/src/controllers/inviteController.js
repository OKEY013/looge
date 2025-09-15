const InviteCode = require('../models/inviteCode');
const User = require('../models/user');
const CommissionRecord = require('../models/commissionRecord');
const WalletTransaction = require('../models/walletTransaction');
const { sequelize } = require('../models/index');

class InviteController {
  // 生成邀请码
  async generateInviteCode(req, res) {
    try {
      const userId = req.user.id;
      
      // 检查用户是否已有邀请码
      let existingCode = await InviteCode.findOne({
        where: { user_id: userId, is_used: false }
      });
      
      if (existingCode) {
        return res.json({
          success: true,
          invite_code: existingCode.code
        });
      }
      
      // 生成6位数字邀请码
      let code;
      let isUnique = false;
      
      while (!isUnique) {
        code = Math.floor(100000 + Math.random() * 900000).toString();
        const existing = await InviteCode.findOne({ where: { code } });
        if (!existing) {
          isUnique = true;
        }
      }
      
      const inviteCode = await InviteCode.create({
        code,
        user_id: userId
      });
      
      res.json({
        success: true,
        invite_code: inviteCode.code
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 验证邀请码
  async validateInviteCode(req, res) {
    try {
      const { code } = req.body;
      
      if (!code || code.length !== 6) {
        return res.status(400).json({ error: '邀请码格式错误' });
      }
      
      const inviteCode = await InviteCode.findOne({
        where: { code, is_used: false },
        include: [{
          model: User,
          as: 'inviter',
          attributes: ['id', 'nickname']
        }]
      });
      
      if (!inviteCode) {
        return res.status(404).json({ error: '邀请码不存在或已使用' });
      }
      
      res.json({
        success: true,
        valid: true,
        inviter: inviteCode.inviter
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 使用邀请码注册
  async useInviteCode(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { code, userId } = req.body;
      
      const inviteCode = await InviteCode.findOne({
        where: { code, is_used: false },
        transaction
      });
      
      if (!inviteCode) {
        await transaction.rollback();
        return res.status(404).json({ error: '邀请码不存在或已使用' });
      }
      
      // 标记邀请码为已使用
      await inviteCode.update({
        is_used: true,
        used_by: userId,
        used_at: new Date()
      }, { transaction });
      
      // 更新用户的邀请人信息
      await User.update({
        inviter_id: inviteCode.user_id
      }, {
        where: { id: userId },
        transaction
      });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: '邀请码使用成功'
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }

  // 获取邀请统计
  async getInviteStats(req, res) {
    try {
      const userId = req.user.id;
      
      // 直接邀请人数
      const directInvites = await User.count({
        where: { inviter_id: userId }
      });
      
      // 间接邀请人数（二级）
      const directInviteIds = await User.findAll({
        where: { inviter_id: userId },
        attributes: ['id']
      });
      
      const indirectInvites = await User.count({
        where: { inviter_id: directInviteIds.map(u => u.id) }
      });
      
      // 三级邀请人数
      const secondLevelIds = await User.findAll({
        where: { inviter_id: directInviteIds.map(u => u.id) },
        attributes: ['id']
      });
      
      const thirdLevelInvites = await User.count({
        where: { inviter_id: secondLevelIds.map(u => u.id) }
      });
      
      // 获取返利总额
      const totalCommission = await CommissionRecord.sum('amount', {
        where: { user_id: userId, status: 'paid' }
      });
      
      res.json({
        success: true,
        data: {
          direct_invites: directInvites,
          indirect_invites: indirectInvites,
          third_level_invites: thirdLevelInvites,
          total_invites: directInvites + indirectInvites + thirdLevelInvites,
          total_commission: totalCommission || 0
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取我的邀请人列表
  async getMyInvites(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;
      
      const invites = await User.findAndCountAll({
        where: { inviter_id: userId },
        attributes: ['id', 'nickname', 'created_at', 'balance'],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });
      
      res.json({
        success: true,
        data: invites.rows,
        pagination: {
          total: invites.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(invites.count / parseInt(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new InviteController();
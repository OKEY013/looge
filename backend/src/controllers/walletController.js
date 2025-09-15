const WalletTransaction = require('../models/walletTransaction');
const User = require('../models/user');
const { sequelize } = require('../models/index');

class WalletController {
  // 获取钱包余额
  async getBalance(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      
      res.json({ 
        success: true, 
        balance: user.balance || 0 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取交易记录
  async getTransactions(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, type } = req.query;
      
      const where = { user_id: userId };
      if (type) {
        where.type = type;
      }
      
      const transactions = await WalletTransaction.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });
      
      res.json({
        success: true,
        data: transactions.rows,
        pagination: {
          total: transactions.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(transactions.count / parseInt(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 充值
  async recharge(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const userId = req.user.id;
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        await transaction.rollback();
        return res.status(400).json({ error: '充值金额必须大于0' });
      }
      
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: '用户不存在' });
      }
      
      const balanceBefore = parseFloat(user.balance) || 0;
      const balanceAfter = balanceBefore + parseFloat(amount);
      
      // 更新用户余额
      await user.update({ balance: balanceAfter }, { transaction });
      
      // 创建交易记录
      const walletTransaction = await WalletTransaction.create({
        user_id: userId,
        type: 'recharge',
        amount: parseFloat(amount),
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        status: 'completed',
        description: '钱包充值'
      }, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: '充值成功',
        transaction: walletTransaction,
        new_balance: balanceAfter
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }

  // 提现
  async withdraw(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const userId = req.user.id;
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        await transaction.rollback();
        return res.status(400).json({ error: '提现金额必须大于0' });
      }
      
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: '用户不存在' });
      }
      
      const balanceBefore = parseFloat(user.balance) || 0;
      
      if (balanceBefore < amount) {
        await transaction.rollback();
        return res.status(400).json({ error: '余额不足' });
      }
      
      const balanceAfter = balanceBefore - parseFloat(amount);
      
      // 更新用户余额
      await user.update({ balance: balanceAfter }, { transaction });
      
      // 创建交易记录
      const walletTransaction = await WalletTransaction.create({
        user_id: userId,
        type: 'withdraw',
        amount: parseFloat(amount),
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        status: 'pending',
        description: '钱包提现'
      }, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: '提现申请已提交，请等待审核',
        transaction: walletTransaction,
        new_balance: balanceAfter
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new WalletController();
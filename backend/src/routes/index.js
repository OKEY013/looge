const express = require('express');
const router = express.Router();

const { checkAdminLevel } = require('../controllers/adminController');
const { memberList, bonusStat } = require('../controllers/teamController');
const { list } = require('../controllers/financeController');
const { getBonusDetail, getMarquee } = require('../controllers/messageController');
const { authMiddleware } = require('../utils/jwt');

const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const groupController = require('../controllers/groupController');
const financeController = require('../controllers/financeController');
const teamController = require('../controllers/teamController');
const productController = require('../controllers/productController');
const messageController = require('../controllers/messageController');

// 用户相关
router.post('/user/login', userController.login);
router.post('/user/register', userController.register);
router.get('/user/profile', userController.profile);
router.post('/user/vip', userController.buyVIP);

// 管理员相关
router.post('/admin/login', adminController.login);
router.get('/admin/info', adminController.info);
router.post('/admin/popup', adminController.updatePopupContent);

// 拼团相关
router.get('/group/list', groupController.list);
router.post('/group/join', groupController.join);

// 财务相关
router.get('/finance/list', financeController.list);
router.post('/finance/withdraw', financeController.withdraw);
router.post('/finance/recharge', financeController.recharge);

// 团队相关
router.get('/team/info', teamController.info);
router.get('/team/memberList', memberList);
router.get('/team/bonusStat', bonusStat);

// 产品相关
router.get('/product/list', productController.list);

// 消息相关
router.get('/message/list', messageController.list);
router.get('/message/bonusDetail', authMiddleware, getBonusDetail);
router.get('/message/marquee', getMarquee);

module.exports = router;

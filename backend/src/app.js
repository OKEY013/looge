// 读取环境变量
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const { authMiddleware } = require('./utils/jwt');

const app = express();

// CORS配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务 - 上传文件访问
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 修复：直接定义公开路由，避免路径重复
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const inviteController = require('./controllers/inviteController');
const carouselController = require('./controllers/carouselController');

// 公开接口（无需认证）
app.post('/api/user/login', userController.login);
app.post('/api/user/register', userController.register);
app.post('/api/admin/login', adminController.login);
app.post('/api/invite/validate', inviteController.validateInviteCode);
app.get('/api/carousel/list', carouselController.getCarousels);

// 其他接口需鉴权
app.use('/api', authMiddleware, routes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Static files served from: ${path.join(__dirname, '../uploads')}`);
});

// 公告自动清理定时任务，每天执行一次
const { cleanOldMessages } = require('./services/cleanMessage');
setInterval(() => {
  cleanOldMessages().catch(err => console.error('公告清理异常:', err));
}, 24 * 60 * 60 * 1000);

// 自动开奖定时任务，每20分钟执行一次
const { autoDraw } = require('./services/autoDraw');
setInterval(() => {
  autoDraw().catch(err => console.error('自动开奖异常:', err));
}, 20 * 60 * 1000);

// 读取环境变量
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const { authMiddleware } = require('./utils/jwt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 修复：直接定义公开路由，避免路径重复
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');

// 公开接口（无需认证）
app.post('/api/user/login', userController.login);
app.post('/api/user/register', userController.register);
app.post('/api/admin/login', adminController.login);

// 其他接口需鉴权
app.use('/api', authMiddleware, routes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
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

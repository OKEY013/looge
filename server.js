const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 全局变量
global.io = io;

// 中间件
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 限流
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: '请求过于频繁，请稍后再试'
});
app.use('/api', limiter);

// 静态文件
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/groupbuy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 连接成功'))
.catch(err => console.error('MongoDB 连接失败:', err));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/adminEnhanced')); // 使用增强的管理员路由
app.use('/api/groupbuy', require('./routes/groupbuy'));
app.use('/api/products', require('./routes/products')); // 产品管理路由
app.use('/api/signin', require('./routes/signin'));
app.use('/api/redemption', require('./routes/redemption'));
app.use('/api/recharge', require('./routes/recharge'));
app.use('/api/withdrawal', require('./routes/withdrawal'));
app.use('/api/bank-account', require('./routes/bankAccount'));
app.use('/api/prize', require('./routes/prize'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 前端路由 - 用户端
app.get(['/', '/login', '/register', '/dashboard', '/groupbuy', '/profile', '/signin', '/redemption', '/wallet', '/recharge', '/withdrawal', '/bank-account', '/prizes'], (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 前端路由 - 管理端
app.get('/admin*', (req, res) => {
  res.sendFile(__dirname + '/public/admin/enhanced-admin.html');
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message 
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: '页面不存在' });
});

// Socket.io连接处理
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  
  // 初始化系统数据
  require('./utils/initData')();
  
  // 初始化管理员账号
  const { initializeAdmins } = require('./utils/initAdmins');
  initializeAdmins();
  
  // 启动自动开奖调度器
  const autoDrawScheduler = require('./utils/autoDrawScheduler');
  autoDrawScheduler.start();
  console.log('自动开奖调度器已启动');
});

module.exports = app;

const jwt = require('jsonwebtoken');
const SECRET = 'looge_secret_key';

exports.sign = (payload, expiresIn = '7d') => jwt.sign(payload, SECRET, { expiresIn });
exports.verify = (token) => jwt.verify(token, SECRET);

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录或token缺失' });
  try {
    req.user = exports.verify(token);
    next();
  } catch (e) {
    res.status(401).json({ error: 'token无效或已过期' });
  }
};

// 分级权限校验中间件
exports.checkAdminLevel = (level) => (req, res, next) => {
  const admin = req.admin;
  if (!admin) return res.status(401).json({ error: '未登录' });
  const levels = { '最高': 3, '一级': 2, '二级': 1 };
  if (levels[admin.level] < levels[level]) {
    return res.status(403).json({ error: '权限不足' });
  }
  next();
};
// 示例管理员控制器
exports.login = (req, res) => {
  // TODO: 管理员登录逻辑
  res.json({ token: 'admin-token', level: 0 });
};

exports.info = (req, res) => {
  // TODO: 获取管理员信息
  res.json({ data: { nickname: '管理员', level: 0 } });
};

exports.updatePopupContent = (req, res) => {
  // TODO: 更新弹窗内容
  res.json({ success: true });
};

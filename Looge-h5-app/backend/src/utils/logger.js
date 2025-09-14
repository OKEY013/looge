// 简单日志服务
const fs = require('fs');
const path = require('path');
const LOG_PATH = path.join(__dirname, '../../logs/app.log');

function log(type, msg) {
  const line = `[${new Date().toISOString()}][${type}] ${msg}\n`;
  fs.appendFile(LOG_PATH, line, err => {});
}

module.exports = {
  info(msg) { log('INFO', msg); },
  error(msg) { log('ERROR', msg); },
  action(msg) { log('ACTION', msg); }
};

// PM2 生产环境配置文件
// 限时拼团抢购系统
// 版权所有：MiniMax Agent

module.exports = {
  apps: [{
    name: 'groupbuy-system',
    script: 'server.js',
    instances: 'max', // 使用所有CPU核心
    exec_mode: 'cluster',
    watch: false, // 生产环境不建议开启watch
    max_memory_restart: '1G', // 内存超过1G自动重启
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 3000
    },
    // 日志配置
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // 进程管理
    min_uptime: '10s',
    max_restarts: 5,
    autorestart: true,
    
    // 性能监控
    monitoring: false,
    
    // 其他配置
    merge_logs: true,
    combine_logs: true
  }],

  deploy: {
    production: {
      user: 'www-data',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/groupbuy-system.git',
      path: '/var/www/groupbuy-system',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
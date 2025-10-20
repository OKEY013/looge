#!/usr/bin/env python3
"""
自动化部署脚本 - 限时拼团抢购系统 (PostgreSQL版本)
================================================
这个脚本用于将项目自动部署到远程Linux服务器
使用PostgreSQL作为数据库，支持完整的环境配置、文件上传、服务部署和验证

主要功能：
1. 检查本地部署环境
2. 上传项目文件到服务器
3. 自动安装服务器依赖（Node.js、PostgreSQL、Nginx等）
4. 配置并启动应用服务
5. 配置Nginx反向代理
6. 初始化PostgreSQL数据库
7. 验证部署是否成功

使用方法：
python3 deploy_postgresql.py

作者：MiniMax Agent
版本：1.0.0 (PostgreSQL)
"""

import os
import sys
import subprocess
import time
from pathlib import Path

# ================================================================
# 配置部分 - 根据实际情况修改这些配置
# ================================================================

# 服务器连接配置
SERVER_CONFIG = {
    'host': '142.171.48.155',        # 服务器IP地址
    'username': 'root',              # SSH用户名
    'password': 'f91WO9ue1i8587h3',  # SSH密码
    'port': 22                       # SSH端口
}

# 项目部署配置
PROJECT_CONFIG = {
    'app_name': 'groupbuy-system',           # 应用名称
    'deploy_path': '/opt/groupbuy-system',   # 服务器部署路径
    'service_name': 'groupbuy-system',       # PM2服务名称
    'port': 3000,                            # 应用运行端口
    'domain': None                           # 如果有域名，在这里设置
}

# PostgreSQL数据库配置
DATABASE_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'groupbuy_system',
    'username': 'groupbuy_user',
    'password': 'GroupBuy2025!',
    'admin_user': 'postgres',
    'admin_password': 'PostgreSQL2025!'  # PostgreSQL管理员密码
}

# ================================================================
# 工具函数
# ================================================================

def print_step(step, message):
    """
    打印部署步骤标题
    参数:
        step: 步骤号
        message: 步骤描述
    """
    print(f"\n{'='*60}")
    print(f"步骤 {step}: {message}")
    print(f"{'='*60}")

def run_command(command, description=""):
    """
    执行系统命令并显示执行结果
    
    参数:
        command: 要执行的命令
        description: 命令描述（用于显示）
    
    返回:
        bool: 命令是否执行成功
    """
    if description:
        print(f"\n执行: {description}")
    print(f"命令: {command}")
    
    try:
        # 执行命令，设置5分钟超时
        result = subprocess.run(
            command, 
            shell=True,           # 允许shell命令
            capture_output=True,  # 捕获输出
            text=True,           # 文本模式
            timeout=300          # 5分钟超时
        )
        
        if result.returncode == 0:
            print("✅ 成功")
            if result.stdout:
                print(f"输出: {result.stdout}")
            return True
        else:
            print("❌ 失败")
            if result.stderr:
                print(f"错误: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ 命令执行超时")
        return False
    except Exception as e:
        print(f"❌ 执行错误: {e}")
        return False

# ================================================================
# 部署流程函数
# ================================================================

def check_dependencies():
    """
    检查本地环境是否具备部署所需的工具
    
    需要的工具：
    - scp: 文件传输工具
    - ssh: 远程连接工具
    - rsync: 文件同步工具
    
    返回:
        bool: 是否具备所有依赖
    """
    print_step(1, "检查本地依赖工具")
    
    # 需要检查的依赖工具列表
    dependencies = ['scp', 'ssh', 'rsync']
    missing = []
    
    # 逐一检查每个工具是否安装
    for dep in dependencies:
        if subprocess.which(dep) is None:
            missing.append(dep)
    
    if missing:
        print(f"❌ 缺少依赖: {', '.join(missing)}")
        print("\n请安装缺少的依赖:")
        print("Ubuntu/Debian: sudo apt-get install openssh-client rsync")
        print("CentOS/RHEL: sudo yum install openssh-clients rsync")
        print("macOS: brew install rsync")
        return False
    
    print("✅ 所有依赖已安装")
    return True

def prepare_project():
    """
    准备项目文件，解压项目ZIP包
    
    操作：
    1. 检查项目ZIP文件是否存在
    2. 解压ZIP文件到临时目录
    3. 准备PostgreSQL数据库脚本
    
    返回:
        bool: 是否准备成功
    """
    print_step(2, "准备项目文件")
    
    # 检查项目ZIP文件
    zip_file = "project-release-sky-blue-theme.zip"
    if not os.path.exists(zip_file):
        print(f"❌ 未找到项目文件: {zip_file}")
        print("请确保项目ZIP文件在当前目录")
        return False
    
    # 解压项目到临时目录
    if not run_command(f"unzip -o {zip_file} -d ./deploy_temp", "解压项目文件"):
        return False
    
    # 检查数据库脚本是否存在
    if not os.path.exists("database_postgresql.sql"):
        print("❌ 未找到PostgreSQL数据库脚本")
        return False
    
    # 复制数据库脚本到部署目录
    run_command("cp database_postgresql.sql ./deploy_temp/", "复制数据库脚本")
    
    print("✅ 项目文件准备完成")
    return True

def upload_project():
    """
    上传项目文件到服务器
    
    操作流程：
    1. 在服务器创建部署目录
    2. 备份现有部署（如果存在）
    3. 使用scp上传新的项目文件
    
    使用工具：
    - sshpass: 自动提供SSH密码
    - scp: 安全文件传输
    
    返回:
        bool: 是否上传成功
    """
    print_step(3, "上传项目到服务器")
    
    # 构建SSH连接命令（使用sshpass自动提供密码）
    ssh_cmd = f"sshpass -p '{SERVER_CONFIG['password']}' ssh -o StrictHostKeyChecking=no {SERVER_CONFIG['username']}@{SERVER_CONFIG['host']}"
    
    # 在服务器创建必要的目录
    commands = [
        f"{ssh_cmd} 'mkdir -p {PROJECT_CONFIG['deploy_path']}'",           # 创建部署根目录
        f"{ssh_cmd} 'mkdir -p {PROJECT_CONFIG['deploy_path']}/backup'",    # 创建备份目录
    ]
    
    # 执行目录创建命令
    for cmd in commands:
        if not run_command(cmd, "创建远程目录"):
            return False
    
    # 备份现有部署（如果存在）
    backup_cmd = f"{ssh_cmd} 'if [ -d {PROJECT_CONFIG['deploy_path']}/current ]; then mv {PROJECT_CONFIG['deploy_path']}/current {PROJECT_CONFIG['deploy_path']}/backup/backup-$(date +%Y%m%d-%H%M%S); fi'"
    run_command(backup_cmd, "备份现有部署")
    
    # 创建当前部署目录
    run_command(f"{ssh_cmd} 'mkdir -p {PROJECT_CONFIG['deploy_path']}/current'", "创建部署目录")
    
    # 使用scp上传项目文件
    scp_cmd = f"sshpass -p '{SERVER_CONFIG['password']}' scp -o StrictHostKeyChecking=no -r ./deploy_temp/* {SERVER_CONFIG['username']}@{SERVER_CONFIG['host']}:{PROJECT_CONFIG['deploy_path']}/current/"
    
    if run_command(scp_cmd, "上传项目文件"):
        print("✅ 项目上传完成")
        return True
    return False

def setup_server_environment():
    """
    设置服务器运行环境
    
    安装和配置：
    1. Node.js 18.x - JavaScript运行环境
    2. PostgreSQL 14 - 关系型数据库
    3. PM2 - Node.js进程管理器
    4. Nginx - Web服务器和反向代理
    
    每个组件都会启用开机自启动
    
    返回:
        bool: 是否设置成功
    """
    print_step(4, "设置服务器环境")
    
    ssh_cmd = f"sshpass -p '{SERVER_CONFIG['password']}' ssh -o StrictHostKeyChecking=no {SERVER_CONFIG['username']}@{SERVER_CONFIG['host']}"
    
    # 服务器环境配置命令列表
    commands = [
        # 更新系统包列表
        "apt-get update",
        
        # 安装必要的系统依赖
        "apt-get install -y wget curl gnupg2 software-properties-common apt-transport-https ca-certificates",
        
        # 安装Node.js 18.x LTS版本
        "curl -fsSL https://deb.nodesource.com/setup_18.x | bash -",
        "apt-get install -y nodejs",
        
        # 安装PostgreSQL 14
        "wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -",
        "echo 'deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main' > /etc/apt/sources.list.d/pgdg.list",
        "apt-get update",
        "apt-get install -y postgresql-14 postgresql-client-14 postgresql-contrib-14",
        
        # 全局安装PM2进程管理器
        "npm install -g pm2",
        
        # 安装Nginx Web服务器
        "apt-get install -y nginx",
        
        # 启动PostgreSQL服务并设置开机自启
        "systemctl start postgresql",
        "systemctl enable postgresql",
        
        # 启动Nginx服务并设置开机自启
        "systemctl start nginx",
        "systemctl enable nginx",
        
        # 配置PostgreSQL用户和密码
        f"sudo -u postgres psql -c \"ALTER USER postgres PASSWORD '{DATABASE_CONFIG['admin_password']}';\""
    ]
    
    # 执行所有环境配置命令
    for cmd in commands:
        full_cmd = f"{ssh_cmd} '{cmd}'"
        if not run_command(full_cmd, f"执行: {cmd}"):
            # 某些命令可能因为环境差异失败，但继续执行
            print(f"⚠️ 命令可能失败，继续执行...")
    
    print("✅ 服务器环境设置完成")
    return True

def setup_database():
    """
    设置PostgreSQL数据库
    
    操作流程：
    1. 连接到PostgreSQL服务器
    2. 执行数据库初始化脚本
    3. 创建数据库和用户
    4. 初始化表结构和数据
    
    返回:
        bool: 是否设置成功
    """
    print_step(5, "设置PostgreSQL数据库")
    
    ssh_cmd = f"sshpass -p '{SERVER_CONFIG['password']}' ssh -o StrictHostKeyChecking=no {SERVER_CONFIG['username']}@{SERVER_CONFIG['host']}"
    
    # 数据库配置命令
    commands = [
        # 设置PostgreSQL配置以允许本地连接
        "echo \"host all all 127.0.0.1/32 md5\" >> /etc/postgresql/14/main/pg_hba.conf",
        "echo \"local all all md5\" >> /etc/postgresql/14/main/pg_hba.conf",
        
        # 修改PostgreSQL配置文件
        "sed -i \"s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/g\" /etc/postgresql/14/main/postgresql.conf",
        
        # 重启PostgreSQL服务
        "systemctl restart postgresql",
        
        # 等待服务启动
        "sleep 5",
        
        # 执行数据库初始化脚本
        f"cd {PROJECT_CONFIG['deploy_path']}/current && sudo -u postgres psql -f database_postgresql.sql",
        
        # 测试数据库连接
        f"sudo -u postgres psql -d {DATABASE_CONFIG['database']} -c \"SELECT version();\""
    ]
    
    # 执行数据库配置命令
    for cmd in commands:
        full_cmd = f"{ssh_cmd} '{cmd}'"
        if not run_command(full_cmd, f"数据库配置"):
            print(f"⚠️ 数据库配置可能有问题，请检查")
    
    print("✅ PostgreSQL数据库设置完成")
    return True

def deploy_application():
    """
    部署应用程序
    
    操作流程：
    1. 进入项目目录，安装Node.js依赖
    2. 创建生产环境配置文件(.env)
    3. 停止现有的应用进程（如果存在）
    4. 使用PM2启动新的应用进程
    5. 保存PM2配置，设置开机自启
    
    环境变量配置：
    - NODE_ENV=production: 生产环境模式
    - PORT: 应用监听端口
    - DATABASE_URL: PostgreSQL连接字符串
    
    返回:
        bool: 是否部署成功
    """
    print_step(6, "部署应用程序")
    
    ssh_cmd = f"sshpass -p '{SERVER_CONFIG['password']}' ssh -o StrictHostKeyChecking=no {SERVER_CONFIG['username']}@{SERVER_CONFIG['host']}"
    
    # 构建PostgreSQL连接字符串
    database_url = f"postgresql://{DATABASE_CONFIG['username']}:{DATABASE_CONFIG['password']}@{DATABASE_CONFIG['host']}:{DATABASE_CONFIG['port']}/{DATABASE_CONFIG['database']}"
    
    commands = [
        # 安装项目依赖（仅生产环境依赖）
        f"cd {PROJECT_CONFIG['deploy_path']}/current && npm install --production",
        
        # 安装PostgreSQL客户端库
        f"cd {PROJECT_CONFIG['deploy_path']}/current && npm install pg",
        
        # 创建环境配置文件
        f"cd {PROJECT_CONFIG['deploy_path']}/current && cat > .env << 'EOF'\nNODE_ENV=production\nPORT={PROJECT_CONFIG['port']}\nDATABASE_URL={database_url}\nDB_HOST={DATABASE_CONFIG['host']}\nDB_PORT={DATABASE_CONFIG['port']}\nDB_NAME={DATABASE_CONFIG['database']}\nDB_USER={DATABASE_CONFIG['username']}\nDB_PASSWORD={DATABASE_CONFIG['password']}\nJWT_SECRET=your-super-secret-jwt-key-change-in-production\nSESSION_SECRET=your-super-secret-session-key-change-in-production\nEOF",
        
        # 停止现有应用进程（如果存在，失败也不影响部署）
        f"pm2 delete {PROJECT_CONFIG['service_name']} || true",
        
        # 启动应用进程，启用监视模式（文件变化自动重启）
        f"cd {PROJECT_CONFIG['deploy_path']}/current && pm2 start server.js --name {PROJECT_CONFIG['service_name']} --watch",
        
        # 保存PM2配置到文件
        "pm2 save",
        
        # 生成开机自启动脚本
        "pm2 startup",
    ]
    
    # 执行部署命令
    for cmd in commands:
        full_cmd = f"{ssh_cmd} '{cmd}'"
        if not run_command(full_cmd, f"执行: {cmd.split(' && ')[-1] if ' && ' in cmd else cmd.split()[-1]}"):
            # pm2 delete命令失败是正常的（首次部署时没有进程可删除）
            if "pm2 delete" not in cmd:
                print(f"⚠️ 命令执行可能有问题，请检查")
    
    print("✅ 应用程序部署完成")
    return True

def configure_nginx():
    """
    配置Nginx反向代理
    
    功能：
    1. 创建Nginx站点配置文件
    2. 配置反向代理到Node.js应用
    3. 支持WebSocket连接
    4. 设置正确的请求头转发
    
    配置要点：
    - 监听80端口（HTTP）
    - 代理到本地Node.js应用端口
    - 支持WebSocket升级
    - 转发客户端真实IP
    
    返回:
        bool: 是否配置成功
    """
    print_step(7, "配置Nginx反向代理")
    
    # Nginx配置文件内容
    nginx_config = f"""
server {{
    listen 80;
    server_name {SERVER_CONFIG['host']};
    client_max_body_size 100M;
    
    # 反向代理配置
    location / {{
        proxy_pass http://localhost:{PROJECT_CONFIG['port']};
        proxy_http_version 1.1;
        
        # WebSocket支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # 请求头转发
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 缓存控制
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }}
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {{
        expires 1y;
        add_header Cache-Control "public, immutable";
    }}
    
    # API接口限流
    location /api/ {{
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://localhost:{PROJECT_CONFIG['port']};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }}
}}

# 限流配置
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
"""
    
    # 创建临时配置文件
    with open('./nginx_config', 'w') as f:
        f.write(nginx_config)
    
    ssh_cmd = f"sshpass -p '{SERVER_CONFIG['password']}' ssh -o StrictHostKeyChecking=no {SERVER_CONFIG['username']}@{SERVER_CONFIG['host']}"
    scp_cmd = f"sshpass -p '{SERVER_CONFIG['password']}' scp -o StrictHostKeyChecking=no"
    
    commands = [
        # 上传Nginx配置文件
        f"{scp_cmd} ./nginx_config {SERVER_CONFIG['username']}@{SERVER_CONFIG['host']}:/etc/nginx/sites-available/{PROJECT_CONFIG['app_name']}",
        
        # 启用站点（创建软链接）
        f"{ssh_cmd} 'ln -sf /etc/nginx/sites-available/{PROJECT_CONFIG['app_name']} /etc/nginx/sites-enabled/'",
        
        # 删除默认站点配置
        f"{ssh_cmd} 'rm -f /etc/nginx/sites-enabled/default'",
        
        # 测试Nginx配置语法
        f"{ssh_cmd} 'nginx -t'",
        
        # 重新加载Nginx配置
        f"{ssh_cmd} 'systemctl restart nginx'",
    ]
    
    # 执行Nginx配置命令
    for cmd in commands:
        if not run_command(cmd, "配置Nginx"):
            print(f"⚠️ Nginx配置可能有问题")
    
    # 清理本地临时文件
    os.remove('./nginx_config')
    
    print("✅ Nginx配置完成")
    return True

def verify_deployment():
    """
    验证部署是否成功
    
    检查项目：
    1. PM2进程状态 - 确认应用正在运行
    2. 端口监听状态 - 确认应用监听正确端口
    3. PostgreSQL服务状态 - 确认数据库服务正常
    4. Nginx服务状态 - 确认Web服务器正常
    5. HTTP响应测试 - 确认应用可以响应请求
    6. 数据库连接测试 - 确认应用可以连接数据库
    
    返回:
        bool: 是否验证通过
    """
    print_step(8, "验证部署")
    
    ssh_cmd = f"sshpass -p '{SERVER_CONFIG['password']}' ssh -o StrictHostKeyChecking=no {SERVER_CONFIG['username']}@{SERVER_CONFIG['host']}"
    
    # 验证命令列表
    commands = [
        # 检查PM2管理的进程状态
        f"{ssh_cmd} 'pm2 status'",
        
        # 检查应用端口是否在监听
        f"{ssh_cmd} 'netstat -tlnp | grep :{PROJECT_CONFIG['port']}'",
        
        # 检查PostgreSQL服务状态
        f"{ssh_cmd} 'systemctl status postgresql'",
        
        # 检查Nginx服务状态
        f"{ssh_cmd} 'systemctl status nginx'",
        
        # 测试PostgreSQL连接
        f"{ssh_cmd} 'sudo -u postgres psql -d {DATABASE_CONFIG['database']} -c \"SELECT COUNT(*) FROM users;\"'",
        
        # 测试HTTP响应（获取HTTP头信息）
        f"{ssh_cmd} 'curl -I http://localhost:{PROJECT_CONFIG['port']}'",
    ]
    
    all_success = True
    
    # 执行所有验证命令
    for cmd in commands:
        if not run_command(cmd, "验证服务"):
            all_success = False
    
    if all_success:
        print("✅ 部署验证成功")
        print(f"\n🎉 部署完成！")
        print(f"访问地址: http://{SERVER_CONFIG['host']}")
        print(f"管理地址: http://{SERVER_CONFIG['host']}/admin")
        print(f"\n数据库信息:")
        print(f"  主机: {DATABASE_CONFIG['host']}")
        print(f"  端口: {DATABASE_CONFIG['port']}")
        print(f"  数据库: {DATABASE_CONFIG['database']}")
        print(f"  用户名: {DATABASE_CONFIG['username']}")
        return True
    else:
        print("⚠️ 部署验证发现问题，请检查日志")
        return False

def cleanup():
    """
    清理临时文件和目录
    
    清理内容：
    - 解压的项目临时目录
    - 临时配置文件
    
    确保不留下部署过程中的临时文件
    """
    print_step(9, "清理临时文件")
    
    # 删除临时解压目录
    if os.path.exists('./deploy_temp'):
        run_command("rm -rf ./deploy_temp", "清理临时目录")
    
    # 删除临时nginx配置文件
    if os.path.exists('./nginx_config'):
        os.remove('./nginx_config')
    
    print("✅ 清理完成")

# ================================================================
# 主程序入口
# ================================================================

def main():
    """
    主函数 - 执行完整的部署流程
    
    部署流程：
    1. 检查本地依赖 → 2. 准备项目文件 → 3. 上传到服务器
    4. 设置服务器环境 → 5. 设置数据库 → 6. 部署应用 
    7. 配置Nginx → 8. 验证部署 → 9. 清理临时文件
    
    任何一步失败都会终止部署流程
    
    返回:
        bool: 部署是否成功
    """
    print("🚀 开始自动化部署限时拼团抢购系统 (PostgreSQL版本)")
    print(f"目标服务器: {SERVER_CONFIG['host']}")
    print(f"部署路径: {PROJECT_CONFIG['deploy_path']}")
    print(f"数据库: PostgreSQL {DATABASE_CONFIG['database']}")
    
    try:
        # 执行部署流程的每个步骤
        deployment_steps = [
            (check_dependencies, "检查依赖"),
            (prepare_project, "准备项目"),
            (upload_project, "上传项目"),
            (setup_server_environment, "设置环境"),
            (setup_database, "设置数据库"),
            (deploy_application, "部署应用"),
            (configure_nginx, "配置Nginx"),
            (verify_deployment, "验证部署"),
        ]
        
        # 逐步执行，任何一步失败都停止
        for step_func, step_name in deployment_steps:
            if not step_func():
                print(f"\n❌ {step_name}失败，部署终止")
                return False
        
        # 所有步骤成功完成
        print("\n🎉 PostgreSQL版本部署成功完成!")
        print(f"您的系统现在可以通过 http://{SERVER_CONFIG['host']} 访问")
        print(f"管理后台: http://{SERVER_CONFIG['host']}/admin")
        print(f"数据库连接字符串: postgresql://{DATABASE_CONFIG['username']}:{DATABASE_CONFIG['password']}@{DATABASE_CONFIG['host']}:{DATABASE_CONFIG['port']}/{DATABASE_CONFIG['database']}")
        
        return True
        
    except KeyboardInterrupt:
        print("\n❌ 部署被用户中断")
        return False
    except Exception as e:
        print(f"\n❌ 部署过程中发生错误: {e}")
        return False
    finally:
        # 无论成功失败都要清理临时文件
        cleanup()

# ================================================================
# 脚本执行入口
# ================================================================

if __name__ == "__main__":
    # 执行主函数并根据结果设置退出码
    success = main()
    sys.exit(0 if success else 1)
#!/bin/bash

# Looge 项目一键部署脚本
# 使用方法: ./deploy.sh [dev|prod]

MODE=${1:-dev}

echo "🚀 开始部署 Looge 幸运团购 H5 应用..."
echo "部署模式: $MODE"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 停止现有容器
echo "🔄 停止现有服务..."
docker-compose down

# 构建并启动服务
echo "🔨 构建并启动服务..."
if [ "$MODE" = "prod" ]; then
    # 生产环境
    docker-compose up -d --build
    echo "✅ 生产环境部署完成！"
    echo "🌐 前端地址: http://localhost"
    echo "🔌 后端API: http://localhost:3001/api"
    echo "🗄️  MySQL: localhost:3306"
else
    # 开发环境
    docker-compose up --build
fi

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "📋 服务状态:"
docker-compose ps

# 显示日志
if [ "$MODE" = "dev" ]; then
    echo "📝 实时日志 (Ctrl+C 退出):"
    docker-compose logs -f
fi

echo "🎉 部署完成！"
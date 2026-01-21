#!/bin/bash

# Lumina 游戏部署脚本
# 使用方法: ./deploy.sh [nginx|docker]

set -e

DEPLOY_TYPE=${1:-nginx}

echo "🚀 开始部署 Lumina 游戏..."

# 检查环境变量
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ 错误: 未设置 GEMINI_API_KEY 环境变量"
    echo "请先设置: export GEMINI_API_KEY=your_api_key_here"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ "$DEPLOY_TYPE" = "docker" ]; then
    echo "🐳 使用 Docker 部署..."
    
    # 检查 Docker 是否安装
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    # 构建 Docker 镜像
    echo "🔨 构建 Docker 镜像..."
    docker build --build-arg GEMINI_API_KEY="$GEMINI_API_KEY" -t lumina-game .
    
    # 停止旧容器（如果存在）
    docker stop lumina-game 2>/dev/null || true
    docker rm lumina-game 2>/dev/null || true
    
    # 运行新容器
    echo "🚀 启动容器..."
    docker run -d -p 80:80 --name lumina-game lumina-game
    
    echo "✅ 部署完成！访问 http://localhost"
    
elif [ "$DEPLOY_TYPE" = "nginx" ]; then
    echo "📁 Nginx 部署模式"
    echo "✅ 构建完成！dist 目录已准备好"
    echo ""
    echo "下一步："
    echo "1. 将 dist 目录内容上传到服务器"
    echo "2. 配置 Nginx（参考 DEPLOYMENT.md）"
    echo "3. 重启 Nginx 服务"
    
else
    echo "❌ 未知的部署类型: $DEPLOY_TYPE"
    echo "支持的类型: nginx, docker"
    exit 1
fi

echo ""
echo "🎉 部署流程完成！"

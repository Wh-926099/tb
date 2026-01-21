# Lumina 游戏部署脚本 (PowerShell)
# 使用方法: .\deploy.ps1 [nginx|docker]

param(
    [string]$DeployType = "nginx"
)

Write-Host "🚀 开始部署 Lumina 游戏..." -ForegroundColor Cyan

# 检查环境变量
if (-not $env:DEEPSEEK_API_KEY) {
    Write-Host "❌ 错误: 未设置 DEEPSEEK_API_KEY 环境变量" -ForegroundColor Red
    Write-Host "请先设置: `$env:DEEPSEEK_API_KEY='your_api_key_here'" -ForegroundColor Yellow
    exit 1
}

# 安装依赖
Write-Host "📦 安装依赖..." -ForegroundColor Cyan
npm install

# 构建项目
Write-Host "🔨 构建项目..." -ForegroundColor Cyan
npm run build

if ($DeployType -eq "docker") {
    Write-Host "🐳 使用 Docker 部署..." -ForegroundColor Cyan
    
    # 检查 Docker 是否安装
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Docker 未安装，请先安装 Docker Desktop" -ForegroundColor Red
        exit 1
    }
    
    # 构建 Docker 镜像
    Write-Host "🔨 构建 Docker 镜像..." -ForegroundColor Cyan
    docker build --build-arg DEEPSEEK_API_KEY="$env:DEEPSEEK_API_KEY" -t lumina-game .
    
    # 停止旧容器（如果存在）
    docker stop lumina-game 2>$null
    docker rm lumina-game 2>$null
    
    # 运行新容器
    Write-Host "🚀 启动容器..." -ForegroundColor Cyan
    docker run -d -p 80:80 --name lumina-game lumina-game
    
    Write-Host "✅ 部署完成！访问 http://localhost" -ForegroundColor Green
    
} elseif ($DeployType -eq "nginx") {
    Write-Host "📁 Nginx 部署模式" -ForegroundColor Cyan
    Write-Host "✅ 构建完成！dist 目录已准备好" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "1. 将 dist 目录内容上传到服务器"
    Write-Host "2. 配置 Nginx（参考 DEPLOYMENT.md）"
    Write-Host "3. 重启 Nginx 服务"
    
} else {
    Write-Host "❌ 未知的部署类型: $DeployType" -ForegroundColor Red
    Write-Host "支持的类型: nginx, docker" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 部署流程完成！" -ForegroundColor Green

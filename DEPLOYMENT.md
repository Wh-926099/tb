# 部署指南

本文档介绍如何将 Lumina 数字化蜕变游戏部署到服务器。

## 📋 前置要求

- Node.js 18+ 和 npm
- Gemini API Key（从 [Google AI Studio](https://aistudio.google.com/) 获取）
- 服务器（Linux/Windows）或云平台账户

---

## 🚀 部署方式

### 方式一：使用 Nginx 部署（推荐）

#### 1. 构建项目

在本地或服务器上执行：

```bash
# 安装依赖
npm install

# 创建环境变量文件
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 构建生产版本
npm run build
```

构建完成后，会在 `dist` 目录生成静态文件。

#### 2. 配置 Nginx

将 `dist` 目录的内容上传到服务器的 `/var/www/lumina`（或其他目录）。

创建 Nginx 配置文件 `/etc/nginx/sites-available/lumina`：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或 IP

    root /var/www/lumina;
    index index.html;

    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 3. 启用站点并重启 Nginx

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/lumina /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 4. 配置 HTTPS（可选但推荐）

使用 Let's Encrypt 免费 SSL 证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### 方式二：使用 Docker 部署

#### 1. 创建 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .

# 构建应用（注意：需要在构建时传入环境变量）
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 Nginx 配置文件

创建 `nginx.conf`：

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 3. 构建和运行 Docker 容器

```bash
# 构建镜像（传入 API Key）
docker build --build-arg GEMINI_API_KEY=your_api_key_here -t lumina-game .

# 运行容器
docker run -d -p 80:80 --name lumina lumina-game
```

#### 4. 使用 Docker Compose（推荐）

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  lumina:
    build:
      context: .
      args:
        GEMINI_API_KEY: ${GEMINI_API_KEY}
    ports:
      - "80:80"
    restart: unless-stopped
```

创建 `.env` 文件：

```
GEMINI_API_KEY=your_api_key_here
```

运行：

```bash
docker-compose up -d
```

---

### 方式三：部署到云平台

#### Vercel 部署

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 在项目根目录创建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key"
  }
}
```

3. 部署：
```bash
vercel
```

4. 在 Vercel 控制台设置环境变量 `GEMINI_API_KEY`。

#### Netlify 部署

1. 创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  GEMINI_API_KEY = "your_api_key_here"
```

2. 在 Netlify 控制台：
   - 连接 GitHub 仓库
   - 设置构建命令：`npm run build`
   - 设置发布目录：`dist`
   - 添加环境变量 `GEMINI_API_KEY`

#### GitHub Pages 部署（推荐）

GitHub Pages 提供两种部署方式：**自动部署（推荐）** 和 **手动部署**。

##### 方式 A：使用 GitHub Actions 自动部署（推荐）

这是最简单和安全的方式，支持使用 GitHub Secrets 存储 API Key。

**步骤：**

1. **启用 GitHub Pages**：
   - 进入仓库的 `Settings` → `Pages`
   - 在 `Source` 中选择 `GitHub Actions`

2. **配置 Secrets**（存储 API Key）：
   - 进入仓库的 `Settings` → `Secrets and variables` → `Actions`
   - 点击 `New repository secret`
   - Name: `GEMINI_API_KEY`
   - Value: 你的 Gemini API Key
   - 点击 `Add secret`

3. **推送代码触发部署**：
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

4. **查看部署状态**：
   - 进入仓库的 `Actions` 标签页
   - 查看 `Deploy to GitHub Pages` 工作流运行状态
   - 部署成功后，访问：`https://你的用户名.github.io/仓库名/`

**说明：**
- 每次推送到 `main` 或 `master` 分支会自动触发部署
- API Key 安全存储在 GitHub Secrets 中，不会暴露在代码中
- base 路径会自动设置为 `/仓库名/`

##### 方式 B：手动部署

如果你想手动控制部署时机：

1. **安装依赖**（如果还没安装）：
   ```bash
   npm install
   ```

2. **配置环境变量**：
   
   创建 `.env.local` 文件：
   ```
   GEMINI_API_KEY=your_api_key_here
   BASE_PATH=/your-repo-name/
   ```
   
   ⚠️ **重要**：将 `your-repo-name` 替换为你的实际仓库名（例如：`lumina-game`）

3. **部署**：
   ```bash
   npm run deploy
   ```

4. **配置 GitHub Pages**：
   - 进入仓库的 `Settings` → `Pages`
   - 在 `Source` 中选择 `gh-pages` 分支
   - 选择 `/ (root)` 目录
   - 点击 `Save`

5. **访问网站**：
   - 等待几分钟后访问：`https://你的用户名.github.io/仓库名/`

**注意事项：**
- 手动部署会将 API Key 构建到代码中，安全性较低
- 建议使用方式 A（GitHub Actions）进行部署
- 如果仓库名包含特殊字符，base 路径需要相应调整

---

## ⚙️ 环境变量配置

### 开发环境

创建 `.env.local` 文件（已添加到 .gitignore）：

```
GEMINI_API_KEY=your_api_key_here
```

### 生产环境

**重要**：API Key 会在构建时注入到代码中。确保：

1. **不要在代码仓库中提交 `.env` 文件**
2. **使用环境变量或构建参数传递 API Key**
3. **考虑使用后端代理 API 调用**（更安全的方式）

### 更安全的部署方式（推荐）

由于前端代码会暴露 API Key，建议：

1. **创建后端 API 代理**：
   - 在服务器上运行 Node.js 后端
   - 后端持有 API Key
   - 前端调用后端 API，后端再调用 Gemini API

2. **使用服务器端环境变量**：
   - 在构建时通过 CI/CD 传入环境变量
   - 或使用服务器环境变量

---

## 🔧 构建优化

### 生产构建

```bash
npm run build
```

构建产物在 `dist` 目录，包含：
- 压缩的 JavaScript 和 CSS
- 优化的静态资源
- 代码分割

### 预览构建结果

```bash
npm run preview
```

---

## 📝 部署检查清单

- [ ] 已获取 Gemini API Key
- [ ] 已配置环境变量
- [ ] 已执行 `npm run build` 成功
- [ ] 已上传 `dist` 目录到服务器
- [ ] 已配置 Web 服务器（Nginx/Apache）
- [ ] 已配置域名和 DNS（如需要）
- [ ] 已配置 HTTPS（推荐）
- [ ] 已测试所有功能正常
- [ ] 已设置监控和日志

---

## 🐛 常见问题

### 1. API Key 未生效

- 检查环境变量是否正确设置
- 确认构建时环境变量已注入
- 查看浏览器控制台是否有错误

### 2. 路由 404 错误

- 确保 Web 服务器配置了 SPA 路由重定向（`try_files` 或 `rewrite`）
- 检查 `index.html` 是否正确返回

### 3. 静态资源加载失败

- 检查 `vite.config.ts` 中的 `base` 配置
- 确认资源路径是否正确

### 4. CORS 错误

- 如果使用后端代理，检查 CORS 配置
- 确保 API 调用路径正确

---

## 📞 需要帮助？

如果遇到问题，请检查：
1. 服务器日志
2. 浏览器控制台
3. 网络请求（开发者工具 Network 标签）

---

## 🔒 安全建议

1. **永远不要**在代码仓库中提交 API Key
2. 使用环境变量或密钥管理服务
3. 考虑使用后端 API 代理保护 API Key
4. 启用 HTTPS
5. 定期轮换 API Key
6. 设置 API Key 使用限制（在 Google Cloud Console）

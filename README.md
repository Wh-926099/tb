<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lumina - 数字化蜕变游戏

这是一个基于 React + Vite + TypeScript 开发的数字化蜕变游戏，使用 DeepSeek AI 生成游戏内容。

View your app in AI Studio: https://ai.studio/apps/drive/1Myy-wviJSeJEZDz0rUA_N8cP_2adJA56

## 本地运行

**前置要求:**  Node.js 18+

1. 安装依赖:
   ```bash
   npm install
   ```

2. 配置环境变量:
   
   创建 `.env.local` 文件（或 `.env`），设置你的 DeepSeek API Key:
   ```
   DEEPSEEK_API_KEY=your_api_key_here
   ```
   
   从 [DeepSeek 官网](https://platform.deepseek.com/) 获取 API Key

3. 运行开发服务器:
   ```bash
   npm run dev
   ```

4. 在浏览器中打开 http://localhost:3000

## 部署到服务器

### 🚀 GitHub Pages 部署（推荐）

最简单的部署方式，一键自动部署！

**快速开始：**
1. 在 GitHub 仓库设置中添加 Secret：`DEEPSEEK_API_KEY`
2. 启用 GitHub Pages（Source 选择 `GitHub Actions`）
3. 推送代码到 `main` 分支
4. 等待自动部署完成

详细步骤请查看：[GITHUB_PAGES.md](./GITHUB_PAGES.md)

### 其他部署方式

详细的部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

- **Docker 部署**: 使用 `docker-compose up -d`（需要先设置环境变量）
- **Nginx 部署**: 构建后上传 `dist` 目录到服务器
- **云平台部署**: 支持 Vercel、Netlify 等

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录中。

## 项目结构

```
├── components/          # React 组件
├── services/           # API 服务（DeepSeek AI）
├── types.ts           # TypeScript 类型定义
├── constants.ts       # 游戏常量配置
├── App.tsx            # 主应用组件
└── vite.config.ts     # Vite 配置
```

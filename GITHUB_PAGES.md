# GitHub Pages 快速部署指南

## 🚀 一键部署到 GitHub Pages

### 前置要求

- GitHub 账户
- 已创建 GitHub 仓库
- DeepSeek API Key（从 [DeepSeek 官网](https://platform.deepseek.com/) 获取）

---

## 📝 部署步骤

### 第一步：配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 `Settings`（设置）
3. 在左侧菜单找到 `Secrets and variables` → `Actions`
4. 点击 `New repository secret`
5. 填写：
   - **Name**: `DEEPSEEK_API_KEY`
   - **Value**: 你的 DeepSeek API Key
6. 点击 `Add secret`

### 第二步：启用 GitHub Pages（重要！）

⚠️ **这一步必须在推送代码之前完成，否则部署会失败！**

1. 进入你的 GitHub 仓库
2. 点击 `Settings`（设置）
3. 在左侧菜单找到 `Pages`
4. 在 `Build and deployment` 部分：
   - **Source**：选择 `GitHub Actions`（不是 `Deploy from a branch`）
   - 如果看到 "Use a suggested workflow" 或 "Static HTML" 等选项，**不要点击 Configure**
   - 只需要确保 Source 下拉菜单选择的是 `GitHub Actions`
5. 保存设置（如果有 Save 按钮，点击保存）

**重要提示**：
- 如果 Source 显示为 "Deploy from a branch"，需要改为 "GitHub Actions"
- 如果看不到 "GitHub Actions" 选项，可能是仓库权限问题，确保你有管理员权限
- 首次启用可能需要几分钟才能生效

### 第三步：推送代码

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "Configure GitHub Pages deployment"

# 推送到 GitHub
git push origin main
```

### 第四步：等待部署完成

1. 进入仓库的 `Actions` 标签页
2. 查看 `Deploy to GitHub Pages` 工作流
3. 等待部署完成（通常需要 1-2 分钟）

### 第五步：访问网站

部署完成后，访问：
```
https://你的用户名.github.io/仓库名/
```

例如：`https://username.github.io/lumina-game/`

**注意**：如果你只是想使用 GitHub Pages 的默认域名（`username.github.io/repo-name`），**不需要**添加自定义域名。直接跳过下面的"自定义域名"部分即可。

---

## 🌐 自定义域名（可选）

如果你想使用自己的域名（例如：`example.com` 或 `www.example.com`），可以按照以下步骤配置：

### 重要提示

⚠️ **如果只是想使用默认的 GitHub Pages 域名，请跳过此步骤！**

### 配置步骤

1. **在 GitHub Pages 设置中添加域名**：
   - 进入仓库的 `Settings` → `Pages`
   - 在 `Custom domain` 部分，输入你的域名
   - **重要**：只输入域名，不要包含：
     - ❌ 协议（`http://` 或 `https://`）
     - ❌ 路径（`/` 或 `/path`）
     - ❌ 端口号（`:80` 或 `:443`）
   
   **正确格式示例**：
   - ✅ `example.com`
   - ✅ `www.example.com`
   - ✅ `game.example.com`
   
   **错误格式示例**：
   - ❌ `https://example.com`（不要包含协议）
   - ❌ `example.com/`（不要包含尾部斜杠）
   - ❌ `http://www.example.com`（不要包含协议）

2. **配置 DNS 记录**：
   
   在你的域名注册商或 DNS 服务商处添加以下记录：
   
   **选项 A：使用 A 记录（推荐）**
   ```
   类型: A
   主机记录: @ (或留空，表示根域名)
   值: 185.199.108.153
   值: 185.199.109.153
   值: 185.199.110.153
   值: 185.199.111.153
   ```
   
   如果使用子域名（如 `www.example.com`）：
   ```
   类型: A
   主机记录: www
   值: 185.199.108.153
   值: 185.199.109.153
   值: 185.199.110.153
   值: 185.199.111.153
   ```
   
   **选项 B：使用 CNAME 记录（仅适用于子域名）**
   ```
   类型: CNAME
   主机记录: www (或其他子域名)
   值: 你的用户名.github.io
   ```
   
   ⚠️ **注意**：根域名（`example.com`）不能使用 CNAME，必须使用 A 记录。

3. **等待 DNS 生效**：
   - DNS 更改通常需要几分钟到几小时才能生效
   - 可以使用 `dig` 或在线工具检查 DNS 是否已生效

4. **启用 HTTPS（自动）**：
   - GitHub Pages 会自动为自定义域名配置 HTTPS
   - 等待几分钟后，`Enforce HTTPS` 选项会变为可用
   - 勾选 `Enforce HTTPS` 以强制使用 HTTPS

### 自定义域名常见错误

**错误：Domain is not a valid public domain**

可能原因：
- 输入了 GitHub Pages 的默认域名（`username.github.io`）
- 域名格式不正确（包含了协议或路径）
- 域名还未在 DNS 中正确配置

解决方法：
- 确保只输入纯域名，例如：`example.com`
- 不要输入 `https://example.com` 或 `example.com/`
- 如果使用默认域名，不需要添加自定义域名

---

## 🔄 自动部署

配置完成后，每次你推送代码到 `main` 或 `master` 分支时，GitHub Actions 会自动：
1. 构建项目
2. 部署到 GitHub Pages
3. 更新网站内容

---

## ⚙️ 手动触发部署

如果需要手动触发部署：

1. 进入仓库的 `Actions` 标签页
2. 选择 `Deploy to GitHub Pages` 工作流
3. 点击 `Run workflow`
4. 选择分支（通常是 `main`）
5. 点击 `Run workflow`

---

## 🐛 常见问题

### 1. 部署失败：API Key 未设置

**错误信息**：`DEEPSEEK_API_KEY` is not set

**解决方法**：
- 检查是否在 GitHub Secrets 中正确设置了 `DEEPSEEK_API_KEY`
- 确保 Secret 名称完全匹配（区分大小写）

### 2. 网站显示 404

**可能原因**：
- base 路径配置不正确
- GitHub Pages 还未完全部署完成（等待几分钟）

**解决方法**：
- 检查仓库设置中的 Pages 配置
- 确认访问 URL 格式正确：`https://用户名.github.io/仓库名/`

### 3. 资源加载失败（CSS/JS 404）

**解决方法**：
- 检查 `vite.config.ts` 中的 `base` 配置
- 确保 base 路径以 `/` 开头和结尾，例如：`/lumina-game/`

### 4. 部署后 API 调用失败

**可能原因**：
- API Key 未正确设置
- API Key 已过期或被撤销

**解决方法**：
- 检查 GitHub Secrets 中的 API Key 是否正确
- 在 Google AI Studio 中验证 API Key 是否有效

### 5. 错误：Get Pages site failed

**错误信息**：`Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions`

**原因**：
- GitHub Pages 未启用
- Source 未设置为 "GitHub Actions"
- 仓库权限不足

**解决方法**：
1. 进入仓库的 `Settings` → `Pages`
2. 确保 `Source` 选择的是 `GitHub Actions`（不是 "Deploy from a branch"）
3. 如果看不到 "GitHub Actions" 选项：
   - 检查仓库权限（需要管理员权限）
   - 确保仓库不是私有仓库的免费账户（免费账户的私有仓库不支持 GitHub Pages）
4. 保存设置后，等待 1-2 分钟
5. 重新触发工作流（在 Actions 标签页点击 "Run workflow"）

**注意**：工作流中已添加 `enablement: true` 参数，可以自动启用 Pages，但首次部署前最好手动检查设置。

### 6. 自定义域名错误：Domain is not a valid public domain

**错误原因**：
- 输入了包含协议或路径的域名（如 `https://example.com`）
- 输入了 GitHub Pages 的默认域名
- 域名格式不正确

**解决方法**：
- 只输入纯域名，例如：`example.com` 或 `www.example.com`
- 不要包含 `http://`、`https://` 或尾部斜杠 `/`
- 如果只想使用默认域名（`username.github.io/repo-name`），不需要添加自定义域名

---

## 🔒 安全提示

✅ **已配置**：API Key 存储在 GitHub Secrets 中，不会暴露在代码中

⚠️ **注意**：虽然 API Key 不会出现在代码仓库中，但构建后的前端代码仍然会包含 API Key。如果担心安全性，建议：
- 设置 API Key 的使用限制（在 Google Cloud Console）
- 定期轮换 API Key
- 考虑使用后端 API 代理（更安全的方式）

---

## 📚 更多信息

- 详细部署文档：[DEPLOYMENT.md](./DEPLOYMENT.md)
- GitHub Pages 官方文档：https://docs.github.com/pages
- GitHub Actions 文档：https://docs.github.com/actions

---

## ✨ 完成！

如果一切顺利，你的游戏现在应该已经部署到 GitHub Pages 了！🎉

访问你的网站，开始游戏吧！

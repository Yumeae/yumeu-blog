# Astro + Cloudflare 博客系统

运行在 Cloudflare Pages + Workers + KV + R2 的现代化博客系统。

## 功能亮点

- **Cloudflare 原生架构**：静态资源托管在 Pages，API 运行在 Edge Runtime Worker
- **KV + R2 内容栈**：文章元数据、Markdown 保存于 KV，媒体文件存储于 R2
- **Cloudflare Access 防护**：`/admin` 与 CMS API 仅在 Access JWT 校验通过后可用
- **Markdown Pretty Printer**：持久化前执行 AST 校验，确保格式一致性
- **失效标记与刷新**：自动检测内容过期并触发后台刷新
- **Workers Analytics 审计**：发布、删除、媒体上传等事件记录

## 技术栈

- **前端框架**：Astro 5 + React 19
- **运行环境**：Cloudflare Pages + Workers
- **数据存储**：Cloudflare KV、R2、Workers Analytics
- **样式**：Tailwind CSS 3
- **动画**：motion
- **图标**：Lucide React
- **Markdown**：marked
- **代码高亮**：Shiki

## 项目结构

```
src/
  pages/              # Astro 页面路由
  components/         # React 组件
  lib/                # 工具函数（KV、Access、Analytics）
  types/              # TypeScript 类型定义
  functions/          # Cloudflare Worker API
wrangler.toml         # Cloudflare 配置
```

## 环境变量

需要在 Cloudflare Dashboard 配置以下变量：

| 变量名 | 说明 |
|---|---|
| `ACCESS_AUD` | Cloudflare Access Application AUD |
| `ACCESS_TEAM_DOMAIN` | Access Team 域名 |
| `ACCESS_EMAIL_ALLOWLIST` | 允许登录的邮箱列表（逗号分隔）|
| `MEDIA_PUBLIC_BASE_URL` | R2 公开访问 URL |
| `MEDIA_R2_PREFIX` | R2 对象前缀 |

## Cloudflare 资源绑定

1. **KV Namespace**：`CONTENT_KV` - 存储文章索引和内容
2. **R2 Bucket**：`MEDIA_BUCKET` - 存储媒体文件
3. **Analytics Dataset**：`WORKERS_ANALYTICS` - 记录审计事件

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 部署到 Cloudflare

### 1. 创建 Cloudflare 资源

在 Cloudflare Dashboard 创建：
- KV Namespace (CONTENT_KV)
- R2 Bucket (MEDIA_BUCKET)
- Workers Analytics Dataset
- Access Application (保护 /admin 路径)

### 2. 配置环境变量

在 `wrangler.toml` 中配置变量和绑定 ID。

### 3. 构建和部署

```bash
# 构建
pnpm build

# 部署
wrangler deploy
```

### 4. 配置 Pages 路由

在 Cloudflare Pages 项目设置中，配置以下路由规则：

```
/api/*     -> Worker
/admin/api/* -> Worker
/*         -> Static Assets
```

## API 端点

| 方法 | 路径 | 说明 | 权限 |
|---|---|---|---|
| `GET` | `/api/posts` | 获取文章列表 | 公开 |
| `GET` | `/api/posts/[slug]` | 获取文章详情 | 公开 |
| `POST` | `/api/posts/refresh` | 触发内容刷新 | 公开 |
| `GET` | `/admin/api/posts` | 获取 CMS 文章列表 | Access |
| `POST` | `/admin/api/posts` | 创建文章 | Access |
| `PUT` | `/admin/api/posts/[slug]` | 更新文章 | Access |
| `DELETE` | `/admin/api/posts/[slug]` | 删除文章 | Access |
| `POST` | `/admin/api/media` | 上传媒体文件 | Access |

## 贡献指南

1. 遵循现有代码风格
2. 使用 TypeScript
3. 添加适当的类型注解
4. 提交前运行 `pnpm build` 确保构建成功

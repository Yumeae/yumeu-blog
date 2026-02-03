# Astro Cloudflare Blog

一个运行在 Cloudflare Pages + Workers + KV + R2 的全新博客系统，继承 2025 Blog 的交互与视觉，并按 `.monkeycode/specs/astro-cloudflare-blog/requirements.md` 实现内容与发布全链路 Cloudflare 化。

## 功能亮点

- **Cloudflare 原生架构**：静态资源托管在 Pages，API / CMS 路径运行在 Edge Runtime Worker，延迟最低 50ms。
- **KV + R2 内容栈**：文章元数据、Markdown、草稿保存在 KV，媒体文件写入 R2，并通过 KV 反查公开 URL。
- **Cloudflare Access 防护**：`/admin` 与所有 CMS API 仅在 Access JWT 校验通过后可用，同时支持邮箱白名单。
- **Markdown Pretty Printer**：持久化前执行 AST round-trip 校验，确保标题层级、空行、代码块围栏等与设计风格一致。
- **失效标记与刷新**：前端若发现 `versionTimestamp` 超过 5 分钟，会展示 “内容过期，刷新中” 徽标并向 `/api/posts/refresh` 发送后台刷新请求。
- **Workers Analytics 审计**：发布、删除、缺失 slug、媒体上传等事件都会被写入 Analytics Dataset，方便追踪。

## 技术栈

- **框架**：Next.js 16 (App Router, React 19)
- **运行**：Cloudflare Pages + Workers (`nodejs_compat`)
- **数据**：Cloudflare KV、R2、Workers Analytics
- **客户端**：SWR、Zustand、motion、dayjs、Lucide、Shiki、KaTeX

## 目录速览

```
src/
  app/
    (home)/                 # 首页卡片、拖拽布局、stale 提示
    api/                    # 面向读者的 Edge API（posts 列表/详情/刷新）
    admin/api/              # CMS API（Access 验证、KV/R2 写入）
    write/                  # CMS 前端（后续逐步切换到新 API）
  lib/                      # Access、KV 仓储、内容解析、Cloudflare env 工具
  hooks/                    # SWR 数据、状态管理
public/blogs/               # 旧 Git 驱动内容，作为 Worker 宕机时的兜底
wrangler.toml               # Cloudflare 绑定、变量、资产配置
.monkeycode/specs/          # 需求与设计文档
```

## 环境变量与绑定

| 名称 | 说明 |
| --- | --- |
| `NEXT_PUBLIC_GITHUB_OWNER` / `REPO` / `BRANCH` | 旧版 GitHub 内容仓库（回退用，可保留默认） |
| `NEXT_PUBLIC_GITHUB_APP_ID` | 旧流程保留字段，不影响 Cloudflare 流水线 |
| `BLOG_SLUG_KEY` | CMS 默认 slug，可留空 |
| `ACCESS_AUD` | Cloudflare Access Application 的 AUD，`src/lib/access.ts` 会用它校验 JWT |
| `ACCESS_TEAM_DOMAIN` | 你的 Access Team 域名（例：`team.cloudflareaccess.com`） |
| `ACCESS_EMAIL_ALLOWLIST` | 允许登录 CMS 的邮箱列表，逗号分隔 |
| `MEDIA_PUBLIC_BASE_URL` | 指向 R2 自定义域或 CDN，用于拼接媒体访问 URL |
| `MEDIA_R2_PREFIX` | R2 对象前缀，默认 `media` |

`wrangler.toml` 需要绑定：

- `CONTENT_KV`：文章索引、正文、草稿、媒体记录
- `MEDIA_BUCKET`：Cloudflare R2 Bucket
- `WORKERS_ANALYTICS`：Workers Analytics Dataset（事件审计）
- `ASSETS`：Pages 静态资源（OpenNext 产物）

## 本地开发

```bash
# 安装依赖（Node.js 18+）

# 启动 Next 开发服务器（端口 2025）

# Cloudflare 构建（生成 .open-next）

# Cloudflare Worker 预览（需要 wrangler）
```

> MonkeyCode 环境若限制本地安装，请在支持 `pnpm install` 的机器执行上述步骤。

## Cloudflare Pages + Workers 部署指南

1. **创建资源**：在 Cloudflare 后台创建 KV Namespace、R2 Bucket、Workers Analytics Dataset，并把 ID/Friendly Name 写入 `wrangler.toml`。同时创建 Access Application，路径覆盖 `/admin` 与 `/admin/api/*`，AUD 与 `ACCESS_AUD` 一致。
2. **构建**：执行 `pnpm run build:cf`，确保 `.open-next` 与 `.open-next/worker.js` 生成。
3. **部署**：运行 `npx wrangler deploy`（或 CI 中同等命令）。Wrangler 会同时上传 Pages 资产与 Worker，Pages 需将 `/api/*`、`/admin/api/*` 反向代理到 Worker。
4. **验证**：
   - 访问 `/api/posts` 应返回 `items`、`versionTimestamp` 与 `stale` 字段。
   - 登录 `/admin`，尝试上传图片、保存文章，确认 KV/R2/Analytics 中产生对应记录。

## CMS / API 快速参考

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/api/posts` | 读者文章列表，包含 `stale` 与版本时间戳 |
| `GET` | `/api/posts/[slug]` | 单篇文章详情，不存在时返回 `missing-slug` 并写入 Analytics |
| `POST` | `/api/posts/refresh` | 前端发起的后台刷新事件，返回 202 |
| `POST` | `/admin/api/posts` | 新建文章（Access 校验、KV 写入、审计） |
| `PUT` / `DELETE` | `/admin/api/posts/[slug]` | 更新或删除文章 |
| `PUT` | `/admin/api/drafts/[slug]` | 草稿自动保存到 KV |
| `POST` | `/admin/api/media` | 上传图片到 R2，记录对象元信息 |

## 数据新鲜度与回退逻辑

- Worker 每次写入都会更新 `posts:index` 与 `versionTimestamp`。`src/hooks/use-blog-index.ts` 会判断当前时间与版本时间的差值，超过 5 分钟即视为 stale。
- 首页 `ArticleCard` 在 stale 场景下会展示 “内容过期” 徽标，并自动调用 `/api/posts/refresh`；同时继续渲染现有内容，避免空白。
- 当 Worker 不可用时，Hook 会自动回退读取 `public/blogs/index.json`，确保用户至少能看到旧内容。

## 贡献指南

1. 新增需求请在 `.monkeycode/specs/<feature>/` 中撰写 `requirements.md` 与 `design.md`。
2. 遵循 `pnpm lint --fix` / `pnpm test`（后续补充）以保证质量。
3. 提交 PR 时请附带部署说明或截图，便于审阅。

欢迎反馈问题或提交改进，期待一起构建更好的 Cloudflare 原生博客体验。

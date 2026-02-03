# 需求文档

## 引言

该需求旨在以现有 `2025 Blog` Next.js 项目为体验蓝本，交付一个运行在 Astro + Cloudflare Pages + Cloudflare Workers + KV + R2 的全栈博客系统。目标是保证前端页面风格与现站一致，同时提供 Cloudflare Access 保护的 CMS，并让新增内容直接落地于 KV 与 R2；历史博客数据不迁移，运维仅需管理新版内容。

## 词汇表

- **Astro Frontend**：由 Astro 构建的前端代码，部署在 Cloudflare Pages 上，负责页面渲染与交互。
- **Cloudflare Pages Host**：承载 Astro Frontend 的 Cloudflare Pages 运行环境，负责静态资源分发与 Workers 路由绑定。
- **Cloudflare Worker API**：运行在 Cloudflare Workers 上的 API 层，处理 CMS 请求、内容读取与写入。
- **CMS Admin Portal**：运行于 Astro Frontend `/admin` 路径的管理界面，供内容运营编辑文章与资源。
- **Access Gateway**：Cloudflare Access 鉴权层，为 CMS Admin Portal 与后台 API 提供基于 JWT 的访问控制。
- **Content KV Namespace**：Cloudflare KV 命名空间，保存文章元数据、草稿、发布状态等结构化 JSON。
- **Media R2 Bucket**：Cloudflare R2 存储，用于保存富媒体资源并生成访问 URL。
- **Workers Analytics Engine**：Cloudflare Workers 的日志分析目标，用于记录审计与运行指标。
- **Content Parser Service**：运行在 Cloudflare Worker API 内的 Markdown 与 front-matter 解析模块。
- **Pretty Printer Service**：依赖 Content Parser Service 的格式化模块，对 Markdown AST 进行规范化输出。
- **Media Upload Pipeline**：Cloudflare Worker API 中负责把 CMS 上传的图片写入 Media R2 Bucket 并下发访问 URL 的子系统。
- **Reader**：访问公开博客内容的访客用户。
- **Content Editor**：负责撰写或维护文章的运营人员。
- **Maintainer**：具有发布权限并通过 Cloudflare Access 登录 CMS Admin Portal 的人员。
- **Platform Engineer**：负责部署、监控与运行拓扑配置的工程角色。

## 需求

### 需求1：Astro 页面体验对齐

**用户故事：** AS Reader, I want the Astro Frontend to preserve the 2025 Blog look and interactions so that I can browse familiar sections without regression.

#### Acceptance Criteria

1. WHEN Reader requests `/`, Astro Frontend SHALL render hero、导航与精选 Card 结构，并使用 Cloudflare Worker API 返回的最近 5 分钟内版本数据。
2. WHILE Reader 在首页、文章列表与详情页之间导航，Astro Frontend SHALL 保持桌面与移动端 p95 小于 2 秒的首次可交互时间并完成 Card、时间线与联系组件的 Hydration。
3. IF Cloudflare Worker API 返回的 `versionTimestamp` 早于 5 分钟，Astro Frontend SHALL 显示 `stale` 徽标并向 Cloudflare Worker API 触发后台刷新请求，同时继续渲染当前内容。

### 需求2：Cloudflare 数据栈存取

**用户故事：** AS Content Editor, I want post metadata and media stored in Cloudflare KV and R2 so that publishing is independent from GitHub.

#### Acceptance Criteria

1. WHEN CMS Admin Portal 发布文章，Cloudflare Worker API SHALL 以文章 slug 为键将 JSON 元数据写入 Content KV Namespace，并包含 `publishedAt`、`status` 与 `heroImageUrl` 字段。
2. WHEN CMS Admin Portal 上传富媒体，Media Upload Pipeline SHALL 将二进制流写入 Media R2 Bucket，并在 500ms 内把生成的签名 URL 回写到 Content KV Namespace。
3. WHILE Cloudflare Worker API 处理 `GET /api/posts` 请求，Cloudflare Worker API SHALL 批量读取 Content KV Namespace 内容、按 `publishedAt` 倒序分页并在 300ms p95 内响应 100 并发读取。
4. IF Content KV Namespace 未命中请求的 slug，Cloudflare Worker API SHALL 返回带有 `code`、`requestedSlug`、`timestamp` 字段的 404 JSON，并在 Workers Analytics Engine 记录一次 `missing-slug` 事件。

### 需求3：CMS 管理与 Access 防护

**用户故事：** AS Maintainer, I want the CMS Admin Portal secured by Cloudflare Access so that only authorized staff can edit content.

#### Acceptance Criteria

1. WHEN Maintainer 访问 `/admin`，Access Gateway SHALL 校验 Cloudflare Access JWT 后才返回 CMS Admin Portal 资源。
2. WHILE Maintainer 在 CMS Admin Portal 编辑内容，CMS Admin Portal SHALL 每 30 秒自动保存草稿到 Content KV Namespace 并展示时间戳确认。
3. IF Access Gateway 校验失败，Access Gateway SHALL 重定向至 Cloudflare Access 登录端点并在 Workers Analytics Engine 记录含 `reason` 与 `requestId` 的拒绝事件。
4. WHEN Maintainer 点击发布，CMS Admin Portal SHALL 要求双重确认并在 Content KV Namespace 存储包含作者、slug、差异哈希的审计记录。

### 需求4：部署拓扑与路由

**用户故事：** AS Platform Engineer, I want Cloudflare Pages and Workers wired together so that the Astro build and APIs share a single域名。

#### Acceptance Criteria

1. WHEN Cloudflare Pages Host 完成 Astro 构建，Cloudflare Pages Host SHALL 部署静态产物并把 `/api/*` 与 `/admin/api/*` 路径绑定到 Cloudflare Worker API，附加延迟不超过 50ms。
2. WHILE Cloudflare Pages Host 转发 `/admin` 与 `/api` 请求，Cloudflare Pages Host SHALL 透传 `CF-Access-Client-Id` 与 `CF-Access-Client-Secret` 头给 Cloudflare Worker API。
3. IF Cloudflare Worker API 超过 5 秒无响应，Cloudflare Pages Host SHALL 返回 Astro Frontend 提供的维护页并向 Workers Analytics Engine 发送包含 `region` 与 `duration` 的告警事件。

### 需求5：Markdown 解析与漂亮打印

**用户故事：** AS Maintainer, I want consistent Markdown parsing and formatting so that round-trip editing remains lossless.

#### Acceptance Criteria

1. WHEN CMS Admin Portal 保存 Markdown，Content Parser Service SHALL 解析 YAML front-matter、Markdown 正文与媒体引用为 AST，并在成功前校验必填字段。
2. WHILE Content Parser Service 处理 AST，Pretty Printer Service SHALL 应用统一的空行、标题层级与代码块围栏格式以符合博客样式指南。
3. IF Content Parser Service 将 AST 序列化回 Markdown，Content Parser Service SHALL 重新解析序列化后的文本并比较 AST 哈希，以往返校验通过后才确认持久化。
4. WHEN Content Parser Service 检测到语法错误，Content Parser Service SHALL 返回包含行号与规则编号的结构化错误并阻止写入 Content KV Namespace。

### 需求6：新版内容独立运营

**用户故事：** AS Maintainer, I want the new Astro + Cloudflare stack to start clean so that I only manage fresh posts created after go-live.

#### Acceptance Criteria

1. WHEN Maintainer 创建第一篇内容，CMS Admin Portal SHALL 提示“旧版博客不自动迁移”并引导导入素材的手工流程文档链接。
2. WHILE Maintainer 在 CMS Admin Portal 浏览文章列表，CMS Admin Portal SHALL 仅查询 Content KV Namespace 新建的记录，绝不调用旧 GitHub 仓库 API。
3. IF Reader 请求到的 slug 尚未创建，Cloudflare Worker API SHALL 返回“内容即将上线”文案并提供订阅入口，不执行 GitHub 兜底读取。

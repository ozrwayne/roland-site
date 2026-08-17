# Roland Wayne

Roland Wayne 的个人网站，使用 Astro 构建，并通过 Cloudflare Workers 部署。

## 项目结构

- `src/pages/`：Astro 路由，包含文章列表、文章详情与其他公开页面。
- `src/content/blog/`：本地 Markdown 文章。
- `apps/homepage/`：新版 React 首页；独立构建后只覆盖正式产物的 `/`。
- `public/`：Astro 页面使用的静态资源。
- `wrangler.jsonc`：Cloudflare Worker 部署配置。

首页和文章系统保持构建边界：调整首页不会改动文章详情模板，Astro 仍负责 `/blog/*` 等服务端路由。

## 本地开发

```sh
npm install
npm run dev
```

单独开发新版首页：

```sh
npm run dev:homepage
```

生产构建：

```sh
npm run build
```

## 内容维护

- 历史文章位于 `src/content/blog/`；新文章从 `https://cms.rolandwayne.com` 的 WordPress REST API 读取。
- WordPress 与 Markdown 文章在构建时合并；slug 相同时以 WordPress 版本为准。
- WordPress API 无法访问时构建会停止，避免部署一个缺少 CMS 文章的版本。
- 新版首页使用的生产资源位于 `apps/homepage/public/`；设计实验与 QA 产物不参与正式构建。

## GitHub 自动部署

`main` 分支已经连接到 Cloudflare Workers Builds。向 `main` 推送提交后，Cloudflare 会自动执行：

```text
npm run build
npx wrangler deploy
```

因此日常发布流程是：本地完成修改 → `npm run build` 验证 → 提交并推送到 `main`。构建或部署失败时，在 Cloudflare Worker 的部署记录中查看日志。

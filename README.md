# Roland Wayne

Roland Wayne 的个人网站，通过 Cloudflare Workers 部署。

## 生产结构

- `apps/homepage/`：React 首页与全部首页静态资源。
- `src/content/blog/`：本地 Markdown 文章。
- `src/pages/blog/[...slug].astro`：文章详情路由。
- `src/layouts/ArticlePost.astro`：文章页面布局。
- `src/pages/api/contact.ts`：保留的联系表单兼容 API。
- `src/pages/` 中其他页面：旧公开 URL 的永久重定向入口。
- `scripts/overlay-homepage.mjs`：把 React 首页覆盖到 Astro/Cloudflare 构建产物的 `/`。

旧 Astro 站点完整保存在 Git 标签 `archive/astro-legacy-2026-08-17`，不再留在生产源码中。

## 本地开发

```sh
npm install
npm run dev:homepage
```

生产构建：

```sh
npm run build
```

`main` 连接 Cloudflare Workers Builds。推送前必须完成生产构建与桌面、移动端页面检查。

# Roland Wayne 维护说明

## 架构边界

生产首页是 `apps/homepage/` 的 React/Vite 应用。Astro 只保留文章内容、文章详情、兼容 API、旧 URL 重定向、SEO、Sitemap 与 Cloudflare 构建能力。

`npm run build` 的顺序：

1. 构建 Astro 文章与兼容路由；
2. 构建 React 首页到 `apps/homepage/dist/client/`；
3. 使用 `scripts/overlay-homepage.mjs` 把 React 首页覆盖到根 `dist/`。

旧 Astro UI 源码保存在 Git 标签 `archive/astro-legacy-2026-08-17`。

## 路由

| URL | 行为 |
|---|---|
| `/` | React 首页 |
| `/blog/:slug` | Astro 文章详情 |
| `/blog` | 301 到 `/#articles` |
| `/about` | 301 到 `/#about` |
| `/research` | 301 到 `/#researching` |
| `/services` | 301 到 `/#building` |
| `/university` | 301 到 `/#collaborating` |
| `/contact` | 301 到 `/#contacting` |
| `/zh/*` | 301 到对应 React 首页模块 |
| `/api/contact` | 兼容的联系表单 POST API |

## 内容和书架

- 文章源文件：`src/content/blog/`
- 文章封面与正文图片：`public/images/blog/`
- 书架数据和书本结构：`apps/homepage/src/BookshelfApp.jsx`
- 书架资源：`apps/homepage/public/assets/books/`
- 新增书本：使用项目 Skill `$add-bookshelf-book`

## 验证

```sh
npm run build
node .agents/skills/add-bookshelf-book/scripts/validate-bookshelf.mjs
```

再用浏览器检查桌面和 390px 移动端：首页主要模块、书架循环、文章详情、旧 URL 重定向、无横向溢出。

项目不再维护 OpenAI Sites 的 worker、hosting manifest 或打包测试；唯一部署目标是 Cloudflare。

# Roland Wayne 维护说明

## 架构边界

生产站只有一套 React/Vite 前端。Vite 输出首页与浏览器资源，`scripts/generate-react-site.mjs` 使用同一个 React 文章组件生成静态文章 HTML、SEO、Sitemap 和 404 页面。`worker/index.js` 只处理 `/api/contact`，其余请求交给 Cloudflare 静态资源绑定。

`npm run build` 的顺序：

1. Vite 构建 React 首页到根 `dist/`；
2. React SSG 读取 `content/blog/` 并生成 `dist/blog/<slug>/index.html`；
3. 生成 Sitemap、404 与完整静态资源产物。

## 路由

| URL | 行为 |
|---|---|
| `/` | React 首页 |
| `/blog/:slug/` | React 静态文章详情 |
| `/blog` | 301 到 `/#articles` |
| `/about` | 301 到 `/#about` |
| `/research` | 301 到 `/#researching` |
| `/services` | 301 到 `/#building` |
| `/university` | 301 到 `/#collaborating` |
| `/contact` | 301 到 `/#contacting` |
| `/zh/*` | 301 到对应 React 首页模块 |
| `/api/contact` | 联系表单 POST API |

## 内容和书架

- 文章源文件：`content/blog/`
- 文章封面与正文图片：`public/images/blog/`
- 书架数据和书本结构：`apps/homepage/src/BookshelfApp.jsx`
- 书架资源：`public/assets/books/`
- 新增书本：使用项目 Skill `$add-bookshelf-book`

## 验证

```sh
npm run build
npm run validate
```

再用浏览器检查桌面和 390px 移动端：首页主要模块、书架循环、文章详情、旧 URL 重定向、无横向溢出。

项目不维护其他部署目标；唯一部署目标是 Cloudflare。

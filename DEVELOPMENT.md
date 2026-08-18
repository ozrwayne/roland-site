# Roland Wayne 维护说明

## 架构边界

生产站只有一套 React/Vite 前端。Vite 输出首页与浏览器资源，`scripts/generate-react-site.mjs` 使用同一个 React 文章组件生成静态文章 HTML、SEO、Sitemap 和 404 页面。`worker/index.js` 只处理 `/api/contact`，其余请求交给 Cloudflare 静态资源绑定。

`npm run build` 的顺序：

1. Vite 构建 React 首页到根 `dist/`；
2. React SSG 读取 `content/blog/`，生成 `dist/articles/index.html` 和 `dist/blog/<slug>/index.html`；
3. 生成 Sitemap、404 与完整静态资源产物。

## 路由

| URL | 行为 |
|---|---|
| `/` | React 首页 |
| `/articles/` | 可搜索文章索引与完整动态书架 |
| `/blog/:slug/` | React 静态文章详情 |
| `/blog` | 301 到 `/articles/` |
| `/about` | 301 到 `/` |
| `/research` | 301 到 `/` |
| `/services` | 301 到 `/` |
| `/university` | 301 到 `/` |
| `/contact` | 301 到 `/` |
| `/zh/*` | 301 到 `/` |
| `/api/contact` | 联系表单 POST API |

## 内容和书架

- 文章源文件：`content/blog/`
- 文章封面与正文图片：`public/images/blog/`
- 书架数据和书本结构：`apps/homepage/src/BookshelfApp.jsx`
- 文章库页面：`apps/homepage/src/ArticlesIndexPage.jsx`
- 书架资源：`public/assets/books/`
- 新增书本：使用项目 Skill `$add-bookshelf-book`

## 验证

```sh
npm run build
npm run validate
```

再用浏览器检查桌面和 390px 移动端：首页澳洲精选、无 hash 模块导航、`/articles/` 搜索与书架循环、文章详情、旧 URL 重定向、无横向溢出。

项目不维护其他部署目标；唯一部署目标是 Cloudflare。

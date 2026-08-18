# Roland Wayne

`www.rolandwayne.com` 的纯 React 生产源码。React/Vite 负责首页与文章页，Cloudflare Worker 只处理联系 API 和静态资源分发。

## 当前页面

首页 `/` 的信息架构是：

`About → Article → Signal → Building → Collaboration → Contact`

- Article 包含知识网络、文章 heading 与动态书架。
- Building 合并 Services 与 Research。
- 旧 `/about`、`/services`、`/research`、`/university`、`/contact` 和 `/zh/*` 地址继续 301 到对应首页锚点。
- `/blog/<slug>/` 是 React 静态生成的独立文章页；`/blog` 301 到首页 Article。

## 生产结构

| 路径 | 作用 |
|---|---|
| `apps/homepage/src/App.jsx` | React 首页结构、内容与交互 |
| `apps/homepage/src/ArticlePage.jsx` | React 文章页结构与 hydration |
| `apps/homepage/src/BookshelfApp.jsx` | 生产书架数据与完整书本组件 |
| `apps/homepage/src/components/GlobalLandmarkBackground.jsx` | 三段同步、滚动控制的全局背景视频 |
| `content/blog/` | Markdown 文章源文件 |
| `public/` | 图片、视频、书封、PDF、robots 与重定向规则 |
| `scripts/generate-react-site.mjs` | React 文章 SSG、SEO、Sitemap 与 404 生成 |
| `worker/index.js` | Cloudflare 联系 API 与静态资源入口 |
| `wrangler.jsonc` | Cloudflare Worker 与静态资源配置 |

## 本地开发

```sh
npm install
npm run dev
npm run build
npm run validate
npm run preview
```

书架变更还应运行：

```sh
node .agents/skills/add-bookshelf-book/scripts/validate-bookshelf.mjs
```

## 发布与维护

- `main` 连接现有 Cloudflare Workers Builds。
- 推送前完成 `npm run build`、`npm run validate`、`git diff --check`，并检查桌面与移动端页面；构建成功不替代浏览器交互验证。
- 发布 X 高曝光文章使用项目 Skill `.agents/skills/publish-high-exposure-articles/`，一次最多一篇并同步加入书架。
- 单独添加文章、报告或 PDF 书籍使用 `.agents/skills/add-bookshelf-book/`。
- 提交、推送、部署、DNS 或 Cloudflare 配置改动必须另有明确授权。

项目维护边界与当前视觉/交互契约见 `AGENTS.md`、`apps/homepage/AGENTS.md` 和 `BASELINE.md`。

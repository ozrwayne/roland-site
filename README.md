# Roland Wayne

Roland Wayne 的个人网站，使用 Astro 构建，并通过 Cloudflare Workers 部署。

## 本地开发

```sh
npm install
npm run dev
```

生产构建：

```sh
npm run build
```

## 内容维护

- 页面位于 `src/pages/`。
- 历史文章位于 `src/content/blog/`；新文章从 `https://cms.rolandwayne.com` 的 WordPress REST API 读取。
- WordPress 与 Markdown 文章在构建时合并；slug 相同时以 WordPress 版本为准。
- WordPress API 无法访问时构建会停止，避免部署一个缺少 CMS 文章的版本。
- 图片等静态资源位于 `public/`。
- Cloudflare Worker 配置位于 `wrangler.jsonc`。

## GitHub 自动部署

`main` 分支已经连接到 Cloudflare Workers Builds。向 `main` 推送提交后，Cloudflare 会自动执行：

```text
npm run build
npx wrangler deploy
```

因此日常发布流程是：本地完成修改 → `npm run build` 验证 → 提交并推送到 `main`。构建或部署失败时，在 Cloudflare Worker 的部署记录中查看日志。

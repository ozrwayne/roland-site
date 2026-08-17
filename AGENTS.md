# Roland Wayne 网站维护说明

## 项目范围

- 本文件适用于整个仓库。
- 本仓库是 `www.rolandwayne.com` 的 React 首页与 Astro 文章系统源码。
- 当前生产分支是 `main`，远程仓库为 `ozrwayne/roland-site`。
- `/Users/garylau/Work/rolandwayne` 本身就是仓库根目录；不要再在里面嵌套克隆一份仓库。

## 技术栈与目录

- React 19 + Vite 6 负责生产首页；Astro 5 + Tailwind CSS 4 负责文章、兼容路由、SEO 与 Cloudflare 构建。
- 使用 `@astrojs/cloudflare` 适配 Cloudflare Workers/Pages。
- 首页位于 `apps/homepage/`；文章路由和布局位于 `src/pages/blog/`、`src/layouts/ArticlePost.astro`，内容位于 `src/content/`，文章静态资源位于 `public/`。
- 旧 Astro UI 保存在 Git 标签 `archive/astro-legacy-2026-08-17`；旧公开 URL 通过 `src/pages/` 的永久重定向继续可达，不恢复旧 UI 源码。
- `wrangler.jsonc` 是 Cloudflare 部署配置；构建输出目录是 `dist/`。
- `node_modules/`、`.astro/`、`dist/` 和环境变量文件均为本地/生成内容，不应提交。

## 重构边界与旧站基线

开始 UI 或内容改动前先阅读 `BASELINE.md`，但只把它当作旧站状态记录和回归对照，不把它当作新设计约束。

- 本次重构允许把视觉主题、颜色、排版、UI 组件和页面结构全部推倒重来；不得默认继承旧站的深色与金色。
- 必须保留的是现有功能、模块、内容、公开路由/旧链接迁移能力及 SEO/部署能力，不是旧版布局和样式。
- 服务、高校合作、博客、联系等现有目的地需要在新信息架构中仍可到达，但导航的名称、分组、位置和表现形式可以重新设计。
- `/` 是规范首页路由。
- 不编造 Roland 的学历、研究、职业经历、合作方、联系方式或其他个人事实；不确定的内容先标记并请求确认。

## 常用命令

在仓库根目录执行：

```bash
npm install
npm run dev
npm run build
npm run preview
```

提交前至少运行一次 `npm run build`，确认 Astro 生产构建通过。若当前 Codex 运行环境的 `npm` 包装器改走 pnpm，且触发依赖脚本审批错误，可用已安装依赖直接验证：

```bash
./node_modules/.bin/astro build
```

不要因为本地包管理器差异把 `pnpm-lock.yaml` 或 `pnpm-workspace.yaml` 加入仓库；项目现有锁文件是 `package-lock.json`。

## Git 与部署

- 开始工作前检查 `git status`，保留用户已有改动，不覆盖或回退无关文件。
- 更新前优先使用 `git pull --ff-only`；不要使用 `git reset --hard`、强制推送或删除远程分支。
- 代码修改完成后检查 `git diff`、运行构建，再向用户汇报改动和验证结果。
- 提交、推送、Cloudflare 部署或其他外部写入，只有在用户明确要求时执行。
- 未经用户明确授权，不修改域名、DNS、Cloudflare 配置、权限或生产环境变量。

## 密钥与隐私

- 不读取、输出或提交集中式密钥文件、Cookie、访问令牌、私钥或生产数据。
- `.env` 与 `.env.production` 已加入 `.gitignore`；新增环境变量时只记录变量名和用途，不记录值。

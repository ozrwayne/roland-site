# Roland Wayne 网站维护说明

## 项目范围与事实来源

- 本文件适用于整个仓库；进入子目录后还要读取更近层级的 `AGENTS.md`。
- 本仓库是 `https://www.rolandwayne.com/` 的生产源码。仓库根目录就是 `/Users/garylau/Work/rolandwayne`，不要在其中再次克隆仓库。
- 生产分支是 `main`，远程仓库是 `ozrwayne/roland-site`。历史实现只允许从 Git 历史追溯，不得恢复到当前源码。
- 判断当前状态时按“代码与构建配置 → 本地生产构建 → 线上只读检查”的顺序取证。历史原型、生成实验、未跟踪目录和旧会话说明都不能覆盖当前生产代码。
- UI 工作先读 `BASELINE.md` 和 `apps/homepage/AGENTS.md`；书架或高曝光文章发布任务还要读取对应的项目级 Skill。

## 当前生产架构

- React 19.2 + Vite 6.4 是唯一前端运行时，负责规范首页 `/` 与全部 `/blog/<slug>/` 文章页。
- `npm run build` 先由 Vite 构建首页到根 `dist/`，再由 `scripts/generate-react-site.mjs` 使用 React SSR 生成文章静态 HTML、Sitemap 与 404 页面。
- `worker/index.js` 是纯 JavaScript Cloudflare Worker，只负责联系 API 与静态资源分发；旧 URL 重定向由 `public/_redirects` 维护。
- 首页源码入口是 `apps/homepage/src/App.jsx`；书架数据与组件在 `apps/homepage/src/BookshelfApp.jsx`；全局地标背景在 `apps/homepage/src/components/GlobalLandmarkBackground.jsx`；首页样式集中在 `apps/homepage/src/styles.css`。
- 文章内容在 `content/blog/`，生成器与校验器位于 `scripts/`，文章 React 组件与样式位于 `apps/homepage/src/ArticlePage.jsx`、`article.css`。全部静态资源统一位于根 `public/`。
- `node_modules/`、`dist/`、环境变量文件及本地实验产物均不是源码，不得提交。

## 路由与信息架构契约

- `/` 是唯一规范首页。当前首页顺序是 `About → Article → Signal → Building → Collaboration → Contact`。
- 首页锚点是 `#about`、`#articles`、`#signaling`、`#building`、`#collaborating`、`#contacting`；Research 位于 Building 内的 `#researching`。
- `/blog` 永久重定向到 `/#articles`；`/blog/<slug>/` 是可索引的文章详情页。
- `/about`、`/services`、`/research`、`/university`、`/contact` 及现有 `/zh/*` 入口必须继续以 301 指向对应首页锚点。
- Sitemap 只广告 `/` 与具体文章页，不把重定向入口或 `/blog` 列为竞争页面。
- 不随意改动公开 slug、锚点、Canonical、Open Graph、JSON-LD、robots、sitemap 或旧链接迁移行为。

## 当前设计与交互边界

- 2026-08-18 的生产页是当前视觉基线，不再把 2026-05-03 的深色金色旧站当作默认设计来源。
- 首页使用固定 header 行和其下唯一可垂直滚动的 `.content-scroll-region`。导航、滚动进度、背景视频和 section observer 都依赖这个滚动根；不要改回 `window` 滚动。
- 全局背景是三段同步的 15 秒 AI 地标视频，按内容滚动进度控制 `currentTime`，不是自动播放的装饰轮播。具体约束以 `apps/homepage/AGENTS.md` 为准。
- 主要模块使用暖象牙色半透明 archival-paper 表面，外层地标背景保持可见。不要恢复旧站深色/金色主题、全页纸纹、旧 landmark-strip/district 动画或已经退出生产的原型。
- 用户只要求局部视觉修改时，只改指定 surface；不要顺手重排其他模块、重写内容或替换背景系统。
- 不编造 Roland 的学历、研究、职业经历、合作方、粉丝数、曝光量、联系方式或其他事实。改动这类内容前从用户提供材料或当前权威来源核实，并区分可变数据与长期事实。

## 内容与书架一致性

- 文章 `pubDate` 是规范发布日期；`siteDate` 仅为旧导入兼容字段，不用于显示或排序。草稿不得进入生产列表或 Sitemap。
- 每篇进入首页书架的文章都必须同时具备有效的 Markdown 文章、媒体、完整 book object、书封资源和正确生产链接。不要把书架退化为普通封面卡片。
- 日常高曝光文章发布必须使用 `.agents/skills/publish-high-exposure-articles/`；单独添加文章、报告或 PDF 书籍使用 `.agents/skills/add-bookshelf-book/`。一次发布最多一篇，保留无关工作区改动，只暂存明确产物。
- 书架内容的唯一数据源是 `apps/homepage/src/BookshelfApp.jsx` 导出的 `books`；不要在 `App.jsx` 或构建脚本中维护第二份数量或书目。

## 常用命令

在仓库根目录执行：

```bash
npm install
npm run dev            # React/Vite 开发服务器
npm run dev:homepage   # npm run dev 的兼容别名
npm run build          # Vite 首页 + React 文章静态生成
npm run preview        # 在完整 build 后预览根生产产物
```

- 修改首页 UI 时由 Agent 自行启动 `npm run dev:homepage` 并用浏览器检查，不把可自动完成的启动步骤交给用户。
- 提交前至少运行 `npm run build` 和 `git diff --check`。书架变更还要运行 `node .agents/skills/add-bookshelf-book/scripts/validate-bookshelf.mjs`。
- 若包管理器包装层导致依赖脚本审批错误，可使用已安装依赖做针对性诊断，但最终验收仍以完整 `npm run build` 为准。
- 项目锁文件是 `package-lock.json`；不要因为本地工具差异引入 `pnpm-lock.yaml` 或 `pnpm-workspace.yaml`。

## 视觉与路由验收

- UI 改动至少检查常规桌面和 390px 左右移动端，覆盖首屏、唯一滚动根、导航锚点、Article 展开区与书架、Signal、Building、Collaboration、Contact。
- 检查无横向溢出、键盘焦点可见、skip link 可用、`prefers-reduced-motion` 生效、媒体失败有可读 fallback，且控制台没有本次改动引入的错误。
- 路由或内容改动要验证 `/`、至少一个 `/blog/<slug>/`、`/blog` 重定向及受影响的旧入口；构建成功不能代替浏览器交互和视觉检查。

## Git、部署与隐私

- 开始前检查 `git status`，保留用户已有和未跟踪改动。更新前优先 `git pull --ff-only`；禁止 `git reset --hard`、强制推送、宽泛清理或删除远程分支。
- 修改完成后检查 scoped diff，再报告构建与浏览器验证。提交、推送、部署、合并或其他外部写入只有在用户明确要求时执行。
- 未经明确授权，不修改域名、DNS、Cloudflare 配置、权限、生产环境变量或联系邮件路由。
- 不读取、输出或提交集中式密钥文件、Cookie、访问令牌、私钥或生产数据。环境变量文件只保留最小必要子集并确保被 Git 忽略。

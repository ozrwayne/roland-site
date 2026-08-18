# Roland Wayne Production Baseline

## 当前生产基线

- Snapshot date: 2026-08-18
- Verified URL: `https://www.rolandwayne.com/`
- Page title: `Roland · 跨界思考者`
- Canonical homepage route: `/`
- Primary navigation: `About / Article / Signal / Building / Collaboration / Contact`
- Current visual direction: warm ivory archival-paper surfaces over a light Australian-landmark video background, with black typography and restrained terracotta accents.

当前首页从固定 header 直接进入 Roland 的 portrait/profile hero。Header 与页面内容分处两个不重叠的布局行；`.content-scroll-region` 是唯一纵向滚动根。

全局背景由 left、center、right 三段同步 MP4 构成。它固定在 viewport、静音、不可交互、不自动播放、不循环，并把完整内容滚动进度映射到约 15 秒时间轴。中心保留安静阅读走廊，左右建筑保持等比并锚定外侧；reduced-motion 使用静态 fallback。

生产模块顺序与职责：

1. `About`：身份、简介、主要行动、关键数据与肖像。
2. `Article`：主从布局展示三篇澳洲精选文章，并提供 `/articles/` 完整文章库入口。
3. `Signal`：已确认的 Social 与 Official 外部身份目录。
4. `Building`：同一 surface 内的 Services 与 Research。
5. `Collaboration`：高校、医学教育、AI 科研与知识系统合作。
6. `Contact`：公开联系邮箱、复制与 `mailto:` 行为。

完整动态书本 rail 已移到 `/articles/`，同页提供标题、摘要和主题搜索。公开链接契约：`/blog/<slug>/` 为文章详情；`/blog` 301 到 `/articles/`；旧英文页面和 `/zh/*` 页面以 301 迁移到纯 `/`。首页同页导航不在地址栏写入 hash。Sitemap 保留首页、文章库与具体文章页。

这份生产基线用于防止后续 Agent 从历史实验中恢复已经退出的 UI。局部修改应保留未被用户点名的模块、事实内容、路由、滚动架构、可访问性与部署能力。若用户明确批准新设计，新设计可以更新本基线，但必须以实现和浏览器验证为准。

## 旧站历史基线（仅供追溯）

- Snapshot date: 2026-05-03
- Legacy theme: dark background (`#0A0A0A`) + gold accent (`#C9A96E`)
- Legacy navigation: `服务 / 高校合作 / 博客 / 联系`
- Historical implementation is available only through Git history and must not be restored into production source.

旧站完整 UI 不在生产源码中。旧深色/金色视觉、页面拆分方式和组件不能作为当前默认设计约束；只保留仍在生效的公开链接迁移、内容、SEO 与 Cloudflare 能力。

# Roland Wayne 网站开发文档

> 本文档基于仓库 `main` 分支当前代码整理，用作 UI/结构重构后的维护说明与功能、模块、内容保留清单。

视觉方向见 [`DESIGN-DIRECTION.md`](./DESIGN-DIRECTION.md)：固定深蓝身份索引栏、右侧 WIS 蓝白内容画布和 Apple 式克制视觉。

当前规范首页是 `/`。`/about` 继续重定向到 `/`；首页即“关于”，文章归档位于 `/blog`。

## 1. 项目定位与重构原则

- 生产站点：<https://www.rolandwayne.com>
- GitHub：<https://github.com/ozrwayne/roland-site>
- 当前分支：`main`
- 当前基线提交：`ca9087f`（SEO: add ORCID and Google Scholar to Person sameAs）
- 代码目录：`/Users/garylau/Work/rolandwayne`

本轮重构允许大幅改变视觉主题、页面结构、组件组织和交互方式，但以下内容默认属于不可丢失项：

1. 当前公开路由、旧链接和重定向行为，除非明确设计迁移方案。
2. 当前页面表达的功能模块、业务内容、研究内容、个人介绍和联系方式。
3. 博客文章、文章 slug、发布日期、标签、正文中的图片和引用。
4. 当前产品采用单一中文界面；历史中英文内容资产可以保留作迁移参考，但不在导航中暴露语言切换或双页面入口。
5. SEO 元信息、规范链接、Open Graph/Twitter 元信息、Person JSON-LD、站点地图、robots 和验证文件。
6. `public/` 中现有图片、favicon 和文章配图。
7. Cloudflare 构建与部署所需的输出结构和配置。

重构前先建立新旧路由/模块映射；不要在没有替代方案的情况下删除页面、文章、图片、Schema 字段或旧 URL。

## 2. 技术栈与运行方式

- Astro 5
- Tailwind CSS 4
- `@astrojs/cloudflare`：Cloudflare Workers/Pages 适配器
- `@astrojs/sitemap`：站点地图集成
- 内容：Astro Content Collections + Markdown
- 字体：Apple/Windows/中文系统字体栈，全站使用同一套系统风格字体
- 图标：项目内置的 Phosphor Regular Web Font（`public/vendor/phosphor/`，含 MIT License）
- 生产域名在 `astro.config.mjs` 中配置为 `https://www.rolandwayne.com`

项目脚本：

```bash
npm install
npm run dev       # 本地开发服务器
npm run build     # 生产构建
npm run preview   # 预览构建结果
npm run astro ... # Astro CLI
```

本机 Codex 运行环境的 `npm` 可能由 pnpm 包装器接管。如果因此触发依赖脚本审批错误，可使用已安装依赖直接做构建验证：

```bash
./node_modules/.bin/astro build
```

项目现有锁文件是 `package-lock.json`。不要因为本机包管理器差异提交临时生成的 `pnpm-lock.yaml` 或 `pnpm-workspace.yaml`。

## 3. 源码目录地图

| 路径 | 职责 |
|---|---|
| `src/pages/` | Astro 页面、动态博客路由和 XML API 路由 |
| `src/components/` | Header、Footer、SEO 等共用组件 |
| `src/layouts/` | `BaseLayout` 全站壳层、`BlogPost` 文章壳层 |
| `src/content/blog/` | Markdown 博客正文 |
| `src/content.config.ts` | 博客 collection 的 frontmatter schema |
| `src/i18n/` | `zh.json`、`en.json` 和语言路径工具 |
| `src/styles/global.css` | Tailwind 主题 token、字体和全局样式 |
| `public/` | favicon、个人照片、博客配图、robots 和验证文件 |
| `astro.config.mjs` | 站点 URL、Tailwind、sitemap、Cloudflare adapter |
| `wrangler.jsonc` | Cloudflare Worker/Assets 配置 |
| `BASELINE.md` | 旧站视觉与导航状态快照，仅用于回归对照 |
| `AGENTS.md` | 项目级 Agent/维护约束 |

## 4. 当前路由清单

### 4.1 默认路由（根路径）

| URL | 源文件 | 当前内容/行为 |
|---|---|---|
| `/` | `src/pages/index.astro` | 规范中文首页/关于页：WIS Hero、Welcome 置顶的最新文章时间线、学术研究/独立写作/系统构建、联系 CTA |
| `/about` | `src/pages/about.astro` | 重定向到 `/` 的旧链接兼容入口 |
| `/research` | `src/pages/research.astro` | 研究页：当前研究、发表论文与手稿、研究兴趣 |
| `/services` | `src/pages/services.astro` | Wayne Insight Spring 服务页：理念、全方位申请指导、AI 研究思维课程、咨询 CTA |
| `/university` | `src/pages/university.astro` | 高校合作页：个人简介、教育/组织经历、核心成就、工作职责、专业领域、合作咨询 |
| `/blog` | `src/pages/blog/index.astro` | 紧凑文章归档页：`Blog / Archive`、`文章`、`Thoughts & Insights`，下接已发布文章列表；不显示文章数量 |
| `/blog/:slug` | `src/pages/blog/[...slug].astro` | 从 `src/content/blog/` 动态生成文章详情页 |
| `/contact` | `src/pages/contact.astro` | 联系信息、所在地、学术机构、公司、邮件 CTA；当前没有后端表单 |

### 4.2 历史 `/zh/` 兼容路由

这些源码仍在仓库中，用于保留历史内容和旧链接兼容；当前导航不会链接到它们，也不把它们视为第二套产品页面。后续路由清理时应迁移有价值内容并改为指向根路径规范页面的重定向。

| URL | 源文件 | 当前内容/行为 |
|---|---|---|
| `/zh/` | `src/pages/zh/index.astro` | 基于 `zh.json` 的新版中文首页：研究者/顾问/教育者 Hero、健康科学与教育定位、三大支柱、联系 CTA |
| `/zh/about` | `src/pages/zh/about.astro` | 关于页：个人故事、跨学科经历、Wayne Insight Spring、思想影响、三条里程碑 |
| `/zh/research` | `src/pages/zh/research.astro` | 中文研究页，使用 `zh.json` 文案 |
| `/zh/services` | `src/pages/zh/services.astro` | 中文服务页，使用 `zh.json` 文案 |
| `/zh/contact` | `src/pages/zh/contact.astro` | 中文联系页，使用 `zh.json` 文案 |

### 4.3 站点地图路由

| URL | 源文件 | 当前行为 |
|---|---|---|
| `/sitemap-index.xml` | `src/pages/sitemap-index.xml.ts` | 指向 `/sitemap-0.xml` |
| `/sitemap-0.xml` | `src/pages/sitemap-0.xml.ts` | 输出静态路径和所有非 draft 博客路径 |

### 4.4 单语言策略

当前站点只提供根路径下的中文规范页面，不建设 `/en/...` 双页面，也不显示中/EN 切换。`src/i18n/en.json` 和相关工具暂时仅作为历史资产保留，不得据此生成失效导航。

## 5. 共用 UI 与交互模块

### `BaseLayout.astro`

全站页面壳层，负责：

- `<html lang="...">`
- `<head>` 中注入 `SEO.astro`
- 桌面端为固定左栏预留内容画布，移动端恢复全宽
- 共用固定身份栏/移动端顶栏 `Header`
- 共用只占右侧内容画布的 SEO `Footer`
- 全局 `global.css`

### `Header.astro`

- 桌面端是整块深蓝固定窄栏，含圆形真实头像、姓名和导航；姓名下不放身份 title。
- 导航是：关于、文章、研究、服务、高校合作、联系。
- 激活态只显示一个冰蓝小圆点，不显示斜杠或大块背景。
- 站点为单一中文界面；桌面侧栏和移动菜单都不显示语言切换。
- 移动端变为深蓝顶栏和全屏菜单，支持 `aria-expanded`、关闭状态与 body 滚动锁定。

### `Footer.astro`

- Roland Wayne 品牌、当前年份、身份副标题、站内导航、个人主页、友情链接和版权。
- Footer 位于 `.site-content` 内；桌面端从固定左栏右缘开始，移动端自然全宽。
- 个人主页：Email、LinkedIn、Google Scholar、ORCID、X，均使用已确认的具体地址。
- 友情链接：`medflowedu.com`、`austeoswa.com`、`wayneinsightspring.com`。

### `SEO.astro`

每页输出：

- charset、viewport、title、description、canonical
- Open Graph 基本字段和可访问的默认大图
- Twitter Card 基本字段
- robots、theme-color、color-scheme
- favicon
- Roland Wayne 的 Person JSON-LD

Person Schema 当前含有 `@id`、姓名及别名、邮箱、教育机构、博士候选人凭证、Wayne Insight Spring/MedFlow 关联、研究/业务关键词、X/LinkedIn/ORCID/Google Scholar `sameAs`；另输出 WebSite JSON-LD。

### `BlogPost.astro`

- 文章标题、发布日期、标签和可选封面
- Tailwind Typography 正文样式
- Markdown 正文插槽
- 返回 `/blog` 的文章列表链接

## 6. 页面模块与现有内容

### 首页

当前存在两套首页实现，内容和结构并不完全一致：

- `/`：硬编码中文，强调“研究者 · 系统构建者 · 跨界领域思考者”、学术研究、独立写作、系统构建，使用 `public/profile.jpg`。
- `/zh/`：从 `zh.json` 读取“研究者 · 顾问 · 教育者”、健康科学/教育、教育咨询、知识分享；图片位置目前显示 `Profile Photo` 占位文字，而不是照片。

重构时需要先决定哪套是规范首页，并保留另一套内容中仍有价值的模块和文案，不能直接以其中一套覆盖另一套。

### 关于

`/zh/about` 的内容包括：

- 昆士兰大学健康实施科学博士候选人身份
- 低钠盐替代品与心血管疾病预防的实施研究
- 从康复治疗到健康经济学/实施科学的经历
- Wayne Insight Spring 国际医学教育咨询
- Charlie Munger、Wittgenstein、佛学等思想影响
- 2024 博士候选人、2024 硕士论文、2022 创办 Wayne Insight Spring 三条里程碑

`/about` 当前只是旧链接重定向，不是独立关于页。

### 研究

研究模块当前包括：

- 当前研究：低钠盐替代品在心血管疾病预防中的实施
- Springfield Healthy Hearts 项目关联
- 实施科学、心血管健康、离散选择实验标签
- 发表论文与手稿：低钠盐替代品范围综述（审稿中）
- 硕士论文：消费者对低钠盐替代品的偏好，成绩 85.50%
- 研究兴趣：健康实施科学、离散选择实验、心血管疾病预防、健康经济学、行为科学、人群健康干预

### 服务

Wayne Insight Spring 服务模块当前包括：

- 定位：帮助家庭做国际医学教育决策，而不只是获得录取
- 理念：“敬天爱人，敬畏因果”
- 全方位申请指导：战略规划、学校选择、申请审核、面试准备，覆盖澳大利亚/英国/香港等地区
- AI 研究思维课程：AI 工具、研究方法、批判性思维
- “预约咨询” CTA，当前落到联系页

### 高校合作

`/university` 是中文硬编码页面，当前包括：

- 国际医学教育合作伙伴定位
- Roland 个人简介
- 昆士兰大学医学院博士候选人、Springfield 研究中心、邦德大学临床模拟教学团队、硕士经历、社团职务等身份条目
- `600+`、`3+`、`6+`、`30万+` 四项核心成就数字
- 团队管理、体系搭建、项目统筹、知识建设、AI 科研体系构建、AI 科研教学、AI 医学研究七项职责
- 卫生经济学研究、临床数据建模、医学升学咨询、团队运营、中国市场准入咨询、AI 科研等专业标签
- 面向海外高校及私营医疗企业的合作咨询 CTA

### 联系

当前是信息页和 mailto CTA，不存在真实表单提交、API、数据库或邮件服务。中英文内容都包含：

- 邮箱
- 布里斯班/昆士兰州所在地
- 昆士兰大学学术机构
- Wayne Insight Spring（香港）公司信息
- “联系表单即将上线”的占位说明

### 博客

博客 collection 由 `src/content.config.ts` 定义：

```ts
title: string
description: string
pubDate: date
updatedDate?: date
tags: string[]
image?: string
cover?: string
coverAlt?: string
pinned: boolean
draft: boolean
```

列表只显示 `draft: false` 的文章。`pinned: true` 的文章优先，其余按 `pubDate` 倒序；文章 slug 来自 Markdown 文件名。首页使用同一排序并取 `slice(0, 5)`，因此后续新增文章会自动更新首页，最多显示五篇。

新增文章封面示例：

```yaml
cover: "/images/blog/my-article/cover.jpg"
coverAlt: "对封面内容的简洁描述"
pinned: false
```

`Welcome — Why This Site Exists` 当前设置 `pinned: true`，会持续置顶；其封面为 `public/images/blog/welcome/cover.png`。没有 `cover` 时会回退到旧的 `image` 字段，再回退到 Welcome 的品牌封面。

当前文章：

| slug | 标题 | 日期 | 标签 | 文章资源 |
|---|---|---|---|---|
| `welcome` | Welcome — Why This Site Exists | 2025-02-21 | `personal`, `introduction` | 介绍网站的学术研究、医学教育咨询、研究思维/AI 内容三重定位 |
| `australia-2026` | AI、矿产与澳洲经济：2026，澳洲能迎来新国运吗？ | 2026-02-25 | 澳大利亚、经济、AI、关键矿产、地缘政治 | 长篇澳洲经济/AI/关键矿产分析，含图 1–11、引用和作者注 |

`australia-2026.md` 使用的配图：

- `fig1-smile-curve.png`
- `fig2-iphone-profits.png`
- `fig3-intangible-assets.png`
- `fig4-ai-code.png`
- `fig5-inference-cost.png`
- `fig6-data-center-power.png`
- `fig7-lithium-share.png`
- `fig8-australia-minerals.png`
- `fig9-china-monopoly.png`
- `fig10-norway-fund.png`
- `fig11-value-chain.png`
- 另有 `fig6-data-center-power2.png` 资源，目前正文未直接引用，重构时不要误删。

## 7. 国际化现状

- 翻译资源：`src/i18n/zh.json`、`src/i18n/en.json`。
- 工具：`getLangFromUrl()`、`useTranslations()`、`getLocalizedPath()`、`getSwitchLangPath()`。
- 实际页面主要使用 `zh`，且部分页面把中文内容直接写在 Astro 文件里，部分页面从 `zh.json` 读取。
- `/en` 路由文件不存在，当前英文翻译不能自动形成完整英文站。
- 根路径页面、`/zh/` 页面、`/university` 页面之间存在内容和导航差异。重构时应先建立统一内容模型，或明确哪些是历史兼容页面。

## 8. 静态资源与 SEO 资产

| 资源 | 用途 |
|---|---|
| `public/profile.jpg` | 首页/高校合作页个人照片 |
| `public/favicon.svg`、`public/favicon.ico` | favicon |
| `public/robots.txt` | 爬虫规则 |
| `public/eaa0690619ed43eea785e7d1943c5f58.txt` | 站点验证/索引相关文本文件，需保留 |
| `public/images/blog/australia-2026/*` | 长文配图和优化后的列表封面 `cover.jpg` |
| `public/images/blog/welcome/cover.png` | Welcome 文章封面，也是默认 OG 图 |
| `public/brand/wis-logo-dark.png` | Hero 使用的 WIS 中英深色标志 |
| `public/brand/hero-planes.png` | Hero 右侧透明蓝白几何背景 |
| `astro.config.mjs` 的 `site` | canonical、sitemap、绝对 URL 基础 |
| `src/components/SEO.astro` 的 Person JSON-LD | 人物实体与站点 SEO 主数据 |

`SEO.astro` 默认 Open Graph 图片已改为真实存在的 `/images/blog/welcome/cover.png`，并自动输出绝对 URL。

## 9. Cloudflare 与部署

`astro.config.mjs`：

- `site: https://www.rolandwayne.com`
- Tailwind Vite plugin
- sitemap integration
- Cloudflare adapter

`wrangler.jsonc`：

- Worker entry：`dist/_worker.js/index.js`
- 静态资源目录：`dist`
- Assets binding：`ASSETS`
- `nodejs_compat`、`global_fetch_strictly_public`
- observability 开启

构建通过不等于已经部署。未经用户明确授权，不执行 `wrangler deploy`、修改域名/DNS、生产变量或 Cloudflare 权限操作。

## 10. 已知缺口与重构前需确认的事项

这些不是本次文档推测，而是从当前代码可以直接确认的状态：

1. **存在历史 `/zh/` 页面源码**：当前不在导航中暴露，后续应迁移有价值内容并改成根路径规范页面的兼容重定向。
2. **存在未使用的英文内容资产**：当前明确不建设 `/en/` 双页面，`en.json` 仅作历史参考。
3. **联系功能是 mailto 占位**：没有表单后端或提交状态。
4. **历史语言工具仍能构造失效路径**：当前 Header 已不再调用；后续清理国际化旧代码时一并移除。
5. **站点地图存在待校准项**：包含 `/about/` 这种重定向入口，但静态列表没有 `/university/`；重构后应让 sitemap 与规范路由一致。
6. **博客文章布局使用中文 BaseLayout**：文章详情和返回链接统一使用根路径规范路由，符合当前单语言策略。
7. **缺少自动化测试/lint 脚本**：当前主要验证方式是 Astro 生产构建和人工回归。
8. **README 仍是 Astro Starter Kit 模板文档**：不能作为产品功能说明，应以本文档和实际代码为准。

本轮已修复的历史缺口：默认 OG 图片 404、Footer 通用占位外链、首页文章手写排序，以及没有文章封面模型。

上述缺口不代表可以直接删除对应内容。它们应在重构计划中被标记为“保留并修正”“迁移到新结构”或“经确认后废弃”。

## 11. 重构验收清单

### 路由与功能

- [ ] `/`、`/research`、`/services`、`/university`、`/blog`、`/contact` 可访问。
- [ ] `/about` 的旧链接行为有明确保留或迁移方案。
- [ ] `/zh/`、`/zh/about`、`/zh/research`、`/zh/services`、`/zh/contact` 可访问，或有等价的新语言路由和 301/重定向方案。
- [ ] 每篇 `draft: false` 文章仍可从列表进入，slug 不变。
- [ ] 博客正文中的图片、标题、摘要、发布日期、标签、引用和作者注仍存在。
- [ ] 移动端导航可打开、关闭并正确跳转。
- [ ] 邮件 CTA、外链、站内 CTA 均有明确目标。

### 内容与数据

- [ ] 研究、教育咨询、高校合作、系统构建/写作等现有内容模块均有新结构落点。
- [ ] `zh.json`、`en.json` 的内容没有在迁移中静默丢失。
- [ ] 博客 frontmatter schema 仍能校验现有文章。
- [ ] 个人事实、联系方式和公司/学校信息经过确认后再改写。

### SEO 与部署

- [ ] 每个规范页面仍有 title、description、canonical、OG、Twitter Card。
- [ ] Person JSON-LD 的 `@id`、身份关联和已确认 `sameAs` 没有丢失。
- [ ] favicon、robots、站点验证文件和博客配图仍可访问。
- [ ] sitemap 只包含规范、可访问、非 draft 的 URL。
- [ ] `./node_modules/.bin/astro build` 或 `npm run build` 通过。
- [ ] 未经授权不触发生产部署。

### 视觉与体验

- [ ] 新主题可以完全不同，但完成一次桌面端、移动端和文章长页面视觉回归。
- [ ] 对键盘导航、焦点态、颜色对比度、图片 alt、链接状态和移动菜单进行人工检查。
- [ ] 重构后再用浏览器核对真实部署页面；浏览器核对是视觉/交互验收，不替代源码内容清单。

## 12. 推荐工作流

1. 从 `main` 创建独立重构分支，先记录基线构建结果。
2. 先建立“旧路由 → 新路由”和“旧模块 → 新模块”映射表。
3. 先抽取统一内容模型和路由配置，再替换布局和主题；避免一边改视觉一边散落修改事实内容。
4. 分阶段迁移：全局壳层 → 首页/内页 → 博客 → 国际化 → SEO/站点地图 → Cloudflare 适配。
5. 每个阶段都运行构建，并用本清单做路由、内容、资源和 SEO 回归。
6. 完成后再进行浏览器视觉 QA，确认线上/预览页面和源码清单一致。

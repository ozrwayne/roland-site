# Roland Wayne 生产首页维护约定

## 适用范围与来源

- 本文件适用于 `apps/homepage/`；同时继承仓库根 `AGENTS.md`。
- 这里是生产 React 应用，不是 Prototype。以 `src/App.jsx`、`src/ArticlePage.jsx`、`src/BookshelfApp.jsx`、`src/components/` 和根目录 `public/` 的当前实现为准。
- 历史 landmark lane、district、street master、独立 strip、旧纸纹和 standalone intro 实验不属于当前生产架构。除非用户明确重新引入，不要从旧提交、未跟踪原型或生成目录恢复它们。
- 大幅视觉改动前先查看当前本地预览与线上页面。只有用户选定的新 mock 才能取代当前生产基线；不要让生成图自行覆盖已确认的内容和交互契约。

## 页面骨架与滚动

- `.homepage-stage` 分成固定尺寸的 `.site-header` 行与下方 `.content-scroll-region`。后者是唯一纵向滚动根。
- 所有模块定位、active nav、viewport scrollbar 和背景时间映射都必须读取 `.content-scroll-region` 的 `scrollTop`、`scrollHeight` 与 `clientHeight`，不要使用 `window.scrollY` 或恢复 body 主滚动。
- Header 始终占有独立布局行；内容不得进入 header 矩形。桌面品牌从 `Roland Wayne` 收拢为 `RW` 的动画在滚动后可逆；移动端保持现有菜单和 Contact 行为。
- 规范 section 顺序是 `About → Article → Signal → Building → Collaboration → Contact`。DOM id 继续服务内部定位与旧链接兼容，但点击导航不得产生 URL hash；跨页目标通过 `navigation.js` 的 sessionStorage 意图回到纯 `/` 后定位。

## 全局地标背景

- 当前生产背景由 `GlobalLandmarkBackground.jsx` 中的三段 MP4 组成：left、center、right。三段均为 24 fps、约 15 秒的同步 pane，并通过 Blob URL 在全部资源准备后一起显示。
- 背景固定在 viewport，位于 routed/page content 之外，`muted`、`playsInline`、不可交互、不自动播放、不循环。正常滚动把完整页面进度单调映射到 `currentTime`；向上滚动会反向回放同一路径。
- 左右建筑 pane 保持高度驱动的等比缩放并锚定外侧下角；中心 pane 只承担可压缩的安静阅读走廊。不要横向拉伸建筑、裁掉完整建筑半边、交换左右素材或让单侧压住正文。
- 三段视频自带平滑浅色背景，是唯一全 viewport 视觉背景。`--page` 只作加载与 reduced-motion fallback；不要叠加旧 kraft-paper 纹理、全页 grain、暗色 mask 或新的全屏背景。
- `prefers-reduced-motion` 下将视频停在首帧并隐藏动态背景；不得用自动播放或 CSS 动画替代。

## 视觉系统

- 当前方向是暖象牙、棕灰细边框、轻微 backdrop softening 与安静阴影的 archival-paper surfaces，外侧地标背景保持可见。
- Hero、Article、Signal、Building、Collaboration、Contact 是相互分离的主要 surface；模块间留白显著大于模块内留白。不要恢复旧站深色金色主题或让一个大面板覆盖多个模块。
- Hero 保留宽屏黄金比例构图、左文右肖像、现有 display 字体、无描边头像和三个 pointer-inert 云层素材。云层是局部前景拼贴，不是全页纹理；不得遮住脸、主要按钮或可读正文。
- 桌面 SVG follower cursor 只在现有支持条件下显示；触摸设备和 reduced-motion 环境保持关闭。

## Article 与文章库

- 首页 `#articles` 保留 `Article` section 标题，并以三篇澳洲精选文章组成主从浏览 surface：左侧/上方为可选择目录，三篇目录下直接放“阅读所有文章”按钮；右侧详情固定为上方封面、下方简短介绍/主题/详情入口。桌面双栏的内容轨道约为 1:2，右栏略占主导，封面必须横向贴满详情卡片且左右不留空白。右侧详情整体上移，使卡片上边界与 `Article` 大标题顶端对齐，同时让“阅读全文”按钮下边线与左侧“阅读所有文章”按钮下边线保持水平对齐；Article 主框的顶部和底部内边距跟随 `--portrait-reference-top-space` / `--portrait-reference-bottom-space`，位移不得在底部遗留额外布局空白；窄屏恢复自然上下流。不要把 section 标题替换成某个地区专题名，不要添加专题说明、标题下分隔线或底部 footer 文案/分隔线，也不要把右侧详情恢复成左右分栏。
- `/articles/` 是独立 React 文章库：顶部沿用 `Article` 标题形式；书架区域只显示完整 `EmbeddedBookshelf`，不加外框、标题或说明，并横向铺满整个 viewport；正文不画左右边界但保留响应式页边留白；搜索只显示一个独立搜索框。文章列表固定一行一篇并保持紧凑，封面框固定为 16:9，允许封面图拉伸填满框体；`welcome` 永远置顶，其余按 `pubDate` 从新到旧排列。搜索覆盖标题、摘要和主题，并保留键盘操作、结果计数、清空和空结果状态。
- 书架唯一数据源是 `BookshelfApp.jsx` 的 `books`。每本书保留 front cover、top page edge、right page block、back cover、厚度和可读 DOM 标题；不能改成 flat cover card。
- 书本本身保持轴对齐，倾斜只来自 rail/window 与整本书的等量反向旋转。右 page block 使用一个 `skewY` 矩形，不创建独立左 spine，也不改为四点 polygon。
- 动画循环以一组完整书目的实测宽度为周期；保留响应式 clone 数、跨 set 单调 stacking、hover/focus 暂停和 reduced-motion。只有第一组进入 accessibility tree 与 tab order。
- 白皮书继续使用生产静态 PDF 路径与原始文件字节。例行文章发布只能新增 book 数据和对应资源，不得顺手改书架几何或动画。

## 各模块内容契约

- Signal 是 Social 与 Official 两组外部身份目录。整行可点击，只保留已确认 URL；真实图标加载成功时不得透出 fallback initials，hover 不反转为黑底。
- Building 在一个 surface 内并列 Services 与 Research；Research 的公开兼容锚点是 `#researching`。Collaboration 保留高校/机构合作信息，Contact 保留复制邮箱与 `mailto:`，不要把这些模块拆回已经下线的旧页面。
- Collaboration 的视频与 Contact 手部视频是各自局部 surface 的素材，不属于全局滚动背景；不要把它们套用全局三 pane 的滚动规则。
- 页面中的履历、研究状态、录取案例、粉丝数、曝光量、机构链接和联系方式都是事实数据。任何新增或更新都必须有用户材料或当前权威来源，不得从视觉稿推断。

## 响应式、可访问性与性能

- 保持 320px 最小可用宽度，并在约 390px 移动端和常规桌面验证。不得产生 document 横向溢出、双重滚动条或 header/content 相互覆盖。
- 保留 skip link、语义 heading、键盘访问、明显的 `:focus-visible`、decorative media 的 `aria-hidden`，以及 clone 书目的不可访问状态。
- 新媒体优先使用本地压缩资源、明确 poster/尺寸与适当 preload；不得在首屏引入不必要的第三方运行时、追踪器或阻塞加载。
- 背景 readiness 继续由三 pane 同步后的回调控制。不要让某一 pane 先露出，也不要用固定延时伪造加载完成。

## 开发与验收

- 开发使用仓库根的 `npm run dev`；完整生产验收使用 `npm run build`，确认根 `dist/index.html` 与具体 `dist/blog/<slug>/index.html` 同时生成。
- Agent 自行启动本地服务器并用浏览器检查桌面与移动端，不要求用户手动启动。交互检查至少覆盖滚动根、品牌收拢、无 hash 导航、首页澳洲文章切换、`/articles/` 搜索、书架循环与焦点、Contact 动作和 reduced-motion。
- 样式或布局调整后同时检查首屏和页面下半部；只看 build、DOM 或静态截图都不能单独证明交互正确。
- 保留无关工作区改动，不修改生成目录。没有用户明确授权时，不提交、推送、部署或修改线上内容。

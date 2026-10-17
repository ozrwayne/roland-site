import React from "react";
import { renderToString } from "react-dom/server";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createServer } from "vite";
import { loadPublishedArticles } from "./article-content.mjs";

const projectRoot = resolve(import.meta.dirname, "..");
const distRoot = join(projectRoot, "dist");
const siteOrigin = "https://www.rolandwayne.com";
const siteName = "Roland Wayne";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;",
})[character]);

const safeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

const personSchema = {
  "@context": "https://schema.org",
  "@id": `${siteOrigin}/#person`,
  "@type": "Person",
  name: "Roland Wayne",
  alternateName: ["王罗湳", "罗湳", "罗湳Roland"],
  givenName: "Roland",
  familyName: "Wayne",
  email: "mailto:contact@rolandwayne.com",
  url: siteOrigin,
  description: "澳洲昆士蘭大學醫學院全獎博士（醫學經濟學方向）。創辦 Wayne InsightSpring（AI 企業轉型諮詢，主攻中小企業）同 MedFlow（大健康留學）。將醫學經濟學評估方法論應用於 AI 落地與教育路徑設計。",
  jobTitle: ["Founder, Wayne InsightSpring", "Founder, MedFlow", "Principal Consultant"],
  affiliation: {
    "@type": "EducationalOrganization",
    name: "University of Queensland Medical School",
    url: "https://medicine.uq.edu.au",
  },
  sameAs: [
    "https://x.com/rwayne",
    "https://www.linkedin.com/in/roland-wayne-b3b179266",
    "https://orcid.org/0009-0002-4272-5854",
    "https://scholar.google.com/citations?user=ESmLe1MAAAAJ&hl=en",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteOrigin}/#website`,
  name: siteName,
  url: `${siteOrigin}/`,
  inLanguage: ["zh-CN", "en"],
  author: { "@id": `${siteOrigin}/#person` },
};

function createArticleHead(article, assetTags, articleCss) {
  const canonical = `${siteOrigin}/blog/${encodeURIComponent(article.slug)}/`;
  const image = article.cover?.startsWith("http")
    ? article.cover
    : `${siteOrigin}${article.cover || "/images/blog/welcome/cover.png"}`;
  const title = `${article.title} | ${siteName}`;
  const language = article.lang === "zh" ? "zh-CN" : article.lang;
  const locale = article.lang === "zh" ? "zh_CN" : "en_US";
  const category = article.tags[0] || (article.lang === "zh" ? "文章" : "Article");
  const imageAlt = article.coverAlt || `${siteName} — ${article.title}`;
  const webPageId = `${canonical}#webpage`;
  const schemas = [
    personSchema,
    websiteSchema,
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": webPageId,
      url: canonical,
      name: article.title,
      description: article.description,
      isPartOf: { "@id": `${siteOrigin}/#website` },
      about: { "@id": `${siteOrigin}/#person` },
      inLanguage: language,
      primaryImageOfPage: { "@type": "ImageObject", url: image, caption: imageAlt },
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${canonical}#article`,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      headline: article.title,
      description: article.description,
      image: [image],
      url: canonical,
      datePublished: article.pubDate,
      dateModified: article.updatedDate || article.pubDate,
      author: { "@id": `${siteOrigin}/#person` },
      inLanguage: language,
      articleSection: category,
      ...(article.tags.length ? { keywords: article.tags.join(", ") } : {}),
    },
  ];

  const tags = article.tags
    .map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`)
    .join("\n    ");

  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f7f6f2" />
    <meta name="color-scheme" content="light" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="${siteName}" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(article.description)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="sitemap" type="application/xml" href="/sitemap-index.xml" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(article.description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:locale" content="${locale}" />
    <meta property="article:published_time" content="${article.pubDate}" />
    <meta property="article:modified_time" content="${article.updatedDate || article.pubDate}" />
    <meta property="article:section" content="${escapeHtml(category)}" />
    ${tags}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(article.description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />
    <link rel="icon" type="image/png" href="/assets/roland-profile-library.png" />
    <link rel="preload" as="font" type="font/woff2" href="/assets/anthropic-sans.woff2" crossorigin />
    ${schemas.map((schema) => `<script type="application/ld+json">${safeJson(schema)}</script>`).join("\n    ")}
    <style>${articleCss}</style>
    ${assetTags}`;
}

function createArticlesIndexHead(articles, assetTags, pageCss) {
  const canonical = `${siteOrigin}/articles/`;
  const title = `所有文章 | ${siteName}`;
  const description = "搜索 Roland Wayne 关于医学、健康经济学、澳大利亚、教育与 AI 的全部文章，并浏览完整写作书架。";
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#collection`,
    url: canonical,
    name: title,
    description,
    isPartOf: { "@id": `${siteOrigin}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteOrigin}/blog/${encodeURIComponent(article.slug)}/`,
        name: article.title,
      })),
    },
  };

  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f7f3ea" />
    <meta name="color-scheme" content="light" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="sitemap" type="application/xml" href="/sitemap-index.xml" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:locale" content="zh_CN" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <link rel="icon" type="image/png" href="/assets/roland-profile-library.png" />
    <link rel="preload" as="font" type="font/woff2" href="/assets/anthropic-sans.woff2" crossorigin />
    <script type="application/ld+json">${safeJson(personSchema)}</script>
    <script type="application/ld+json">${safeJson(websiteSchema)}</script>
    <script type="application/ld+json">${safeJson(schema)}</script>
    <style>${pageCss}</style>
    ${assetTags}`;
}

function createSitemap(articles) {
  const urls = [
    { loc: `${siteOrigin}/` },
    { loc: `${siteOrigin}/articles/` },
    ...articles.map((article) => ({
      loc: `${siteOrigin}/blog/${encodeURIComponent(article.slug)}/`,
      lastmod: (article.updatedDate || article.pubDate).slice(0, 10),
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, lastmod }) => `  <url><loc>${escapeHtml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
}

const articles = await loadPublishedArticles(projectRoot);
const baseHtml = await readFile(join(distRoot, "index.html"), "utf8");
const articleCss = await readFile(join(projectRoot, "apps/homepage/src/article.css"), "utf8");
const articlesIndexCss = [
  await readFile(join(projectRoot, "apps/homepage/src/styles.css"), "utf8"),
  await readFile(join(projectRoot, "apps/homepage/src/articles.css"), "utf8"),
].join("\n");
const assetTags = [
  ...(baseHtml.match(/<link rel="modulepreload"[^>]*>/g) || []),
  ...(baseHtml.match(/<script type="module"[^>]*><\/script>/g) || []),
].join("\n    ");

if (!assetTags.includes("type=\"module\"")) {
  throw new Error("Vite module entry was not found in dist/index.html");
}

const vite = await createServer({
  configFile: join(projectRoot, "apps/homepage/vite.config.mjs"),
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const { ArticlePage } = await vite.ssrLoadModule("/src/ArticlePage.jsx");

for (const article of articles) {
  if (article.cover?.startsWith("/")) {
    await access(join(projectRoot, "public", article.cover.slice(1)));
  }

  const rendered = renderToString(React.createElement(ArticlePage, { article }));
  const html = `<!doctype html>
<html lang="${article.lang === "zh" ? "zh-CN" : escapeHtml(article.lang)}">
  <head>${createArticleHead(article, assetTags, articleCss)}
  </head>
  <body class="article-route">
    <div id="root">${rendered}</div>
    <script id="__ARTICLE_DATA__" type="application/json">${safeJson(article)}</script>
  </body>
</html>
`;
  const target = join(distRoot, "blog", article.slug, "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}

const articleSummaries = articles
  .map(({ html, sourceFile, ...article }) => ({
    ...article,
    href: `/blog/${encodeURIComponent(article.slug)}/`,
  }))
  .sort((first, second) => {
    if (first.slug === "welcome") return -1;
    if (second.slug === "welcome") return 1;
    return Date.parse(second.pubDate) - Date.parse(first.pubDate);
  });
const { ArticlesIndexPage } = await vite.ssrLoadModule("/src/ArticlesIndexPage.jsx");
const articlesIndexMarkup = renderToString(
  React.createElement(ArticlesIndexPage, { articles: articleSummaries }),
);
const articlesIndexHtml = `<!doctype html>
<html lang="zh-CN">
  <head>${createArticlesIndexHead(articleSummaries, assetTags, articlesIndexCss)}
  </head>
  <body class="articles-route">
    <div id="root">${articlesIndexMarkup}</div>
    <script id="__ARTICLES_DATA__" type="application/json">${safeJson(articleSummaries)}</script>
  </body>
</html>
`;
await mkdir(join(distRoot, "articles"), { recursive: true });
await writeFile(join(distRoot, "articles", "index.html"), articlesIndexHtml);

// Homepage: the React app mounts with createRoot (client-only), so give crawlers
// a static intro inside #root plus Person/WebSite JSON-LD. createRoot clears this
// markup on first render, so the visual design is unchanged once JS runs.
const homepageFeatured = [
  ["australia-2026", "AI、矿产与澳洲经济：2026，澳洲能迎来新国运吗？"],
  ["ndis-australia-ai-future", "NDIS正在摧毁澳洲AI时代的新国运"],
  ["australia-housing-market-2026", "写在澳大利亚房地产市场崩溃的前夜"],
];
const homepageIntro = `<main class="static-intro" style="max-width:42rem;margin:12vh auto;padding:2rem;font-family:system-ui,sans-serif;line-height:1.7">
      <h1>Roland Wayne</h1>
      <p>研究员｜系统构建者｜跨界思考者</p>
      <p>昆士兰大学医学院博士候选人（澳洲博士，全额奖学金），研究处于健康经济学与实施科学的交叉领域，关注如何把循证干预转化为现实世界的健康成果，并在 AI 系统实践中寻找更清晰、更可执行的答案。</p>
      <p>创办 <a href="https://www.wayneinsightspring.com/">Wayne InsightSpring</a>（企业 AI 转型咨询）与 <a href="https://medflowedu.com/">MedFlow</a>（医学留学与国际医学院申请指导，覆盖澳洲、英国与香港），也开设 AI 研究思维课程，带领团队在真实医学科研场景中应用 AI 工具。</p>
      <h2>精选文章</h2>
      <ul>
        ${homepageFeatured.map(([slug, title]) => `<li><a href="/blog/${slug}/">${escapeHtml(title)}</a></li>`).join("\n        ")}
      </ul>
      <p><a href="/articles/">阅读所有文章</a> · <a href="mailto:contact@rolandwayne.com">contact@rolandwayne.com</a></p>
    </main>`;
if (!baseHtml.includes('<div id="root"></div>')) {
  throw new Error("Homepage #root placeholder was not found in dist/index.html");
}
const homepageHtml = baseHtml
  .replace(
    "</head>",
    `  <script type="application/ld+json">${safeJson(personSchema)}</script>\n    <script type="application/ld+json">${safeJson(websiteSchema)}</script>\n  </head>`,
  )
  .replace('<div id="root"></div>', `<div id="root">${homepageIntro}</div>`);
await writeFile(join(distRoot, "index.html"), homepageHtml);

const sitemap = createSitemap(articles);
await writeFile(join(distRoot, "sitemap-0.xml"), sitemap);
await writeFile(
  join(distRoot, "sitemap-index.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${siteOrigin}/sitemap-0.xml</loc></sitemap></sitemapindex>\n`,
);
await writeFile(
  join(distRoot, "404.html"),
  `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>页面未找到 | Roland Wayne</title></head><body><main style="font-family:system-ui;max-width:42rem;margin:15vh auto;padding:2rem"><h1>页面未找到</h1><p>这个地址不存在或已经迁移。</p><a href="/">返回首页</a></main></body></html>`,
);

// Middleware mode has no listening socket. Starting shutdown releases Vite's
// file watcher; awaiting its close promise is unnecessary and can remain
// unsettled on some patch releases after all handles are already gone.
void vite.close();

console.log(JSON.stringify({ ok: true, articles: articles.length, output: distRoot }, null, 2));

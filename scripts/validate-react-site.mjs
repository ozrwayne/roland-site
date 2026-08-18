import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { loadPublishedArticles } from "./article-content.mjs";

const projectRoot = resolve(import.meta.dirname, "..");
const distRoot = join(projectRoot, "dist");
const errors = [];

const requireFile = async (path, label) => {
  try {
    await access(path);
  } catch {
    errors.push(`missing ${label}: ${path}`);
  }
};

const articles = await loadPublishedArticles(projectRoot);
await requireFile(join(distRoot, "index.html"), "React homepage");
await requireFile(join(distRoot, "articles/index.html"), "searchable article index");
await requireFile(join(distRoot, "_redirects"), "redirect rules");
await requireFile(join(distRoot, "sitemap-index.xml"), "sitemap index");
await requireFile(join(distRoot, "sitemap-0.xml"), "sitemap body");
await requireFile(join(distRoot, "404.html"), "404 page");
await requireFile(join(projectRoot, "worker/index.js"), "Cloudflare Worker");

try {
  const articleIndex = await readFile(join(distRoot, "articles/index.html"), "utf8");
  if (!articleIndex.includes("__ARTICLES_DATA__")) errors.push("article index hydration data missing");
  if (!articleIndex.includes("搜索标题、摘要或主题")) errors.push("article search control missing");
  if (!articleIndex.includes("完整写作书架")) errors.push("bookshelf section missing from article index");
} catch {
  // Missing output is reported above.
}

for (const article of articles) {
  const output = join(distRoot, "blog", article.slug, "index.html");
  await requireFile(output, `article ${article.slug}`);
  try {
    const html = await readFile(output, "utf8");
    if (!html.includes(article.title)) errors.push(`${article.slug}: title missing from HTML`);
    if (!html.includes("__ARTICLE_DATA__")) errors.push(`${article.slug}: hydration data missing`);
    if (!html.includes("BlogPosting")) errors.push(`${article.slug}: article schema missing`);
  } catch {
    // Missing files are reported above.
  }
}

const result = { ok: errors.length === 0, articles: articles.length, errors };
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;

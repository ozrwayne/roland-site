import { readFile, readdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const toIsoDate = (value, field, file) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) {
    throw new Error(`${file}: invalid ${field}`);
  }
  return date.toISOString();
};

const requireString = (value, field, file) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${file}: missing ${field}`);
  }
  return value.trim();
};

export async function loadPublishedArticles(projectRoot) {
  const contentRoot = join(projectRoot, "content/blog");
  const files = (await readdir(contentRoot))
    .filter((file) => extname(file) === ".md")
    .sort();
  const articles = [];

  marked.use({ gfm: true });

  for (const file of files) {
    const source = await readFile(join(contentRoot, file), "utf8");
    const { data, content } = matter(source);
    if (data.draft === true) continue;

    const slug = requireString(data.slug ?? basename(file, ".md"), "slug", file);
    if (slug.includes("/") || slug === "." || slug === "..") {
      throw new Error(`${file}: slug must be one path segment`);
    }

    const tags = Array.isArray(data.tags)
      ? data.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [];
    const pubDate = toIsoDate(data.pubDate, "pubDate", file);
    const updatedDate = data.updatedDate
      ? toIsoDate(data.updatedDate, "updatedDate", file)
      : undefined;

    articles.push({
      slug,
      title: requireString(data.title, "title", file),
      description: requireString(data.description, "description", file),
      lang: typeof data.lang === "string" ? data.lang : "zh",
      pubDate,
      updatedDate,
      tags,
      cover: typeof (data.cover ?? data.image) === "string" ? (data.cover ?? data.image) : undefined,
      coverAlt: typeof data.coverAlt === "string" ? data.coverAlt : "",
      sourceUrl: typeof data.sourceUrl === "string" ? data.sourceUrl : undefined,
      sourceViews: Number.isInteger(data.sourceViews) ? data.sourceViews : undefined,
      pinned: data.pinned === true,
      html: await marked.parse(content),
      sourceFile: file,
    });
  }

  const seen = new Set();
  for (const article of articles) {
    if (seen.has(article.slug)) throw new Error(`duplicate article slug: ${article.slug}`);
    seen.add(article.slug);
  }

  return articles.sort((a, b) => Date.parse(a.pubDate) - Date.parse(b.pubDate));
}

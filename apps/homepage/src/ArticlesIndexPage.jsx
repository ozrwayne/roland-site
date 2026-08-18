import React, { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { EmbeddedBookshelf } from "./BookshelfApp.jsx";
import { rememberHomeSection } from "./navigation.js";

const navLinks = [
  { label: "About", section: "about" },
  { label: "Article", href: "/articles/", active: true },
  { label: "Signal", section: "signaling" },
  { label: "Building", section: "building" },
  { label: "Collaboration", section: "collaborating" },
];

function HomeSectionLink({ section, children, ...props }) {
  return (
    <a href="/" onClick={() => rememberHomeSection(section)} {...props}>
      {children}
    </a>
  );
}

function SiteNavLink({ link }) {
  if (link.href) {
    return <a className="active" href={link.href} aria-current="page">{link.label}</a>;
  }
  return <HomeSectionLink section={link.section}>{link.label}</HomeSectionLink>;
}

const formatDate = (value) => new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Shanghai",
}).format(new Date(value));

const normalize = (value) => value.toLocaleLowerCase("zh-CN").replace(/\s+/g, "");

const byPinnedThenNewest = (first, second) => {
  if (first.slug === "welcome") return -1;
  if (second.slug === "welcome") return 1;
  return Date.parse(second.pubDate) - Date.parse(first.pubDate);
};

export function ArticlesIndexPage({ articles }) {
  const [query, setQuery] = useState("");
  const orderedArticles = useMemo(() => [...articles].sort(byPinnedThenNewest), [articles]);
  const filteredArticles = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return orderedArticles;
    return orderedArticles.filter((article) => normalize([
      article.title,
      article.description,
      ...(article.tags || []),
    ].join(" ")).includes(needle));
  }, [orderedArticles, query]);

  return (
    <div className="articles-index-page">
      <a
        className="articles-skip-link"
        href="/articles/"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("all-articles")?.focus({ preventScroll: true });
          document.getElementById("all-articles")?.scrollIntoView();
        }}
      >
        跳到文章索引
      </a>

      <header className="articles-index-header">
        <HomeSectionLink className="articles-index-brand" section="about" aria-label="Roland Wayne 首页">
          <img src="/assets/roland-profile-library.png" alt="" width="42" height="42" />
          <span>Roland Wayne</span>
        </HomeSectionLink>
        <nav aria-label="网站导航">
          {navLinks.map((link) => <SiteNavLink link={link} key={link.label} />)}
        </nav>
        <HomeSectionLink className="articles-index-contact" section="contacting">Contact</HomeSectionLink>
      </header>

      <main>
        <section className="articles-index-hero">
          <span>Roland Wayne / Writing archive</span>
          <h1>Article</h1>
        </section>

        <section className="articles-bookshelf-stage" aria-label="文章书架">
          <EmbeddedBookshelf />
        </section>

        <section className="articles-search-section" id="all-articles" tabIndex="-1" aria-label="全部文章">
          <div className="articles-search-toolbar">
            <label className="articles-search-box">
              <Search size={19} aria-hidden="true" />
              <span className="sr-only">搜索文章</span>
              <input
                type="search"
                value={query}
                placeholder="搜索标题、摘要或主题"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <p className="articles-result-count" aria-live="polite">
              {query ? `找到 ${filteredArticles.length} 篇` : `共 ${articles.length} 篇`}
            </p>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="articles-card-grid">
              {filteredArticles.map((article, index) => (
                <article className="articles-card" key={article.slug}>
                  <a className="articles-card-cover" href={article.href} tabIndex="-1" aria-hidden="true">
                    {article.cover
                      ? <img src={article.cover} alt="" loading="lazy" />
                      : <span>{String(index + 1).padStart(2, "0")}</span>}
                  </a>
                  <div className="articles-card-copy">
                    <p>{formatDate(article.pubDate)} · {(article.tags || []).slice(0, 2).join(" / ") || "Article"}</p>
                    <h3><a href={article.href}>{article.title}</a></h3>
                    <span>{article.description}</span>
                    <a className="articles-card-read" href={article.href}>阅读文章 <ArrowRight size={15} /></a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="articles-empty-state">
              <strong>没有找到匹配文章</strong>
              <p>试试“澳洲”“健康”“AI”或更短的关键词。</p>
              <button type="button" onClick={() => setQuery("")}>清除搜索</button>
            </div>
          )}
        </section>
      </main>

      <footer className="articles-index-footer">
        <HomeSectionLink section="about">Roland Wayne</HomeSectionLink>
        <HomeSectionLink section="contacting">联系 Roland →</HomeSectionLink>
      </footer>
    </div>
  );
}

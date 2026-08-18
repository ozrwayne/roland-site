import React from "react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Article", href: "/#articles", active: true },
  { label: "Signal", href: "/#signaling" },
  { label: "Building", href: "/#building" },
  { label: "Collaboration", href: "/#collaborating" },
];

export function ArticlePage({ article }) {
  const lang = article.lang || "zh";
  const category = article.tags?.[0] || (lang === "zh" ? "文章" : "Article");
  const formatter = new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="article-page">
      <a className="skip-link" href="#article-content">跳到文章正文</a>

      <header className="article-site-header">
        <div className="header-primary">
          <a className="brand" href="/#about" aria-label="Roland Wayne 首页">
            <img src="/assets/roland-avatar-original.png" alt="" width="40" height="40" />
            <span aria-hidden="true">RW</span>
            <span className="sr-only">Roland Wayne</span>
          </a>

          <nav className="desktop-nav" aria-label="网站导航">
            {navLinks.map((link) => (
              <a
                className={link.active ? "active" : undefined}
                href={link.href}
                aria-current={link.active ? "page" : undefined}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a className="contact-link" href="/#contacting">Contact</a>
        </div>

        <nav className="mobile-nav" aria-label="移动端网站导航">
          {navLinks.map((link) => (
            <a
              className={link.active ? "active" : undefined}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="article-content">
        <article className="post">
          <header className="post-header">
            <div className="post-heading">
              <p className="post-kicker">{category}</p>
              <h1>{article.title}</h1>
              <time className="post-date" dateTime={article.pubDate}>
                {formatter.format(new Date(article.pubDate))}
              </time>
            </div>
          </header>

          {article.cover && (
            <figure className="cover-wrap">
              <img
                src={article.cover}
                alt={article.coverAlt || ""}
                width="1536"
                height="1024"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </figure>
          )}

          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          <footer className="post-end">
            <a href="/#articles">← 返回全部文章</a>
            <a href="/#contacting">联系 Roland →</a>
          </footer>
        </article>
      </main>
    </div>
  );
}

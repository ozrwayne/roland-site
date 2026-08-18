import React from "react";
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
    return (
      <a className={link.active ? "active" : undefined} href={link.href} aria-current="page">
        {link.label}
      </a>
    );
  }
  return <HomeSectionLink section={link.section}>{link.label}</HomeSectionLink>;
}

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
      <a
        className="skip-link"
        href={`/blog/${article.slug}/`}
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("article-content")?.focus({ preventScroll: true });
          document.getElementById("article-content")?.scrollIntoView();
        }}
      >
        跳到文章正文
      </a>

      <header className="article-site-header">
        <div className="header-primary">
          <HomeSectionLink className="brand" section="about" aria-label="Roland Wayne 首页">
            <img src="/assets/roland-profile-library.png" alt="" width="40" height="40" />
            <span aria-hidden="true">RW</span>
            <span className="sr-only">Roland Wayne</span>
          </HomeSectionLink>

          <nav className="desktop-nav" aria-label="网站导航">
            {navLinks.map((link) => <SiteNavLink link={link} key={link.label} />)}
          </nav>

          <HomeSectionLink className="contact-link" section="contacting">Contact</HomeSectionLink>
        </div>

        <nav className="mobile-nav" aria-label="移动端网站导航">
          {navLinks.map((link) => <SiteNavLink link={link} key={link.label} />)}
        </nav>
      </header>

      <main id="article-content" tabIndex="-1">
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
            <a href="/articles/">← 返回全部文章</a>
            <HomeSectionLink section="contacting">联系 Roland →</HomeSectionLink>
          </footer>
        </article>
      </main>
    </div>
  );
}

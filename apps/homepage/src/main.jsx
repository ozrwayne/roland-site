import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

async function mountApplication() {
  const root = document.getElementById("root");
  const articleDataNode = document.getElementById("__ARTICLE_DATA__");
  const articlesDataNode = document.getElementById("__ARTICLES_DATA__");

  if (articleDataNode) {
    document.body.classList.add("article-route");
    const article = JSON.parse(articleDataNode.textContent);
    const { ArticlePage } = await import("./ArticlePage.jsx");

    hydrateRoot(
      root,
      <React.StrictMode>
        <ArticlePage article={article} />
      </React.StrictMode>,
    );
  } else if (articlesDataNode) {
    document.body.classList.add("articles-route");
    const articles = JSON.parse(articlesDataNode.textContent);
    const [{ ArticlesIndexPage }] = await Promise.all([
      import("./ArticlesIndexPage.jsx"),
      import("./styles.css"),
      import("./articles.css"),
    ]);

    hydrateRoot(
      root,
      <React.StrictMode>
        <ArticlesIndexPage articles={articles} />
      </React.StrictMode>,
    );
  } else {
    const [{ App }] = await Promise.all([
      import("./App.jsx"),
      import("./styles.css"),
    ]);

    createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
}

mountApplication();

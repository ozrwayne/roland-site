# Current Roland bookshelf schema

## Source map

| Purpose | Path |
|---|---|
| Book data and React anatomy | `apps/homepage/src/BookshelfApp.jsx` |
| Homepage book geometry and cover CSS | `apps/homepage/src/styles.css` |
| Cover/PDF assets | `apps/homepage/public/assets/books/` |
| Homepage entry | `apps/homepage/src/App.jsx` |
| Homepage package build | `apps/homepage/package.json` |
| Root production build/overlay | `package.json`, `scripts/overlay-homepage.mjs` |

`App.jsx` renders `EmbeddedBookshelf` inside the `Article` surface. `BookshelfApp.jsx` exports one `books` array consumed by that production rail.

## Entry shape

```js
{
  id: "stable-kebab-id",
  number: "14",
  title: "Exact visible title",
  kicker: "Topic / Type",
  year: "2026",
  artwork: "/assets/books/cover.webp",
  tone: "light", // light cover text; use "dark" for dark text on pale covers
  accent: "#AABBCC",
  thickness: 24,
  href: "https://www.rolandwayne.com/blog/slug/",
}
```

PDF additions:

```js
format: "pdf",
href: "/assets/books/report.pdf",
```

Dedicated branded cover additions:

```js
cover: "variant-name",
```

Keep the exact title as DOM text in every variant.

## Asset rules

- Prefer WebP for raster covers.
- Preserve supplied PDFs byte-for-byte; copy rather than re-export.
- Use lowercase stable filenames without spaces.
- Production public assets remain static files. Vite does not automatically convert `/assets/...` strings to data URLs.
- Confirm the built asset exists under both `apps/homepage/dist/client/assets/` and root `dist/assets/` after overlay.

## PDF navigation

Production behavior must support a normal public path:

```js
function openPdf(event, href) {
  if (!href.startsWith("data:application/pdf;base64,")) return;
  event.currentTarget.href = getEmbeddedPdfUrl(href);
}
```

This preserves ordinary `_blank` navigation for `/assets/books/report.pdf` while retaining optional base64-to-Blob behavior for a genuinely self-contained artifact. Never pass a temporary WeChat, Downloads, or user-library path to production.

## Geometry contracts

- Shelf/window rotation: `-7deg`.
- Book counter-rotation: `+7deg`; net cover rotation is zero.
- Right page block: one `skewY(-18.4349488deg)` rectangle.
- No `.book-spine` element/selector for this camera.
- Loop distance: first complete set's local `offsetWidth`.
- Clone count: at least `ceil(windowWidth / loopDistance) + 2`.
- Stack values: monotonically decrease across every repeated set.

## Acceptance

- IDs/numbers are unique and sequential.
- Every local asset exists.
- Exact titles remain readable text.
- `npm run build` and the bookshelf validator pass.
- Desktop and 390px mobile have no horizontal document overflow.
- Hover/focus reveals a whole book without changing the loop period.
- Last-to-first advance and overlap match ordinary neighbors.
- Normal article links resolve; PDF books open the browser PDF viewer.

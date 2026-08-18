---
name: add-bookshelf-book
description: Add a complete article, report, or PDF book to the live Roland Wayne React bookshelf, including exact metadata, cover treatment, assets, perspective-safe geometry, seamless-loop behavior, production build integration, and local or live QA. Use when asked to 制作一本书、添加文章/PDF/白皮书到书架、设计书封、更新书架内容，或测试上线后的 Roland 书架。
---

# Add Bookshelf Book

Work from `/Users/garylau/Work/rolandwayne`. The deployed bookshelf and article pages share the repository's React/Vite production build.

## Prepare

1. Read the root and `apps/homepage/AGENTS.md` files.
2. Inspect `git status`; preserve unrelated work.
3. Read [references/book-schema.md](references/book-schema.md).
4. Resolve the exact title, target, content type, cover direction, source URL/file, and factual metadata. Never invent article facts.
5. For PDFs, invoke the PDF skill, inspect the source, preserve its bytes, and record SHA-256 before copying. For generated or edited artwork, invoke the appropriate image/design skill.

## Add the book

1. Add one entry to `apps/homepage/src/BookshelfApp.jsx` using the schema reference.
2. Use the next sequential two-digit number and a unique stable ID.
3. Put new cover/PDF assets in `public/assets/books/`, except an approved shared brand asset already under `public/assets/`.
4. Keep exact title text in the DOM. Do not flatten the title into cover artwork.
5. Add a dedicated cover variant only when the supplied visual direction cannot use the standard cover anatomy.
6. For a production PDF, use its `/assets/books/*.pdf` URL and `_blank` semantics. Decode base64 only when the href actually begins with `data:application/pdf;base64,`; leave normal HTTP/static paths untouched.
7. Derive any displayed totals from `books`; never add another hard-coded count.

## Preserve the book rail

- Keep front cover, top page edge, right page block, back cover, and thickness as one rigid object.
- Keep covers axis-aligned; only the rail path rises from lower left to upper right.
- Show no separate left spine face from the upper-right/front camera.
- Keep the right page block as one `skewY` rectangle so top and bottom remain parallel.
- Preserve measured loop distance, responsive clone count, monotonic stacking across repeated sets, hidden clone accessibility, hover pause, and reduced motion.
- Update the exported `books` data once; the production `EmbeddedBookshelf` must consume it.

## Build and validate

Run from the repository root:

```bash
npm run build
node .agents/skills/add-bookshelf-book/scripts/validate-bookshelf.mjs
```

The root build must finish the Vite homepage build and React article static generation. Require `dist/index.html` and at least one `dist/blog/<slug>/index.html`.

For a PDF, compare copied and source checksums. If a separate self-contained HTML deliverable exists, also require one matching embedded PDF payload; do not assume the production Vite site embeds public assets.

## Local visual QA

1. Start `npm run dev` yourself.
2. Use Browser at desktop and mobile sizes. Inspect the new book at rest and on hover/focus.
3. Check title hierarchy, closed seams, parallel right-page edges, last-to-first overlap, no document overflow, and continuous motion.
4. Confirm only the first set is keyboard reachable; all clones are hidden and untabbable.
5. Click article/PDF destinations only when needed to verify navigation; do not submit forms.

## Live QA

When the user says the site is deployed, test the supplied domain or `https://www.rolandwayne.com/` read-only. Verify:

- canonical HTTPS URL, title, and major navigation;
- the `Article` section and moving book rail on desktop and mobile;
- network/static asset responses and console errors;
- at least one normal article book destination;
- the newest book and PDF viewer behavior;
- no horizontal overflow or visible loop break.

Do not deploy, push, change DNS, edit production content, upload files, or submit forms without separate explicit authorization. Clearly separate local results from production results.

## Report

Report the files changed, book/assets added, build and validator results, live URLs tested, any production mismatch, and whether any external write occurred.

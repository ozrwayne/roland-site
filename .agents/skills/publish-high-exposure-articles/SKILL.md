---
name: publish-high-exposure-articles
description: Publish exactly one unpublished X article per run from the local Roland.W archive, selecting strictly numeric exposure above 100,000 in Beijing publication order, then add the same article as a complete book to the React homepage shelf. Use for daily article publishing, importing the next high-exposure article, repairing an interrupted X-to-site run, or maintaining the Roland article-and-bookshelf pipeline.
---

# Publish one high-exposure article and book

Work only in `/Users/garylau/Work/rolandwayne`. One successful run creates at
most one article, one matching bookshelf entry, and one focused content commit.
Use only `rwayne-after-20260225/engagement-table.md` and its matching local ZIP;
never scrape X or invent missing content.

## Preflight

1. Read the repository `AGENTS.md` and `apps/homepage/AGENTS.md`.
2. Inspect `git status --short --branch`. Preserve unrelated changes and never
   stage them. Publishing must target this repository's `main` branch; stop if
   another branch or conflicting edits make an isolated main-branch commit
   unsafe.
3. If a previous run already generated an article or book without completing
   the pair, finish and validate that pair before selecting another article.
4. Select the next candidate:

   ```bash
   python3 .agents/skills/publish-high-exposure-articles/scripts/select_next_article.py \
     --root /Users/garylau/Work/rolandwayne --threshold 100000 --json
   ```

Only numeric exposure strictly greater than 100,000 qualifies. Reject `待补读`,
blank, rounded, or malformed values and rows without a status URL. Continue
from the latest qualifying article already represented in `src/content/blog/`,
then sort remaining candidates by Beijing publication time, oldest first. If
there is no candidate, make no changes and report a no-op. Stop on a missing
ZIP, metadata disagreement, or unreadable media; never skip forward.

## Import and review

1. Dry-run, then import exactly the selected article:

   ```bash
   python3 .agents/skills/publish-high-exposure-articles/scripts/import_article.py \
     --root /Users/garylau/Work/rolandwayne --threshold 100000 --dry-run
   python3 .agents/skills/publish-high-exposure-articles/scripts/import_article.py \
     --root /Users/garylau/Work/rolandwayne --threshold 100000
   ```

   The importer creates `src/content/blog/x-<status-id>.md`, copies archive
   media to `public/images/blog/x-<status-id>/`, rewrites asset links, declares
   the cover in frontmatter, and leaves the source ZIP untouched.

2. Review the complete Markdown. Preserve the exact source title, `pubDate`,
   `sourceUrl`, numeric `sourceViews`, argument, citations, links, and images.
   Replace the starter description with a concise factual summary and add 3–6
   useful tags. Remove only unmistakable extraction artifacts. Keep
   `draft: false` and `pinned: false`; do not add or substitute a site-entry
   date for the canonical source publication date.

3. Treat medical, legal, financial, safety, and other time-sensitive claims as
   a publication checkpoint. Verify current claims with authoritative sources.
   Do not silently rewrite the source argument. Stop and request direction when
   safe publication would require substantive changes. Any prior unchanged
   exception applies only to the exact article for which the user granted it.

## Add the matching React shelf book

Read `../add-bookshelf-book/references/book-schema.md`, then dry-run and add the
reviewed article:

```bash
python3 .agents/skills/publish-high-exposure-articles/scripts/add_article_to_bookshelf.py \
  --root /Users/garylau/Work/rolandwayne \
  --article src/content/blog/x-<status-id>.md --dry-run
python3 .agents/skills/publish-high-exposure-articles/scripts/add_article_to_bookshelf.py \
  --root /Users/garylau/Work/rolandwayne \
  --article src/content/blog/x-<status-id>.md
```

The script must:

- append one sequential book to `apps/homepage/src/BookshelfApp.jsx`;
- preserve the exact article title as live DOM text;
- copy the article cover byte-for-byte to
  `apps/homepage/public/assets/books/x-<status-id>.<ext>`;
- link the book to the production `/blog/x-<status-id>/` route;
- derive the year from `pubDate`, the kicker from reviewed tags, and stable
  accent/thickness defaults from the slug;
- refuse overwrites, duplicate IDs/hrefs, non-sequential numbering, missing
  covers, drafts, or frontmatter mismatches.

Use `--tone dark` only when the cover is pale enough to require dark title text.
Use `--kicker`, `--accent`, or `--thickness` only for a deliberate cover-level
correction. Do not change shelf geometry, animation, clone behavior, or CSS for
a routine article publication.

## Validate

Run:

```bash
npm run build
node .agents/skills/add-bookshelf-book/scripts/validate-bookshelf.mjs
git diff --check
git status --short
```

Require the generated article page, all article assets, the copied book cover,
and the book title in both homepage build outputs. Check that the semantic book
links to the new article, cloned sets remain hidden and untabbable, and there is
no desktop or 390px mobile horizontal overflow. Review the final diff for
credentials, cookies, temporary files, and unrelated changes. Stop on any
failure; do not select a second article.

## Publish

For an explicitly authorized run, including the configured daily automation,
stage only:

- `src/content/blog/x-<status-id>.md`;
- `public/images/blog/x-<status-id>/`;
- `apps/homepage/src/BookshelfApp.jsx`;
- `apps/homepage/public/assets/books/x-<status-id>.<ext>`.

Create one commit such as `content: publish x-<status-id> and shelf book`, then
push only `main`. Never force-push, reset, broadly clean, delete source ZIPs, or
stage other work. If `origin/main` advanced, use a fast-forward-safe update and
preserve/hash-check any overlapping user paths before rebuilding. Cloudflare
deployment follows the existing main-branch workflow; do not edit DNS or
deployment settings.

Report the title, exposure, Beijing publication date, source URL, article slug,
book number, copied cover, validation results, commit, and push result. A
successful run must not create a second article, book, or content commit that
day.

## Scripts

- `scripts/select_next_article.py` — select the next eligible table/ZIP row.
- `scripts/import_article.py` — dry-run or import one article and its media.
- `scripts/add_article_to_bookshelf.py` — dry-run or append its complete React
  shelf book and copy its cover.

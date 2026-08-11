---
name: publish-high-exposure-articles
description: Publish exactly one unpublished X article per run from the local Roland.W archive, selecting strictly numeric exposure above 100,000 and continuing in Beijing publication-date order. Use for daily article publishing, importing the next high-exposure article, or maintaining this site's X-to-Astro content pipeline.
---

# Publish high-exposure articles

Use this project skill whenever an article is to be imported from
`rwayne-after-20260225/` into the Astro blog. The source is the local
`engagement-table.md` plus the matching article ZIP; never scrape X or invent a
missing article. One successful run publishes at most one article.

## Fixed workflow

1. Work only in `/Users/garylau/Work/rolandwayne`. Read the repository
   `AGENTS.md` and inspect `git status --short` before changing anything.
   Preserve unrelated user changes. They may remain in the working tree, but
   they must never be staged; stop only when they conflict with the generated
   article paths or make a safe isolated commit impossible.

2. Select the next article with the deterministic selector:

   ```bash
   python3 .agents/skills/publish-high-exposure-articles/scripts/select_next_article.py \
     --root /Users/garylau/Work/rolandwayne --threshold 100000 --json
   ```

   Only rows whose exposure is a numeric value strictly greater than 100,000
   qualify. Treat `待补读`, blank values, rounded values, and missing URLs as
   ineligible. Sort by the engagement table's Beijing timestamp, oldest first.
   Treat the latest qualifying table row already represented in
   `src/content/blog/` as the publication cursor, skip every row at or before
   that Beijing timestamp, and skip titles/source URLs already present there.
   This prevents an older out-of-scope archive row from being backfilled after
   the chronological series has advanced.

3. If there is no candidate, make no changes and report a no-op. If the
   candidate's ZIP is missing, metadata disagrees with the table, or media is
   unreadable, stop; do not skip forward to a later date.

4. Run the importer in dry-run mode, then import exactly that candidate:

   ```bash
   python3 .agents/skills/publish-high-exposure-articles/scripts/import_article.py \
     --root /Users/garylau/Work/rolandwayne --threshold 100000 --dry-run
   python3 .agents/skills/publish-high-exposure-articles/scripts/import_article.py \
     --root /Users/garylau/Work/rolandwayne --threshold 100000
   ```

   The importer creates a stable `x-<status-id>.md` slug, copies archive media
   to `public/images/blog/<slug>/`, rewrites local asset links, and leaves the
   source ZIP untouched. The cover is declared in frontmatter and the duplicate
   leading cover image is removed from the article body.

5. Review the generated Markdown before publishing. Keep the source title,
   publication date, source URL, and numeric `sourceViews` unchanged. Replace
   the generated description with a concise, factual summary of the full
   article (no invented claims), and add 3–6 useful tags. Retain the article's
   text, headings, links, citations, and images. Remove only unmistakable
   extraction artifacts; do not rewrite the author's argument. Keep
   `draft: false` and `pinned: false` (the Welcome article is the only pinned
   post). Keep the source `pubDate` unchanged and set `siteDate` to the Beijing
   time when the article enters this site. The importer supplies `siteDate` for
   new imports; if finishing an older uncommitted import that lacks it, add the
   current Beijing publication time during review.

6. Validate the content and site:

   ```bash
   npm run build
   git diff --check
   git status --short
   ```

   Confirm the new Markdown, cover, and every referenced asset exist. Check
   that no credentials, cookies, or private files entered the diff. If the
   build or review fails, stop without selecting another article.

7. For an explicitly authorized publish (including the configured daily
   automation), stage only the generated Markdown and its asset directory,
   create one focused commit such as `content: publish x-<status-id>`, and
   push only this repository's `main` branch. Never stage unrelated changes;
   never use force-push, reset, broad cleanup, or a different remote.
   Cloudflare deployment is triggered by the repository's existing `main`
   workflow; do not edit DNS or Cloudflare settings as part of this skill.

8. Report the published title, exposure, Beijing publication date, source URL,
   commit, and push result. A successful run must not create a second article
   or second content commit on the same day. If a prior generated article is
   already present but not committed, finish and validate that article first;
   if its generated paths conflict with unrelated edits, stop and report it.

## Safety rules

- Never publish a `待补读` row or a row at exactly 100,000 views.
- Never delete, rename, or modify the archive ZIPs.
- Never silently change source dates, exposure counts, titles, or source URLs.
- Never continue past a missing archive, metadata mismatch, invalid media, build
  failure, or failed push.
- Keep all automation scoped to this project directory and this content source.
- If no qualifying article remains, the correct result is a no-op rather than a
  fabricated or lower-exposure post.

## Scripts

- `scripts/select_next_article.py` — deterministic table/ZIP/frontmatter
  selector; exits 1 when no candidate exists.
- `scripts/import_article.py` — validates one ZIP and imports its Markdown and
  media; supports `--dry-run` and refuses to overwrite an existing slug.

#!/usr/bin/env python3
"""Import the next eligible X article from its local archive into the Astro site.

The script is deliberately deterministic: selection is delegated to
``select_next_article.py`` and the source ZIP is never modified.  Use
``--dry-run`` for the scheduled preflight; the normal mode writes one new
Markdown entry and its local media assets.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
import zipfile
from pathlib import Path, PurePosixPath

sys.dont_write_bytecode = True
SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))
from select_next_article import select  # noqa: E402


IMAGE_EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"}
MEDIA_EXTENSIONS = IMAGE_EXTENSIONS | {".mp4", ".mov", ".webm"}
ASSET_RE = re.compile(r"!\[[^\]]*\]\((?:\./)?assets/([^\)]+)\)")
MARKDOWN_LINK_RE = re.compile(r"!?\[([^\]]*)\]\([^\)]*\)")


def slug_for(status_id: str) -> str:
    return f"x-{status_id}"


def yaml_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def description_from_markdown(markdown: str) -> str:
    """Return a short factual starting point for later editorial review."""

    lines = markdown.splitlines()
    paragraph: list[str] = []
    for line in lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("!") or stripped.startswith("#"):
            if paragraph:
                break
            continue
        if stripped.startswith(">"):
            stripped = stripped.lstrip("> ")
        if stripped:
            paragraph.append(stripped)
    text = " ".join(paragraph)
    text = MARKDOWN_LINK_RE.sub(r"\1", text)
    text = re.sub(r"[*_`~]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > 180:
        text = text[:177].rstrip() + "..."
    return text or "本文记录作者对现实问题的观察、分析与实践。"


def article_title(markdown: str) -> str | None:
    for line in markdown.splitlines():
        match = re.match(r"^#\s+(.+?)\s*$", line)
        if match:
            return match.group(1)
    return None


def compact(value: str) -> str:
    normalized = unicodedata.normalize("NFKC", value).casefold()
    return "".join(char for char in normalized if char.isalnum())


def archive_files(archive: Path, expected_title: str, expected_source_url: str) -> tuple[str, dict[str, bytes]]:
    with zipfile.ZipFile(archive) as source:
        article_name = next((name for name in source.namelist() if name.endswith("/article.md")), None)
        metadata_name = next((name for name in source.namelist() if name.endswith("/metadata.json")), None)
        if not article_name or not metadata_name:
            raise ValueError("archive must contain article.md and metadata.json")

        markdown = source.read(article_name).decode("utf-8")
        metadata = json.loads(source.read(metadata_name).decode("utf-8"))
        if compact(str(metadata.get("title", ""))) != compact(expected_title):
            raise ValueError("archive metadata title does not match engagement table")
        if metadata.get("sourceUrl") and metadata["sourceUrl"] != expected_source_url:
            raise ValueError("archive metadata source URL does not match engagement table")
        if compact(article_title(markdown) or "") != compact(expected_title):
            raise ValueError("article.md title does not match engagement table")

        assets: dict[str, bytes] = {}
        for name in source.namelist():
            path = PurePosixPath(name)
            if "assets" not in path.parts or path.name == "" or path.suffix.lower() not in MEDIA_EXTENSIONS:
                continue
            # Only use a basename in the generated public directory.  The archive
            # exporter uses flat asset names (cover.jpg, image-01.jpg, ...).
            filename = path.name
            if filename in assets:
                raise ValueError(f"duplicate asset filename in archive: {filename}")
            assets[filename] = source.read(name)
        if "cover.jpg" not in assets and not any(name.startswith("cover.") for name in assets):
            raise ValueError("archive has no cover asset")
        return markdown, assets


def rewrite_markdown(markdown: str, slug: str) -> str:
    # The cover is rendered by BlogPost.astro; keeping the leading cover image
    # would show it twice on every article page.
    markdown = re.sub(r"^\s*!\[[^\]]*\]\((?:\./)?assets/cover\.[^\)]+\)\s*\n+", "", markdown, count=1)
    return ASSET_RE.sub(lambda match: f"![{match.group(1)}](/images/blog/{slug}/{match.group(1)})", markdown)


def cover_name(assets: dict[str, bytes]) -> str:
    for name in assets:
        if name.startswith("cover."):
            return name
    return "cover.jpg"


def render_frontmatter(candidate: dict[str, object], slug: str, description: str, cover: str) -> str:
    published_at = str(candidate["published_at"])
    return "\n".join(
        [
            "---",
            f"title: {yaml_string(str(candidate['title']))}",
            f"description: {yaml_string(description)}",
            "lang: zh",
            f"pubDate: {published_at}",
            f"sourceUrl: {yaml_string(str(candidate['source_url']))}",
            f"sourceViews: {int(candidate['views'])}",
            "tags: []",
            f"cover: \"/images/blog/{slug}/{cover}\"",
            f"coverAlt: {yaml_string(str(candidate['title']) + '文章封面')}",
            "pinned: false",
            "draft: false",
            "---",
            "",
        ]
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--threshold", type=int, default=100_000)
    parser.add_argument("--dry-run", action="store_true", help="Validate and print the next import without writing")
    args = parser.parse_args()
    root = args.root.resolve()

    candidate = select(root, args.threshold)
    if candidate is None:
        print(json.dumps({"status": "no_candidate"}, ensure_ascii=False, indent=2))
        return 1
    archive_relative = candidate.get("archive")
    if not archive_relative:
        raise SystemExit(f"archive missing for candidate: {candidate['title']}")
    archive = root / str(archive_relative)
    slug = slug_for(str(candidate["status_id"]))
    target_markdown = root / "src/content/blog" / f"{slug}.md"
    target_assets = root / "public/images/blog" / slug
    if target_markdown.exists() or target_assets.exists():
        raise SystemExit(f"refusing to overwrite existing import target: {slug}")

    markdown, assets = archive_files(archive, str(candidate["title"]), str(candidate["source_url"]))
    rewritten = rewrite_markdown(markdown, slug)
    description = description_from_markdown(rewritten)
    frontmatter = render_frontmatter(candidate, slug, description, cover_name(assets))
    result = {
        "status": "dry_run" if args.dry_run else "imported",
        "slug": slug,
        "title": candidate["title"],
        "views": candidate["views"],
        "published_at": candidate["published_at"],
        "source_url": candidate["source_url"],
        "archive": archive_relative,
        "asset_count": len(assets),
        "markdown": str(target_markdown.relative_to(root)),
        "assets": str(target_assets.relative_to(root)),
    }
    if args.dry_run:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0

    target_assets.mkdir(parents=True, exist_ok=False)
    for name, content in assets.items():
        (target_assets / name).write_bytes(content)
    target_markdown.write_text(frontmatter + rewritten, encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

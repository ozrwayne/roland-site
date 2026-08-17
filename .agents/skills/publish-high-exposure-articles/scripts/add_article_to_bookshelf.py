#!/usr/bin/env python3
"""Add one published Astro article to the React homepage bookshelf."""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
import re
import sys
from pathlib import Path


sys.dont_write_bytecode = True

BOOKS_START = "export const books = ["
BOOKS_END = "\n];"
BOOK_RE = re.compile(r"\n  \{\n(?P<body>.*?)\n  \},", re.DOTALL)
FIELD_RE = re.compile(r'^\s+(?P<key>\w+):\s+"(?P<value>[^"]*)",\s*$', re.MULTILINE)
ACCENTS = (
    "#b64f36",
    "#2d6f73",
    "#8d5b3a",
    "#536b91",
    "#8a4f68",
    "#66733f",
)


def fail(message: str) -> "NoReturn":
    raise SystemExit(message)


def parse_frontmatter(path: Path) -> dict[str, object]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        fail(f"article has no YAML frontmatter: {path}")
    parts = text.split("---", 2)
    if len(parts) != 3:
        fail(f"article frontmatter is not closed: {path}")

    lines = parts[1].splitlines()
    values: dict[str, object] = {}
    index = 0
    while index < len(lines):
        match = re.match(r"^([A-Za-z][\w-]*):\s*(.*?)\s*$", lines[index])
        if not match:
            index += 1
            continue
        key, raw = match.groups()
        if key == "tags" and not raw:
            tags: list[str] = []
            index += 1
            while index < len(lines):
                item = re.match(r"^\s+-\s+(.*?)\s*$", lines[index])
                if not item:
                    break
                tags.append(item.group(1).strip("\"'"))
                index += 1
            values[key] = tags
            continue
        try:
            values[key] = ast.literal_eval(raw)
        except (SyntaxError, ValueError):
            values[key] = raw.strip("\"'")
        index += 1
    return values


def js_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def book_objects(source: str) -> tuple[int, int, list[dict[str, str]]]:
    start = source.find(BOOKS_START)
    end = source.find(BOOKS_END, start)
    if start < 0 or end < 0:
        fail("could not locate export const books array")
    objects: list[dict[str, str]] = []
    for match in BOOK_RE.finditer(source[start:end]):
        objects.append({field.group("key"): field.group("value") for field in FIELD_RE.finditer(match.group("body"))})
    if not objects:
        fail("books array contains no parseable entries")
    numbers = [item.get("number") for item in objects]
    expected = [str(index).zfill(2) for index in range(1, len(objects) + 1)]
    if numbers != expected:
        fail(f"bookshelf numbering is not sequential: expected {expected}, found {numbers}")
    return start, end, objects


def article_details(root: Path, article: Path) -> dict[str, object]:
    try:
        relative = article.relative_to(root / "src/content/blog")
    except ValueError:
        fail("article must be inside src/content/blog")
    if relative.parent != Path(".") or article.suffix != ".md":
        fail("article must be a top-level Markdown file in src/content/blog")

    slug = article.stem
    if not re.fullmatch(r"x-\d+", slug):
        fail("this publisher only adds x-<status-id> articles to the bookshelf")

    values = parse_frontmatter(article)
    required = ("title", "pubDate", "cover", "sourceUrl", "sourceViews")
    missing = [key for key in required if not values.get(key)]
    if missing:
        fail(f"article frontmatter is missing: {', '.join(missing)}")
    if values.get("draft") not in (False, "false", "False"):
        fail("article must use draft: false before it can be shelved")

    cover = str(values["cover"])
    expected_prefix = f"/images/blog/{slug}/"
    if not cover.startswith(expected_prefix):
        fail(f"article cover must begin with {expected_prefix}")
    cover_source = root / "public" / cover.lstrip("/")
    if not cover_source.is_file():
        fail(f"article cover does not exist: {cover_source}")

    published = str(values["pubDate"])
    year_match = re.match(r"^(\d{4})", published)
    if not year_match:
        fail(f"could not derive a year from pubDate: {published}")

    tags = values.get("tags")
    if not isinstance(tags, list):
        tags = []
    return {
        "slug": slug,
        "title": str(values["title"]),
        "year": year_match.group(1),
        "tags": [str(tag) for tag in tags if str(tag).strip()],
        "cover_source": cover_source,
    }


def default_kicker(tags: list[str]) -> str:
    if len(tags) >= 2:
        return f"{tags[0]} / {tags[1]}"
    if tags:
        return f"{tags[0]} / Article"
    return "Article / X Archive"


def render_entry(details: dict[str, object], number: str, artwork: str, args: argparse.Namespace) -> str:
    digest = hashlib.sha256(str(details["slug"]).encode("utf-8")).digest()
    kicker = args.kicker or default_kicker(details["tags"])
    accent = args.accent or ACCENTS[digest[0] % len(ACCENTS)]
    thickness = args.thickness if args.thickness is not None else 18 + digest[1] % 13
    href = f"https://www.rolandwayne.com/blog/{details['slug']}/"
    return "\n".join(
        [
            "  {",
            f"    id: {js_string(str(details['slug']))},",
            f"    number: {js_string(number)},",
            f"    title: {js_string(str(details['title']))},",
            f"    kicker: {js_string(kicker)},",
            f"    year: {js_string(str(details['year']))},",
            f"    artwork: {js_string(artwork)},",
            f"    tone: {js_string(args.tone)},",
            f"    accent: {js_string(accent)},",
            f"    thickness: {thickness},",
            f"    href: {js_string(href)},",
            "  },",
        ]
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--article", type=Path, required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--kicker", help="Cover category label; defaults to the first two article tags")
    parser.add_argument("--tone", choices=("light", "dark"), default="light", help="Cover text tone")
    parser.add_argument("--accent", help="CSS color used for the book edge")
    parser.add_argument("--thickness", type=int, choices=range(15, 33))
    args = parser.parse_args()

    root = args.root.resolve()
    article = args.article if args.article.is_absolute() else root / args.article
    article = article.resolve()
    details = article_details(root, article)
    bookshelf_path = root / "apps/homepage/src/BookshelfApp.jsx"
    source = bookshelf_path.read_text(encoding="utf-8")
    _, end, objects = book_objects(source)

    slug = str(details["slug"])
    cover_source = details["cover_source"]
    asset_name = f"{slug}{cover_source.suffix.lower()}"
    artwork = f"/assets/books/{asset_name}"
    cover_target = root / "apps/homepage/public/assets/books" / asset_name
    href = f"https://www.rolandwayne.com/blog/{slug}/"
    existing = next((item for item in objects if item.get("id") == slug), None)
    href_owner = next((item for item in objects if item.get("href") == href), None)

    if existing or href_owner:
        if existing != href_owner or not existing:
            fail("book ID or href collides with a different bookshelf entry")
        expected = {
            "title": str(details["title"]),
            "artwork": artwork,
            "href": href,
        }
        mismatches = [key for key, value in expected.items() if existing.get(key) != value]
        if mismatches:
            fail(f"existing bookshelf entry disagrees on: {', '.join(mismatches)}")
        if not cover_target.is_file() or cover_target.read_bytes() != cover_source.read_bytes():
            fail("existing bookshelf cover is missing or differs from the article cover")
        result = {"status": "already_present", "slug": slug, "number": existing["number"], "artwork": artwork}
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0

    if cover_target.exists() and cover_target.read_bytes() != cover_source.read_bytes():
        fail(f"refusing to overwrite a different bookshelf cover: {cover_target}")

    number = str(len(objects) + 1).zfill(2)
    entry = render_entry(details, number, artwork, args)
    updated = source[:end] + "\n" + entry + source[end:]
    result = {
        "status": "dry_run" if args.dry_run else "added",
        "slug": slug,
        "number": number,
        "title": details["title"],
        "artwork": artwork,
        "href": href,
        "source_cover": str(cover_source.relative_to(root)),
        "copied_cover": str(cover_target.relative_to(root)),
    }
    if not args.dry_run:
        cover_target.parent.mkdir(parents=True, exist_ok=True)
        if not cover_target.exists():
            cover_target.write_bytes(cover_source.read_bytes())
        bookshelf_path.write_text(updated, encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

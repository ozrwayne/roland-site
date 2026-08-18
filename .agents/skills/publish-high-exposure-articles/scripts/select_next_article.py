#!/usr/bin/env python3
"""Select the next unpublished X article above the configured exposure threshold."""

from __future__ import annotations

import argparse
import ast
import json
import re
import sys
import unicodedata
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo


sys.dont_write_bytecode = True
SHANGHAI = ZoneInfo("Asia/Shanghai")
ROW_RE = re.compile(
    r"^\|\s*\[(?P<title>.*?)\]\((?P<url>https?://[^)]+)\)\s*\|\s*"
    r"(?P<views>[^|]+?)\s*\|\s*(?P<published>\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})\s*\|"
)


@dataclass(frozen=True)
class Candidate:
    title: str
    source_url: str
    views: int
    published_at: str
    archive: str | None
    status_id: str


def compact(value: str) -> str:
    """Normalize titles for matching table rows, ZIP names, and frontmatter."""

    normalized = unicodedata.normalize("NFKC", value).casefold()
    return "".join(char for char in normalized if char.isalnum())


def parse_views(value: str) -> int | None:
    value = value.strip().replace(",", "")
    return int(value) if value.isdigit() else None


def parse_table(path: Path, threshold: int) -> list[Candidate]:
    candidates: list[Candidate] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        match = ROW_RE.match(line)
        if not match:
            continue
        views = parse_views(match.group("views"))
        if views is None or views <= threshold:
            continue
        published = datetime.strptime(match.group("published"), "%Y-%m-%d %H:%M").replace(
            tzinfo=SHANGHAI
        )
        status_match = re.search(r"/status/(\d+)", match.group("url"))
        if not status_match:
            continue
        candidates.append(
            Candidate(
                title=match.group("title").strip(),
                source_url=match.group("url"),
                views=views,
                published_at=published.isoformat(),
                archive=None,
                status_id=status_match.group(1),
            )
        )
    return sorted(candidates, key=lambda item: item.published_at)


def frontmatter_values(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    values: dict[str, str] = {}
    for line in parts[1].splitlines():
        match = re.match(r"^([A-Za-z][\w-]*):\s*(.*?)\s*$", line)
        if not match:
            continue
        raw = match.group(2)
        try:
            parsed = ast.literal_eval(raw)
            values[match.group(1)] = str(parsed)
        except (ValueError, SyntaxError):
            values[match.group(1)] = raw.strip("\"'")
    return values


def existing_articles(root: Path) -> tuple[set[str], set[str]]:
    titles: set[str] = set()
    source_urls: set[str] = set()
    for path in (root / "content/blog").glob("*.md"):
        values = frontmatter_values(path)
        if values.get("title"):
            titles.add(compact(values["title"]))
        if values.get("sourceUrl"):
            source_urls.add(values["sourceUrl"])
    return titles, source_urls


def locate_archive(root: Path, title: str) -> Path | None:
    wanted = compact(title)
    for path in sorted((root / "rwayne-after-20260225").glob("Roland.W - *.zip")):
        filename_title = path.stem.removeprefix("Roland.W - ")
        if compact(filename_title) == wanted:
            return path
    return None


def select(root: Path, threshold: int) -> dict[str, object] | None:
    table = root / "rwayne-after-20260225/engagement-table.md"
    if not table.exists():
        raise FileNotFoundError(table)
    titles, source_urls = existing_articles(root)
    candidates = parse_table(table, threshold)

    # Existing matching articles form a chronological publication cursor. Do
    # not backfill an older archive row after newer qualifying articles have
    # already been published.
    published_candidates = [
        candidate
        for candidate in candidates
        if compact(candidate.title) in titles or candidate.source_url in source_urls
    ]
    published_through = max(
        (candidate.published_at for candidate in published_candidates),
        default=None,
    )

    for candidate in candidates:
        if published_through is not None and candidate.published_at <= published_through:
            continue
        if compact(candidate.title) in titles or candidate.source_url in source_urls:
            continue
        archive = locate_archive(root, candidate.title)
        result = asdict(candidate)
        result["archive"] = str(archive.relative_to(root)) if archive else None
        return result
    return None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--threshold", type=int, default=100_000)
    parser.add_argument("--json", action="store_true", help="Print machine-readable output")
    args = parser.parse_args()

    result = select(args.root.resolve(), args.threshold)
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif result:
        print(f"{result['title']} | {result['views']:,} views | {result['published_at']}")
        print(f"source: {result['source_url']}")
        print(f"archive: {result['archive'] or 'MISSING'}")
    else:
        print("No unpublished article matches the exposure threshold.")
    return 0 if result else 1


if __name__ == "__main__":
    raise SystemExit(main())

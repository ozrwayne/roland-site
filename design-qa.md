# Article Library Design QA

## Evidence

- Source visual truth: `/var/folders/kz/b445zzy530ddcsz8y74_0z500000gn/T/codex-clipboard-87eb60c7-17ea-4279-95f3-4354cf76bab5.png` (article-row before state, 3088 × 1262 px) and `/var/folders/kz/b445zzy530ddcsz8y74_0z500000gn/T/codex-clipboard-ae4b2266-2175-458c-a325-a31140a15ac6.png` (bookshelf before state, 3344 × 1780 px).
- Rendered implementation: `/tmp/roland-article-qa-desktop-list-final.png` (1720 × 1258 CSS viewport; 1720 × 1258 capture at device scale 1), `/tmp/roland-article-qa-desktop-top-final.png` (same viewport), and `/tmp/roland-article-qa-mobile-top.png` (390 × 844 CSS viewport; 375 × 812 visible-page capture at device scale 1 after browser chrome and scrollbars).
- Combined comparisons: `/tmp/roland-article-qa-row-comparison.png` and `/tmp/roland-article-qa-shelf-comparison.png`. Both inputs were normalized to a common comparison height before being placed side by side; the source images represent the rejected before state, so the intended comparison is the user-requested directional change rather than pixel identity.
- State: `/articles/` at the hero/bookshelf boundary and the first article row, with `Welcome — Why This Site Exists` pinned first.

## Findings

- No actionable P0, P1, or P2 visual differences remain.
- Fonts and typography: existing display, serif, and sans stacks are unchanged; the tighter row does not introduce clipping or unintended wrapping.
- Spacing and layout rhythm: the bookshelf spans the full 1720 px desktop content viewport with zero horizontal overflow; hero-to-shelf gap is 0 px and shelf-to-search gap is 40 px. The first desktop row is about 322 px tall instead of the previous oversized presentation.
- Colors and visual tokens: no palette, border, or surface-token changes were introduced.
- Image quality and asset fidelity: existing cover assets remain in use. Article frames are fixed at 16:9 (measured 1.783 desktop and 1.777 mobile) and intentionally use `object-fit: fill` as requested.
- Copy and content: article titles, descriptions, dates, and ordering are unchanged. Welcome remains first and the remaining articles retain newest-to-oldest ordering.

## Responsive And Interaction Checks

- Desktop: 1720 × 1258, no document horizontal overflow, bookshelf left/right edges at 0/1720, no console errors.
- Mobile: 390 × 844, one-column cards, full-width bookshelf, 16:9 cover frame, and no horizontal overflow.
- Search: entering `澳洲` returned 5 matching articles and clearing the query restored the list.
- Server/client consistency: article dates are explicitly formatted in `Asia/Shanghai`, so Cloudflare's UTC prerender and the browser produce identical date text without a hydration error.

## Comparison History

1. Initial implementation used `100vw` for the full-bleed shelf. The rendered page exposed a horizontal scrollbar because the viewport unit included the vertical scrollbar gutter.
2. The shelf was moved to an inline-size query container and sized with `100cqw`. Post-fix evidence measured `scrollWidth === clientWidth`, with the shelf exactly aligned to both viewport edges.
3. Production verification exposed a pre-existing timezone mismatch: Workers rendered one article as `2026/08/05` while the browser rendered `2026/08/06`. The formatter now names `Asia/Shanghai`, and an UTC build produces the same `2026/08/06` text as the client.

## Follow-up Polish

- No P3 follow-up is required for this scoped change.

final result: passed

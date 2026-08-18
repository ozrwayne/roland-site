# Homepage Article Alignment Design QA

## Evidence

- Source visual truth: `/var/folders/kz/b445zzy530ddcsz8y74_0z500000gn/T/codex-clipboard-13626925-9f23-4940-ae0d-609b681c4d94.png` (2552 × 1712 px). It records the before state and the requested target relationship: raise the right article card, align its top with the `Article` title, and align the two black action-button bottoms.
- Rendered implementation: `/tmp/roland-home-article-spacing-final.png` (1720 × 1150 CSS viewport and capture at device scale 1).
- Full-view comparison: `/tmp/roland-home-article-spacing-comparison.png` (3434 × 1150 px). The source was proportionally normalized to 1150 px high and placed beside the implementation without changing either design's internal proportions.
- State: homepage `Article` section, first Australia article active, normal desktop theme.

## Findings

- No actionable P0, P1, or P2 differences remain for the requested alignment change.
- Fonts and typography: existing display, CJK serif, and sans stacks, sizes, weights, line heights, and wrapping remain unchanged.
- Spacing and layout rhythm: the right card top and `Article` title top differ by 0 px. The `阅读全文` and `阅读所有文章` button bottoms differ by 0 px at 920, 1000, 1080, 1180, 1280, 1440, 1720, and 2552 px desktop widths. The desktop surface uses the shared 40 px top/bottom spacing tokens; measured visual insets are 41 px including the 1 px border. The translated card's layout space collapses with it, so no stale bottom gap remains.
- Colors and visual tokens: no palette, border, surface, radius, or button-token changes were introduced.
- Image quality and asset fidelity: the existing article cover and crop remain in use. Only the desktop cover height adjusts to satisfy both alignment constraints; measured cover height stays between about 287 and 313 px across the checked desktop range.
- Copy and content: all headings, descriptions, metadata, tags, labels, and destinations are unchanged.

## Responsive And Interaction Checks

- All three article selectors were activated. Each selected article retained a 0 px title-top delta and 0 px button-bottom delta after the transition settled.
- At 390 × 844, the card returns to the existing natural stacked flow (`transform: none`), the cover remains 210 px high, and no horizontal overflow appears.
- Mobile preserves its established 28 px top and 30 px bottom surface padding instead of inheriting the desktop spacing override.
- Desktop widths from 920 through 2552 px produced no document horizontal overflow.
- Browser diagnostics returned no console log entries.
- A separate focused crop was not needed: both target alignment edges are fully visible in the full-view comparison, and their exact DOM coordinates were measured at every tested breakpoint and selection state.

## Comparison History

1. Before state: the card and directory started on the same row; at 1720 px the right action ended 249.13 px below the left action.
2. First implementation aligned the button bottoms by translating the card upward from the measured live delta.
3. The user added the title-top requirement. The implementation now independently aligns the card top to the `Article` title and adjusts only the desktop cover height for the remaining action alignment. Post-fix evidence measures both deltas at exactly 0 px.
4. The translated card initially left its natural grid height behind, creating excess bottom whitespace. The slot now collapses that translated space, and the Article surface uses the same 40 px desktop top/bottom tokens as the other primary frames. Post-fix evidence measures 41 px from each visible content edge to the bordered surface edge.

## Follow-up Polish

- No P3 follow-up is required for this scoped change.

final result: passed

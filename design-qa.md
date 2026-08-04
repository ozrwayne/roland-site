# Design QA — WIS Blue/White Homepage

## Evidence

- Source visual truth: `/Users/garylau/.codex/generated_images/019fc6a1-11e1-74b2-aa33-b83ce35444ae/exec-060e749a-2b0c-4d40-976e-6417bfaaa64e.png`
- Browser-rendered implementation: `/Users/garylau/Work/rolandwayne/tmp/design-qa/home-desktop-final-v2.jpg`
- Full-view comparison: `/Users/garylau/Work/rolandwayne/tmp/design-qa/home-comparison-final-v2.jpg`
- Focused hero/sidebar comparison: `/Users/garylau/Work/rolandwayne/tmp/design-qa/hero-comparison-final.png`
- Mobile evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/home-mobile-final-v2.jpg`
- Mobile menu evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/home-mobile-menu.png`
- Contact/footer evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/home-footer-final-v3.jpg`
- Article archive evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/blog-desktop-v1.png`
- Welcome article evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/welcome-desktop-v1.png`
- Enlarged Logo/alignment evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/hero-logo-alignment-v1.jpg`
- Enlarged Logo mobile evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/hero-logo-mobile-v1.jpg`
- Full-frame Hero background evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/hero-full-frame-background-v1.jpg`
- Full-frame Hero mobile evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/hero-full-frame-mobile-v1.jpg`
- Centered contact CTA evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/contact-center-v1.jpg`
- Unified white practice section evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/practice-white-v1.jpg`
- Single-language desktop evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/single-language-desktop-v1.jpg`
- Single-language mobile menu evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/single-language-mobile-menu-v1.jpg`
- Compact blog archive evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/blog-compact-header-v1.jpg`
- Compact blog archive mobile evidence: `/Users/garylau/Work/rolandwayne/tmp/design-qa/blog-compact-header-mobile-v1.jpg`

## Normalization

- CSS viewport: `1536 × 1024` for the desktop comparison.
- Source pixels: `1536 × 1024`.
- Browser screenshot pixels: `1528 × 1019` from the Codex in-app Browser capture surface.
- Browser-reported device pixel ratio: `2`.
- Density/crop normalization: the source was resized to `1528 × 1019` before the side-by-side comparison; no content-region crop was applied to the full-view comparison.
- State: `/` at top-of-page, light theme, desktop navigation visible, no hover or focus state.

## Full-view comparison

The final implementation preserves the selected visual's major composition: a solid deep-navy fixed identity rail, circular portrait, one-dot active state, cool-white hero, WIS blue typography, right-side WIS logo over translucent diagonal planes, and a restrained article timeline. The content order intentionally differs from the original mock because the user explicitly requested `Welcome — Why This Site Exists` to remain pinned above newer articles. Placeholder rows from the concept mock are intentionally omitted; the homepage renders only published content and will expand up to five entries as new Markdown articles are added.

## Focused-region comparison

The hero/sidebar crop was compared separately because it contains the most fidelity-sensitive surfaces: portrait crop, icon weight, active marker, display typography, brand logo quality and diagonal-plane artwork. The final version uses the supplied portrait and WIS logo assets, a generated raster hero background, and a vendored Phosphor icon font. No logo, hero artwork or icon was approximated with custom SVG, CSS illustration, emoji or placeholder art.

## Required fidelity surfaces

- Fonts and typography: one native system stack is used throughout. The final headline holds the intended two-line composition at the desktop target; utility labels use restrained tracking and weight.
- Spacing and layout rhythm: the rail matches the reference's approximately 18% desktop share. Hero and article sections align to the right-side content canvas, and the footer begins exactly after the fixed rail.
- Colors and tokens: deep navy `#0A1F5D`, ice blue `#A3D1E0`, unified cool white `rgb(247, 249, 252)` and pale blue-gray consistently replace the legacy black/gold system. The contact CTA shares the exact cool-white token used by Hero/latest; only the footer drops to near-black `#05070D`.
- Image quality: the real WIS mark remains crisp and unfaded; generated hero/cover assets match the selected blue-white direction. The Australia cover was reduced to a 351 KB derivative to avoid a slow card image.
- Copy and content: all requested hero text, latest-article behavior, three About pillars, contact CTA and verified external links are present.
- Icons: one Phosphor regular icon family is used for the rail, mobile menu, arrows and section markers.
- Responsiveness/accessibility: the 390 × 844 layout has no horizontal overflow, the desktop rail becomes a mobile header/menu, menu state locks body scrolling, focus styles and reduced-motion handling are present, and image alt text is supplied.

## Comparison history

### Iteration 1

- [P2] Desktop hero headline wrapped into four lines because the display size exceeded the copy column.
  - Fix: reduced the desktop display scale to a 63.7 px computed size and widened its text measure.
  - Post-fix evidence: `home-desktop-viewport-v2.png`; the headline now matches the intended two-line hierarchy.
- [P2] The Australia timeline thumbnail used the full-size source map and was not ready during the first above-the-fold capture.
  - Fix: created `public/images/blog/australia-2026/cover.jpg` at 1200 px / 351 KB and pointed frontmatter to it.
  - Post-fix evidence: `home-desktop-final.png`; all six visible page images report complete with non-zero natural width.

### Iteration 2

- [P2] The first coded Hero read as two adjacent modules because the copy and artwork each owned a separate half and a visible center seam.
  - Fix: changed Hero to one relative cool-white canvas; the plane artwork now spans the full section, while the copy and real WIS Logo overlay it independently.
  - Post-fix evidence: `home-desktop-final-v2.jpg` and `home-comparison-final-v2.jpg`.
- [P2] The contact CTA and footer originally formed one continuous dark-blue block, which weakened the page ending and conflicted with the requested white section rhythm.
  - Fix: contact CTA now uses the shared `--wis-paper` background; the standard footer alone uses `#05070D`.
  - Post-fix evidence: `home-footer-final-v3.jpg`.
- Mobile regression after the unified Hero change:
  - Result: `390 × 844` viewport remains single-column with no horizontal overflow (`scrollWidth 382` for a browser content viewport of `390`).
  - Post-fix evidence: `home-mobile-final-v2.jpg`.

### Iteration 3

- [P2] The supplied WIS Logo needed more visual authority and a stricter relationship to the Hero copy.
  - Fix: increased the desktop Logo width to approximately `611px` at the target viewport and aligned it to the same vertical center as the complete left copy group.
  - Measured result: copy center `244px`; Logo center `244px`.
  - Post-fix evidence: `hero-logo-alignment-v1.jpg`.
- [P2] The two-line headline needed stronger semantic contrast.
  - Fix: retained WIS navy for “用跨学科思维” and changed “拆解复杂问题” to near-black `rgb(17, 19, 24)`.
- Mobile regression:
  - Result: Logo expands to approximately `313px` at the `390px` viewport while the document remains free of horizontal overflow (`scrollWidth 382`).
  - Post-fix evidence: `hero-logo-mobile-v1.jpg`.

### Iteration 4

- [P2] The Hero background still used `object-fit: cover`, so fitting the original `1536 × 1024` artwork into the wide Hero cropped its upper and lower composition and made the planes look enlarged.
  - Fix: separated background framing from Logo sizing and changed the plane artwork to full-frame mapping. The Logo remains independently enlarged.
  - Result: the source artwork's bottom reflection line, plane start positions and right edge are all visible again.
  - Post-fix evidence: `hero-full-frame-background-v1.jpg` and `hero-full-frame-mobile-v1.jpg`.

### Iteration 5

- [P2] The contact CTA relied only on inherited text alignment rather than one explicit layout axis.
  - Fix: made `.cta-content` a centered vertical flex group with `align-items: center` and `text-align: center`.
  - Measured result: kicker, title, description, button and section all share the same horizontal center at approximately `904.92px` in the desktop target viewport.
  - Post-fix evidence: `contact-center-v1.jpg`.

### Iteration 6

- [P2] The “工作与实践” section still used the pale-blue `#EEF3F9` rhythm surface instead of the agreed shared white canvas.
  - Fix: changed the section background to the global `--wis-paper` token and retained only the hairline border for separation.
  - Measured result: Hero, latest articles, practice and contact CTA all compute to `rgb(247, 249, 252)`.
  - Post-fix evidence: `practice-white-v1.jpg`.

### Iteration 7

- [P3] Practice links used text decoration on hover, so the underline stopped before the arrow.
  - Fix: replaced text decoration with one bottom border on the complete inline-flex link and added `align-self: flex-start` to prevent the line stretching across the card column.
  - Measured result: the compact link box ends exactly at the arrow edge, so the hover line covers text, spacing and arrow continuously.

### Iteration 8

- [P2] The desktop rail and mobile menu still displayed a Chinese/English language control even though the site will not use dual pages.
  - Fix: removed both language controls, their globe icons, disabled English label, component prop plumbing and obsolete CSS.
  - Result: desktop and mobile DOM contain zero language-switch or globe elements; the mobile menu still opens normally without horizontal overflow.
  - Post-fix evidence: `single-language-desktop-v1.jpg` and `single-language-mobile-menu-v1.jpg`.

### Iteration 9

- [P2] The article archive header used an oversized display title and excessive vertical padding, delaying the article list and making the page feel inflated.
  - Fix: reduced the desktop header to approximately `274px` and the mobile header to approximately `199px`; the first article now begins near `346px` on desktop and `311px` on mobile.
  - Copy hierarchy: `Blog / Archive` → `文章` → `Thoughts & Insights`.
  - Removed the dynamic article-count label entirely.
  - Post-fix evidence: `blog-compact-header-v1.jpg` and `blog-compact-header-mobile-v1.jpg`.

### Final pass

No actionable P0/P1/P2 differences remain. Browser-computed backgrounds confirm Hero, latest articles and contact CTA are all `rgb(247, 249, 252)`, while the footer is `rgb(5, 7, 13)`. Browser console error/warning checks returned an empty list on the homepage and Welcome article.

## Primary interactions tested

- Desktop active navigation on `/` and `/blog`.
- Mobile menu open/close state, `aria-expanded`, body scroll lock and active marker.
- Homepage links to the article archive and article detail.
- Welcome cover on both archive and article-detail views.
- Footer alignment with the fixed rail.
- Verified footer URLs for LinkedIn, Google Scholar, ORCID, X and the three friendship links.

## Follow-up polish

- [P3] When the next three posts are published, review the five-row timeline density at `1536 × 1024`; the data behavior is complete, but real titles may require small copy-specific line-clamp tuning.

## Final result

final result: passed

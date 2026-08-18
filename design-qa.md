# Homepage Article Switch Stability QA

## Scope

- Surface: homepage `Article` section.
- Regression: the right detail copy visibly flashed and its internal cover/copy boundary moved when selecting another featured article.
- Required result: switching may replace content only; card, cover, copy region, and action geometry must remain unchanged.

## Root Cause

- The selected detail article used a changing React `key`, so every selection unmounted and rebuilt the entire right card.
- The rebuilt card replayed `content-fade-in`, temporarily changing opacity and vertical position.
- The desktop alignment effect recalculated cover height from the active article's text height, moving the cover/copy boundary between the longer first article and the two shorter articles.
- On mobile, the natural copy height also changed the total card height by 40.438 px.

## Fix

- Reuse one persistent detail card and remove the selection-time entry animation.
- Keep all three local cover images decoded in the fixed cover slot and switch them with non-animated visibility.
- Overlay all three detail-copy panels in one shared grid track so the longest content defines a stable responsive height; expose only the active panel to interaction and accessibility.
- Lock the desktop card and cover geometry independently of the selected article, while retaining the existing top and action alignment.

## Browser Evidence

- Desktop viewport: 1440 × 1000.
- All three selections measured exactly the same geometry:
  - detail card: top 65 px, height 717.555 px, width 719.102 px
  - cover: top 66 px, height 311.414 px, width 717.102 px
  - copy region: top 377.414 px, height 404.141 px, width 717.102 px
  - read action: top 693.555 px, height 46 px, bottom 739.555 px
  - action-bottom alignment delta: 0 px
- A 24-sample rapid-switch check returned one unique rectangle for the card, cover, copy, and action. Opacity stayed at `1`, animation stayed `none`, exactly one copy and one cover were visible, and all three covers remained decoded.
- Mobile viewport: 390 × 844. All three selections measured the same 640.813 px card, 210 px cover, 428.813 px copy region, and identical action coordinates.
- Desktop and mobile document overflow: 0 px.
- Browser diagnostics contained no error or warning entries introduced by the change.

## Build Evidence

- `npm run build`: passed; 17 articles generated.
- `node scripts/validate-react-site.mjs`: passed with no errors.
- `node .agents/skills/add-bookshelf-book/scripts/validate-bookshelf.mjs`: passed for 14 books, 1 PDF, and 15 local assets.
- `git diff --check`: passed.

final result: passed

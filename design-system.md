# Fomi Stage 1 — Design System & Asset Plan

## Direction
Premium dark creative software. The UI should feel calm, precise, cinematic, and professional. Artwork—not decorative chrome—is the visual hero. Use the five supplied reference screens as pattern inspiration only; do not copy any one product's layout or branding.

## Brand principles
- Maximum capability, minimum complexity.
- Clear hierarchy and high information density without clutter.
- Every control has a clear purpose and feedback.
- Consistent shared tokens, with separate product experiences for Part A and Part B.

## Color tokens
- App background: `#101115`
- Sidebar / navigation: `#14151A`
- Main surface: `#191A20`
- Raised surface: `#202129`
- Hover surface: `#292A34`
- Border subtle: `#30313B`
- Border strong: `#414350`
- Text primary: `#F3F2F7`
- Text secondary: `#B3B4C0`
- Text muted: `#858794`
- Accent violet: `#B9A0FF`
- Accent hover: `#C8B6FF`
- Accent pressed: `#9B7FF0`
- Focus ring: `#D0BEFF`
- Success: `#63D6A2`
- Warning: `#F4C978`
- Error: `#FF7F8B`
- Info: `#8CB8FF`

Use accent for primary actions, active navigation, selected nodes, and focus—not for every border or heading. Keep semantic status colors distinct.

## Typography
- UI font: Geist Sans (or Inter fallback); code/metadata: Geist Mono (or ui-monospace fallback).
- Default body: 14px / 1.5.
- Compact labels: 12px / 1.4, medium weight.
- Button text: 13px / 1.3, 600 weight.
- Section title: 16px / 1.35, 600 weight.
- Page title: 20–24px / 1.2, 600 weight.
- Large canvas headline: 28–32px / 1.15 only for empty/welcome states.
- Avoid long all-caps labels; use tabular numerals for dimensions, counts, and credits.

## Spacing scale
Use a 4px base unit:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px
- `space-10`: 40px
- `space-12`: 48px
Dense tool controls may use 8–12px internal gaps; major panel groups use 20–24px.

## Shape, borders, elevation
- Small controls: 8px radius.
- Inputs and cards: 10–12px radius.
- Dialogs / popovers: 12–16px radius.
- Use 1px borders to define surfaces. Avoid heavy shadows; use subtle elevation only for menus, dialogs, and floating controls.
- Selected elements should use a clear border/fill treatment, not color alone.

## Iconography
- Use Lucide icons consistently (lucide-react), stroke width 1.75–2.
- Typical sizes: 16px inline, 18px controls, 20px navigation, 24px empty states.
- Pair unfamiliar icons with labels or tooltips.
- Never use emoji as functional UI icons.
- Every icon-only button needs an accessible name and a visible focus state.

## Motion and interaction
- Fast controls: 120–160ms.
- Menus and small transitions: 160–220ms.
- Canvas / panel transitions: 220–280ms.
- Use ease-out for entering and ease-in for exiting.
- Respect `prefers-reduced-motion`; no essential information should depend on animation.
- Every action needs feedback: pressed/selected state, loading state, toast, or a clear result.

## Responsive breakpoints
Use Tailwind defaults unless the implementation needs a deliberate exception:
- Mobile: `< 640px` — single-column, bottom or collapsible control sheet, no persistent wide sidebar.
- Small tablet: `640–767px` — compact navigation, controls can become drawers.
- Tablet / small laptop: `768–1023px` — collapsible sidebar and 2-column results when space allows.
- Desktop: `1024–1279px` — full primary workspace with compact side panels.
- Large desktop: `1280–1535px` — expanded gallery and comfortable inspector width.
- Wide display: `1536px+` — cap readable content widths; do not stretch controls endlessly.
Check actual available width, not device labels. Avoid horizontal overflow at every breakpoint.

## Layout measurements
- Desktop left navigation: 64–76px icon rail, or 208–232px expanded sidebar.
- Generation settings panel: 280–340px on wide screens.
- Canvas inspector: 260–320px when visible.
- Top bar: 56–64px.
- Click targets: aim for 40–44px minimum; compact icon buttons may be smaller only when well-spaced.
- Canvas content max width: 1600px; keep galleries responsive to available space.

## Asset strategy
Prefer a small, curated set of original/generated demo assets stored locally in `public/images/` and optimized with `next/image`. Avoid depending on hotlinked image URLs in the final deployment.

### Required demo asset set
1. `campaign-skincare-hero.webp` — premium skincare bottle, editorial studio light, 4:5.
2. `campaign-skincare-natural.webp` — warm natural-light variation, 4:5.
3. `campaign-skincare-dramatic.webp` — dark dramatic studio variation, 4:5.
4. `campaign-skincare-minimal.webp` — minimal cream/stone variation, 4:5.
5. `fashion-editorial.webp` — cinematic editorial portrait, 4:5.
6. `architectural-atmosphere.webp` — atmospheric architecture, 3:2.
7. `surreal-object-study.webp` — imaginative sculptural object, 1:1.
8. `video-preview-poster.webp` — cinematic video frame poster, 16:9.
9. `reference-board-01.webp` — mixed creative reference board, 3:2.
10. `empty-canvas-noise.webp` — subtle dark texture/noise, optional and low contrast.

Use images that are properly licensed or generated specifically for the demo. Do not use Fomi's logo or another product's logo without permission. If assets are generated, ensure the same campaign subject appears consistently across variations.

### Image treatment
- Cards use `object-fit: cover` and stable aspect-ratio containers.
- Set meaningful alt text for informative images; use empty alt text for purely decorative textures.
- Prefer AVIF/WebP where supported, keep thumbnails reasonably sized, and lazy-load below-the-fold content.
- Include a local fallback/placeholder for failed image loads.
- Store asset metadata (alt, ratio, prompt, type, parentId) separately from UI components.

## Product-specific rules
### Part A — Generate
Prioritize prompt composition, generation settings, clear status feedback, and a results gallery. Dense settings should remain understandable and not compete with generated imagery.

### Part B — Canvas
Prioritize visual comparison and lineage. Selected images and parent/child branches need unmistakable states. Keep branching history legible and usable on smaller screens.

## Quality gates
- Contrast checked for all text and controls.
- Keyboard focus is visible and not clipped.
- No horizontal scrolling at 320px viewport width.
- Controls have hover, active, disabled, and loading states where relevant.
- `prefers-reduced-motion` is respected.
- Images have stable dimensions to prevent layout shift.
- Both applications use the same token values but keep separate route/app implementations.

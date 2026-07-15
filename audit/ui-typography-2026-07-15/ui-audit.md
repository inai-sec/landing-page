# InaiSec landing page UI audit — 2026-07-15

## Scope

- Goal: apply the latest browser annotations, normalize repeated typography, and verify the approved landing page across dark/light and desktop/tablet/mobile states.
- Source of truth: the approved Option 1 screenshot, the current browser annotations, and the same-state pre-change captures in this directory.
- Accessibility target: clear heading hierarchy, visible focus, labeled controls, native disclosure behavior, reduced-motion support, and no layout overflow. This is a focused product-design audit, not a formal WCAG conformance claim.

## What was strong

- The alternating section bands, restrained cyan accent, grid texture, and full-page scroll rhythm already felt coherent and human-made.
- The hero workflow, transparent convergence diagram, founder story, and design-partner offer form a clear narrative from detection to a first conversation.
- Native FAQ disclosures, labeled form fields, a skip link, and theme-aware assets provide a solid accessibility base.

## Findings fixed

- **Typography source:** Manrope and IBM Plex Mono were referenced but not declared locally. Added local `@font-face` declarations so the intended type system renders consistently.
- **Repeated item hierarchy:** Problem, Outcomes, and Why-now used slightly different heading and description sizes. Added shared `step-index`, `point-title`, and `point-copy` classes backed by stylesheet tokens.
- **Responsive section pattern:** Problem and Why-now switched layouts at different widths. Both now retain the same alternating two-column pattern through tablet and stack together at `760px`.
- **Mobile centered headings:** Outcomes had a selector mismatch that made its centered heading smaller than the FAQ heading. The shared centered-section rule now applies correctly.
- **Regulatory urgency:** Updated the Why-now title and added a fourth item, “Shorter regulatory clocks,” while keeping the existing visual pattern.
- **Form alignment:** The design-partner form is centered within the right-side column and within its stacked tablet layout.

## Flow audit

1. **Hero — healthy.** Approved copy and workflow remain unchanged; `01–03` establish the shared index style.
2. **Problem — healthy.** Left/right framing is consistent with Why-now; `01–04` share the hero index size and the common item hierarchy.
3. **Outcomes — healthy.** Centered title and summary are consistent; the `2 × 2` outcome grid and transparent diagram remain balanced in both themes.
4. **Why now — healthy.** Regulatory framing is clearer; four urgency items use the same heading, copy, and index system as Problem.
5. **Founder — healthy.** Practitioner story, portrait, signature, and proof points remain visually intact.
6. **Design partner — healthy.** Value summary remains on the left and the form is centered on the right; labels and validation affordances remain present.
7. **FAQ — healthy.** Header FAQ is a direct anchor, native accordions remain usable, and the section/footer break is present.

## Visual evidence

- Dark desktop: `12-after-hero-desktop-dark.png` through `18-after-faq-desktop-dark.png`.
- Dark tablet/compact: `19-after-problem-tablet-dark.png` through `22-after-join-972-dark.png`.
- Dark mobile: `23-after-hero-mobile-dark.png` through `29-after-faq-mobile-dark.png`.
- Light desktop: `30-after-hero-desktop-light.png` through `36-after-faq-desktop-light.png`.
- Same-input comparison: `comparison-before-after.png`.
- Focused same-region comparison: `comparison-focused-typography.jpg`.

## Verification

- Shared repeated-title computed style: Manrope, `19.52px`, weight `700`, line-height `23.0336px`.
- Shared repeated-copy computed style: Manrope, `16px`, weight `400`, line-height `25.28px`.
- Shared hero/Problem/Why indices: IBM Plex Mono, `11.2px`, weight `750`, line-height `16.8px`.
- No horizontal overflow at `1440 × 1000`, `972 × 1217`, `806 × 1217`, or `390 × 844`.
- Dark and light diagram assets swap correctly.
- Mobile navigation opens, closes, and navigates directly to FAQ; FAQ disclosure opens correctly.
- `git diff --check` and `node --check script.js` pass.

## Follow-up

- No P0, P1, or P2 design findings remain.
- P3 maintenance note: the stylesheet still contains older overridden layout blocks from prior iterations. They do not affect the current rendering; consolidating them should be a separate cleanup after the design is locked to avoid widening this visual change set.

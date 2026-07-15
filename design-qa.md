# Design QA — annotation round 2

## Comparison target

- Source visual truth:
  - Browser annotations 1–5 supplied with this task, including the marked Problem, Outcomes, Why now, diagram, and FAQ regions.
  - `/var/folders/jj/4q9hmyx126135vzpwqfhqkxc0000gn/T/codex-clipboard-74ababe3-5aab-44d4-a0e2-03be2f775ba2.png` (approved visual direction).
  - Same-state pre-change captures:
    - `/tmp/inaisec-design-qa-round2/before-problem.jpg`
    - `/tmp/inaisec-design-qa-round2/before-outcomes.jpg`
    - `/tmp/inaisec-design-qa-round2/before-why.jpg`
    - `/tmp/inaisec-design-qa-round2/before-faq.jpg`
- Implementation URL: `http://localhost:4173/?theme=dark`
- Final browser-rendered implementation captures:
  - `/tmp/inaisec-design-qa-round2/after-problem-final.jpg`
  - `/tmp/inaisec-design-qa-round2/after-outcomes-final.jpg`
  - `/tmp/inaisec-design-qa-round2/after-why-final.jpg`
  - `/tmp/inaisec-design-qa-round2/after-faq-final.jpg`
  - `/tmp/inaisec-design-qa-round2/after-outcomes-light.jpg`
  - `/tmp/inaisec-design-qa-round2/after-outcomes-1280x720-final.png`
  - `/tmp/inaisec-design-qa-round2/after-faq-1280x720.png`
  - `/tmp/inaisec-design-qa-round2/after-faq-mobile.png`
  - `/tmp/inaisec-design-qa-round2/after-diagram-mobile.png`
- Viewports:
  - Primary desktop: `1998 × 1217`
  - Compact desktop: `1280 × 720`
  - Mobile: `390 × 844`
- States: dark and light themes; desktop section anchors; compact-height section anchors; mobile menu open/closed; FAQ closed/open; empty-form validation error.

## Comparison evidence

- Full-view, same-input before/after comparison: `/tmp/inaisec-design-qa-round2/comparison-before-after.jpg`.
  - Problem, Outcomes, Why now, and FAQ are paired at the same `1998 × 1217` viewport and dark theme.
  - The comparison confirms consistent viewport-scale section rhythm, removal of the annotated internal rules, and the FAQ/footer boundary.
- Focused Outcomes comparison: `/tmp/inaisec-design-qa-round2/focused-outcomes-before-after.jpg`.
  - Confirms the divider-free `2 × 2` outcome layout and revised convergence asset with wider row spacing, five nodes per source, larger labels, and transparent background treatment.

## Findings

No actionable P0, P1, or P2 findings remain.

- Fonts and typography: Manrope and IBM Plex Mono remain unchanged from the approved build. Problem and Why-now sequence indices now resolve to `11.2px`, exactly matching the hero workflow node IDs, with the same `750` weight and normal letter spacing.
- Spacing and layout rhythm: every post-hero desktop section resolves to `calc(100svh - 76px)` (`1141px` at the primary viewport). Problem, Outcomes, Why now, Founder, Join, and FAQ therefore advance with the same page rhythm. Compact desktop sections resolve to the available `644px` below the header without clipping.
- Colors and visual tokens: existing dark/light tokens, grid texture, cyan accents, section backgrounds, and contrast are preserved. The changes remove only the annotated internal rules; section boundary lines remain.
- Image quality and asset fidelity: both revised convergence diagrams are `1536 × 1024` RGBA PNGs with transparent corners and no green fringe. Dark and light assets use the exact labels `IR`, `LEADERSHIP`, `LEGAL`, `CUSTOMER IMPACT`, `FACTS`, `UNKNOWNS`, `OWNER`, and `DECISION`; each input line has exactly five nodes.
- Copy and content: all section copy is unchanged. The FAQ remains a native accordion in the page, while the header FAQ control is now a single direct `<a href="#faq">` link rather than a nested dropdown.
- Responsiveness: measured horizontal overflow is `0px` at all three tested viewports. The desktop full-page rule is limited to widths above `980px`; mobile sections retain natural content height. The mobile menu closes after activating the FAQ link.
- Accessibility and behavior: section headings, form labels, theme control, visible focus treatment, native FAQ disclosures, reduced-motion handling, and status messaging remain intact. The direct FAQ menu link removes the previous nested-disclosure ambiguity.

## Comparison history

### Pass 1 — annotated layout and asset changes

- [P2] Problem, Outcomes, and Why-now still used horizontal and vertical internal rules.
  - Fix: removed borders from the Problem and Why-now rails and from the Outcomes `2 × 2` items while retaining section boundaries.
  - Post-fix evidence: `/tmp/inaisec-design-qa-round2/after-problem-final.jpg`, `/tmp/inaisec-design-qa-round2/after-outcomes-final.jpg`, and `/tmp/inaisec-design-qa-round2/after-why-final.jpg`.
- [P2] Post-hero sections had inconsistent heights, so only the first pages felt like full scroll stops.
  - Fix: applied one shared desktop section contract of `min-height: calc(100svh - 76px)` with centered content.
  - Post-fix evidence: browser measurements show `1141px` for Problem, Outcomes, Why now, Founder, Join, and FAQ at `1998 × 1217`.
- [P2] The convergence diagram was too compressed, had too many nodes, and used undersized labels.
  - Fix: replaced both theme assets with transparent revisions using wider row spacing, five nodes per line, and larger labels.
  - Post-fix evidence: `/tmp/inaisec-design-qa-round2/focused-outcomes-before-after.jpg` and `/tmp/inaisec-design-qa-round2/after-outcomes-light.jpg`.
- [P2] Header FAQ behaved as a dropdown, and FAQ lacked a reliable bottom page-break line.
  - Fix: changed the header control to a direct anchor, removed dropdown JavaScript behavior, and added the FAQ/footer boundary in all responsive states.
  - Post-fix evidence: exactly one header FAQ anchor, zero header `details`, and a computed `1px` FAQ bottom border.

### Pass 2 — exact typography and compact-height audit

- [P2] Sequence indices were enlarged but did not exactly match the hero node size (`12.48px` versus `11.2px`).
  - Fix: set Problem and Why-now indices to `0.7rem`, matching the hero.
  - Post-fix evidence: browser-computed values are `11.2px` for both selectors.
- [P2] The FAQ divider was desktop-only.
  - Fix: moved the FAQ bottom border outside the desktop media query.
  - Post-fix evidence: computed border is `1px` at `1998 × 1217`, `1280 × 720`, and `390 × 844`.
- [P2] At `1280 × 720`, Outcomes and FAQ exceeded the available page height and compact anchor navigation could hide the eyebrow behind the sticky header.
  - Fix: added a compact-height layout with `76px` scroll padding, reduced vertical padding/gaps, scaled the diagram to `440px`, and tightened FAQ rows.
  - Post-fix evidence: Outcomes and FAQ each measure `644px`, navigate to `top: 76px`, and end at `bottom: 720px` in the compact viewport.

### Pass 3 — final visual comparison

- Re-captured the four primary dark-theme sections at `1998 × 1217` after all fixes.
- Compared the source and implementation together in the full-view montage and inspected the Outcomes region at readable scale.
- Result: no actionable P0/P1/P2 differences remain.

## Primary interactions tested

- Desktop navigation: Problem, Outcomes, Why now, Founder, Join, and FAQ.
- Header FAQ: direct navigation to `#faq`; no dropdown or header disclosure remains.
- Theme toggle: dark to light with correct theme-specific convergence asset swap.
- Mobile menu: open, close, and close-on-FAQ-link activation.
- FAQ disclosure: first answer opens and becomes visible.
- Contact form: empty submit focuses the email field, sets `aria-invalid="true"`, and announces `Please enter a valid work email.`
- Console check: no warning or error entries.

## Validation

- `git diff --check`: passed.
- `node --check script.js`: passed.
- Browser-rendered evidence captured at all three target viewports.
- External form delivery was not invoked; only local validation behavior was tested.

## Follow-up polish

No blocking follow-up. End-to-end email delivery can be tested when the form destination is in scope.

final result: passed

# Design QA — InaiSec live-forensics messaging pass

## Comparison target

- Source state: the pre-change captures in `audit/full-audit-2026-07-15/` and the annotated tablet capture in `audit/forensic-messaging-2026-07-15/01-before-annotated-hero.jpg`.
- Rendered implementation: `http://localhost:4173/?theme=dark#top`.
- Viewports: 1440 × 1000, 847 × 1127, and 390 × 844.
- Themes: dark and light.
- Tested states: hero, Problem, Outcomes, Why now, Founder, Join, FAQ, mobile navigation, FAQ expansion, theme switch, and empty-form validation.

## Narrative audit

Passed. The page now describes live identity forensics rather than post-incident evidence assembly.

- Hero establishes the active-investigation category and the core motion: pull evidence, trace compromised access, establish blast radius, and prepare response and disclosure decisions.
- Problem distinguishes detection from the forensic work of tracing identities, roles, sessions, systems, data, customers, and jurisdictions while the incident is active.
- Outcomes names the concrete result: a current blast radius, timeline, scope, unknowns, and decision basis.
- Why now connects machine-speed identity movement with earlier customer, legal, containment, and regulatory decisions.
- Founder credibility is tied to the live investigative gap instead of generic evidence fragmentation.
- The design-partner offer asks prospects to test a real or sanitized credential investigation and states what they receive.
- FAQ reinforces category, existing-stack fit, target user, and design-partner expectations without drifting into generic AI SOC claims.

The narrative through-line is: **Pull → Trace → Scope → Decide → Disclose**.

## Visual and responsive audit

### Hero workflow card

Passed after correction. At the annotated 847 px viewport, the status badge previously extended 6 px beyond the card because the tablet layout restored two columns while the card header stayed on one line. The header now stacks between 761 px and 920 px, and the badge remains fully inside the card.

- 1440 px: 0 px page overflow; 0 px card overflow.
- 847 px: 0 px page overflow; 0 px card overflow.
- 390 px: 0 px page overflow; 0 px card overflow.

### Convergence illustration

Passed. The transparent 1536 × 1024 generated illustration remains crisp in both themes. Text stays live HTML rather than baked into the raster, so it is sharp, accessible, and theme-aware.

- Desktop and tablet labels: 14.08 px.
- Mobile labels: 12 px.
- Inputs: Identity, Cloud, SaaS, Data.
- Outputs: Timeline, Scope, Unknowns, Decision.
- Output rules now size to each label instead of extending to a shared minimum width.
- Light-theme contrast and dark-theme glow were visually checked.

### Shared Problem and Why-now point grid

Passed after correction. Problem and Why now now use the same `point-grid` and `point-card` component classes, spacing, typography, and responsive breakpoints.

- 1440 px: both render as four columns.
- 847 px, 760 px, and 601 px: both render as matching 2 × 2 grids.
- 600 px and 390 px: both render as one column.
- All tested widths: identical computed gaps and 0 px horizontal overflow.

### Typography, spacing, and icons

Passed. Manrope and IBM Plex Mono remain consistently applied. Shared point styles govern the repeated Problem, Outcomes, and Why-now content. The existing SVG outcome icons remain crisp and visually coherent. No heading, label, badge, button, or illustration text overlaps or truncates at the tested widths.

## Comparison evidence

Before is on the left and the revised implementation is on the right:

- Hero overflow and messaging: `audit/forensic-messaging-2026-07-15/14-comparison-overflow.jpg`.
- Problem messaging: `audit/forensic-messaging-2026-07-15/15-comparison-problem-messaging.jpg`.
- Outcomes messaging and diagram labels: `audit/forensic-messaging-2026-07-15/16-comparison-outcomes-messaging.jpg`.

Focused post-fix evidence:

- Tablet hero: `audit/forensic-messaging-2026-07-15/02-after-hero-tablet.jpg`.
- Desktop outcomes: `audit/forensic-messaging-2026-07-15/05-after-outcomes-desktop.jpg`.
- Mobile hero: `audit/forensic-messaging-2026-07-15/09-after-hero-mobile.jpg`.
- Mobile outcomes: `audit/forensic-messaging-2026-07-15/10-after-outcomes-mobile.jpg`.
- Mobile illustration: `audit/forensic-messaging-2026-07-15/11-after-diagram-mobile.jpg`.
- Mobile Join section: `audit/forensic-messaging-2026-07-15/12-after-join-mobile.jpg`.
- Light-theme outcomes: `audit/forensic-messaging-2026-07-15/13-after-outcomes-light.jpg`.
- Problem 2 × 2 grid: `audit/point-grid-unification-2026-07-15/03-after-problem-760.jpg`.
- Why-now 2 × 2 grid: `audit/point-grid-unification-2026-07-15/04-after-why-now-760.jpg`.
- Shortened diagram rules, dark theme: `audit/point-grid-unification-2026-07-15/05-after-outcomes-underline-760.jpg`.
- Shortened diagram rules, light theme: `audit/point-grid-unification-2026-07-15/06-after-outcomes-underline-light-1440.jpg`.
- Problem before/after comparison: `audit/point-grid-unification-2026-07-15/07-comparison-problem.jpg`.
- Why-now before/after comparison: `audit/point-grid-unification-2026-07-15/08-comparison-why-now.jpg`.

## Interaction and accessibility verification

- Mobile menu opens, exposes the navigation, navigates to FAQ, and closes.
- Theme control switches to light and updates its accessible label to “Switch to dark theme.”
- FAQ expands and exposes the expected answer.
- Empty partner-form submission reports “Please enter a valid work email,” focuses email, and sends no data.
- Semantic landmarks, section names, heading order, field labels, figure caption, and status region are present in the browser accessibility snapshot.
- Browser console errors: none.

## Static verification

- `git diff --check`: passed.
- `node --check script.js`: passed.
- Local page and required assets load successfully.
- Independent final review: passed; no actionable P0, P1, or P2 issue found.
- Independent point-grid review: passed; underline sizing and all three responsive states match.

## Findings

Resolved:

- [P2] Tablet hero badge overflow.
- [P2] Messaging described evidence assembly more than active identity forensics.
- [P2] Diagram labels were too small to scan comfortably.
- [P2] Diagram input label used an undefined color token.
- [P2] Diagram output rules extended well beyond short labels.
- [P2] Problem changed to 2 × 2 at tablet widths while Why now collapsed to one column.

No actionable P0, P1, or P2 issue remains in the tested states.

final result: passed

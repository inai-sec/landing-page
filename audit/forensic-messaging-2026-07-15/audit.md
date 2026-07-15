# InaiSec live-forensics messaging and UI audit — 2026-07-15

## Outcome

The page now positions InaiSec as identity-first forensics performed during the incident, not as a workspace that merely assembles material collected elsewhere afterward.

The conversion story is:

1. Detection establishes a real incident.
2. InaiSec pulls case-scoped evidence on demand.
3. Investigators trace identities, roles, sessions, and systems across cloud, SaaS, and data.
4. The live investigation keeps blast radius, unknowns, owners, and decisions current.
5. Response and disclosure decisions use the same traceable record.

## Copy decisions

- Retained the approved “Picks up where detection stops” hook.
- Changed the category label to “Identity-first incident forensics.”
- Reframed the workflow from notification preparation to confirmed alert → identity trace → known blast radius.
- Replaced the generic fragmented-story problem with the explicit gap between SIEM/XDR/EDR/AI SOC confirmation and active forensic scoping.
- Reframed Outcomes around knowing blast radius while the incident is live.
- Grounded Why now in machine-speed identity movement and regulatory/customer clocks that begin before scope is stable.
- Reframed the design-partner offer around a real or sanitized credential investigation.

All capability claims are bounded to the existing product description: case-scoped evidence collection, identity/role/session/system tracing, blast-radius mapping, and disclosure evidence during an investigation. The page does not claim generic disk, memory, malware, or endpoint DFIR.

## UI fixes

- Fixed the 761–920 px hero-card header overflow by stacking its title and status badge.
- Added shrink constraints so the card title cannot force the badge beyond the card.
- Enlarged convergence labels to 14.08 px on desktop/tablet and 12 px on mobile.
- Replaced the undefined input-label color token with the theme text token.

## Evidence

- `01-before-annotated-hero.jpg` — annotated source state.
- `02-after-hero-tablet.jpg` — corrected 847 px hero.
- `05-after-outcomes-desktop.jpg` — revised outcomes and enlarged labels.
- `11-after-diagram-mobile.jpg` — mobile diagram legibility.
- `13-after-outcomes-light.jpg` — light-theme contrast.
- `14-comparison-overflow.jpg` — hero before/after.
- `15-comparison-problem-messaging.jpg` — Problem before/after.
- `16-comparison-outcomes-messaging.jpg` — Outcomes before/after.

## Verification

- Responsive overflow: 0 px at 1440, 847, and 390 px.
- Hero card overflow: 0 px at all three widths.
- Dark and light themes visually reviewed.
- Mobile navigation, theme switch, FAQ expansion, and form validation passed.
- Browser console reported no errors.
- Static syntax and whitespace checks passed.
- An independent final UI review found no actionable P0, P1, or P2 issue.

No actionable P0, P1, or P2 issue remains.

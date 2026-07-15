# InaiSec point-grid unification audit — 2026-07-15

## Surface and task

- Product: InaiSec landing page.
- Flow: Outcomes illustration → Problem evidence points → Why-now pressure points.
- Goal: shorten the illustration’s output-label rules and make the two four-point sections respond identically.
- Capture tool: Codex in-app browser.
- Primary reproduction viewport: 760 × 1000, dark theme.

## Steps

1. **Outcomes illustration — healthy after fix.** The output rules previously measured 118.8 px for every label. They now size to the live label text: 61.9 px for Timeline, 38.7 px for Scope, and 61.9 px for Unknowns and Decision at 760 px. Dark and light captures show the rule ending with the word.
2. **Problem points — healthy.** At 760 px, Trace, Scope, Decision, and Record render in a balanced 2 × 2 grid.
3. **Why-now points — healthy after fix.** At the same viewport, More surface area, Machine-speed movement, Earlier decisions, and Shorter regulatory clocks now use the same 2 × 2 grid, card reset, spacing, and typography as Problem.
4. **Breakpoint behavior — healthy.** Both grids render 4 columns at 1440 px, 2 columns at 847/760/601 px, and 1 column at 600/390 px. Computed gaps match at every tested width and horizontal overflow is 0 px.

## Evidence

- `01-before-problem-760.jpg` — Problem’s original 2 × 2 behavior.
- `02-before-why-now-760.jpg` — Why now’s original one-column behavior and the longer Decision rule above it.
- `03-after-problem-760.jpg` — Problem after adopting the shared component.
- `04-after-why-now-760.jpg` — Why now after adopting the shared component.
- `05-after-outcomes-underline-760.jpg` — dark-theme output rules sized to their labels.
- `06-after-outcomes-underline-light-1440.jpg` — light-theme output rules sized to their labels.
- `07-comparison-problem.jpg` — Problem before/after in one comparison image.
- `08-comparison-why-now.jpg` — Why now before/after in one comparison image.

## Accessibility and evidence limits

- The change preserves semantic articles, heading order, and live diagram text.
- No interaction behavior changed.
- Screenshots support visual layout and contrast review; they are not a formal WCAG or assistive-technology certification.
- An independent final UI review found no actionable P0, P1, or P2 regression.

No actionable P0, P1, or P2 issue remains in the tested states.

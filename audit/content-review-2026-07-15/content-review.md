# InaiSec landing-page content review — 2026-07-15

## Verdict

The direction is strong. The Problem section should borrow the live site's category boundary, while the FAQ should become shorter, more human, and more focused on securing a first conversation.

## Step 1 — Problem section: needs copy refinement

Evidence: `01-local-problem.jpg` and `03-public-problem.jpg`.

- Use the live title exactly: **“Detection finds the threat. Everything after is still manual.”**
- Recommended body copy:

  > SIEM, XDR, EDR, and AI analyst tools help security teams find and validate threats. But once an incident crosses identity, cloud, SaaS, customer data, and counsel, the business still has to assemble the answer by hand.

  > Evidence remains scattered, ownership is unclear, and decisions about customer impact and disclosure often have to be made before the full picture is complete.

- Why: this names the tools InaiSec complements, then connects directly to the four downstream ideas: Evidence, Impact, Decision, and Record.

## Step 2 — Why-now items: healthy, with one sizing adjustment

- At the annotated `2141 × 1217` viewport, Problem items measure `295 × 176px`; Why-now items measure `295 × 199px`.
- Match the shared `176px` height and padding rather than hard-coding a `288px` width. Keep width fluid through the four-column grid so the section remains responsive.
- Use the same shared component rule for both sections; do not introduce a new card treatment or background.

## Step 3 — FAQ: simplify and humanize

Evidence: `02-local-faq.jpg`.

- Remove **“Do you need our data or production credentials?”** from the accordion.
- Remove **“Is this legal advice?”** from the accordion.
- Recommended intro:

  > Bring one incident your team still thinks about. We’ll use the first conversation to understand what made it hard and whether working together makes sense.

- Preserve the useful security reassurance beside the design-partner form instead:

  > No production access or data upload needed for the first conversation.

- The remaining FAQ questions are more conversion-relevant: product category, stack replacement, ideal customer, and design-partner expectations.

## Accessibility and evidence limits

- Fewer FAQ rows improve scanning and reduce repetitive disclosure controls.
- The screenshots show clear hierarchy and adequate target height, but they do not prove keyboard, screen-reader, or contrast compliance after implementation. Those should be rechecked once the copy and sizing changes are applied.

# InaiSec landing-page audit — 2026-07-15

## Scope

Conversion path for a first design-partner meeting, reviewed across desktop and mobile in dark and light themes. The audit covered narrative coherence, title/description alignment, typography, section rhythm, navigation, the partner form, FAQ behavior, accessibility fundamentals, icon consistency, and image quality.

## Overall health

Healthy. The page now tells one consistent story: detection establishes that something happened; InaiSec helps the people responsible for the response assemble evidence, assess impact, establish ownership, and leave a defensible decision record. No P0, P1, or P2 issue remains in the tested states.

## Journey review

1. **Hero — Healthy.** The approved hero copy and interaction were preserved. Its role is a concise category hook and primary route into the design-partner conversation.
2. **Problem — Healthy after revision.** The headline now names the boundary clearly: detection finds the threat, while the cross-functional work after detection remains manual. The two supporting paragraphs map directly to the four evidence/impact/decision/record points.
3. **Outcomes — Healthy after revision.** The description now explains why a shared incident story makes the next decision easier to defend. Clarity, alignment, ownership, and defensibility share one typographic and icon system.
4. **Why now — Healthy after revision.** The supporting copy now substantiates the regulatory-clock headline by naming early disclosure obligations, incomplete scope, and the accountability AI cannot carry.
5. **Founder — Healthy.** The section provides human credibility at the right point in the journey. The authentic portrait remains the focal proof asset and now uses a purpose-sized derivative.
6. **Design partner signup — Healthy after revision.** Benefits avoid an unsupported speed promise, the CTA reads as a low-friction first step, and the form clearly states that no production access or data upload is needed.
7. **FAQ — Healthy after revision.** The intro now explains what the questions resolve, two low-value objections remain removed, and the four remaining answers clarify category, stack fit, audience, and design-partner expectations.

## Findings and fixes

### Narrative and copy

- **Fixed:** Problem description previously mixed tools, systems, and stakeholders without directly proving the headline. It now separates what detection tools do from the manual business-response work that follows.
- **Fixed:** Outcomes copy used vague phrases such as “around the point where” and “move with more confidence.” It now names the moment an investigation becomes a business decision and the concrete result: decide and act with confidence.
- **Fixed:** Why-now copy did not explicitly support “regulatory clock.” It now connects credential incidents to disclosure obligations that can begin before scope and impact are complete.
- **Fixed:** The partner benefit “Full blast radius in minutes, not days” carried unnecessary proof burden. It is now “Blast-radius clarity without days of manual stitching.”
- **Fixed:** The FAQ description did not describe the FAQ. It now states exactly what a reader will learn before a conversation.
- **Preserved:** The approved hero text remains unchanged.

### Typography and visual hierarchy

- Shared `step-index`, `point-title`, and `point-copy` styles now govern the Problem, Outcomes, and Why-now repeated content.
- Manrope and IBM Plex Mono are locally declared and consistently used for display/body and technical labels.
- Alternating left/right sections retain the approved alignment and full-page rhythm.

### Icons and imagery

- The four outcome icons remain native SVG assets. They are already crisp, consistent, and more appropriate than raster replacements.
- The former theme-specific raster diagram with baked-in labels was replaced by one transparent, theme-neutral 1536 × 1024 generated illustration. Labels remain live HTML so they stay sharp, accessible, and theme-aware.
- The founder portrait remains authentic. A 384 × 384, 42 KB derivative is now used for the 96 px display slot instead of decoding the full source image.

### Interaction and accessibility checks

- Mobile navigation opens, navigates to a section, and closes correctly.
- Theme control switches between dark and light themes.
- FAQ accordions open and expose their answers.
- Empty partner-form submission focuses the email field and announces “Please enter a valid work email.” through the live status region.
- Heading order, landmarks, labels, alternative text, and live status content were verified in the browser accessibility snapshot.
- No horizontal overflow was visible at 390 × 844.
- Dark and light theme contrast was visually reviewed. This was not a formal WCAG contrast measurement or assistive-technology certification.

## Visual evidence

- Problem comparison: `32-comparison-problem.jpg` (before on the left, after on the right)
- Outcomes comparison: `33-comparison-outcomes.jpg` (before on the left, after on the right)
- Why-now comparison: `34-comparison-why-now.jpg` (before on the left, after on the right)
- FAQ comparison: `35-comparison-faq.jpg` (before on the left, after on the right)
- Light-theme outcomes: `21-after-outcomes-light.jpg`
- Mobile generated illustration: `28-after-outcomes-visual-mobile-dark.jpg`
- Mobile open FAQ: `29-after-faq-open-mobile-dark.jpg`
- Founder section: `30-after-founder-dark.jpg`

## Residual P3 opportunities

- Replace the current 1731 × 909 social card with a lighter 1200 × 630 export that uses the current type and new convergence illustration.
- Convert the external logo SVG wordmark text to outlines so logo metrics cannot vary with platform font availability.
- Consider a small post-FAQ CTA if analytics show readers reaching the end without using the persistent header CTA.
- Remove legacy theme-specific convergence-image CSS and obsolete unused visual assets in a dedicated cleanup change.

## Generated illustration record

- **Saved asset:** `/Users/kpf/Developer/workspace/IRS/landing-page/assets/visuals/decision-convergence-v3.png`
- **Mode:** Built-in ImageGen, reference/edit mode; chroma-key background removed to produce a transparent RGBA asset.
- **Final prompt:**

```text
Use case: infographic-diagram
Asset type: InaiSec landing-page outcomes illustration
Primary request: Redesign the referenced convergence diagram as a premium, production-quality, vector-like technology illustration. Preserve the core topology: four independent horizontal evidence streams, exactly five luminous nodes on each stream, all curving smoothly into one central decision node, followed by one short outgoing line. Remove every word and label from the source; the final artwork must contain no text, letters, numbers, icons, UI panels, borders, or legends.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background for later background removal; one uniform color with no gradient, texture, shadow, reflection, or lighting variation.
Style/medium: precise editorial data visualization, refined human-made linework, elegant restrained glow, crisp anti-aliased edges, polished rather than sci-fi.
Composition/framing: landscape 3:2, generous transparent-safe padding, streams occupy the left two-thirds, convergence node slightly right of center, outgoing line toward the right edge.
Color palette: cyan #38d9f2 lines, restrained lavender #9b82ff node cores, small white highlights; do not use #ff00ff anywhere in the subject.
Constraints: preserve exactly four streams and exactly five nodes per stream; no overlaps except at the central convergence; background must be perfectly uniform chroma key; no cast shadow; no watermark; no text.
Avoid: distressed typography, fuzzy edges, heavy bloom, dark backing plate, glass panels, gradients in the background, extra nodes, extra lines, decorative circuitry.
```

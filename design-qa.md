# InaiSec landing page — approved Option 1 fidelity QA

## Comparison target

- Source visual truth: `/var/folders/jj/4q9hmyx126135vzpwqfhqkxc0000gn/T/codex-clipboard-74ababe3-5aab-44d4-a0e2-03be2f775ba2.png`
- Canonical in-repo source: `.codex-design/selected-option-1-motion.webp`
- Implementation URL: `http://127.0.0.1:4173/?theme=dark#top`
- Implementation capture: `/tmp/inaisec-implementation-final.png`
- Viewport and state: 830 × 1896 CSS pixels; dark theme; page top; menu, FAQ, and validation states closed/empty.

## Comparison evidence

- Full-frame source/implementation comparison: `/tmp/inaisec-final-side-by-side.png`
- Focused visual checks: header and hero, outcomes cards, founder/photo, and contact/footer were reviewed from the same combined 830 × 1896 comparison.
- Responsive check: 390 × 844 viewport, with `scrollWidth: 390` and no horizontal overflow.

The implementation capture is exactly 830 × 1896 with no horizontal overflow. Measured final boundaries are: hero 72–599, outcomes 599–1166, founder 1166–1600, contact 1600–1854, and footer 1854–1896 (subpixel browser rounding only).

## Required fidelity surfaces

- Fonts and typography: passed. Self-hosted Manrope and IBM Plex Mono retain the approved display, body, and microcopy hierarchy. The hero, outcomes intro, founder, contact, and footer wraps match the source.
- Spacing and layout rhythm: passed. The header controls, signal map, outcome-column tracks, section boundaries, photo/form bounds, and legal-footer offsets align to the reference frame.
- Colors and visual tokens: passed. The dark section treatments, muted text, cyan controls, violet founder accent, borders, and glow are matched to the supplied dark-state reference.
- Image quality and asset fidelity: passed. The signal map, four outcome icons, signature, and founder portrait use direct crops from the approved source where visual fidelity requires it. The founder frame is a precise 369 × 326 crop; no visible target asset is substituted with CSS or handcrafted art.
- Copy and content: passed. All visible wording, punctuation, capitalization, and approved line breaks match the reference. The contact form remains functional rather than being static chrome.
- Icons, affordances, and accessibility: passed for scope. Semantic landmarks, skip link, labels, native FAQ disclosure, theme control, mobile menu, focus styles, validation status, and reduced-motion handling remain intact.

## Primary interactions tested

- Theme toggle: dark → light → dark.
- FAQ disclosure: opened and closed.
- Contact form: empty submission focused the work-email field, applied `aria-invalid`, and exposed the validation message.
- Main CTA: updated the route to `#contact`.
- Mobile menu: opened and closed at 390 px; no horizontal overflow.
- Asset load: every page image reported `complete` with non-zero natural dimensions.
- Static checks: `node --check script.js` and `git diff --check` passed; local HTML and approved assets returned HTTP 200.

## Comparison history

### Iteration 1 — blocked

- [P1] The prior rollback restored the wrong landing-page concept rather than the selected Option 1 composition.
- Fix: restored the approved composition, copy, controls, signal artwork, outcome structure, founder block, contact form, and footer.

### Iteration 2 — blocked

- [P1] Founder portrait framing did not match the approval image.
- [P2] Dark-section token drift, outcomes intro wrapping, and legal-footer alignment remained visible.
- Fix: used a direct approved-frame founder crop; aligned dark tokens, exact intro line breaks, and footer-link offset.

### Final iteration — passed

- Full-frame and focused source/implementation comparisons show no actionable P0, P1, or P2 differences at the approved 830 × 1896 dark frame.
- Residual differences are limited to browser-versus-WebP text antialiasing/compression and are P3-only.

## Follow-up polish

- [P3] The source is a raster reference, so text anti-aliasing can differ by a fraction of a pixel across rendering engines.
- [P3] The form intentionally remains client-side for this prototype; no production email delivery was exercised.

final result: passed

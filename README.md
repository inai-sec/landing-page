# InaiSec Landing Page

`landing-page` is the current public brand and design-partner site for InaiSec.
The presentation layer is static HTML, CSS, and JavaScript; the contact form
uses a Vercel serverless function to send inquiries through Resend.

## Quick start

From the repository root:

```bash
pnpm --dir landing-page install
pnpm --dir landing-page start
```

Open `http://localhost:4173`.

The static server is enough for layout, interaction, responsive, and theme
review. It does not emulate the `/api/contact` serverless endpoint. Use a Vercel
development environment or a preview deployment when testing form delivery.

## Source map

| File | Purpose |
| --- | --- |
| `index.html` | Content, document structure, metadata, and form markup. |
| `styles.css` | Marketing runtime tokens, themes, layout, components, and motion. |
| `script.js` | Theme persistence, accessible navigation, active-section and convergence state, and form submission. |
| `api/contact.js` | Validates inquiries and forwards them to Resend. |
| `vercel.json` | Vercel routing and response-header configuration. |
| `assets/` | Logos, local fonts, founder imagery, icons, and social-preview assets. |
| `assets/og/og-render.html` | Editable source for the 1200×630 social card. |
| `assets/og/og-card-v5.png` | Generated Open Graph and X/Twitter preview image. |

## Design direction

The canonical visual specification is the repository-root
[DESIGN.md](../DESIGN.md). `styles.css` is the runtime implementation source of
truth for this site.

The landing page is the more spacious brand register of the same system used
by `frontendv2`: warm charcoal, cool white, teal-cyan, Manrope, IBM Plex Mono,
specific product evidence, and restrained motion. The section order, narrative
spine, layout, and sticky convergence choreography follow the authored
`dev-07-18` baseline. User-approved annotation rounds refine supporting copy
and labels without changing that structure. The current treatment changes the decorative paint on the case
workflow, form, FAQ, and story-state chip, replacing their card chrome with
flat, ruled surfaces. It does not add a page-level background transition or
recolor the Outcomes section.

On viewports at least 1081px wide and 640px tall, one sticky foreground
investigation artifact spans the Problem and Outcomes sections and reversibly
resolves as the reader crosses between them. Its original reveal and depth
curves, input layers, and output layers are preserved. Section copy remains in
normal document flow: panels expand to fit their content and are never cropped
into a fixed-height scene.

The sticky enhancement is disabled for reduced motion, increased contrast,
forced colors, enlarged root text, and browsers without the required sticky or
mask support. Those modes, compact or short viewports, and no-JavaScript
rendering use the branch's inline fallback: the fragmented figure is
decorative and `aria-hidden`, while the complete figure carries the semantic
`figcaption`. Enlarged text reflows to a static single-column story, and the
mobile navigation remains usable when JavaScript is unavailable.

The hero keeps the branch's desktop and mobile title spans inside one `h1`;
CSS displays exactly one span at a time. The heading uses a solid text color
and remains visible independently of the hero artifact and animation state.
Workflow steps, convergence labels, and form controls reuse the same title/body
tokens as the authored `Evidence gap` entries, including a stacked label legend
when the inline convergence figure becomes too narrow for overlay text.

Narrative paragraphs, FAQ answers, and design-partner benefits share the same
responsive prose token: 16–18px at the default root size, with 1.6 line height.
Compact card descriptions and supporting/footer text use 16px with the same
line-height ratio. Sticky scenes and short viewports must not independently
shrink section prose. The Incident Room bridge is a separate paragraph with
only “InaiSec” bolded.

### Content contract

The section order and narrative spine intentionally follow the authored
`dev-07-18` baseline at commit `e36088679e24ed7e871a77ad9abc58aeb991022d`,
with current wording reflecting approved browser annotations:

1. Hero and active investigation
2. Problem and four response gaps
3. Outcomes and the complete forensic picture
4. Why now and four market pressures
5. Founder
6. Design partner program
7. FAQ and footer

The September 8, 2026 copy pass uses “Trace the incident. Understand the
impact.” as the hero. It names security incidents and potentially affected
customers, centers the Problem section on reconstructing scattered evidence,
and embeds response questions in the four existing Outcomes points. The
Why-now headline is “Decisions can’t wait for the final report.” The footer
describes evidence, customer impact, open questions, and decisions without a
disclosure-speed promise. Primary CTA wording, section order, and sticky
choreography remain as authored. The phone headline size accommodates the
approved wording without clipping.

The follow-up credibility review aligns `llms.txt` with the page's qualified
claims about evidence, potential customer impact, uncertainty, and human
decisions. It removes exhaustive coverage, speed, and disclosure-readiness
promises from that summary. The social card uses `og-card-v5.png`, the approved
hero paragraph's opening sentence, and the landing page's current workflow copy
and ownership labels. The sitemap records the September 8, 2026 page modification date.

Accessibility behavior, the form contract, metadata, and analytics loading
remain the implementation layer around that presentation. During visual-only
work, do not rewrite, reorder, or reflow the visible narrative or alter the
sticky choreography. Limit surface changes to the documented decorative box
paint unless a separate structural or messaging change is explicitly approved.

Do not add decorative grids, page-wide gradients, purple washes, glow effects,
glass panels, or card shells around every idea. Color must explain action or
state; borders and spacing provide most of the hierarchy.

Keep the page focused on the identity-first incident-forensics story: start at
confirmation, pull case-scoped evidence when needed, trace identity to impact,
keep unknowns current, preserve accountable human decisions, and reach a
defensible record.

The safe workflow for UI UX Pro Max and Impeccable is documented in
[AI_DESIGN_WORKFLOW.md](../docs/design/AI_DESIGN_WORKFLOW.md). The current
redesign decisions and evidence are recorded in [design-qa.md](design-qa.md).

## Contact form

`api/contact.js` accepts `POST` requests, validates email syntax and message
length, applies a honeypot check, and sends plain-text email through Resend.
HTML field limits, client validation, and the handler cap email at 254
characters and the message at 4,000; messages require at least 10 characters.
Configure these variables in the Vercel project:

- `RESEND_API_KEY`: Resend API key.
- `CONTACT_FROM`: verified sender, for example `InaiSec <hello@inaisec.ai>`.
- `CONTACT_TO`: destination inbox.

The form must retain visible labels, inline error text, a real pending state,
and an unambiguous success state. A send failure reveals a clickable
`hello@inaisec.ai` email alternative immediately below the status message. The
footer email link remains available. Both are manual alternatives; the form
does not automatically send through the visitor's email app.

### Contact rate limit: deferred deployment step

The handler and `vercel.json` do not activate a rate limit. During deployment,
configure this rule in the Vercel project's Firewall:

| Setting | Value |
| --- | --- |
| Rule name | `contact-form-rate-limit` |
| Conditions, both required | Request Path equals `/api/contact`; Request Method equals `POST` |
| Action and strategy | Rate Limit; Fixed Window |
| Window and limit | 600 seconds; 5 requests |
| Counting key | IP Address |
| Over-limit action | Default (429) |

Inspect Log mode first to assess shared-network traffic; it does not block.
To enforce, select Default (429), Save Rule, Review Changes, and Publish.
Fixed Window is available on all plans; 600 seconds fits Hobby/Pro limits.
Counters are regional, so this is not a global email-quota guarantee.
[Vercel rate-limit documentation](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

After activation, verify from one network using an invalid email and short
message: requests should receive validation errors before the threshold and
429 above it, without sending mail. Retry after the window resets and confirm
the UI offers waiting or the manual email alternative. Do not assume the WAF
returns a `Retry-After` header. This rule has not been activated or tested here.

## Deployment

Vercel is the supported first deployment target because it serves the static
site and `api/contact.js` together. Set the project root to `landing-page`; no
build command or output-directory override is required.

Static hosting such as S3 and CloudFront can serve the presentation layer, but
the form then needs a separately hosted endpoint and a deliberate update to its
request URL and security policy.

## Verification

Before publishing, review at 375, 768, 1024, and 1440 CSS pixels and verify:

- light and dark themes, including first-load behavior;
- keyboard navigation, skip link, focus visibility, and mobile navigation;
- reduced-motion behavior, 200% text zoom/reflow, and content visibility with
  JavaScript disabled;
- long headings, form errors, pending, success, and delivery failure states;
- metadata, canonical URL, production links, and a 1200×630 social preview;
- consistency between visible claims and `llms.txt`, founder attribution,
  structured-data identity, and the sitemap modification date;
- the exported social card at feed size, including its headline and short lede;
- form delivery in a Vercel preview with all three Resend variables configured.

The installed design tools also provide repeatable source checks from the
repository root:

```bash
# Impeccable ships as a plugin (installed via /plugin). The vendored copy at
# `.agents/skills/impeccable/` was removed 2026-08-04 (it had diverged from the
# plugin). IMPECCABLE_SCRIPTS resolves the installed plugin's script directory.
IMPECCABLE_SCRIPTS="$(dirname "$(find ~/.claude/plugins/cache/impeccable -name detect.mjs -path '*skills*' | sort | tail -1)")"
node "$IMPECCABLE_SCRIPTS"/context.mjs --target landing-page
node "$IMPECCABLE_SCRIPTS"/detect.mjs --json \
  landing-page/index.html landing-page/styles.css landing-page/script.js
node --check landing-page/script.js
```

The detector is a review aid, not an authority. Classify its findings against
`DESIGN.md`, then verify accepted changes in the rendered page with Axe and
keyboard testing.

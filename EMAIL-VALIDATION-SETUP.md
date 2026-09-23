# Work-email filtering — owner setup

**Implemented locally:** `/api/contact` checks the submitted domain with DISIFY before forwarding through Resend. Known free/personal and disposable providers are rejected. The existing form displays work-email feedback and a retry/direct-email fallback. **Still yours to do:** create the account, configure credentials, push and deploy, then verify Preview and Production. All 47 mocked handler tests and independent Astra review pass. The required Fable gate remains incomplete because the local Claude CLI needs login. No account, live API check, or deployment was performed by this task.

## 1. Get a DISIFY key

[Create a DISIFY account](https://disify.com/account/register), choose **Free**, and create/copy an API key in the [account dashboard](https://disify.com/account). Free includes the needed core checks: 30,000 validations/month, 10,000/day and 60 requests/minute; the first 24 hours allow 1,000/day and 10/minute. Each domain check costs one validation unit. No paid plan is needed for this integration. Existing purchased overflow credits can be consumed when limits are exceeded; otherwise quota errors block the submission for retry. See [authentication](https://docs.disify.com/guide/authentication.html) and [limits](https://docs.disify.com/guide/rate-limits.html).

## 2. Set Vercel environment variables

Open the **landing-page project → Settings → Environment Variables**. Add `DISIFY_API_KEY` and retain the three existing Resend settings. Values below are placeholders; paste real keys only into Vercel, never into this guide, HTML, JavaScript, source control, or logs.

| Exact name | Value/type |
| --- | --- |
| `DISIFY_API_KEY` | Secret string: `<your DISIFY account API key>` |
| `RESEND_API_KEY` | Secret string: `<your Resend API key>` |
| `CONTACT_FROM` | Config string: `<verified sender name and email>` |
| `CONTACT_TO` | Config string: `<your notification inbox email>` |

Select **Preview** and **Production** deliberately. Use a test inbox for Preview's `CONTACT_TO`; a branch-specific Preview override can isolate testing. For local Vercel testing, also configure **Development**. Keep names exactly as above, with no public/browser prefix. DISIFY receives its key in `X-Api-Key` from the function only. [Vercel environment guide](https://vercel.com/docs/environment-variables).

## 3. Test, then deploy

From `landing-page/`, run `npm test` (Node 22+). These handler tests use synthetic fixtures and mocked vendors; they need no credentials and send no email. For a local end-to-end check, link the existing Vercel project and run `vercel dev` with Development variables; `npm start` serves only the static page and cannot run the API.

After your code push creates a Preview, test the form there. Environment changes apply only to new deployments: use **Deployments → selected deployment → Redeploy** after saving variables. Verify Preview, then push/deploy to your configured production branch and repeat a controlled smoke test. Use synthetic addresses for rejected cases and an inbox you own for the company success case, never customer leads.

| Check | Expected result |
| --- | --- |
| `synthetic-check@gmail.com` | Work-email rejection; no Resend notification. |
| `synthetic-check@disposable-inbox.test` | Documented illustrative disposable case; rejection, no notification. Vendor classification is checked live, not guaranteed by a test facility. |
| Your own company address, including `+tag` | Forwards if DISIFY returns valid format, usable DNS, `free: false`, `disposable: false`; Google Workspace/Microsoft 365 hosting alone is not rejected. |
| Outage, quota/HTTP error, malformed or incomplete result, indeterminate DNS | HTTP 503; form offers retry/direct email; nothing reaches Resend. Tests simulate these. For a Preview-only smoke test, temporarily unset its DISIFY key, redeploy, verify, then restore and redeploy. |

## Policy and limits

`api/contact.js` rejects the exact `gmail.com` domain locally before calling DISIFY (case-insensitive, including plus addresses). Company domains hosted by Google still go through normal checks. It holds the four-second `DISIFY_TIMEOUT_MS`, feedback text, and free/disposable rejection rule. No allowlist or provider framework is added. A definite missing-mail-DNS result gets a check-your-domain error; missing/unknown DNS evidence gets retry. Only the lowercased full domain goes to DISIFY, preserving subdomains and keeping the mailbox name/message private from it ([domain API](https://docs.disify.com/api/domain.html)). A passing result means eligible under these checks, **not** a proven business, mailbox ownership, employment, or guaranteed delivery. Domain reputation can miss junk or misclassify legitimate users; the existing direct-email fallback remains available. This does not replace the separately documented Vercel firewall rate limit in README. Production firewall settings and DISIFY's independent uptime/security reputation have not been verified.

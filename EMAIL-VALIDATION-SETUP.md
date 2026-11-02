# Work-email filtering — owner setup

**Implemented locally:** `/api/contact` checks the submitted domain with DISIFY before forwarding through Resend. Free/personal providers are forwarded with a `[personal email]` subject prefix; disposable providers are rejected. Unavailable or inconclusive checks forward with an `[email not verified]` subject prefix. The existing form displays work-email feedback and a retry/direct-email fallback. **Still yours to do:** create the account, configure credentials, push and deploy, then verify Preview and Production. The mocked handler tests cover these forwarding and rejection paths. The required Fable gate remains incomplete because the local Claude CLI needs login. No account, live API check, or deployment was performed by this task.

## 1. Get a DISIFY key

[Create a DISIFY account](https://disify.com/account/register), choose **Free**, and create/copy an API key in the [account dashboard](https://disify.com/account). Free includes the needed core checks: 30,000 validations/month, 10,000/day and 60 requests/minute; the first 24 hours allow 1,000/day and 10/minute. Each domain check costs one validation unit. No paid plan is needed for this integration. Existing purchased overflow credits can be consumed when limits are exceeded; otherwise quota errors cause the lead to be forwarded as `[email not verified]`. See [authentication](https://docs.disify.com/guide/authentication.html) and [limits](https://docs.disify.com/guide/rate-limits.html).

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
| `synthetic-check@gmail.com` | HTTP 200 after successful Resend delivery; subject prefixed `[personal email]` when DISIFY classifies it as a free provider. |
| Bad email format or definite no-mail-DNS domain | HTTP 400; no Resend notification. |
| `synthetic-check@disposable-inbox.test` | Documented illustrative disposable case; HTTP 400, no notification. Vendor classification is checked live, not guaranteed by a test facility. |
| Your own company address, including `+tag` | Forwards if DISIFY returns valid format, usable DNS, `free: false`, `disposable: false`; Google Workspace/Microsoft 365 hosting alone is not rejected. |
| Outage, quota/HTTP error, malformed or incomplete result, indeterminate DNS | Forwards through Resend with subject prefixed `[email not verified]`; HTTP 200 after successful delivery. Tests simulate these. For a Preview-only smoke test, temporarily unset its DISIFY key, redeploy, verify, then restore and redeploy. |

## Policy and limits

`api/contact.js` forwards gmail.com and other free/personal-provider domains, marking the subject `[personal email]` and the first body line `Personal email provider (<domain>).` with the lowercased checked domain. A missing DISIFY key, checker outage, timeout, or inconclusive result also forwards the lead, marking the subject `[email not verified]` and the first body line `Email not verified: the domain check was unavailable.` Successful Resend delivery returns HTTP 200 with `{ok: true}`; Resend failures retain their existing error responses. Bad-format, disposable, and definite no-mail-DNS domains are still refused with HTTP 400. The four-second `DISIFY_TIMEOUT_MS` is unchanged. No allowlist or provider framework is added. Only the lowercased full domain goes to DISIFY, preserving subdomains and keeping the mailbox name/message private from it ([domain API](https://docs.disify.com/api/domain.html)). A passing result means eligible under these checks, **not** a proven business, mailbox ownership, employment, or guaranteed delivery. Domain reputation can miss junk or misclassify legitimate users; the existing direct-email fallback remains available. This does not replace the separately documented Vercel firewall rate limit in README. Production firewall settings and DISIFY's independent uptime/security reputation have not been verified.

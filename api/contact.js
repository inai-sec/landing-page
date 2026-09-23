// Vercel serverless function that forwards contact-form submissions via Resend.
// Required environment variables (set in the Vercel project settings):
//   RESEND_API_KEY  - API key from https://resend.com/api-keys
//   CONTACT_FROM    - verified sender, e.g. "InaiSec <hello@inaisec.ai>"
//   CONTACT_TO      - destination inbox, e.g. "hello@inaisec.ai"
//   DISIFY_API_KEY  - server-only key from https://disify.com/account

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISIFY_TIMEOUT_MS = 4000;
const CHECK_UNAVAILABLE = "We couldn’t check your email right now. Please try again shortly or email us directly.";

// Domain-only request: never send the mailbox name or inquiry to DISIFY.
async function checkWorkDomain(domain, apiKey) {
  const response = await fetch("https://disify.com/api/domain", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "X-Api-Key": apiKey,
    },
    body: new URLSearchParams({ domain }),
    signal: AbortSignal.timeout(DISIFY_TIMEOUT_MS),
    redirect: "error",
  });
  if (response.status !== 200) throw new Error("Domain check unavailable");
  const result = await response.json();
  if (!result || typeof result.format !== "boolean") throw new Error("Incomplete domain check");
  if (!result.format) return "Please enter a valid work email domain.";
  if (["free", "disposable", "dns"].some(field => typeof result[field] !== "boolean")) {
    throw new Error("Incomplete domain check");
  }
  const signals = result.signals === undefined ? [] : result.signals;
  if (!Array.isArray(signals) || !signals.every(signal => typeof signal === "string")) {
    throw new Error("Incomplete domain check");
  }
  if (result.free || result.disposable) {
    return "Please use your company work email. Personal and disposable email providers aren’t accepted.";
  }
  if (signals.includes("dns_indeterminate")) throw new Error("Domain check inconclusive");
  if (!result.dns) return "We couldn’t find mail service for that domain. Please check your work email.";
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid body" });
  }

  // Honeypot: legitimate browsers leave this empty; bots tend to fill every field.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    // Pretend success so we don't tip off the bot.
    return res.status(200).json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: "Please enter a valid work email." });
  }
  if (message.length < 10 || message.length > 4000) {
    return res.status(400).json({ error: "Message must be between 10 and 4000 characters." });
  }

  const domain = email.split("@")[1].toLowerCase();
  if (domain === "gmail.com") {
    return res.status(400).json({ error: "Please use your company work email. Personal Gmail addresses aren’t accepted." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !from || !to) {
    console.error("Missing RESEND_API_KEY / CONTACT_FROM / CONTACT_TO env vars.");
    return res.status(500).json({ error: "Contact endpoint is not configured." });
  }

  const disifyKey = process.env.DISIFY_API_KEY?.trim();
  if (!disifyKey) return res.status(503).json({ error: CHECK_UNAVAILABLE });
  try {
    const rejection = await checkWorkDomain(domain, disifyKey);
    if (rejection) return res.status(400).json({ error: rejection });
  } catch {
    // Never log vendor payloads, request details, or credentials.
    console.error("DISIFY domain check unavailable or inconclusive.");
    return res.status(503).json({ error: CHECK_UNAVAILABLE });
  }

  const subject = "InaiSec design partner program";
  const text = [
    "New design partner inquiry from inaisec.ai",
    "",
    `Work email: ${email}`,
    "",
    "Context:",
    message,
  ].join("\n");

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        reply_to: email,
        text,
      }),
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error("Resend error", resendResponse.status, detail);
      return res.status(502).json({ error: "Could not deliver your message right now." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact handler error", err);
    return res.status(500).json({ error: "Unexpected error sending your message." });
  }
}

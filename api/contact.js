// Vercel serverless function that forwards contact-form submissions via Resend.
// Required environment variables (set in the Vercel project settings):
//   RESEND_API_KEY  - API key from https://resend.com/api-keys
//   CONTACT_FROM    - verified sender, e.g. "InaiSec <hello@inaisec.ai>"
//   CONTACT_TO      - destination inbox, e.g. "hello@inaisec.ai"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !from || !to) {
    console.error("Missing RESEND_API_KEY / CONTACT_FROM / CONTACT_TO env vars.");
    return res.status(500).json({ error: "Contact endpoint is not configured." });
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

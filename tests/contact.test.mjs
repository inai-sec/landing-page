import assert from 'node:assert/strict';
import { test } from 'node:test';
import handler from '../api/contact.js';

// Core shapes from https://docs.disify.com/api/domain.html and response-fields.html.
const core = { format: true, domain: 'acme.test', disposable: false, dns: true,
  free: false, whitelist: false, confidence: 0, role: false };
const inquiry = { email: 'Founder+partner@acme.test', message: 'Synthetic test inquiry only.', website: '' };

async function submit(t, { body = inquiry, verdict = core, status = 200,
  failure, missingKey = false, absentKey = false, method = 'POST', resendStatus = 200 } = {}) {
  for (const [key, value] of Object.entries({ RESEND_API_KEY: 'resend-test-key',
    CONTACT_FROM: 'sender@acme.test', CONTACT_TO: 'owner@acme.test', DISIFY_API_KEY: missingKey ? '' : 'disify-test-key' })) {
    const old = process.env[key];
    if (key === 'DISIFY_API_KEY' && absentKey) delete process.env[key];
    else process.env[key] = value;
    t.after(() => { if (old === undefined) delete process.env[key]; else process.env[key] = old; });
  }
  const calls = [];
  const errors = t.mock.method(console, 'error', () => {});
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    if (url === 'https://api.resend.com/emails') return new Response('{}', { status: resendStatus });
    assert.equal(url, 'https://disify.com/api/domain');
    if (failure) return failure(options);
    return new Response(JSON.stringify(verdict), { status });
  });
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
  await handler({ method, body }, res);
  return { res, calls, errors, sends: calls.filter(c => c.url === 'https://api.resend.com/emails') };
}

function assertForwarded({ res, sends }, prefix = '', firstLine = 'New design partner inquiry from inaisec.ai') {
  assert.equal(res.code, 200);
  assert.deepEqual(res.data, { ok: true });
  assert.equal(sends.length, 1);
  const sent = JSON.parse(sends[0].options.body);
  assert.equal(sent.subject, prefix + 'InaiSec design partner program');
  assert.equal(sent.text.split('\n')[0], firstLine);
}
function assertUnverified(result) {
  assertForwarded(result, '[email not verified] ', 'Email not verified: the domain check was unavailable.');
  assert.deepEqual(result.errors.mock.calls.map(call => call.arguments),
    [['DISIFY domain check unavailable or inconclusive.']]);
}
function assertPersonal(result, domain) {
  assertForwarded(result, '[personal email] ', `Personal email provider (${domain}).`);
  assert.equal(result.calls[0].options.body.toString(), 'domain=' + domain);
}

for (const [name, verdict, code] of [
  ['personal provider', { ...core, domain: 'outlook.com', free: true, whitelist: true }, 200],
  ['disposable provider', { ...core, disposable: true, dns: false, signals: ['keyword_match', 'no_mx_records'] }, 400],
  ['invalid domain', { format: false }, 400],
  ['no mail DNS', { ...core, dns: false, signals: ['no_mx_records'] }, 400],
  ['indeterminate DNS', { ...core, dns: false, signals: ['dns_indeterminate'] }, 200],
  ['indeterminate signal with DNS true', { ...core, signals: ['dns_indeterminate'] }, 200],
  ['missing free', { ...core, free: undefined }, 200],
  ['missing disposable', { ...core, disposable: undefined }, 200],
  ['missing DNS', { ...core, dns: undefined }, 200],
  ['missing format', { ...core, format: undefined }, 200],
  ['string boolean', { ...core, free: 'false' }, 200],
  ['unknown DNS', { ...core, dns: null }, 200],
  ['malformed signals', { ...core, signals: 'dns_indeterminate' }, 200],
  ['null signals', { ...core, signals: null }, 200],
  ['non-string signal', { ...core, signals: [null] }, 200],
  ['null response', null, 200],
]) test(name + (code === 400 ? ' never reaches Resend' : ' forwards marked'), async t => {
  const body = name === 'personal provider' ? { ...inquiry, email: 'synthetic@outlook.com' } : inquiry;
  const result = await submit(t, { body, verdict });
  if (code === 400) {
    assert.equal(result.res.code, 400);
    assert.equal(result.sends.length, 0);
    assert.equal(typeof result.res.data.error, 'string');
  } else if (name === 'personal provider') {
    assertPersonal(result, 'outlook.com');
  } else {
    assertUnverified(result);
  }
});

for (const mx of ['aspmx.l.google.com', 'acme-test.mail.protection.outlook.com']) {
  test('company mail hosted at ' + mx + ' forwards', async t => {
    const { res, calls, sends } = await submit(t, { verdict: { ...core, mx_info: [mx] },
      body: { ...inquiry, email: '  Founder+partner@Acme.test  ' } });
    assert.equal(res.code, 200);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.headers['X-Api-Key'], 'disify-test-key');
    assert.equal(calls[0].options.body.toString(), 'domain=acme.test');
    assert.equal(calls[0].options.redirect, 'error');
    assert.ok(calls[0].options.signal instanceof AbortSignal);
    assert.equal(sends.length, 1);
    const sent = JSON.parse(sends[0].options.body);
    assertForwarded({ res, sends });
    assert.equal(sent.reply_to, 'Founder+partner@Acme.test');
    assert.ok(sent.text.includes(inquiry.message));
  });
}
test('full multi-label domain is retained', async t => {
  const { res, calls, sends } = await submit(t, { body: { ...inquiry, email: 'a+b@team.acme.co.uk' },
    verdict: { ...core, domain: 'team.acme.co.uk' } });
  assert.equal(res.code, 200);
  assert.equal(calls[0].options.body.toString(), 'domain=team.acme.co.uk');
  assertForwarded({ res, sends });
});
for (const status of [401, 403, 429, 500, 502, 302]) test('DISIFY HTTP ' + status + ' forwards unverified', async t => {
  assertUnverified(await submit(t, { status }));
});
for (const [name, failure] of [
  ['network error', async () => { throw new TypeError('Network failure'); }],
  ['malformed JSON', async () => new Response('<html>not JSON</html>')],
  ['timeout before headers', options => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
  })],
  ['timeout while reading body', async options => ({ status: 200, ok: true, json: () => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
  }) })],
]) test(name + ' forwards unverified', async t => {
  // Keep the event loop alive: AbortSignal.timeout intentionally uses an unref timer.
  const keepAlive = setInterval(() => {}, 1000);
  try {
    const started = Date.now();
    assertUnverified(await submit(t, { failure }));
    assert.ok(Date.now() - started < 6000);
  } finally { clearInterval(keepAlive); }
});
test('empty DISIFY key forwards unverified without anonymous fallback', async t => {
  const result = await submit(t, { missingKey: true });
  assertUnverified(result);
  assert.equal(result.calls.length, 1);
});
test('honeypot pretends success without either vendor', async t => {
  const { res, calls } = await submit(t, { body: { website: 'spam' }, missingKey: true });
  assert.equal(res.code, 200);
  assert.deepEqual(res.data, { ok: true });
  assert.equal(calls.length, 0);
});
for (const body of [null, 'bad json', {}, { ...inquiry, email: null },
  { ...inquiry, email: 'two@@acme.test' }, { ...inquiry, email: 'x'.repeat(255) + '@acme.test' },
  { ...inquiry, message: 'short' }, { ...inquiry, message: 'x'.repeat(4001) }]) {
  test('bad request makes no vendor calls: ' + JSON.stringify(body)?.slice(0, 60), async t => {
    const { res, calls } = await submit(t, { body });
    assert.equal(res.code, 400);
    assert.equal(calls.length, 0);
  });
}
test('non-POST makes no vendor calls', async t => {
  const { res, calls } = await submit(t, { method: 'GET' });
  assert.equal(res.code, 405);
  assert.equal(res.headers.Allow, 'POST');
  assert.equal(calls.length, 0);
});
test('Resend failure is still a failure after eligibility check', async t => {
  const { res, sends } = await submit(t, { resendStatus: 500 });
  assert.equal(res.code, 502);
  assert.equal(sends.length, 1);
});

for (const email of ['synthetic@gmail.com', '  Synthetic+partner@GMAIL.COM  ']) {
  test('Gmail forwards as personal email: ' + email, async t => {
    assertPersonal(await submit(t, { body: { ...inquiry, email },
      verdict: { ...core, domain: 'gmail.com', free: true } }), 'gmail.com');
  });
}
test('Gmail uses the DISIFY personal-provider verdict', async t => {
  assertPersonal(await submit(t, { body: { ...inquiry, email: 'synthetic@gmail.com' },
    verdict: { ...core, domain: 'gmail.com', free: true } }), 'gmail.com');
});
for (const domain of ['gmail.com.acme.test', 'notgmail.com', 'mail.gmail.com']) {
  test('Gmail check uses exact domain equality: ' + domain, async t => {
    const { res, calls } = await submit(t, { body: { ...inquiry, email: 'synthetic@' + domain },
      verdict: { ...core, domain } });
    assert.equal(res.code, 200);
    assert.equal(calls[0].options.body.toString(), 'domain=' + domain);
    assert.equal(calls.length, 2);
  });
}

test('absent DISIFY_API_KEY forwards unverified', async t => {
  const result = await submit(t, { absentKey: true });
  assertUnverified(result);
  assert.equal(result.calls.length, 1);
});
test('DISIFY timeout forwards unverified within six seconds', async t => {
  const keepAlive = setInterval(() => {}, 1000);
  try {
    const started = Date.now();
    assertUnverified(await submit(t, { failure: options => new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
    }) }));
    assert.ok(Date.now() - started < 6000);
  } finally { clearInterval(keepAlive); }
});
test('non-disposable outlook.com forwards as personal email', async t => {
  assertPersonal(await submit(t, { body: { ...inquiry, email: 'synthetic@outlook.com' },
    verdict: { ...core, domain: 'outlook.com', free: true, disposable: false } }), 'outlook.com');
});
test('mixed-case padded Gmail forwards with normalized personal marking', async t => {
  const result = await submit(t, { body: { ...inquiry, email: '  Synthetic+partner@GMAIL.COM  ' },
    verdict: { ...core, domain: 'gmail.com', free: true } });
  assertPersonal(result, 'gmail.com');
  assert.equal(JSON.parse(result.sends[0].options.body).reply_to, 'Synthetic+partner@GMAIL.COM');
});

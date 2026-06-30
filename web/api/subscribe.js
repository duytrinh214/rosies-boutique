import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Generate a unique ROSIE-XXXXX code
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return 'ROSIE-' + out;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Check required env vars
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
    return res.status(500).json({ error: 'Server configuration error — please contact support.' });
  }
  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY env var');
    return res.status(500).json({ error: 'Email service not configured — please contact support.' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { name, email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required.' });
  }

  const emailLower = email.trim().toLowerCase();

  try {
    // Check if this email already has a code
    const { data: existing } = await supabase
      .from('discount_codes')
      .select('code, used')
      .eq('email', emailLower)
      .single();

    if (existing) {
      // Email đã đăng ký rồi — chặn, KHÔNG gửi thêm code nào nữa
      const msg = existing.used
        ? 'This email has already used its discount.'
        : "You're already subscribed — your $10 code is already in your inbox. 🌸";
      return res.status(409).json({ error: msg });
    }

    // Generate a unique code
    let code;
    let attempts = 0;
    while (!code && attempts < 10) {
      const candidate = generateCode();
      const { data } = await supabase
        .from('discount_codes')
        .select('code')
        .eq('code', candidate)
        .single();
      if (!data) code = candidate;
      attempts++;
    }
    if (!code) throw new Error('Could not generate unique code, please try again.');

    // Save to Supabase
    const { error: insertErr } = await supabase.from('discount_codes').insert({
      code,
      email: emailLower,
      name: name?.trim() || null,
      percent: 10,
      used: false,
    });
    if (insertErr) throw insertErr;

    // Also save to subscribers table (existing)
    await supabase.from('subscribers').insert({
      name: name?.trim() || null,
      email: emailLower,
      source: 'discount_popup',
    });

    // Send discount email via Resend
    await sendDiscountEmail({ name, email: emailLower, code, resend });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: err.message || 'Something went wrong.' });
  }
}

async function sendDiscountEmail({ name, email, code, resend }) {
  const firstName = name?.trim().split(' ')[0] || 'there';
  await resend.emails.send({
    from: "Rosie's Boutique <orders@rosiesboutique.com.au>",
    to: email,
    subject: `Your $10 welcome gift is here 🌸`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf3ec;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://www.rosiesboutique.com.au/logo.png" alt="Rosie's Boutique" style="height:60px;" />
    </div>
    <div style="background:#fff;border-radius:20px;padding:40px 36px;text-align:center;">
      <p style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7c6e;margin:0 0 12px;">Welcome Gift</p>
      <h1 style="font-size:36px;color:#2b1d18;margin:0 0 8px;font-weight:500;">Hi ${firstName}! 🌸</h1>
      <p style="font-size:16px;color:#6b5248;line-height:1.6;margin:16px 0 28px;">
        Thank you for joining the Rosie's Boutique family.<br/>
        Here's your exclusive $10 off your first order:
      </p>
      <div style="background:#faf3ec;border:2px dashed #e8c4b8;border-radius:14px;padding:20px 24px;margin:0 0 28px;">
        <p style="font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#9b7c6e;margin:0 0 8px;">Your discount code</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:0.06em;color:#2b1d18;margin:0;font-family:monospace;">${code}</p>
        <p style="font-size:13px;color:#9b7c6e;margin:10px 0 0;">Valid for one purchase · $10 off</p>
      </div>
      <a href="https://www.rosiesboutique.com.au" style="display:inline-block;background:#2b1d18;color:#fff;text-decoration:none;padding:16px 36px;border-radius:40px;font-size:15px;letter-spacing:0.04em;">
        Shop Now →
      </a>
      <p style="font-size:13px;color:#b09a90;margin:28px 0 0;line-height:1.5;">
        Enter code at checkout. Single use only — code expires once used.<br/>
        Not valid with other offers.
      </p>
    </div>
    <p style="text-align:center;font-size:12px;color:#b09a90;margin-top:24px;">
      Rosie's Boutique · 87 President Rd, Albanvale VIC 3021<br/>
      Questions? <a href="mailto:enquiry.rosiesboutique@outlook.com" style="color:#9b7c6e;">enquiry.rosiesboutique@outlook.com</a><br/>
      <a href="https://www.rosiesboutique.com.au/api/unsubscribe?email=${encodeURIComponent(email)}" style="color:#b09a90;">Unsubscribe from future offers</a>
    </p>
  </div>
</body>
</html>`,
  });
}

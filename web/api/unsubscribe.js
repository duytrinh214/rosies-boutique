import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method not allowed');

  const email = (req.query.email || '').toString().trim().toLowerCase();
  if (!email) return res.status(400).send(htmlPage('Missing email address.', false));

  try {
    const { error } = await supabase
      .from('subscribers')
      .update({ unsubscribed: true })
      .eq('email', email);

    if (error) throw error;

    return res.status(200).send(htmlPage(`You've been unsubscribed. You will no longer receive marketing emails at ${email}.`, true));
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return res.status(500).send(htmlPage('Something went wrong. Please email enquiry.rosiesboutique@outlook.com and we will remove you manually.', false));
  }
}

function htmlPage(message, success) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unsubscribed — Rosie's Boutique</title></head>
<body style="margin:0;padding:0;background:#faf3ec;font-family:Georgia,serif;">
  <div style="max-width:480px;margin:60px auto;padding:40px 32px;background:#fff;border-radius:20px;text-align:center;">
    <p style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7c6e;margin:0 0 16px;">Rosie's Boutique</p>
    <h1 style="font-size:24px;color:#2b1d18;margin:0 0 16px;font-weight:500;">${success ? "You're unsubscribed 🌸" : 'Oops'}</h1>
    <p style="font-size:15px;color:#6b5248;line-height:1.6;">${message}</p>
  </div>
</body>
</html>`;
}

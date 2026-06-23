import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Code required.' });

  try {
    const { error } = await supabase
      .from('discount_codes')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('code', code.trim().toUpperCase())
      .eq('used', false); // safety: only mark if not already used

    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Mark used error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}

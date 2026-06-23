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
  if (!code) return res.status(400).json({ error: 'Code is required.' });

  try {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('code, percent, used, email')
      .eq('code', code.trim().toUpperCase())
      .single();

    if (error || !data) {
      return res.status(404).json({ valid: false, error: 'Code not found.' });
    }
    if (data.used) {
      return res.status(200).json({ valid: false, error: 'This code has already been used.' });
    }

    return res.status(200).json({ valid: true, code: data.code, percent: data.percent });
  } catch (err) {
    console.error('Validate discount error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}

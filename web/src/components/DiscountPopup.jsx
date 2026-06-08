import { useState, useEffect } from 'react';
import Icon from './Icon';
import { getSupabase } from '../lib/supabase';

const SEEN_KEY = 'rosie_discount_popup_seen';

const DiscountModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const sb = getSupabase();
      if (!sb) throw new Error('Sign-up is temporarily unavailable — please try again later.');
      const { error } = await sb.from('subscribers').insert({
        name: form.name.trim() || null,
        email: form.email.trim(),
        source: 'discount_popup',
      });
      if (error) throw error;
      setDone(true);
    } catch (e2) {
      setErr(e2.message || 'Could not save your details — please try again.');
    } finally { setBusy(false); }
  };

  return (
    <div className="discount-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(43,29,24,0.5)', backdropFilter: 'blur(3px)', padding: 20 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="discount-modal" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.1fr 1fr', maxWidth: 880, width: '100%', borderRadius: 24, overflow: 'hidden', background: 'var(--bg-cream)', boxShadow: '0 40px 100px -30px rgba(43,29,24,0.5)' }}>
        <button onClick={onClose} aria-label="Close" className="discount-modal-close" style={{
          position: 'absolute', top: 16, right: 16, zIndex: 2, width: 38, height: 38, borderRadius: '50%',
          border: 'none', background: 'rgba(255,255,255,0.7)', color: 'var(--ink)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Icon name="close" size={17} />
        </button>

        {/* Form side */}
        <div style={{ padding: '52px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {done ? (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: '50%', background: '#e3efdc', color: '#5a7a4a', marginBottom: 18 }}>
                <Icon name="check" size={24} />
              </div>
              <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, margin: '0 0 10px', letterSpacing: '-0.01em' }}>You're in!</h2>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                Keep an eye on your inbox — your $10 welcome gift is on its way to <strong style={{ color: 'var(--ink)' }}>{form.email.trim()}</strong>.
              </p>
            </>
          ) : (
            <>
              <span className="eyebrow muted">Welcome gift</span>
              <h2 className="serif" style={{ fontSize: 38, fontWeight: 500, margin: '12px 0 10px', letterSpacing: '-0.01em' }}>SAVE $10</h2>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 26px' }}>
                Subscribe and get $10 OFF your first Rosie's Boutique purchase!
              </p>
              <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
                <input className="input" type="text" placeholder="Your name" value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={{ background: '#fff' }} />
                <input className="input" type="email" required placeholder="your@email.com" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={{ background: '#fff' }} />
                {err && <div style={{ fontSize: 13, color: '#a8584a' }}>{err}</div>}
                <button type="submit" className="btn btn-primary btn-block" disabled={busy} style={{ marginTop: 4 }}>
                  {busy ? 'Submitting…' : 'Unlock your discount'} <Icon name="arrow-right" size={16} />
                </button>
              </form>
              <a onClick={onClose} style={{ display: 'block', textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer' }}>
                No thanks
              </a>
            </>
          )}
        </div>

        {/* Image side */}
        <div className="discount-modal-image" style={{ position: 'relative', minHeight: 320, background: 'var(--bg-pink)' }}>
          <img src="/products/sunset-atelier.jpg" alt="A Rosie's Boutique floral arrangement"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      </div>
    </div>
  );
};

const DiscountPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}
    if (!seen) {
      const t = setTimeout(() => {
        setOpen(true);
        try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
      }, 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <div style={{ position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 600 }}>
        <button onClick={() => setOpen(true)} aria-label="Get $10 off — open offer" className="discount-tab" style={{
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          background: 'var(--accent)', color: '#fff', border: 'none',
          borderRadius: '0 10px 10px 0', padding: '20px 10px', fontSize: 12.5, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', boxShadow: '0 12px 30px -12px rgba(43,29,24,0.45)',
        }}>
          Get $10 off
        </button>
      </div>

      {open && <DiscountModal onClose={close} />}
    </>
  );
};

export default DiscountPopup;

import { useState } from 'react';
import Icon from './Icon';
import { getSupabase } from '../lib/supabase';

const FooterContactForm = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const sb = getSupabase();
      if (!sb) throw new Error('Messaging is temporarily unavailable — please email us directly.');
      const { error } = await sb.from('contact_messages').insert({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim(),
        message: form.message.trim(),
      });
      if (error) throw error;
      setSent(true);
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (e2) {
      setErr(e2.message || 'Could not send your message — please try again.');
    } finally { setBusy(false); }
  };

  if (sent) {
    return (
      <div style={{ padding: '20px 0 4px', fontSize: 14, color: '#e9d8c9', lineHeight: 1.6 }}>
        <strong style={{ color: '#fff', display: 'block', marginBottom: 6 }}>Thank you for writing.</strong>
        A real florist will reply within one business day.
        <div>
          <a onClick={() => setSent(false)} style={{ display: 'inline', color: '#f6ddd0', textDecoration: 'underline', cursor: 'pointer', marginTop: 10 }}>Send another message</a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="footer-contact-form" style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <input className="footer-input" type="text" required placeholder="Name" value={form.name} onChange={set('name')} />
      <input className="footer-input" type="tel" placeholder="Phone number" value={form.phone} onChange={set('phone')} />
      <input className="footer-input" type="email" required placeholder="Email" value={form.email} onChange={set('email')} />
      <textarea className="footer-input" rows="3" required placeholder="Your message" value={form.message} onChange={set('message')} style={{ resize: 'vertical' }}></textarea>
      {err && <div style={{ fontSize: 12.5, color: '#e6a395' }}>{err}</div>}
      <button type="submit" className="btn btn-primary" disabled={busy} style={{ justifyContent: 'center' }}>
        {busy ? 'Sending…' : 'Send'} <Icon name="arrow-right" size={15} />
      </button>
    </form>
  );
};

const Footer = ({ navigate }) => (
  <footer className="footer">
    <div className="container footer-grid">
      <div className="footer-col-contact">
        <div className="brand-line">Rosie's Boutique<span style={{ color: 'var(--accent-soft)' }}>.</span></div>
        <h4>Contact us</h4>
        <FooterContactForm />
      </div>
      <div>
        <h4>Follow us</h4>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
          <a href="https://www.instagram.com/rosie.sboutique/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" style={{ color: '#e9d8c9', display: 'inline-flex' }}><Icon name="instagram" size={26} /></a>
          <a href="https://www.facebook.com/profile.php?id=61572040978693" aria-label="Facebook" target="_blank" rel="noopener noreferrer" style={{ color: '#e9d8c9', display: 'inline-flex' }}><Icon name="facebook" size={26} /></a>
        </span>
      </div>
      <div>
        <h4>Shop</h4>
        <a onClick={() => navigate('shop', { id: 'bouquets' })}>Bouquets</a>
        <a onClick={() => navigate('shop', { id: 'luxe-vase-arrangements' })}>Luxe Vase Arrangements</a>
        <a onClick={() => navigate('shop', { id: 'event-corporate-hire' })}>Event and Corporate Hire</a>
        <a onClick={() => navigate('shop', { id: 'wedding-hire' })}>Wedding Hire</a>
      </div>
      <div>
        <h4>Help</h4>
        <a onClick={() => navigate('shipping')}>Shipping</a>
        <a onClick={() => navigate('returns')}>Returns</a>
        <a onClick={() => navigate('faq')}>FAQ</a>
        <a onClick={() => navigate('contact')}>Contact</a>
      </div>
    </div>
    <div className="bottom">
      <span>Copyright © Rosie's Boutique 2026</span>
    </div>
  </footer>
);

export default Footer;

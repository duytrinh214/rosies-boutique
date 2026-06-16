import { useState } from 'react';
import emailjs from '@emailjs/browser';
import Icon from './Icon';
import { getSupabase } from '../lib/supabase';

const EMAILJS_SERVICE_ID = 'service_753npkh';
const EMAILJS_TEMPLATE_ID = 'template_b2xthgg';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YXCIZg2Db_HAB5cel';

const FooterContactForm = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => { const n = { ...er }; delete n[key]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setErr(''); setBusy(true);
    try {
      const sb = getSupabase();
      if (sb) {
        const { error } = await sb.from('contact_messages').insert({
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim(),
          message: form.message.trim(),
        });
        if (error) throw error;
      } else {
        const list = JSON.parse(localStorage.getItem('rb_contact_messages') || '[]');
        list.push({ ...form, created_at: new Date().toISOString() });
        localStorage.setItem('rb_contact_messages', JSON.stringify(list));
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || '', message: form.message.trim() },
        EMAILJS_PUBLIC_KEY,
      );

      setSent(true);
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (e2) {
      setErr(e2.message || 'Could not send your message — please try again.');
    } finally { setBusy(false); }
  };

  if (sent) {
    return (
      <div style={{ padding: '20px 0 4px', fontSize: 14, color: '#e9d8c9', lineHeight: 1.6 }}>
        <strong style={{ color: '#fff', display: 'block', marginBottom: 6 }}>Message sent!</strong>
        A real florist will reply within one business day.
        <div>
          <a onClick={() => setSent(false)} style={{ display: 'inline', color: '#f6ddd0', textDecoration: 'underline', cursor: 'pointer', marginTop: 10 }}>Send another message</a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="footer-contact-form" style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <div>
        <input className={'footer-input' + (errors.name ? ' footer-input-error' : '')} type="text" placeholder="Name *" value={form.name} onChange={set('name')} />
        {errors.name && <div style={{ fontSize: 12, color: '#e6a395', marginTop: 4 }}>{errors.name}</div>}
      </div>
      <input className="footer-input" type="tel" placeholder="Phone number" value={form.phone} onChange={set('phone')} />
      <div>
        <input className={'footer-input' + (errors.email ? ' footer-input-error' : '')} type="email" placeholder="Email *" value={form.email} onChange={set('email')} />
        {errors.email && <div style={{ fontSize: 12, color: '#e6a395', marginTop: 4 }}>{errors.email}</div>}
      </div>
      <div>
        <textarea className={'footer-input' + (errors.message ? ' footer-input-error' : '')} rows="3" placeholder="Your message *" value={form.message} onChange={set('message')} style={{ resize: 'vertical' }}></textarea>
        {errors.message && <div style={{ fontSize: 12, color: '#e6a395', marginTop: 4 }}>{errors.message}</div>}
      </div>
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

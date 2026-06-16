import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import { getSupabase } from '../lib/supabase';
import { InfoHero, ContactLine, INFO_INK } from './info-shared';

const ERR_RED = '#c0473a';
const EMAILJS_SERVICE_ID = 'service_753npkh';
const EMAILJS_TEMPLATE_ID = 'template_b2xthgg';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YXCIZg2Db_HAB5cel';

// Labelled field matching the shared Field style, with an optional required
// asterisk and an inline validation error.
const ContactField = ({ label, required, error, children }) =>
<label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    <span style={{ fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>
      {label}{required && <span style={{ color: ERR_RED, marginLeft: 3 }}>*</span>}
    </span>
    {children}
    {error && <span style={{ fontSize: 12.5, color: ERR_RED, fontWeight: 500, letterSpacing: 0, textTransform: 'none' }}>{error}</span>}
  </label>;


// Mirrors the footer contact form: same Name / Phone / Email / Message
// fields, the same Supabase contact_messages destination, and a matching
// success state — plus inline required-field validation.
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitErr, setSubmitErr] = useState('');

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => { const n = { ...er }; delete n[key]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address';
    if (!form.message.trim()) e.message = 'Please enter your message';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitErr(''); setBusy(true);
    try {
      const sb = getSupabase();
      if (sb) {
        const { error } = await sb.from('contact_messages').insert({
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim(),
          message: form.message.trim() });

        if (error) throw error;
      } else {
        // Demo fallback so the form still works without a backend configured.
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
      setSubmitErr(e2.message || 'Could not send your message — please try again.');
    } finally { setBusy(false); }
  };

  if (sent) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: '#e3efdc', color: '#5a7a4a', marginBottom: 18 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <div className="serif" style={{ fontSize: 24, fontWeight: 500, color: INFO_INK, marginBottom: 8 }}>Message sent</div>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', margin: '0 0 22px' }}>Thank you! We'll be in touch within 1-2 business days.</p>
        <button className="btn btn-secondary" onClick={() => setSent(false)}>Send another</button>
      </div>);

  }

  return (
    <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ContactField label="Name" required error={errors.name}>
        <input className={'info-input' + (errors.name ? ' input-error' : '')} type="text" placeholder="Jane Nguyen" value={form.name} onChange={set('name')} />
      </ContactField>
      <ContactField label="Phone number">
        <input className="info-input" type="tel" placeholder="0400 000 000" value={form.phone} onChange={set('phone')} />
      </ContactField>
      <ContactField label="Email" required error={errors.email}>
        <input className={'info-input' + (errors.email ? ' input-error' : '')} type="email" placeholder="jane@email.com" value={form.email} onChange={set('email')} />
      </ContactField>
      <ContactField label="Message" required error={errors.message}>
        <textarea className={'info-input' + (errors.message ? ' input-error' : '')} rows="4" placeholder="How can we help?" value={form.message} onChange={set('message')} style={{ resize: 'vertical' }}></textarea>
      </ContactField>
      {submitErr && <div style={{ fontSize: 13, color: ERR_RED }}>{submitErr}</div>}
      <button className="btn btn-primary btn-block" type="submit" disabled={busy} style={{ marginTop: 4 }}>
        {busy ? 'Sending…' : <>Send message <Icon name="arrow-right" size={16} /></>}
      </button>
      <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '2px 0 0' }}>* Required fields</p>
    </form>);

};

// ============================================================
// CONTACT
// ============================================================
const ContactPage = () => {
  const { navigate } = useNav();
  return (
    <div className="page-fade" style={{ color: INFO_INK }}>
      <InfoHero
        navigate={navigate}
        crumb="Contact"
        pill="Say hello"
        title="Come visit,"
        titleItalic="or write to us."
        intro="Our atelier doors are open through the week. Drop by for a coffee and a browse, or send a note and a real florist will reply within one business day." />

      <section style={{ padding: '0 56px 56px' }}>
        <div className="g-stack" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'start' }}>

          {/* LEFT — details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Hours */}
            <div className="card" style={{ padding: '36px 40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'var(--ink)', color: 'var(--bg-pink)' }}>
                  <Icon name="clock" size={22} stroke={1.5} />
                </span>
                <h3 className="serif" style={{ fontSize: 26, fontWeight: 500, margin: 0, color: INFO_INK }}>Opening hours</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--hairline)' }}>
                <span style={{ fontSize: 15.5, color: 'var(--ink-soft)' }}>Monday — Friday</span>
                <span className="serif" style={{ fontSize: 20, fontWeight: 500, color: INFO_INK }}>9:00am — 5:00pm</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--hairline)' }}>
                <span style={{ fontSize: 15.5, color: 'var(--ink-soft)' }}>Saturday</span>
                <span className="serif" style={{ fontSize: 20, fontWeight: 500, color: INFO_INK }}>10:00am — 3:00pm</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '12px 0' }}>
                <span style={{ fontSize: 15.5, color: 'var(--ink-soft)' }}>Sunday</span>
                <span className="serif" style={{ fontSize: 20, fontWeight: 500, color: INFO_INK }}>Closed</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', margin: '16px 0 0', lineHeight: 1.6 }}>
                Drop by during opening hours, or send a note any time — a real florist will reply within one business day.
              </p>
            </div>

            {/* Contact lines */}
            <div className="card" style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>
              <ContactLine icon="map-pin" label="Atelier & store" value={<>87 President Rd,<br />Albanvale, Melbourne VIC 3021</>} />
              <ContactLine icon="mail" label="Email" value="enquiry.rosiesboutique@outlook.com" />
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="card" style={{ padding: '40px 44px' }}>
            <h3 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: '0 0 6px', color: INFO_INK }}>Send a message</h3>
            <p style={{ fontSize: 14.5, color: 'var(--muted)', margin: '0 0 26px' }}>We reply within one business day.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* MAP — full width */}
      <section style={{ padding: '0 56px 88px' }}>
        <div className="img-elevated" style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 22, overflow: 'hidden', boxShadow: '0 20px 40px -18px rgba(43,29,24,0.28)' }}>
          <iframe
            title="Rosie's Boutique location"
            src="https://maps.google.com/maps?q=87+President+Rd%2C+Albanvale+VIC+3021&t=&z=15&ie=UTF8&iwloc=&output=embed"
            style={{ width: '100%', height: 420, border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>
    </div>);

};

export default ContactPage;

import { useState } from 'react';
import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import { InfoHero, ContactLine, Field, INFO_INK } from './info-shared';

// ============================================================
// CONTACT
// ============================================================
const ContactPage = () => {
  const { navigate } = useNav();
  const [sent, setSent] = useState(false);
  return (
    <div className="page-fade" style={{ color: INFO_INK }}>
      <InfoHero
        navigate={navigate}
        crumb="Contact"
        pill="Say hello"
        title="Come visit,"
        titleItalic="or write to us."
        intro="Our atelier doors are open seven days a week. Drop by for a coffee and a browse, or send a note and a real florist will reply within one business day." />

      <section style={{ padding: '0 56px 56px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'start' }}>

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
              {/* TODO: replace with real business info before launch — placeholder opening hours */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--hairline)' }}>
                <span style={{ fontSize: 15.5, color: 'var(--ink-soft)' }}>Monday — Sunday</span>
                <span className="serif" style={{ fontSize: 20, fontWeight: 500, color: INFO_INK }}>7:00 — 19:00</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', margin: '16px 0 0', lineHeight: 1.6 }}>
                Open every day of the week, including public holidays. Last orders for same-day delivery are taken at 14:00.
              </p>
            </div>

            {/* Contact lines */}
            <div className="card" style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>
              {/* TODO: replace with real business info before launch — placeholder address, phone and email */}
              <ContactLine icon="map-pin" label="Atelier & store" value={<>12 Tr&#7847;n Qu&#7889;c Th&#7842;o, Ward 7,<br />District 3, Ho Chi Minh City</>} />
              <ContactLine icon="phone" label="Phone & Zalo" value="+84 28 3930 1234" />
              <ContactLine icon="mail" label="Email" value="hello@rosie.co" />
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="card" style={{ padding: '40px 44px' }}>
            <h3 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: '0 0 6px', color: INFO_INK }}>Send a message</h3>
            <p style={{ fontSize: 14.5, color: 'var(--muted)', margin: '0 0 26px' }}>We reply within one business day.</p>
            {sent ?
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: '#e3efdc', color: '#5a7a4a', marginBottom: 18 }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <div className="serif" style={{ fontSize: 24, fontWeight: 500, color: INFO_INK, marginBottom: 8 }}>Message sent</div>
                <p style={{ fontSize: 15, color: 'var(--ink-soft)', margin: '0 0 22px' }}>Thank you for writing — a florist will be in touch shortly.</p>
                <button className="btn btn-secondary" onClick={() => setSent(false)}>Send another</button>
              </div> :

            <form onSubmit={(e) => {e.preventDefault();setSent(true);}} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Field label="Your name"><input className="info-input" type="text" required placeholder="Jane Nguyen" /></Field>
                <Field label="Email"><input className="info-input" type="email" required placeholder="jane@email.com" /></Field>
                <Field label="Subject">
                  <select className="info-input" defaultValue="general">
                    <option value="general">General enquiry</option>
                    <option value="order">Order & shipping</option>
                    <option value="bespoke">Bespoke / wedding</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                </Field>
                <Field label="Message"><textarea className="info-input" rows="4" required placeholder="How can we help?" style={{ resize: 'vertical' }}></textarea></Field>
                <button className="btn btn-primary btn-block" type="submit" style={{ marginTop: 4 }}>Send message <Icon name="arrow-right" size={16} /></button>
              </form>
            }
          </div>
        </div>
      </section>

      {/* MAP — full width */}
      {/* TODO: replace with real Google Maps embed for the shop's actual address before launch */}
      <section style={{ padding: '0 56px 88px' }}>
        <div className="img-elevated" style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 22, overflow: 'hidden', boxShadow: '0 20px 40px -18px rgba(43,29,24,0.28)' }}>
          <iframe
            title="Rosie's Boutique location"
            src="https://maps.google.com/maps?q=District%203%20Ho%20Chi%20Minh%20City&t=&z=15&ie=UTF8&iwloc=&output=embed"
            style={{ width: '100%', height: 420, border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>
    </div>);

};

export default ContactPage;

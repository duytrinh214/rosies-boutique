/* global React, Icon */
const { useState } = React;

const INFO_INK = '#2b1d18';

// ============================================================
// SHARED — page hero (breadcrumb + pill + title + intro)
// ============================================================
const InfoHero = ({ navigate, crumb, pill, title, titleItalic, intro }) =>
<section style={{ padding: '64px 56px 24px' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto', padding: '32px 0 40px' }}>
        <span className="pill"><span className="pill-dot"></span>{pill}</span>
        <h1 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1.0, margin: '24px 0 20px', fontWeight: 500, letterSpacing: '-0.025em', color: INFO_INK }}>
          {title} {titleItalic && <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>{titleItalic}</span>}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--ink-soft)', maxWidth: 600, margin: '0 auto', textWrap: 'pretty' }}>
          {intro}
        </p>
      </div>
    </div>
  </section>;


// ============================================================
// SHIPPING
// ============================================================
const SHIPPING_TIERS = [
{ name: 'Same-day express', area: 'Within Ho Chi Minh City', time: 'Ordered before 2pm · delivered by dusk', price: '₫45,000' },
{ name: 'Standard delivery', area: 'Nationwide · Vietnam', time: '2 – 4 working days', price: '₫30,000' },
{ name: 'Free shipping', area: 'Orders over ₫1,500,000', time: 'Standard nationwide', price: 'Free' }];


const ShippingPage = ({ navigate }) =>
<div className="page-fade" style={{ color: INFO_INK }}>
    <InfoHero
    navigate={navigate}
    crumb="Shipping"
    pill="Delivery & dispatch"
    title="Hand-couriered,"
    titleItalic="petal-perfect."
    intro="Every bouquet leaves the atelier wrapped, boxed and cushioned by hand. Here is exactly how and when your flowers will arrive." />

    <section style={{ padding: '0 56px 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Tiers table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 36 }}>
          {SHIPPING_TIERS.map((t, i) =>
        <div key={t.name} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr 1fr', gap: 24, alignItems: 'center', padding: '26px 36px', borderTop: i === 0 ? 'none' : '1px solid var(--hairline)' }}>
              <div>
                <div className="serif" style={{ fontSize: 22, fontWeight: 500, color: INFO_INK }}>{t.name}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>{t.area}</div>
              </div>
              <div style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{t.time}</div>
              <div className="serif" style={{ fontSize: 22, fontWeight: 500, textAlign: 'right', color: INFO_INK }}>{t.price}</div>
            </div>
        )}
        </div>

        {/* Detail prose */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <InfoBlock icon="clock" title="Processing time"
          body="Ready-made bouquets are dispatched within 24 hours. Made-to-order and wedding pieces are crafted by hand and take 3 – 7 days before they ship — we will email you a dispatch date at checkout." />
          <InfoBlock icon="truck" title="Tracking"
          body="As soon as your order leaves the atelier you will receive an email and SMS with a live tracking link. Same-day couriers share a real-time map so you can watch your flowers travel to the door." />
          <InfoBlock icon="shield" title="Safe packaging"
          body="Stems are secured in a moulded kraft cradle and double-boxed so not a single petal shifts in transit. Our packaging is plastic-free and fully recyclable." />
          <InfoBlock icon="leaf" title="International"
          body="We ship worldwide via DHL Express (5 – 10 working days). Duties and import taxes are calculated and shown at checkout — no surprises on arrival." />
        </div>
      </div>
    </section>

    <InfoCTA navigate={navigate} />
  </div>;


// ============================================================
// RETURNS
// ============================================================
const RETURN_STEPS = [
{ no: '01', title: 'Get in touch', body: 'Email hello@rosie.co or use the contact form within 14 days of delivery. Tell us your order number and what went wrong.' },
{ no: '02', title: 'We send a label', body: 'We email a prepaid return label within one business day. Re-box the flowers in their original packaging if you can.' },
{ no: '03', title: 'Post it back', body: 'Drop the parcel at any courier point. Tracking keeps both of us updated the whole way back to the atelier.' },
{ no: '04', title: 'Refund or swap', body: 'Once we receive and inspect the return, your refund is issued to the original payment method within 5 – 7 business days — or we send a replacement, your choice.' }];


const ReturnsPage = ({ navigate }) =>
<div className="page-fade" style={{ color: INFO_INK }}>
    <InfoHero
    navigate={navigate}
    crumb="Returns"
    pill="Returns & exchanges"
    title="A simple,"
    titleItalic="14-day promise."
    intro="If a piece is not quite right, send it back within 14 days for a full refund or exchange. No fuss, no restocking fee — flowers should make you happy, full stop." />

    <section style={{ padding: '0 56px 64px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {RETURN_STEPS.map((s) =>
        <div key={s.no} className="card" style={{ padding: '36px 40px' }}>
              <div className="serif italic" style={{ fontSize: 30, color: 'var(--muted)', fontWeight: 500, marginBottom: 14 }}>Nº {s.no}</div>
              <div className="serif" style={{ fontSize: 24, fontWeight: 500, color: INFO_INK, marginBottom: 10 }}>{s.title}</div>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-soft)', margin: 0, textWrap: 'pretty' }}>{s.body}</p>
            </div>
        )}
        </div>
      </div>
    </section>

    {/* Eligibility */}
    <section style={{ padding: '0 56px 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <div className="card" style={{ padding: '40px 44px' }}>
          <div style={{ fontSize: 11.5, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, color: '#5a7a4a', marginBottom: 18 }}>What we accept</div>
          {['Unused pieces in original packaging', 'Damaged or faulty items — always', 'Wrong item received', 'Change of mind within 14 days'].map((t) =>
        <CheckRow key={t} text={t} ok={true} />
        )}
        </div>
        <div className="card" style={{ padding: '40px 44px' }}>
          <div style={{ fontSize: 11.5, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, color: '#a8584a', marginBottom: 18 }}>What we can't accept</div>
          {['Bespoke / custom wedding orders', 'Items returned after 14 days', 'Pieces showing wear or dust', 'Sale items marked final'].map((t) =>
        <CheckRow key={t} text={t} ok={false} />
        )}
        </div>
      </div>
    </section>

    <InfoCTA navigate={navigate} />
  </div>;


// ============================================================
// FAQ
// ============================================================
const FAQS = [
{ q: 'Are the flowers really artificial?', a: 'Yes — every stem is hand-crafted from silk and rayon, then dyed in small batches. They are designed to be botanically accurate, so most people cannot tell until they touch them. There is no water, no pollen and no wilting.' },
{ q: 'How long do the flowers last?', a: 'With basic care our florals hold their colour and shape for 5 years or more. Keep them out of direct sunlight, away from humidity, and dust them gently with a soft brush or hairdryer on the cool setting.' },
{ q: 'How long will my order take to arrive?', a: 'Ready-made bouquets dispatch within 24 hours and arrive in 2 – 4 working days nationwide. Same-day express is available within Ho Chi Minh City for orders placed before 2pm. Made-to-order and wedding pieces take 3 – 7 days to craft before shipping.' },
{ q: 'Do you ship internationally?', a: 'We do. International orders ship via DHL Express and arrive in 5 – 10 working days. Any duties or import taxes are calculated transparently at checkout so there are no surprises on delivery.' },
{ q: 'Can I return or exchange my order?', a: 'Absolutely. You have 14 days from delivery to request a return for a full refund or exchange, with no restocking fee. Bespoke and custom wedding orders are the only exception. See our Returns page for the step-by-step.' },
{ q: 'Do you offer custom or bespoke arrangements?', a: 'Yes — bespoke bouquets, wedding florals and event centerpieces are our speciality. Send us your colours, budget and date through the contact page and a florist will design a proposal with you, usually within two days.' },
{ q: 'Do you take wholesale or bulk orders?', a: 'We welcome wholesale enquiries from florists, event planners, hotels and retailers. Bulk pricing starts at 20 units. Email wholesale@rosie.co with the pieces and quantities you need for a tailored quote.' },
{ q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards, Apple Pay, Google Pay, PayPal and Afterpay (4 interest-free instalments). All payments are processed securely in AUD with end-to-end encryption.' },
{ q: 'How are the flowers packaged?', a: 'Each piece is wrapped in tissue, secured in a moulded kraft cradle and double-boxed so nothing shifts in transit. Our packaging is plastic-free, recyclable and gift-ready, so it can be sent straight to a recipient.' },
{ q: 'Can I track my order?', a: 'Yes. The moment your order ships you will receive an email and SMS with a live tracking link. Same-day couriers also share a real-time map so you can follow your flowers right to the door.' }];


const FaqItem = ({ item, open, onToggle }) =>
<div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <button
    onClick={onToggle}
    style={{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
      padding: '26px 32px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
    }}>
      <span className="serif" style={{ fontSize: 21, fontWeight: 500, color: INFO_INK, lineHeight: 1.3 }}>{item.q}</span>
      <span style={{
      flex: 'none', width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--hairline-strong)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: INFO_INK,
      transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease'
    }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </span>
    </button>
    <div style={{
    maxHeight: open ? 300 : 0, overflow: 'hidden',
    transition: 'max-height 0.4s ease, opacity 0.3s ease', opacity: open ? 1 : 0
  }}>
      <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink-soft)', margin: 0, padding: '0 32px 28px', maxWidth: 760, textWrap: 'pretty' }}>{item.a}</p>
    </div>
  </div>;


const FaqPage = ({ navigate }) => {
  const [open, setOpen] = useState(0);
  return (
    <div className="page-fade" style={{ color: INFO_INK }}>
      <InfoHero
        navigate={navigate}
        crumb="FAQ"
        pill="Good to know"
        title="Questions,"
        titleItalic="answered."
        intro="Everything our customers ask most often — from how long the flowers last to shipping, returns and bespoke orders. Still stuck? The contact page is one tap away." />

      <section style={{ padding: '0 56px 72px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FAQS.map((item, i) =>
          <FaqItem key={i} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          )}
        </div>
      </section>

      <InfoCTA navigate={navigate} />
    </div>);

};


// ============================================================
// CONTACT
// ============================================================
const ContactPage = ({ navigate }) => {
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


// ============================================================
// SHARED small components
// ============================================================
const InfoBlock = ({ icon, title, body }) =>
<div className="card" style={{ padding: '34px 38px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', background: 'rgba(43,29,24,0.05)', color: 'var(--ink)' }}>
        <Icon name={icon} size={19} stroke={1.5} />
      </span>
      <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: 0, color: INFO_INK }}>{title}</h3>
    </div>
    <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-soft)', margin: 0, textWrap: 'pretty' }}>{body}</p>
  </div>;


const CheckRow = ({ text, ok }) =>
<div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
    <span style={{ flex: 'none', display: 'inline-flex', color: ok ? '#5a7a4a' : '#b07064' }}>
      {ok ?
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> :
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
    }
    </span>
    <span style={{ fontSize: 15, color: 'var(--ink-soft)' }}>{text}</span>
  </div>;


const ContactLine = ({ icon, label, value }) =>
<div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
    <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: 'rgba(43,29,24,0.05)', color: 'var(--ink)' }}>
      <Icon name={icon} size={19} stroke={1.5} />
    </span>
    <div>
      <div style={{ fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 16, color: INFO_INK, lineHeight: 1.5 }}>{value}</div>
    </div>
  </div>;


const Field = ({ label, children }) =>
<label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    <span style={{ fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>{label}</span>
    {children}
  </label>;


const InfoCTA = ({ navigate }) =>
<section style={{ padding: '0 56px 100px' }}>
    <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, color: 'var(--ink)', marginBottom: 22 }} aria-hidden="true">
        <span style={{ width: 60, height: 1, background: 'currentColor', opacity: 0.4 }}></span>
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
          <rect x="6.5" y="6.5" width="9" height="9" transform="rotate(45 11 11)" />
          <rect x="9.5" y="9.5" width="3" height="3" transform="rotate(45 11 11)" fill="currentColor" stroke="none" />
        </svg>
        <span style={{ width: 60, height: 1, background: 'currentColor', opacity: 0.4 }}></span>
      </div>
      <h3 className="serif" style={{ fontSize: 42, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 26px', color: INFO_INK }}>
        Ready to find a stem to <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>keep?</span>
      </h3>
      <div style={{ display: 'inline-flex', gap: 14 }}>
        <button className="btn btn-primary" onClick={() => navigate('shop')}>Browse the atelier <Icon name="arrow-right" size={16} /></button>
        <button className="btn btn-secondary" onClick={() => navigate('contact')}>Contact us</button>
      </div>
    </div>
  </section>;


// expose globally
Object.assign(window, { ShippingPage, ReturnsPage, FaqPage, ContactPage });

import { useState } from 'react';
import { useNav } from '../lib/nav';
import { InfoHero, InfoCTA, INFO_INK } from './info-shared';

// ============================================================
// FAQ
// ============================================================
const FAQS = [
{ q: 'Are the flowers really artificial?', a: 'Yes — every stem is hand-crafted from silk and rayon, then dyed in small batches. They are designed to be botanically accurate, so most people cannot tell until they touch them. There is no water, no pollen and no wilting.' },
{ q: 'How long do the flowers last?', a: 'With basic care our florals hold their colour and shape for 5 years or more. Keep them out of direct sunlight, away from humidity, and dust them gently with a soft brush or hairdryer on the cool setting.' },
{ q: 'How long will my order take to arrive?', a: 'Ready-made bouquets dispatch within 24 hours and arrive in 2 – 4 working days nationwide. Same-day express is available within Melbourne metro for orders placed before 12pm. Made-to-order and wedding pieces take 3 – 7 days to craft before shipping.' },
{ q: 'Do you ship internationally?', a: 'We do. International orders ship via DHL Express and arrive in 5 – 10 working days. Any duties or import taxes are calculated transparently at checkout so there are no surprises on delivery.' },
{ q: 'Can I return or exchange my order?', a: 'Absolutely. You have 14 days from delivery to request a return for a full refund or exchange, with no restocking fee. Bespoke and custom wedding orders are the only exception. See our Returns page for the step-by-step.' },
{ q: 'Do you offer custom or bespoke arrangements?', a: 'Yes — bespoke bouquets, wedding florals and event centerpieces are our speciality. Send us your colours, budget and date through the contact page and a florist will design a proposal with you, usually within two days.' },
{ q: 'Do you take wholesale or bulk orders?', a: 'We welcome wholesale enquiries from florists, event planners, hotels and retailers. Bulk pricing starts at 20 units. Email enquiry.rosiesboutique@outlook.com with the pieces and quantities you need for a tailored quote.' },
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


const FaqPage = () => {
  const { navigate } = useNav();
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

export default FaqPage;

import { useNav } from '../lib/nav';
import { InfoHero, CheckRow, InfoCTA, INFO_INK } from './info-shared';

// ============================================================
// RETURNS
// ============================================================
const RETURN_STEPS = [
{ no: '01', title: 'Get in touch', body: 'Email hello@rosie.co or use the contact form within 14 days of delivery. Tell us your order number and what went wrong.' },
{ no: '02', title: 'We send a label', body: 'We email a prepaid return label within one business day. Re-box the flowers in their original packaging if you can.' },
{ no: '03', title: 'Post it back', body: 'Drop the parcel at any courier point. Tracking keeps both of us updated the whole way back to the atelier.' },
{ no: '04', title: 'Refund or swap', body: 'Once we receive and inspect the return, your refund is issued to the original payment method within 5 – 7 business days — or we send a replacement, your choice.' }];


const ReturnsPage = () => {
  const { navigate } = useNav();
  return (
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
    </div>);

};

export default ReturnsPage;

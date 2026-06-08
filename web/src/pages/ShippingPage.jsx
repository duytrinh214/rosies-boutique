import { useNav } from '../lib/nav';
import { InfoHero, InfoBlock, InfoCTA, INFO_INK } from './info-shared';

// ============================================================
// SHIPPING
// ============================================================
const SHIPPING_TIERS = [
{ name: 'Same-day express', area: 'Within Melbourne metro', time: 'Ordered before 12pm · delivered by evening', price: '$12' },
{ name: 'Standard delivery', area: 'Nationwide · Australia', time: '2 – 4 working days', price: '$9' },
{ name: 'Free shipping', area: 'Orders over $150', time: 'Standard nationwide', price: 'Free' }];


const ShippingPage = () => {
  const { navigate } = useNav();
  return (
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
            <div key={t.name} className="g-stack-3" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr 1fr', gap: 24, alignItems: 'center', padding: '26px 36px', borderTop: i === 0 ? 'none' : '1px solid var(--hairline)' }}>
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
          <div className="g-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
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
    </div>);

};

export default ShippingPage;

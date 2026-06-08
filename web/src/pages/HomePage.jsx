import { useState, useEffect } from 'react';
import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import { useProducts, DiscountStore } from '../lib/stores';
import { CollectionCard, CollectionCarousel } from './ShopPage';
import { DRAG_ROWS } from '../lib/collections';

// =========================================================
// HERO SLIDESHOW — best-sellers, crossfade + Ken Burns
// =========================================================
const HERO_SLIDES = [
{ src: '/products/coral-peony.jpg', name: 'Coral Peony Bloom' },
{ src: '/products/spring-lush.jpg', name: 'Spring Lush' },
{ src: '/products/magenta-garden.jpg', name: 'Magenta Garden' },
{ src: '/products/ivory-tulip.jpg', name: 'Ivory Tulip Pot' },
{ src: '/products/crimson-orchid.jpg', name: 'Crimson & Orchid' }];


export const HeroSlideshow = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), 5400);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="hero-frame"
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{ width: "100%", height: "760px", margin: "0 auto", padding: "5px" }}>
      <div className="hero-window hero-slideshow">
        {HERO_SLIDES.map((s, i) =>
        <img key={s.src} src={s.src} alt={s.name}
        className={'hero-slide' + (i === idx ? ' active' : '')}
        onError={(e) => {e.target.style.display = 'none';}} />
        )}

        {/* Editorial gradient — top to bottom for legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(43,29,24,0.28) 0%, rgba(43,29,24,0) 28%, rgba(43,29,24,0) 55%, rgba(43,29,24,0.55) 100%)', pointerEvents: 'none', zIndex: 2 }}></div>

        {/* Inner mat — hairline gallery frame */}
        <div style={{ position: 'absolute', inset: 14, border: '1px solid rgba(255,255,255,0.35)', pointerEvents: 'none', zIndex: 3 }}></div>

        {/* Editorial caption — bottom-left */}
        <div className="hero-caption" key={idx} style={{ left: 32, bottom: 70, right: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 28, height: 1, background: '#fff', opacity: 0.7 }}></div>
            <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.92 }}>
              Nº {String(idx + 1).padStart(2, '0')} · Best-seller
            </span>
          </div>
          <div className="serif italic" style={{ fontSize: 36, fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{HERO_SLIDES[idx].name}</div>
        </div>

        {/* Progress segments — bottom */}
        <div style={{ position: 'absolute', left: 32, right: 32, bottom: 30, display: 'flex', gap: 6, zIndex: 5 }}>
          {HERO_SLIDES.map((_, i) =>
          <button key={i} onClick={() => setIdx(i)}
          aria-label={`Go to slide ${i + 1}`}
          style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.35)', border: 'none', padding: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <span style={{ position: 'absolute', inset: 0, background: '#fff', transform: i < idx ? 'scaleX(1)' : i === idx ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: i === idx && !paused ? 'transform 5400ms linear' : 'transform 320ms ease', display: 'block' }}></span>
          </button>
          )}
        </div>
      </div>
    </div>);

};

// =========================================================
// HOME
// =========================================================
export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(null); // { code, email }
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const val = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    const entry = DiscountStore.issue(val, 10);
    setSent({ code: entry.code, email: val });
  };

  if (sent) {
    return (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto', padding: '44px 44px 40px', textAlign: 'center', background: '#fff' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: '#e3efdc', color: '#5a7a4a', marginBottom: 22 }}>
          <Icon name="check" size={26} />
        </div>
        <div style={{ fontSize: 11.5, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', marginBottom: 12 }}>Welcome gift sent</div>
        <h3 className="serif" style={{ fontSize: 30, fontWeight: 500, margin: '0 0 12px', letterSpacing: '-0.01em' }}>Here's your 10% off</h3>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 22px' }}>
          A confirmation with your code is on its way to<br /><strong style={{ color: 'var(--ink)' }}>{sent.email}</strong>.
        </p>
        <div style={{ border: '1px dashed var(--hairline-strong)', borderRadius: 14, padding: '18px 20px', background: 'var(--bg-cream)', marginBottom: 22 }}>
          <div style={{ fontSize: 11.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Your code</div>
          <div className="serif" style={{ fontSize: 30, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--ink)' }}>{sent.code}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 8 }}>Use it at checkout · 10% off your first order</div>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.65, margin: '0 0 4px' }}>
          Thank you for joining us. We can't wait to place a little something by hand, just for you.
        </p>
        <p className="serif italic" style={{ fontSize: 16, color: '#5a4a40', margin: '6px 0 0' }}>With love, the team at Rosie's Boutique</p>
      </div>);

  }

  return (
    <>
      <form onSubmit={submit} style={{ display: 'flex', gap: 10, maxWidth: 480, margin: '0 auto' }}>
        <input className="input" type="email" placeholder="your@email.com" value={email}
        onChange={(e) => {setEmail(e.target.value);if (error) setError('');}} style={{ background: '#fff' }} />
        <button className="btn btn-primary" type="submit">Subscribe</button>
      </form>
      {error && <p style={{ color: '#a8584a', fontSize: 13.5, marginTop: 12 }}>{error}</p>}
    </>);

};

const HomePage = () => {
  const { navigate } = useNav();
  const products = useProducts();
  return (
    <div className="page-fade">
      {/* HERO */}
      <section style={{ padding: '90px 56px 40px' }}>
        <div className="g-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center', maxWidth: 1440, margin: '0 auto' }}>
          {/* Left */}
          <div>
            <span className="pill" style={{ textAlign: "left", flexDirection: "row" }}><span className="pill-dot"></span>Hand-tied in our atelier</span>
            <h1 className="serif" style={{ lineHeight: 1.02, margin: '36px 0 28px', fontWeight: 500, letterSpacing: '-0.02em', fontSize: "120px" }}>
              Everlasting,<br />
              <span className="italic" style={{ color: '#5a4a40', fontWeight: 400, fontSize: "100px" }}>Floral.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 460, margin: '0 0 38px' }}>

            </p>
            <div style={{ display: 'flex', gap: 14, marginBottom: 64 }}>
              <button className="btn btn-primary" onClick={() => navigate('shop')}>
                Shop Now <Icon name="arrow-right" size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('shop')}>Explore Collections</button>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '14px 22px 14px 18px', borderRadius: 999, background: 'rgba(43,29,24,0.04)', border: '1px solid rgba(43,29,24,0.14)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', color: 'var(--bg-pink)' }}>
                <Icon name="clock" size={20} stroke={1.5} />
              </span>
              <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-soft)', fontWeight: 600, marginBottom: 4 }}>Atelier Courier</span>
                <span className="serif italic" style={{ fontSize: 19, color: 'var(--ink)', letterSpacing: '-0.01em', fontFamily: "Inter", lineHeight: "1" }}>Same day delivery, order before 12pm</span>
              </span>
            </div>
          </div>
          {/* Right */}
          <div style={{ position: 'relative' }}>
            <HeroSlideshow />
          </div>
        </div>
      </section>

      {/* Editorial section divider */}
      <div style={{ background: 'var(--bg-pink)', padding: '20px 56px 64px' }} aria-hidden="true">
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(43,29,24,0) 0%, rgba(43,29,24,0.45) 100%)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--ink)' }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }}></span>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
              <rect x="6.5" y="6.5" width="9" height="9" transform="rotate(45 11 11)" />
              <rect x="9.5" y="9.5" width="3" height="3" transform="rotate(45 11 11)" fill="currentColor" stroke="none" />
            </svg>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }}></span>
          </div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(43,29,24,0.45) 0%, rgba(43,29,24,0) 100%)' }}></div>
        </div>
      </div>

      {/* Featured collections strip */}
      <section style={{ background: 'var(--surface-soft)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow muted">Curated Collections</span>
              <h2>Shop by <span className="italic">moment</span></h2>
            </div>
          </div>
          <div className="grid-4">
            <CollectionCard title="Bouquets" img="/images/cat-bouquets.png" collection="everyday" navigate={navigate}
            centerIcon={
            <svg viewBox="0 0 24 24" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="5.5" r="2.1" />
                  <circle cx="7.7" cy="7.3" r="1.9" />
                  <circle cx="16.3" cy="7.3" r="1.9" />
                  <path d="M12 7.6V15" />
                  <path d="M8.7 9 11.4 15" />
                  <path d="M15.3 9 12.6 15" />
                  <path d="M8.6 15h6.8" />
                  <path d="M9.6 15 8.7 19.4" />
                  <path d="M14.4 15 15.3 19.4" />
                </svg>
            } />
            <CollectionCard title="Luxe vase arrangements" img="/images/cat-vase.png" collection="wedding" navigate={navigate}
            centerIcon={
            <svg viewBox="0 0 24 24" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="4.6" r="1.6" />
                  <circle cx="8.4" cy="6.2" r="1.4" />
                  <circle cx="15.6" cy="6.2" r="1.4" />
                  <path d="M12 6.2V12" />
                  <path d="M9.2 7.4 11.2 12" />
                  <path d="M14.8 7.4 12.8 12" />
                  <path d="M8.4 12h7.2l-1 8a1 1 0 0 1-1 1h-3.2a1 1 0 0 1-1-1Z" />
                </svg>
            } />
            <CollectionCard title="Event and corporate hire" img="/images/cat-event.png" collection="gifts" navigate={navigate}
            centerIcon={
            <svg viewBox="0 0 24 24" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="4.4" r="1.5" />
                  <circle cx="8.7" cy="5.9" r="1.3" />
                  <circle cx="15.3" cy="5.9" r="1.3" />
                  <path d="M12 6v3" />
                  <path d="M9.4 7 11.3 9.2" />
                  <path d="M14.6 7 12.7 9.2" />
                  <path d="M7.6 9.2h8.8" />
                  <path d="M8.4 9.2c.5 3.2 6.7 3.2 7.2 0" />
                  <path d="M11.4 12.4v2.6 M12.6 12.4v2.6" />
                  <path d="M11.4 15 9 19.6 M12.6 15 15 19.6" />
                  <path d="M8.6 19.6h6.8" />
                </svg>
            } />
            <CollectionCard title="Wedding hire" img="/images/cat-wedding.png" collection="weddinghire" navigate={navigate}
            centerIcon={
            <svg viewBox="0 0 24 24" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 21V11a7 7 0 0 1 14 0v10" />
                  <circle cx="12" cy="4.3" r="1.2" />
                  <circle cx="7.4" cy="6.5" r="1" />
                  <circle cx="16.6" cy="6.5" r="1" />
                  <circle cx="5.4" cy="11.5" r="0.9" />
                  <circle cx="18.6" cy="11.5" r="0.9" />
                </svg>
            } />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section style={{ background: 'var(--bg-pink)', padding: "44px 0" }}>
        <div className="container" style={{ padding: "0px 56px" }}>
          <div className="grid-4" style={{ gap: 32 }}>
            <ValueProp icon="leaf" title="Botanically accurate" body="Petal-perfect silk replicas designed from real blooms." />
            <ValueProp icon="truck" title="Same day delivery" body="Same-day delivery across the city, hand-couriered." />
            <ValueProp icon="sparkle" title="Lasts a lifetime" body="Artificial florals that hold their colour 5+ years." />
            <ValueProp icon="shield" title="Easy care" body="Keep away from dust, humid and direct sun light." />
          </div>
        </div>
      </section>

      {/* Shop by collection — drag-to-scroll product rows, one per sub-menu */}
      <div style={{ background: 'var(--surface-soft)', padding: '80px 0 0' }}>
        {DRAG_ROWS.map((row, i) =>
        <CollectionCarousel
          key={row.key}
          collectionKey={row.key}
          eyebrow={row.eyebrow}
          title={row.title}
          navigate={navigate}
          products={products}
          last={i === DRAG_ROWS.length - 1} />
        )}
      </div>

      {/* Editorial split */}
      <section style={{ padding: '100px 0', background: 'var(--bg-pink)' }}>
        <div className="container g-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div className="img-elevated" style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', aspectRatio: '1/1', background: '#fff', boxShadow: '0 20px 40px -18px rgba(43,29,24,0.28), 0 50px 90px -40px rgba(43,29,24,0.18)', padding: "6px" }}>
            <img src="/products/atelier-watercolor.jpg"
            alt="Watercolour painting of a hand-tied bouquet from our atelier" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, display: 'block' }} />
            <span className="painting-thanks">Thank you <span className="thanks-heart" aria-hidden="true">&#10084;</span></span>
          </div>
          <div>
            <span className="pill"><span className="pill-dot"></span>Made by hand, slowly</span>
            <h2 className="serif" style={{ fontSize: 64, fontWeight: 500, lineHeight: 1.05, margin: '32px 0 24px', letterSpacing: '-0.02em' }}>
              Every stem,<br />
              <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>placed by hand.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 32, maxWidth: 480 }}>
              Our atelier in the old quarter is where each piece begins. Florists trained over decades tie every bouquet using techniques refined since 1972 — never rushed, never mass produced.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('story')}>Read our story <Icon name="arrow-right" size={16} /></button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '90px 0', background: 'var(--bg-cream)' }}>
        <div className="container text-center" style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: 56, fontWeight: 500, margin: '0 0 18px', letterSpacing: '-0.02em' }}>
            Letters from the <span className="italic">atelier</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginBottom: 32 }}>Seasonal stories, new arrivals and a 10% welcome gift.</p>
          <NewsletterSignup />
        </div>
      </section>
    </div>);

};

const ValueProp = ({ icon, title, body }) =>
<div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: 'var(--ink)' }}>
      <Icon name={icon} size={20} />
    </div>
    <div className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>{title}</div>
    <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5, margin: 0, maxWidth: 240 }}>{body}</p>
  </div>;


export default HomePage;

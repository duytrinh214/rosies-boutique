/* global React, Nav, Footer, ProductCard, PRODUCTS, CATEGORIES, Icon, Stars, useCart, useProducts, FALLBACK_BG */
const { useState, useEffect, useMemo, useRef } = React;

// =========================================================
// HERO SLIDESHOW — best-sellers, crossfade + Ken Burns
// =========================================================
const HERO_SLIDES = [
{ src: 'products/coral-peony.jpg', name: 'Coral Peony Bloom' },
{ src: 'products/spring-lush.jpg', name: 'Spring Lush' },
{ src: 'products/magenta-garden.jpg', name: 'Magenta Garden' },
{ src: 'products/ivory-tulip.jpg', name: 'Ivory Tulip Pot' },
{ src: 'products/crimson-orchid.jpg', name: 'Crimson & Orchid' }];


const HeroSlideshow = () => {
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
const NewsletterSignup = () => {
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

const HomePage = ({ navigate }) => {
  const products = useProducts();
  return (
    <div className="page-fade">
      {/* HERO */}
      <section style={{ padding: '90px 56px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center', maxWidth: 1440, margin: '0 auto' }}>
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
            <CollectionCard title="Bouquets" img="images/cat-bouquets.png" collection="everyday" navigate={navigate}
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
            <CollectionCard title="Luxe vase arrangements" img="images/cat-vase.png" collection="wedding" navigate={navigate}
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
            <CollectionCard title="Event and corporate hire" img="images/cat-event.png" collection="gifts" navigate={navigate}
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
            <CollectionCard title="Wedding hire" img="images/cat-wedding.png" collection="weddinghire" navigate={navigate}
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
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div className="img-elevated" style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', aspectRatio: '1/1', background: '#fff', boxShadow: '0 20px 40px -18px rgba(43,29,24,0.28), 0 50px 90px -40px rgba(43,29,24,0.18)', padding: "6px" }}>
            <img src="products/atelier-watercolor.jpg"
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

const Stat = ({ big, label }) =>
<div>
    <div className="serif" style={{ fontSize: 32, fontWeight: 500, display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>{big}</div>
    <div style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{label}</div>
  </div>;


const CollectionCard = ({ title, caption, img, collection, navigate, centerIcon }) =>
<div className={"img-elevated" + (centerIcon ? " collection-hover" : "")} style={{ cursor: 'pointer', position: 'relative', borderRadius: 22, overflow: 'hidden', aspectRatio: '1/1.15', background: FALLBACK_BG }} onClick={() => navigate('shop', collection ? { id: collection } : {})}>
    <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  onError={(e) => {e.target.style.display = 'none';}} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(43,29,24,0.5) 100%)' }}></div>
    {centerIcon &&
  <div className="cc-overlay" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.42) 100%)' }}></div>}
    {centerIcon &&
  <div className="cc-icon" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{centerIcon}</div>}
    <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, color: '#fff' }}>
      <div className="serif" style={{ fontSize: 26, fontWeight: 500 }}>{title}</div>
    </div>
  </div>;


const ValueProp = ({ icon, title, body }) =>
<div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: 'var(--ink)' }}>
      <Icon name={icon} size={20} />
    </div>
    <div className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>{title}</div>
    <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5, margin: 0, maxWidth: 240 }}>{body}</p>
  </div>;


// =========================================================
// SHOP
// =========================================================
const COLLECTIONS = {
  everyday: {
    title: 'Bouquets',
    eyebrow: 'Curated · Hand-tied',
    blurb: 'Joyful, full-bodied bouquets composed for the simple pleasure of fresh stems at home.',
    filter: (p) => p.category === 'Bouquets'
  },
  wedding: {
    title: 'Luxe vase arrangements',
    eyebrow: 'Curated · Statement',
    blurb: 'Sculptural stems arranged in glass — ivory, champagne and blush palettes that hold a room.',
    filter: (p) => p.category === 'Luxe vase arrangements'
  },
  gifts: {
    title: 'Event and corporate hire',
    eyebrow: 'Curated · At scale',
    blurb: 'Boxed arrangements, keepsakes and installation-ready pieces for events and corporate spaces.',
    filter: (p) => p.category === 'Event and corporate hire' || p.category === 'Gifts'
  },
  weddinghire: {
    title: 'Wedding hire',
    eyebrow: 'Curated · Celebrations',
    blurb: 'Arches, aisle florals and centrepieces available to hire for ceremonies and receptions.',
    filter: (p) => p.category === 'Wedding hire'
  }
};

// =========================================================
// HOME — collection carousels (drag-to-scroll, one per sub-menu)
// =========================================================
const DRAG_ROWS = [
{ key: 'everyday', eyebrow: 'Nº 01 · Hand-tied', title: 'Bouquets' },
{ key: 'wedding', eyebrow: 'Nº 02 · Statement', title: 'Luxe vase arrangements' },
{ key: 'gifts', eyebrow: 'Nº 03 · At scale', title: 'Event and corporate hire' },
{ key: 'weddinghire', eyebrow: 'Nº 04 · Celebrations', title: 'Wedding hire' }];


const CollectionCarousel = ({ collectionKey, eyebrow, title, navigate, products, last }) => {
  const collection = COLLECTIONS[collectionKey];
  const items = useMemo(() => products.filter(collection.filter), [products, collectionKey]);
  const scroller = useRef(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const onDown = (e) => {
    const el = scroller.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.classList.add('is-dragging');
    try {el.setPointerCapture(e.pointerId);} catch (_) {}
  };
  const onMove = (e) => {
    const el = scroller.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };
  const onUp = (e) => {
    const el = scroller.current;
    if (!el) return;
    drag.current.active = false;
    el.classList.remove('is-dragging');
    try {el.releasePointerCapture(e.pointerId);} catch (_) {}
  };
  // swallow the click that ends a drag so cards don't navigate accidentally
  const onClickCapture = (e) => {
    if (drag.current.moved) {e.preventDefault();e.stopPropagation();drag.current.moved = false;}
  };

  const nudge = (dir) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section style={{ padding: last ? '0 0 96px' : '0 0 72px' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 28 }}>
          <div>
            <span className="eyebrow muted">{eyebrow}</span>
            <h2 className="serif" style={{ fontSize: 44, fontWeight: 500, margin: '12px 0 0', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{title}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="carousel-arrow" aria-label="Scroll left" onClick={() => nudge(-1)}><Icon name="arrow-left" size={16} /></button>
              <button className="carousel-arrow" aria-label="Scroll right" onClick={() => nudge(1)}><Icon name="arrow-right" size={16} /></button>
            </div>
            <button className="see-all-link" onClick={() => navigate('shop', { id: collectionKey })}>
              See all <Icon name="arrow-right" size={15} />
            </button>
          </div>
        </div>
        <div
          ref={scroller}
          className="drag-row"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()} style={{ lineHeight: "1.4" }}>
          {items.map((p) =>
          <div className="drag-item" key={p.id}>
              <ProductCard product={p} navigate={navigate} />
            </div>
          )}
        </div>
      </div>
    </section>);

};

const ShopPage = ({ navigate, params = {} }) => {
  const products = useProducts();
  const collectionKey = params.id && COLLECTIONS[params.id] ? params.id : 'everyday';
  const collection = collectionKey ? COLLECTIONS[collectionKey] : null;
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    setCategory('All');
  }, [collectionKey]);

  const filtered = useMemo(() => {
    let list = collection ? products.filter(collection.filter) : products;
    if (category !== 'All') list = list.filter((p) => p.category === category);
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, sort, collectionKey]);

  return (
    <div className="page-fade">
      {/* Header band */}
      <section style={{ padding: '64px 56px 60px' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 32 }}>
            <div>
              <span className="pill"><span className="pill-dot"></span>{collection ? collection.eyebrow : 'Season 2026 · Spring'}</span>
              <h1 className="serif" style={{ fontSize: 84, lineHeight: 1.02, margin: '24px 0 16px', fontWeight: 500, letterSpacing: '-0.02em' }}>
                {collection ? <>The <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>{collection.title.toLowerCase()}</span> edit.</> : <>The full <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>atelier.</span></>}
              </h1>
              <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 540, lineHeight: 1.5, margin: 0 }}>
                {collection ? collection.blurb : `${filtered.length} pieces · artificial flowers, dried florals, and gifts hand-finished in our studio.`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            </div>
          </div>
        </div>
      </section>

      {/* Category chips */}
      {false &&
      <section style={{ padding: '0 56px 30px' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto' }}>
            <div className="chip-strip">
              {CATEGORIES.map((c) =>
            <button key={c} className={'chip' + (category === c ? ' active' : '')} onClick={() => setCategory(c)}>{c}</button>
            )}
            </div>
          </div>
        </section>
      }

      {/* Grid */}
      <section style={{ padding: '20px 56px 80px' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          {filtered.length === 0 ?
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)' }}>
              <p style={{ fontSize: 16, marginBottom: 0 }}>No pieces in this collection yet.</p>
            </div> :

          <div className="grid-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} navigate={navigate} />)}
            </div>
          }
        </div>
      </section>
    </div>);

};

// =========================================================
// OUR STORY
// =========================================================
const STORY_INK = '#2b1d18';

const StoryPage = ({ navigate }) =>
<div className="page-fade" style={{ color: STORY_INK }}>
    {/* HERO */}
    <section style={{ padding: '64px 56px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto', padding: '40px 0 56px' }}>
          <span className="pill"><span className="pill-dot"></span>Saigon · est. 2022</span>
          <h1 className="serif" style={{ fontSize: 'clamp(64px, 8vw, 104px)', lineHeight: 0.98, margin: '28px 0 22px', fontWeight: 500, letterSpacing: '-0.025em', color: STORY_INK }}>
            A small <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>quiet</span><br />
            rebellion <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>in bloom.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--ink-soft)', maxWidth: 620, margin: '0 auto' }}>
            How a single peony — and a quiet wish that it would not wilt — became an atelier of artificial florals made to be kept, not thrown away.
          </p>
        </div>
      </div>
    </section>

    {/* Hero image — wide editorial */}
    <section style={{ padding: '0 56px 56px' }}>
      <div className="img-elevated" style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 22, overflow: 'hidden', aspectRatio: '21/9', background: FALLBACK_BG, boxShadow: '0 20px 40px -18px rgba(43,29,24,0.28), 0 50px 90px -40px rgba(43,29,24,0.18)' }}>
        <img src="products/spring-lush.jpg" alt="The Rosie's Boutique atelier"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={(e) => {e.target.style.display = 'none';}} />
      </div>
    </section>

    {/* Chapter 01 — origin */}
    <StoryChapter
    no="01"
    eyebrow="The first stem"
    title={<>A flower that <span className="italic" style={{ color: '#5a4a40' }}>refused to wilt.</span></>}
    body={[
    "Three years ago, my mother received a peony bouquet on her birthday. Within five days the petals had browned at the edges and the water turned cloudy. She quietly tipped them into the bin and told me how much she had loved them while they lasted.",
    "It hurt me that something so beautiful was so short. I started crafting silk versions to bring her — first clumsy, then better — until the day she set one on the kitchen counter and asked, in passing, whether the florist had used a new variety.",
    "She didn't know mine were not real. That was the moment Rosie's Boutique began."]
    }
    img="products/coral-peony.jpg"
    imgRight={true} />


    {/* Chapter 02 — home */}
    <StoryChapter
    no="02"
    eyebrow="A house in bloom"
    title={<>Soft mornings, <span className="italic" style={{ color: '#5a4a40' }}>without an expiry date.</span></>}
    body={[
    "A real bouquet is a guest. A silk bouquet is family.",
    "Flowers at home are rarely about flowers. They are about a small ritual of beauty in the morning, about a softness on a tired Tuesday, about a piece of the garden you bring indoors when the world outside feels too loud.",
    "Artificial florals let that softness stay. No water to change, no allergens on the breeze, no panic when a week gets busy. A peony sits on the same shelf for two years, then you swap a few stems and the room is a different room — without a single petal wasted."]
    }
    img="products/studio-pink.jpg"
    imgRight={false} />


    {/* Stat strip */}
    <section style={{ background: '#fff', padding: '56px 56px', margin: '0 56px 88px', borderRadius: 28, boxShadow: '0 16px 30px -22px rgba(43,29,24,0.22)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center', color: STORY_INK }}>
        <StoryStat big="84" unit="min" label="to compose a single peony" />
        <StoryStat big="5+" unit="yr" label="colour-fast lifespan" />
        <StoryStat big="0" unit="" label="dyes, no allergens, no waste" />
        <StoryStat big="12" unit="" label="florists in the atelier" />
      </div>
    </section>

    {/* Chapter 03 — gifting */}
    <StoryChapter
    no="03"
    eyebrow="A gift that stays"
    title={<>The feeling outlasts <span className="italic" style={{ color: '#5a4a40' }}>the bouquet.</span></>}
    body={[
    "We give flowers to mark a feeling. Birthdays, anniversaries, apologies, weddings, condolences — fresh blooms speak for three days. The feeling lasts much longer.",
    "A handmade silk bouquet becomes a keepsake on the recipient's mantel. Five birthdays later, the gift is still in the room, still saying the same thing: I thought of you.",
    "That, to us, is what a gift should do."]
    }
    img="products/burgundy-crescent.jpg"
    imgRight={true} />


    {/* Atelier image pair — two photos with caption between */}
    <section style={{ padding: '0 56px 88px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <div className="img-elevated" style={{ borderRadius: 18, overflow: 'hidden', aspectRatio: '4/5', background: FALLBACK_BG }}>
          <img src="products/ivory-tulip.jpg" alt="Hand-cutting petals" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {e.target.style.display = 'none';}} />
        </div>
        <div className="img-elevated" style={{ borderRadius: 18, overflow: 'hidden', aspectRatio: '4/5', background: FALLBACK_BG }}>
          <img src="products/calla-cascade.jpg" alt="Dyeing in small batches" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {e.target.style.display = 'none';}} />
        </div>
      </div>
    </section>

    {/* Chapter 04 — atelier */}
    <StoryChapter
    no="04"
    eyebrow="Inside the atelier"
    title={<>Slowly, by hand, <span className="italic" style={{ color: '#5a4a40' }}>and never twice the same.</span></>}
    body={[
    "Rosie's Boutique began in a small studio in District 3, Saigon, in 2022. Two florists, four sewing students, one stubborn idea: that artificial does not have to mean lifeless.",
    "We hand-cut every petal from raw silk and rayon, then dye them in small batches so no two stems look identical. A finished peony takes 84 minutes; a wedding centerpiece, three days. We refuse mass production, even when the orders pile up — because the petals know the difference, and so do you."]
    }
    img="products/magenta-garden.jpg"
    imgRight={false} />


    {/* Founder's note */}
    <section style={{ padding: '0 56px 88px' }}>
      <div className="card" style={{ maxWidth: 880, margin: '0 auto', padding: '64px 72px', textAlign: 'center', color: STORY_INK }}>
        <div style={{ fontSize: 11.5, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', marginBottom: 18 }}>
          A note from the founder
        </div>
        <h2 className="serif" style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 22px', color: STORY_INK }}>
          <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>"</span>
          I started Rosie's Boutique so that no one has to choose between beautiful and lasting. Because my mother deserved a peony that did not wither — and so does yours.
          <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>"</span>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: 580, margin: '0 auto 28px' }}>
          We live in a throwaway world. There is a quiet rebellion in something made slowly, kept long, and loved every day. That is the only thing we make here.
        </p>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span className="serif italic" style={{ fontSize: 30, color: STORY_INK, lineHeight: 1.1, whiteSpace: 'nowrap' }}>Rosie Vu</span>
          <span style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Founder · Atelier Florist</span>
        </div>
      </div>
    </section>

    {/* CTA back to shop */}
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
        <h3 className="serif" style={{ fontSize: 42, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 26px', color: STORY_INK }}>
          Find a stem to <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>keep.</span>
        </h3>
        <div style={{ display: 'inline-flex', gap: 14 }}>
          <button className="btn btn-primary" onClick={() => navigate('shop')}>Browse the atelier <Icon name="arrow-right" size={16} /></button>
          <button className="btn btn-secondary" onClick={() => navigate('home')}>Back to home</button>
        </div>
      </div>
    </section>
  </div>;


const StoryChapter = ({ no, eyebrow, title, body, img, imgRight }) =>
<section style={{ padding: '24px 56px 88px' }}>
    <div style={{
    maxWidth: 1200, margin: '0 auto',
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center'
  }}>
      <div className="card" style={{
      padding: '48px 52px', color: STORY_INK,
      order: imgRight ? 1 : 2
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <span className="serif italic" style={{ fontSize: 28, color: 'var(--muted)', letterSpacing: '0.02em', fontWeight: 500 }}>Nº {no}</span>
          <span style={{ flex: 1, height: 1, background: 'var(--hairline-strong)' }}></span>
          <span style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>{eyebrow}</span>
        </div>
        <h2 className="serif" style={{ fontSize: 'clamp(36px, 3.6vw, 48px)', fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 24px', color: STORY_INK }}>
          {title}
        </h2>
        {body.map((para, i) =>
      <p key={i} style={{ fontSize: 16, lineHeight: 1.75, color: STORY_INK, margin: i === 0 ? '0 0 16px' : '0 0 16px', textWrap: 'pretty' }}>
            {para}
          </p>
      )}
      </div>
      <div className="img-elevated" style={{
      borderRadius: 18, overflow: 'hidden',
      aspectRatio: '4/5', background: FALLBACK_BG,
      order: imgRight ? 2 : 1,
      boxShadow: '0 20px 40px -18px rgba(43,29,24,0.28), 0 50px 90px -40px rgba(43,29,24,0.18)'
    }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={(e) => {e.target.style.display = 'none';}} />
      </div>
    </div>
  </section>;


const StoryStat = ({ big, unit, label }) =>
<div>
    <div className="serif" style={{ fontSize: 'clamp(48px, 5vw, 64px)', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em', color: STORY_INK, display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
      {big}
      {unit && <span style={{ fontSize: '0.4em', color: 'var(--muted)', fontWeight: 400, fontStyle: 'italic' }}>{unit}</span>}
    </div>
    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, letterSpacing: '0.01em' }}>{label}</div>
  </div>;


Object.assign(window, { HomePage, ShopPage, StoryPage });
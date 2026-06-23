import { useState, useEffect, useMemo } from 'react';
import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import { useProducts } from '../lib/stores';
import { CollectionCard, CollectionCarousel } from './ShopPage';
import { DRAG_ROWS } from '../lib/collections';

// =========================================================
// CURTAIN DIVIDER — draped fabric transition pink → white
// =========================================================
const CurtainFloral = () =>
<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 7 C13 7 11 14 15 18 C12 22 16 27 20 25 C24 27 28 22 25 18 C29 14 27 7 20 7 Z" />
    <path d="M20 11 C17 12 16 16 19 18 C17 20 19 23 21 22 C24 22 24 18 22 17" />
    <path d="M20 25 L20 35" />
    <path d="M20 30 C16 29 13 31 12 34 C15 34 18 33 20 30 Z" />
    <path d="M20 28 C24 27 27 29 28 32 C25 32 22 31 20 28 Z" />
  </svg>;

const CurtainDivider = () =>
<div className="shop-curtain" aria-hidden="true">
    <svg className="curtain-fabric" viewBox="0 0 1440 112" preserveAspectRatio="none">
      {/* soft shadow cast onto the pink above */}
      <path
      d="M0 112 L0 80 C60 62 110 48 170 48 C250 48 300 62 360 60 C430 57 490 42 560 32 C620 24 670 20 720 20 C770 20 820 24 880 32 C950 42 1010 57 1080 60 C1140 62 1190 48 1270 48 C1330 48 1380 62 1440 80 L1440 112 Z"
      fill="rgba(43,29,24,0.06)" transform="translate(0,5)" />
      {/* cream fabric */}
      <path
      d="M0 112 L0 78 C60 60 110 46 170 46 C250 46 300 60 360 58 C430 55 490 40 560 30 C620 22 670 18 720 18 C770 18 820 22 880 30 C950 40 1010 55 1080 58 C1140 60 1190 46 1270 46 C1330 46 1380 60 1440 78 L1440 112 Z"
      fill="var(--surface-soft)" />
      {/* subtle pleat folds */}
      <g stroke="rgba(43,29,24,0.045)" strokeWidth="1.5" fill="none">
        <path d="M170 50 L150 112" />
        <path d="M360 60 L370 112" />
        <path d="M560 34 L545 112" />
        <path d="M720 20 L720 112" />
        <path d="M880 34 L895 112" />
        <path d="M1080 60 L1070 112" />
        <path d="M1270 50 L1290 112" />
      </g>
      {/* highlight sheen along the hem */}
      <path
      d="M0 78 C60 60 110 46 170 46 C250 46 300 60 360 58 C430 55 490 40 560 30 C620 22 670 18 720 18 C770 18 820 22 880 30 C950 40 1010 55 1080 58 C1140 60 1190 46 1270 46 C1330 46 1380 60 1440 78"
      fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
    </svg>
    <span className="shop-curtain-floral left"><CurtainFloral /></span>
    <span className="shop-curtain-floral right"><CurtainFloral /></span>
  </div>;

// =========================================================
// TORN EDGE — irregular torn-paper transition between sections
// =========================================================
const TornEdge = ({ fromColor, toColor, flip = false }) => {
  // Jagged irregular path, like torn paper — randomized-looking but fixed for consistency
  const path = "M0,18 L48,9 L96,22 L144,5 L192,16 L240,3 L288,20 L336,8 L384,24 L432,6 L480,17 L528,2 L576,21 L624,9 L672,15 L720,4 L768,19 L816,7 L864,23 L912,10 L960,16 L1008,3 L1056,20 L1104,8 L1152,14 L1200,5 L1248,18 L1296,9 L1344,22 L1392,6 L1440,16 L1440,40 L0,40 Z";
  return (
    <div aria-hidden="true" style={{ position: 'relative', lineHeight: 0, background: fromColor, transform: flip ? 'scaleY(-1)' : undefined }}>
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 28 }}>
        <path d={path} fill={toColor} />
      </svg>
    </div>
  );
};

// =========================================================
// HERO SLIDESHOW — random picks from the product catalogue,
// crossfade + Ken Burns. Falls back to a few hardcoded shots
// if the database hasn't loaded any products with images yet.
// =========================================================
const FALLBACK_HERO_SLIDES = [
{ src: '/products/coral-peony.jpg', name: 'Coral Peony Bloom' },
{ src: '/products/spring-lush.jpg', name: 'Spring Lush' },
{ src: '/products/magenta-garden.jpg', name: 'Magenta Garden' },
{ src: '/products/ivory-tulip.jpg', name: 'Ivory Tulip Pot' },
{ src: '/products/crimson-orchid.jpg', name: 'Crimson & Orchid' }];

// Fisher–Yates shuffle, returns a new array
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const HeroSlideshow = ({ products = [] }) => {
  // Pick up to 10 random products that actually have an image,
  // re-shuffled only when the product list itself changes.
  const slides = useMemo(() => {
    const withImages = products.filter((p) => p.img);
    if (withImages.length === 0) return FALLBACK_HERO_SLIDES;
    return shuffle(withImages).slice(0, 10).map((p) => ({
      src: /^https?:\/\//.test(p.img) ? p.img : '/' + p.img,
      name: p.name,
    }));
  }, [products]);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => { setIdx(0); }, [slides]);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5400);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  return (
    <div className="hero-frame"
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{ width: "100%", margin: "0 auto", padding: "5px" }}>
      <div className="hero-window hero-slideshow">
        {slides.map((s, i) =>
        <img key={s.src + i} src={s.src} alt={s.name}
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
          <div className="serif italic" style={{ fontSize: 36, fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{slides[idx]?.name}</div>
        </div>

        {/* Progress segments — bottom */}
        <div style={{ position: 'absolute', left: 32, right: 32, bottom: 30, display: 'flex', gap: 6, zIndex: 5 }}>
          {slides.map((_, i) =>
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
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null); // { code, email }
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const val = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: val }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      // Code is sent via email — show confirmation without exposing code on screen
      setSent({ email: val });
    } catch (err) {
      setError(err.message || 'Could not subscribe — please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto', padding: '44px 44px 40px', textAlign: 'center', background: '#fff' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: '#e3efdc', color: '#5a7a4a', marginBottom: 22 }}>
          <Icon name="check" size={26} />
        </div>
        <div style={{ fontSize: 11.5, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', marginBottom: 12 }}>Welcome gift sent</div>
        <h3 className="serif" style={{ fontSize: 30, fontWeight: 500, margin: '0 0 12px', letterSpacing: '-0.01em' }}>Check your inbox!</h3>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 22px' }}>
          Your $10 discount code is on its way to<br /><strong style={{ color: 'var(--ink)' }}>{sent.email}</strong>.
        </p>
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
        onChange={(e) => {setEmail(e.target.value);if (error) setError('');}} style={{ background: '#fff' }} required />
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Subscribe'}</button>
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
            <span className="pill" style={{ textAlign: "left", flexDirection: "row" }}><span className="pill-dot"></span>Rosie's Boutique · Melbourne</span>
            <h1 className="serif" style={{ lineHeight: 1.02, margin: '36px 0 28px', fontWeight: 500, letterSpacing: '-0.02em', fontSize: "clamp(44px, 11vw, 120px)" }}>
              Everlasting{' '}
              <span className="italic" style={{ color: '#5a4a40', fontWeight: 400, fontSize: "clamp(36px, 9vw, 100px)" }}>Floral.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 460, margin: '0 0 38px' }}>

            </p>
            <div style={{ display: 'flex', gap: 14, marginBottom: 64 }}>
              <button className="btn btn-primary" onClick={() => navigate('shop')}>
                Shop Now <Icon name="arrow-right" size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('shop')}>Explore Collections</button>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderRadius: 999, background: 'rgba(43,29,24,0.04)', border: '1px solid rgba(43,29,24,0.14)' }}>
              <span style={{ color: 'var(--accent)', fontSize: 17 }}>✦</span>
              <span className="serif italic" style={{ fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Crafted to be cherished, gifted to be remembered</span>
            </div>
          </div>
          {/* Right */}
          <div style={{ position: 'relative' }}>
            <HeroSlideshow products={products} />
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
      <TornEdge fromColor="var(--bg-pink)" toColor="var(--surface-soft)" />

      {/* Featured collections strip */}
      <section style={{ background: 'var(--surface-soft)', padding: '80px 0', position: 'relative' }}>
        <CurtainDivider />
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow muted">Curated Collections</span>
              <h2>Shop by <span className="italic">moment</span></h2>
            </div>
          </div>
          <div className="grid-4">
            <CollectionCard title="Bouquets" img="/images/cat-bouquets.png" collection="bouquets" navigate={navigate} />
            <CollectionCard title="Luxe Vase Arrangements" img="/images/cat-vase.png" collection="luxe-vase-arrangements" navigate={navigate} />
            <CollectionCard title="Event and Corporate Hire" img="/images/cat-event.png" collection="event-corporate-hire" navigate={navigate} />
            <CollectionCard title="Wedding Hire" img="/images/cat-wedding.png" collection="wedding-hire" navigate={navigate} />
          </div>
        </div>
      </section>
      <TornEdge fromColor="var(--surface-soft)" toColor="var(--bg-pink)" />

      {/* Value props */}
      <section style={{ background: 'var(--bg-pink)', padding: "44px 0" }}>
        <div className="container" style={{ padding: "0px 56px" }}>
          <div className="grid-3" style={{ gap: 32, maxWidth: 880, margin: '0 auto', justifyItems: 'center' }}>
            <ValueProp icon="leaf" title="Botanically accurate" body="Petal-perfect silk replicas designed from real blooms." />
            <ValueProp icon="sparkle" title="Lasts a lifetime" body="Artificial florals that hold their colour 5+ years." />
            <ValueProp icon="shield" title="Easy care" body="Keep away from dust, humid and direct sun light." />
          </div>
        </div>
      </section>
      <TornEdge fromColor="var(--bg-pink)" toColor="var(--surface-soft)" />

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
      <TornEdge fromColor="var(--surface-soft)" toColor="var(--bg-pink)" />

      {/* Customer reviews */}
      <section style={{ padding: '100px 0', background: 'var(--bg-pink)' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: 720, margin: '0 auto 36px' }}>
            <h2 className="serif" style={{ fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.08, margin: 0 }}>
              What our customers are <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>saying</span>
            </h2>
          </div>

          <div className="g-rating-card">
            <div className="g-rating-info">
              <div className="g-rating-top">
                <Icon name="google" size={24} />
                <span className="g-rating-score">5.0</span>
              </div>
              <div className="review-stars" aria-label="Rated 5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ color: 'var(--accent)' }}><Icon name="star" size={18} /></span>)}
              </div>
              <span className="g-rating-label">Google Reviews</span>
            </div>
            <a className="btn btn-primary" href="https://search.google.com/local/writereview?placeid=ChIJcx1ml0_11moRlHCNketlykk" target="_blank" rel="noopener noreferrer">
              Write a review
            </a>
          </div>

          <div className="reviews-row">
            {REVIEWS.map((r) => <ReviewCard key={r.name} name={r.name} date={r.date} text={r.text} />)}
          </div>
        </div>
      </section>
      <TornEdge fromColor="var(--bg-pink)" toColor="var(--bg-cream)" />

      {/* Editorial split */}
      <section style={{ padding: '100px 0', background: 'var(--bg-cream)' }}>
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
              Each arrangement is composed with an artist's eye for colour, form and balance — designed to feel like a living bouquet, without ever fading. It's a small, considered luxury: beauty that stays exactly as you fell in love with it, season after season.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('story')}>Read our story <Icon name="arrow-right" size={16} /></button>
          </div>
        </div>
      </section>
      <TornEdge fromColor="var(--bg-cream)" toColor="var(--bg-pink)" />

      {/* Newsletter */}
      <section style={{ padding: '90px 0', background: 'var(--bg-pink)' }}>
        <div className="container text-center" style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: 56, fontWeight: 500, margin: '0 0 18px', letterSpacing: '-0.02em' }}>
            Letters from <span className="italic">us</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginBottom: 32 }}>Seasonal stories, new arrivals and a $10 welcome gift.</p>
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
    <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5, margin: '0 6px', maxWidth: 240 }}>{body}</p>
  </div>;


// =========================================================
// CUSTOMER REVIEWS
// =========================================================
const REVIEWS = [
{ name: 'Sarah M.', date: '2 weeks ago', text: "Absolutely stunning arrangement — I've had it for over a year and it still looks as fresh as the day it arrived. Everyone asks if they're real!" },
{ name: 'Jessica T.', date: '1 month ago', text: "Ordered for my mum's birthday and she cried happy tears. The quality is incredible and the packaging was so beautiful." },
{ name: 'Emma R.', date: '3 weeks ago', text: 'My guests genuinely thought these were real flowers. The attention to detail is extraordinary. Will be ordering again!' },
{ name: 'Olivia K.', date: '2 months ago', text: 'Fast delivery, beautifully packaged and the arrangement is even more stunning in person. Absolutely love it.' }];


const ReviewCard = ({ name, date, text }) =>
<div className="review-card">
    <div className="review-head">
      <div className="review-avatar-initial" aria-hidden="true">{name.trim().charAt(0)}</div>
      <div className="review-meta">
        <div className="review-name">{name}</div>
        <div className="review-time">{date}</div>
      </div>
    </div>
    <div className="review-stars" aria-label="Rated 5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ color: 'var(--accent)' }}><Icon name="star" size={15} /></span>)}
    </div>
    <p className="review-text">{text}</p>
  </div>;


export default HomePage;

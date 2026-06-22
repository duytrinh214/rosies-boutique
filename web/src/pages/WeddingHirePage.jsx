import { useNav } from '../lib/nav';
import Icon from '../components/Icon';

// =========================================================
// WEDDING HIRE — editorial landing page in Rosie's house style
// (warm pink/cream, serif display, torn-paper section seams).
// Content structure inspired by a full-service wedding florist:
// hero → intro → gallery → philosophy → packages → CTA.
// =========================================================

const TornEdge = ({ fromColor, toColor, flip = false }) => {
  const path = "M0,18 L48,9 L96,22 L144,5 L192,16 L240,3 L288,20 L336,8 L384,24 L432,6 L480,17 L528,2 L576,21 L624,9 L672,15 L720,4 L768,19 L816,7 L864,23 L912,10 L960,16 L1008,3 L1056,20 L1104,8 L1152,14 L1200,5 L1248,18 L1296,9 L1344,22 L1392,6 L1440,16 L1440,40 L0,40 Z";
  return (
    <div aria-hidden="true" style={{ position: 'relative', lineHeight: 0, background: fromColor, transform: flip ? 'scaleY(-1)' : undefined }}>
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 28 }}>
        <path d={path} fill={toColor} />
      </svg>
    </div>
  );
};

const GALLERY = [
  { src: '/products/calla-cascade.jpg', label: 'Cascading calla & orchid' },
  { src: '/products/ivory-tulip.jpg', label: 'Ivory tulip bridal posy' },
  { src: '/products/burgundy-crescent.jpg', label: 'Burgundy crescent bouquet' },
  { src: '/products/coral-peony.jpg', label: 'Coral peony arrangement' },
  { src: '/products/crimson-orchid.jpg', label: 'Crimson orchid statement' },
];

const WeddingHirePage = () => {
  const { navigate } = useNav();
  const enquire = () => navigate('contact');

  return (
    <div className="page-fade">
      {/* ===== HERO ===== */}
      <section style={{ padding: '72px 56px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
          <span className="pill"><span className="pill-dot"></span>Weddings & Celebrations</span>
          <h1 className="serif" style={{ lineHeight: 1.04, margin: '28px 0 20px', fontWeight: 500, letterSpacing: '-0.02em', fontSize: 'clamp(40px, 8vw, 96px)' }}>
            Wedding{' '}
            <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>Flowers.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 580, margin: '0 auto 34px' }}>
            It is our privilege to help you express your love through flowers — everlasting arrangements,
            made to be cherished long after the day is over.
          </p>
          <button className="btn btn-primary" onClick={enquire}>
            Enquire now <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </section>

      {/* hero image band */}
      <section style={{ padding: '24px 56px 64px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', borderRadius: 22, overflow: 'hidden', position: 'relative', aspectRatio: '16 / 7', boxShadow: '0 40px 80px -40px rgba(43,29,24,0.4)' }}>
          <img src="/products/spring-lush.jpg" alt="Lush spring wedding florals" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(43,29,24,0.35), transparent 50%)' }}></div>
          <div style={{ position: 'absolute', left: 40, bottom: 36, color: '#fff' }}>
            <span style={{ letterSpacing: '0.22em', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Studio Rosie · Weddings</span>
            <div className="serif italic" style={{ fontSize: 'clamp(24px, 4vw, 40px)', marginTop: 6 }}>Made with love, kept forever</div>
          </div>
        </div>
      </section>

      <TornEdge fromColor="var(--bg-pink)" toColor="var(--surface-soft)" />

      {/* ===== INTRO: Wedding Flowers Melbourne ===== */}
      <section style={{ background: 'var(--surface-soft)', padding: '76px 56px' }}>
        <div className="wh-split" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <h2 className="serif" style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 500, letterSpacing: '-0.01em', margin: '0 0 24px' }}>
              Wedding Flowers Melbourne
            </h2>
            <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 18px' }}>
              Your wedding day is one of your most memorable days, filled with beautiful moments
              shared with your nearest and dearest.
            </p>
            <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 18px' }}>
              We love being part of making your day as beautiful as you have always dreamt. Weddings
              come in all shapes and sizes — from an intimate ceremony to a full-scale celebration —
              and we cater to them all.
            </p>
            <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
              As a full-service wedding florist in Melbourne, we design arrangements for every part
              of the day, from the ceremony through to the reception.
            </p>
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '4 / 5', boxShadow: '0 30px 60px -36px rgba(43,29,24,0.4)' }}>
            <img src="/products/atelier-watercolor.jpg" alt="Wedding ceremony arch florals" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      <TornEdge fromColor="var(--surface-soft)" toColor="var(--bg-cream)" />

      {/* ===== GALLERY ===== */}
      <section style={{ background: 'var(--bg-cream)', padding: '76px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ letterSpacing: '0.22em', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: 'var(--accent)' }}>The Lookbook</span>
            <h2 className="serif" style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 500, margin: '10px 0 0' }}>A glimpse of our work</h2>
          </div>
          <div className="wh-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {GALLERY.map((g) => (
              <figure key={g.src} className="wh-gallery-item" style={{ margin: 0, borderRadius: 16, overflow: 'hidden', aspectRatio: '3 / 4', position: 'relative' }}>
                <img src={g.src} alt={g.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 600ms cubic-bezier(.2,.8,.2,1)' }} />
                <figcaption style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '24px 14px 12px', fontSize: 12.5, color: '#fff', background: 'linear-gradient(to top, rgba(43,29,24,0.6), transparent)' }}>{g.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <TornEdge fromColor="var(--bg-cream)" toColor="var(--bg-pink)" />

      {/* ===== MADE WITH LOVE ===== */}
      <section style={{ background: 'var(--bg-pink)', padding: '76px 56px' }}>
        <div className="wh-split wh-split-rev" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '4 / 5', boxShadow: '0 30px 60px -36px rgba(43,29,24,0.4)' }}>
            <img src="/products/teacup-romance.jpg" alt="Romantic reception florals" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 className="serif" style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 500, letterSpacing: '-0.01em', margin: '0 0 24px' }}>
              Made with love
            </h2>
            <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 18px' }}>
              Our experience ensures the standard for weddings is always high. We take time and care
              with every arrangement, making pieces that look beautiful in person and just as
              glamorous in your wedding photos.
            </p>
            <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 18px' }}>
              Because our flowers are artificial, they hold their shape and colour perfectly through
              the longest day — and stay as a keepsake for years to come.
            </p>
            <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 30px' }}>
              With an experienced team and an eye for timeless, modern florals, we love working with
              you to create show pieces for your special day.
            </p>
            <button className="btn btn-secondary" onClick={enquire}>Enquire now</button>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '72px 56px 96px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: 'clamp(30px, 6vw, 60px)', fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 18px' }}>
            Let's create your <span className="italic" style={{ color: '#5a4a40' }}>floral story</span>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 32px' }}>
            Tell us about your day — the season, the venue, and your vision — and we'll design
            something that reflects a piece of you.
          </p>
          <button className="btn btn-primary" onClick={enquire}>
            Start your enquiry <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default WeddingHirePage;

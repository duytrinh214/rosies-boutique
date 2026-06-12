import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import { FALLBACK_BG } from '../lib/products';

// =========================================================
// OUR STORY
// =========================================================
const STORY_INK = '#2b1d18';

const StoryPage = () => {
  const { navigate } = useNav();
  return (
  <div className="page-fade" style={{ color: STORY_INK }}>
    {/* HERO */}
    <section className="story-pad" style={{ padding: '64px 56px 24px' }}>
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
    <section className="story-pad" style={{ padding: '0 56px 56px' }}>
      <div className="img-elevated" style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 22, overflow: 'hidden', aspectRatio: '21/9', background: FALLBACK_BG, boxShadow: '0 20px 40px -18px rgba(43,29,24,0.28), 0 50px 90px -40px rgba(43,29,24,0.18)' }}>
        <img src="/products/spring-lush.jpg" alt="The Rosie's Boutique atelier"
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
    img="/products/coral-peony.jpg"
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
    img="/products/studio-pink.jpg"
    imgRight={false} />


    {/* Stat strip */}
    <section className="story-stat-strip" style={{ background: '#fff', padding: '56px 56px', margin: '0 56px 88px', borderRadius: 28, boxShadow: '0 16px 30px -22px rgba(43,29,24,0.22)' }}>
      <div className="g-stack-2" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center', color: STORY_INK }}>
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
    img="/products/burgundy-crescent.jpg"
    imgRight={true} />


    {/* Atelier image pair — two photos with caption between */}
    <section className="story-pad" style={{ padding: '0 56px 88px' }}>
      <div className="g-stack" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <div className="img-elevated" style={{ borderRadius: 18, overflow: 'hidden', aspectRatio: '4/5', background: FALLBACK_BG }}>
          <img src="/products/ivory-tulip.jpg" alt="Hand-cutting petals" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {e.target.style.display = 'none';}} />
        </div>
        <div className="img-elevated" style={{ borderRadius: 18, overflow: 'hidden', aspectRatio: '4/5', background: FALLBACK_BG }}>
          <img src="/products/calla-cascade.jpg" alt="Dyeing in small batches" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {e.target.style.display = 'none';}} />
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
    img="/products/magenta-garden.jpg"
    imgRight={false} />


    {/* Founder's note */}
    <section className="story-pad" style={{ padding: '0 56px 88px' }}>
      <div className="card story-card" style={{ maxWidth: 880, margin: '0 auto', padding: '64px 72px', textAlign: 'center', color: STORY_INK }}>
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
    <section className="story-pad" style={{ padding: '0 56px 100px' }}>
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
  </div>);
};


const StoryChapter = ({ no, eyebrow, title, body, img, imgRight }) =>
<section className="story-pad" style={{ padding: '24px 56px 88px' }}>
    <div style={{
    maxWidth: 1200, margin: '0 auto',
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center'
  }}
  className="g-stack">
      <div className="card story-card" style={{
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


export default StoryPage;

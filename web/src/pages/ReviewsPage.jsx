import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import Stars from '../components/Stars';
import { PRODUCTS, FALLBACK_BG } from '../lib/products';

// =========================================================
// REVIEWS (Google reviews)
// =========================================================
// TODO: Replace with the real Google Business Profile placeId and URLs before launch.
// `profileUrl` opens the public profile; `writeReviewUrl` deep-links straight to the
// "write a review" composer for the "Write a review" CTA below.
const GOOGLE_BUSINESS = {
  placeId: 'YOUR_GOOGLE_PLACE_ID',
  profileUrl: 'https://www.google.com/maps/search/?api=1&query=Rosie%27s+Boutique',
  writeReviewUrl: 'https://search.google.com/local/writereview?placeid=YOUR_GOOGLE_PLACE_ID'
};

const ReviewsPage = () => {
  const { navigate } = useNav();
  // In production: const [reviews, setReviews] = useState([]); useEffect(() => fetch(...).then(setReviews), []);
  // For the prototype the array is seeded from sample Google reviews — set to [] to preview the empty state,
  // or toggle via ?empty=1 in the URL hash.
  const previewEmpty = typeof window !== 'undefined' && window.location.hash.includes('empty');
  const seeded = [
  { name: 'Linh Pham', avatar: 'L', date: '2 days ago', rating: 5, body: 'The Sunset Atelier is absolutely stunning. It arrived hand-tied with the most beautiful raw silk ribbon and the petals look unbelievably real. My mother thought it was a fresh bouquet at first glance.', likes: 24, photos: [PRODUCTS[0].img] },
  { name: 'Henry Nguyen', avatar: 'H', date: '5 days ago', rating: 5, body: "I've been buying from Rosie's Boutique for over two years and the craftsmanship has only gotten better. The peony cluster I ordered for my wife's birthday was a wow moment.", likes: 41, photos: [] },
  { name: 'Mia Tran', avatar: 'M', date: '1 week ago', rating: 5, body: 'The atelier guarantee is the real deal. They refreshed my one-year-old bouquet and it looks brand new. Customer service is warm, fast, and genuinely lovely.', likes: 18, photos: [] },
  { name: 'David Le', avatar: 'D', date: '2 weeks ago', rating: 4, body: 'Beautiful piece, though slightly smaller than I expected — would recommend sizing up for a coffee-table centerpiece. The packaging was immaculate.', likes: 9, photos: [PRODUCTS[4].img] },
  { name: 'Sophie Bui', avatar: 'S', date: '3 weeks ago', rating: 5, body: 'Ordered the Spring Lush for a wedding centerpiece. The presentation was magazine-worthy and the bride cried. Will be back for every milestone moment.', likes: 56, photos: [PRODUCTS[11].img, PRODUCTS[5].img] },
  { name: 'Anna Vu', avatar: 'A', date: '1 month ago', rating: 5, body: 'Same-day delivery within two hours, communication was perfect, and the calla cascade smells faintly of orange blossom. A small business doing things properly.', likes: 32, photos: [] }];

  const reviews = previewEmpty ? [] : seeded;

  const total = reviews.length > 0 ? 2841 : 0;
  const avg = reviews.length > 0 ? 4.9 : 0;
  const dist = [
  { stars: 5, pct: 92 },
  { stars: 4, pct: 6 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 0.5 },
  { stars: 1, pct: 0.5 }];


  const lastSynced = 'just now';
  const hasReviews = reviews.length > 0;

  return (
    <div className="page-fade">
      <section style={{ padding: '64px 56px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
            <button
              onClick={() => navigate('reviews', previewEmpty ? {} : { id: 'empty' })}
              style={{ background: 'transparent', border: '1px dashed var(--hairline-strong)', borderRadius: 999, padding: '5px 12px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 600, cursor: 'pointer' }}
              title="Toggle a preview of the page when Google has not synced any reviews yet">
              Preview: {previewEmpty ? 'with reviews' : 'no reviews yet'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: hasReviews ? '1.2fr 1fr' : '1fr', gap: 56, alignItems: 'start', marginBottom: 56 }}>
            <div>
              <span className="pill"><span className="pill-dot"></span>From our community</span>
              <h1 className="serif" style={{ fontSize: 80, fontWeight: 500, lineHeight: 1.02, margin: '24px 0 18px', letterSpacing: '-0.02em' }}>
                {hasReviews ?
                <>Loved by <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>thousands.</span></> :

                <>The first <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>chapter</span></>
                }
              </h1>
              <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: 540, lineHeight: 1.5, margin: '0 0 14px' }}>
                Real reviews from real customers, syndicated directly from our Google Business Profile.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--muted)' }}>
                <Icon name="google" size={14} />
                <span>Synced from Google · last updated {lastSynced}</span>
              </div>
            </div>

            {/* Summary card — only when there are reviews */}
            {hasReviews &&
            <div className="card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <Icon name="google" size={28} />
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>Verified by</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Google Reviews</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                  <span className="serif" style={{ fontSize: 72, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em' }}>{avg}</span>
                  <div>
                    <Stars value={avg} size={18} />
                    <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>based on {total.toLocaleString()} reviews</div>
                  </div>
                </div>
                <hr className="divider" />
                {dist.map((d) =>
              <div key={d.stars} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: 13 }}>
                    <span style={{ width: 14, color: 'var(--muted)' }}>{d.stars}</span>
                    <Icon name="star" size={12} />
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-pill)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: d.pct + '%', height: '100%', background: 'var(--ink)' }}></div>
                    </div>
                    <span className="muted" style={{ width: 36, textAlign: 'right' }}>{d.pct}%</span>
                  </div>
              )}
              </div>
            }
          </div>

          {hasReviews ?
          <>
              {/* Filter chips */}
              <div className="chip-strip" style={{ marginBottom: 36 }}>
                {['All reviews', 'Most recent', '5 stars', 'With photos', 'Bouquets', 'Gifts', 'Delivery'].map((c, i) =>
              <button key={c} className={'chip' + (i === 0 ? ' active' : '')}>{c}</button>
              )}
              </div>

              {/* Reviews grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 48 }}>
                {reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
              </div>

              <div className="text-center">
                <button className="btn btn-secondary">Show more reviews <Icon name="chevron-down" size={16} /></button>
              </div>

              {/* CTA — write a review on Google */}
              <div style={{ marginTop: 80, padding: 56, background: '#fff', borderRadius: 28, display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
                <div>
                  <h2 className="serif" style={{ fontSize: 40, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
                    Loved your <span className="italic">bouquet?</span>
                  </h2>
                  <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginTop: 12, marginBottom: 0 }}>
                    Share your story on Google — it means the world to a small studio like ours.
                  </p>
                </div>
                <a href={GOOGLE_BUSINESS.writeReviewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <Icon name="google" size={15} /> Write a review <Icon name="arrow-right" size={16} />
                </a>
              </div>
            </> :

          <EmptyReviewsState />
          }
        </div>
      </section>
    </div>);

};

const EmptyReviewsState = () =>
<div className="card" style={{ padding: '88px 80px', textAlign: 'center', maxWidth: 960, margin: '0 auto' }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 76, height: 76, borderRadius: '50%', background: 'var(--bg-pill)', marginBottom: 24 }}>
      <Icon name="google" size={34} />
    </div>
    <h2 className="serif" style={{ fontSize: 48, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 18px', color: 'var(--ink)' }}>
      No reviews <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>yet.</span>
    </h2>
    <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 36px' }}>
      Our Google Business Profile hasn't received any reviews so far. If you've ordered from our atelier, we would be honoured to read your thoughts — every word helps a small studio like ours.
    </p>
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <a href={GOOGLE_BUSINESS.writeReviewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary"
      style={{ whiteSpace: 'nowrap', padding: '16px 30px', fontSize: 14.5 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0 }}>
          <Icon name="google" size={18} />
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>Share your story on Google</span>
        <Icon name="arrow-right" size={15} />
      </a>
      <a href={GOOGLE_BUSINESS.profileUrl} target="_blank" rel="noopener noreferrer"
      style={{ fontSize: 12.5, color: 'var(--muted)', letterSpacing: '0.02em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        View our Google Business Profile
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
      </a>
    </div>
  </div>;

const ReviewCard = ({ review }) =>
<article className="card" style={{ padding: 26 }}>
    <header style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
        {review.avatar}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500, fontSize: 15 }}>{review.name}</span>
          <Icon name="google" size={14} />
        </div>
        <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{review.date}</div>
      </div>
      <Stars value={review.rating} size={14} />
    </header>
    <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 14px' }}>{review.body}</p>
    {review.photos.length > 0 &&
  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {review.photos.map((p, i) =>
    <div key={i} className="img-elevated-sm" style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', background: FALLBACK_BG }}>
            <img src={'/' + p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {e.target.style.display = 'none';}} />
          </div>
    )}
      </div>
  }
    <div style={{ display: 'flex', gap: 16, paddingTop: 14, borderTop: '1px solid var(--hairline)', fontSize: 13, color: 'var(--muted)' }}>
      <button style={{ background: 'none', border: 'none', display: 'inline-flex', gap: 6, alignItems: 'center', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
        <Icon name="heart" size={14} /> {review.likes} helpful
      </button>
      <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Reply</button>
    </div>
  </article>;


export default ReviewsPage;

/* global React */
// Shared data + components for Fleur store

const { useState, useEffect, useMemo, useRef } = React;

// ============ DATA ============
const PRODUCTS = [
{ id: 'sunset-atelier', name: 'Sunset Atelier', category: 'Bouquets', price: 92, img: 'products/sunset-atelier.jpg', tag: 'New', rating: 4.9, reviews: 184, palette: ['Coral', 'Ivory', 'Champagne'], description: "A warm coral, peach and ivory hand-tied composition centered on a hand-shaped chrysanthemum. Wrapped in raw silk ribbon, set in our signature gift vessel.", details: ['Mixed silk roses, cosmos & chrysanthemum', 'Hand-tied with silk & satin ribbon', 'Approx. 28 × 26 cm', 'Made to last 5+ years'], sizes: ['Petite', 'Standard', 'Grand'] },
{ id: 'magenta-garden', name: 'Magenta Garden', category: 'Bouquets', price: 108, img: 'products/magenta-garden.jpg', tag: 'Bestseller', rating: 4.9, reviews: 312, palette: ['Magenta', 'Blush', 'Coral'] },
{ id: 'graduation-lily', name: 'Graduation Lily', category: 'Gifts', price: 86, img: 'products/graduation-lily.jpg', tag: 'Gift', rating: 4.8, reviews: 142, palette: ['Coral', 'Ivory'] },
{ id: 'burgundy-crescent', name: 'Burgundy Crescent', category: 'Bouquets', price: 96, img: 'products/burgundy-crescent.jpg', rating: 4.9, reviews: 220, palette: ['Burgundy', 'Ivory'] },
{ id: 'studio-pink', name: 'Studio Pink Bundle', category: 'Bouquets', price: 74, img: 'products/studio-pink.jpg', tag: 'New', rating: 4.8, reviews: 76, palette: ['Blush', 'Ivory'] },
{ id: 'sunshine-bear', name: 'Sunshine Bear', category: 'Gifts', price: 68, img: 'products/sunshine-bear.jpg', tag: 'Gift', rating: 4.8, reviews: 98, palette: ['Mint', 'Champagne'] },
{ id: 'ivory-tulip', name: 'Ivory Tulip Pot', category: 'Bouquets', price: 112, img: 'products/ivory-tulip.jpg', rating: 4.9, reviews: 167, palette: ['Ivory', 'Champagne'] },
{ id: 'coral-peony', name: 'Coral Peony Bloom', category: 'Bouquets', price: 124, img: 'products/coral-peony.jpg', tag: 'Bestseller', rating: 4.9, reviews: 248, palette: ['Coral', 'Blush'] },
{ id: 'teacup-romance', name: 'Teacup Romance', category: 'Gifts', price: 58, img: 'products/teacup-romance.jpg', tag: 'Gift', rating: 4.7, reviews: 62, palette: ['Blush', 'Ivory'] },
{ id: 'calla-cascade', name: 'Calla Cascade', category: 'Bouquets', price: 98, img: 'products/calla-cascade.jpg', tag: 'New', rating: 4.8, reviews: 89, palette: ['Coral', 'Ivory'] },
{ id: 'crimson-orchid', name: 'Crimson & Orchid', category: 'Bouquets', price: 116, img: 'products/crimson-orchid.jpg', rating: 4.9, reviews: 134, palette: ['Burgundy', 'Ivory'] },
{ id: 'spring-lush', name: 'Spring Lush', category: 'Bouquets', price: 128, img: 'products/spring-lush.jpg', rating: 5.0, reviews: 41, palette: ['Magenta', 'Coral', 'Ivory'] },
{ id: 'amber-protea', name: 'Amber Protea', category: 'Bouquets', price: 94, img: 'products/sunset-atelier.jpg', tag: 'New', rating: 4.8, reviews: 73, palette: ['Amber', 'Coral', 'Ivory'] },
{ id: 'jade-orchid', name: 'Jade Orchid Jar', category: 'Bouquets', price: 120, img: 'products/ivory-tulip.jpg', tag: 'New', rating: 4.9, reviews: 58, palette: ['Lime', 'Ivory'] },
{ id: 'rose-tote', name: 'Rosé Posy Tote', category: 'Gifts', price: 88, img: 'products/magenta-garden.jpg', tag: 'Gift', rating: 4.9, reviews: 121, palette: ['Blush', 'Magenta'] },
{ id: 'peony-cascade', name: 'Peony Cascade', category: 'Bouquets', price: 118, img: 'products/coral-peony.jpg', rating: 4.9, reviews: 96, palette: ['Coral', 'Blush', 'Ivory'] },
{ id: 'golden-graduate', name: 'Golden Graduate', category: 'Gifts', price: 90, img: 'products/graduation-lily.jpg', tag: 'Gift', rating: 4.8, reviews: 64, palette: ['Coral', 'Ivory'] },
{ id: 'sunbeam-bundle', name: 'Sunbeam Bundle', category: 'Bouquets', price: 80, img: 'products/studio-pink.jpg', rating: 4.7, reviews: 52, palette: ['Blush', 'Ivory'] },
{ id: 'pearl-calla', name: 'Pearl Calla Pot', category: 'Bouquets', price: 102, img: 'products/calla-cascade.jpg', rating: 4.8, reviews: 47, palette: ['Peach', 'Ivory'] },
{ id: 'teddy-blossom', name: 'Teddy Blossom', category: 'Gifts', price: 70, img: 'products/sunshine-bear.jpg', tag: 'Gift', rating: 4.8, reviews: 85, palette: ['Mint', 'Champagne'] }];


const CATEGORIES = ['All', 'Bouquets', 'Gifts'];

// Fallback image (in case unsplash is blocked) — gradient placeholder
const FALLBACK_BG = 'linear-gradient(135deg, #f6d6cd 0%, #e7c9a7 50%, #dceddd 100%)';

// ============ UNIFIED PRODUCT STORE ============
// Single source of truth for the catalog. Seeded from the hardcoded PRODUCTS
// array on first load; admin CRUD writes back here so the shop, homepage, admin
// console, and product pages all stay in sync automatically.
const normaliseProduct = (p) => ({
  ...p,
  img: p.img || p.image_url || '',
  image_url: p.image_url || p.img || '',
  event: p.event || '',
  created_at: p.created_at || new Date().toISOString()
});

const ProductStore = (() => {
  const KEY = 'rosie_products_v1';
  let items = [];
  let listeners = [];
  const persist = () => {
    try {localStorage.setItem(KEY, JSON.stringify(items));} catch (e) {}
    listeners.forEach((fn) => fn(items.slice()));
  };
  const seed = () => {
    items = PRODUCTS.map((p) => normaliseProduct({ ...p, image_url: p.img }));
    persist();
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) items = JSON.parse(raw).map(normaliseProduct);else
    seed();
  } catch (e) {seed();}
  return {
    getAll: () => items.slice(),
    list: async () => items.slice(),
    // Called after a Supabase fetch to keep the shop in sync with remote data
    sync: (serverItems) => {items = (serverItems || []).map(normaliseProduct);persist();},
    subscribe: (fn) => {listeners.push(fn);return () => {listeners = listeners.filter((x) => x !== fn);};},
    insert: async (row) => {
      const newId = row.id || ('p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5));
      const item = normaliseProduct({ ...row, id: newId, created_at: new Date().toISOString() });
      items.unshift(item);persist();return item;
    },
    update: async (id, patch) => {
      const idx = items.findIndex((x) => x.id === id);
      if (idx >= 0) {items[idx] = normaliseProduct({ ...items[idx], ...patch });persist();return items[idx];}
      return null;
    },
    remove: async (id) => {items = items.filter((x) => x.id !== id);persist();}
  };
})();

const useProducts = () => {
  const [products, setProducts] = useState(ProductStore.getAll());
  useEffect(() => ProductStore.subscribe(setProducts), []);
  return products;
};

// ============ ICONS ============
const Icon = ({ name, size = 20, stroke = 1.6 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'search':return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case 'bag':return <svg {...props}><path d="M5 7h14l-1 13H6L5 7z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" /></svg>;
    case 'user':return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>;
    case 'arrow-right':return <svg {...props}><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></svg>;
    case 'arrow-left':return <svg {...props}><path d="M19 12H5" /><path d="m11 19-7-7 7-7" /></svg>;
    case 'heart':return <svg {...props}><path d="M12 21s-7-4.5-9.5-9.5C.8 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.2 4 4.5 7.5C19 16.5 12 21 12 21z" /></svg>;
    case 'heart-fill':return <svg {...props} fill="currentColor"><path d="M12 21s-7-4.5-9.5-9.5C.8 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.2 4 4.5 7.5C19 16.5 12 21 12 21z" /></svg>;
    case 'star':return <svg {...props} fill="currentColor"><path d="m12 2 3 7 7 .8-5.2 4.8 1.5 7.4L12 18l-6.3 4 1.5-7.4L2 9.8 9 9z" /></svg>;
    case 'star-empty':return <svg {...props}><path d="m12 2 3 7 7 .8-5.2 4.8 1.5 7.4L12 18l-6.3 4 1.5-7.4L2 9.8 9 9z" /></svg>;
    case 'check':return <svg {...props}><path d="M4 12l5 5L20 7" /></svg>;
    case 'plus':return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
    case 'minus':return <svg {...props}><path d="M5 12h14" /></svg>;
    case 'truck':return <svg {...props}><path d="M3 16V6a1 1 0 0 1 1-1h11v11" /><path d="M15 9h5l2 4v3h-2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>;
    case 'leaf':return <svg {...props}><path d="M11 20s8-2 10-10c0 0-7-2-10 3-2 3-2 7 0 7z" /><path d="M11 20c-3-3-3-7 0-10" /></svg>;
    case 'sparkle':return <svg {...props}><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /></svg>;
    case 'shield':return <svg {...props}><path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z" /></svg>;
    case 'chevron-right':return <svg {...props}><path d="m9 6 6 6-6 6" /></svg>;
    case 'chevron-down':return <svg {...props}><path d="m6 9 6 6 6-6" /></svg>;
    case 'clock':return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'map-pin':return <svg {...props}><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case 'phone':return <svg {...props}><path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>;
    case 'mail':return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case 'google':return <svg width={size} height={size} viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z" /><path fill="#34A853" d="M12 22c2.8 0 5.1-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7C4.5 19.7 8 22 12 22z" /><path fill="#FBBC05" d="M6.2 13.6c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V6.9H2.7C2 8.4 1.6 10.2 1.6 12s.4 3.6 1.1 5.1l3.5-2.7z" /><path fill="#EA4335" d="M12 5.4c1.5 0 2.9.5 3.9 1.5l3-3C17 2.2 14.7 1.3 12 1.3 8 1.3 4.5 3.6 2.7 6.9l3.5 2.7C7 7.2 9.3 5.4 12 5.4z" /></svg>;
    case 'instagram':return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" /></svg>;
    case 'facebook':return <svg {...props}><path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3V3z" /></svg>;
    case 'tiktok':return <svg {...props}><path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 4c.5 2.5 2.5 4.5 5 5" /></svg>;
    default:return null;
  }
};

const Stars = ({ value = 5, size = 13 }) =>
<span className="stars" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) =>
  <span key={i} style={{ color: i <= Math.round(value) ? 'var(--ink)' : 'var(--hairline-strong)', display: 'inline-flex' }}>
        <Icon name="star" size={size} />
      </span>
  )}
  </span>;


// ============ CART STATE (lightweight global) ============
const CartStore = (() => {
  let items = [];
  let listeners = [];
  const read = () => {
    try {
      const raw = localStorage.getItem('fleur_cart');
      if (raw) items = JSON.parse(raw);
    } catch (e) {/* ignore */}
  };
  const persist = () => {
    try {localStorage.setItem('fleur_cart', JSON.stringify(items));} catch (e) {}
    listeners.forEach((fn) => fn(items.slice()));
  };
  read();
  return {
    getItems: () => items,
    add: (product, qty = 1, size = 'Standard') => {
      const key = product.id + ':' + size;
      const existing = items.find((it) => it.key === key);
      if (existing) existing.qty += qty;else
      items.push({ key, id: product.id, name: product.name, price: product.price, img: product.img, size, qty });
      persist();
    },
    remove: (key) => {items = items.filter((it) => it.key !== key);persist();},
    setQty: (key, qty) => {
      const it = items.find((x) => x.key === key);
      if (it) {it.qty = Math.max(1, qty);persist();}
    },
    clear: () => {items = [];persist();},
    subscribe: (fn) => {listeners.push(fn);return () => {listeners = listeners.filter((x) => x !== fn);};}
  };
})();

const useCart = () => {
  const [items, setItems] = useState(CartStore.getItems());
  useEffect(() => CartStore.subscribe(setItems), []);
  return {
    items,
    count: items.reduce((s, it) => s + it.qty, 0),
    total: items.reduce((s, it) => s + it.qty * it.price, 0),
    add: CartStore.add,
    remove: CartStore.remove,
    setQty: CartStore.setQty,
    clear: CartStore.clear
  };
};

// ============ DISCOUNT CODES (issued when customers leave Google reviews) ============
// Each code is a one-shot voucher tied to the email it was sent to. In production this
// would be issued by a backend webhook listening for new Google reviews; in the prototype
// it is generated locally and persisted to localStorage so the same browser can redeem it.
const DiscountStore = (() => {
  const KEY = 'rosie_discount_codes';
  let codes = [];
  let listeners = [];
  const read = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) codes = JSON.parse(raw);
    } catch (e) {/* ignore */}
  };
  const persist = () => {
    try {localStorage.setItem(KEY, JSON.stringify(codes));} catch (e) {}
    listeners.forEach((fn) => fn(codes));
  };
  read();
  const randomCode = () => {
    const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 5; i++) out += a[Math.floor(Math.random() * a.length)];
    return 'ROSIE-' + out;
  };
  return {
    getAll: () => codes,
    issue: (email, percent = 10) => {
      let code = randomCode();
      while (codes.some((c) => c.code === code)) code = randomCode();
      const entry = { code, email, percent, used: false, issuedAt: Date.now() };
      codes.push(entry);
      persist();
      return entry;
    },
    validate: (input) => {
      const c = (input || '').trim().toUpperCase();
      return codes.find((x) => x.code === c && !x.used) || null;
    },
    markUsed: (code) => {
      const c = codes.find((x) => x.code === code);
      if (c) {c.used = true;c.usedAt = Date.now();persist();}
    },
    subscribe: (fn) => {listeners.push(fn);return () => {listeners = listeners.filter((x) => x !== fn);};}
  };
})();

// ============ REVIEW MODERATION QUEUE ============
// Reviews are extracted from the Google Business Profile. Each one is read for its
// star rating and routed automatically:
//   ★★★★–★★★★★ (4–5) → a 10% thank-you code is issued to the reviewer's email instantly
//   ★–★★      (1–2) → no code; flagged for a personal follow-up from a florist
//   ★★★       (3)   → held in the admin queue; a human approves (→ issue code) or rejects
// In production a backend webhook would ingest each new Google review and run this routing;
// here it is seeded + persisted to localStorage so the admin console has something to action.
const ADMIN_EMAIL = 'admin@rosie.co';

const routeByRating = (rating) =>
rating >= 4 ? 'rewarded' : rating <= 2 ? 'declined' : 'pending';

const ReviewQueueStore = (() => {
  const KEY = 'rosie_review_queue_v1';
  let reviews = [];
  let listeners = [];
  const persist = () => {
    try {localStorage.setItem(KEY, JSON.stringify(reviews));} catch (e) {}
    listeners.forEach((fn) => fn(reviews.slice()));
  };
  const seed = () => {
    const base = [
    { name: 'Linh Pham', email: 'linh.pham@gmail.com', date: '2 days ago', rating: 5, body: 'The Sunset Atelier is absolutely stunning. It arrived hand-tied with the most beautiful raw silk ribbon and the petals look unbelievably real. My mother thought it was a fresh bouquet at first glance.' },
    { name: 'Henry Nguyen', email: 'henry.ng@gmail.com', date: '5 days ago', rating: 5, body: "I've been buying from Rosie's Boutique for over two years and the craftsmanship has only gotten better. The peony cluster I ordered for my wife's birthday was a wow moment." },
    { name: 'David Le', email: 'david.le88@gmail.com', date: '1 week ago', rating: 4, body: 'Beautiful piece, though slightly smaller than I expected — would recommend sizing up for a coffee-table centerpiece. The packaging was immaculate.' },
    { name: 'Sophie Bui', email: 'sophie.bui@outlook.com', date: '9 days ago', rating: 3, body: 'The bouquet itself is lovely, but it arrived a day later than the promised window and one stem was a little bent in the box. Customer service was kind when I reached out, so I am torn.' },
    { name: 'Trang Hoang', email: 'trang.hoang@gmail.com', date: '2 weeks ago', rating: 3, body: 'Pretty flowers and nice ribbon, but the colour was a bit different from the website photos — more peach than coral. Not bad, just not quite what I pictured for the price.' },
    { name: 'Kevin Do', email: 'kevin.do@yahoo.com', date: '2 weeks ago', rating: 2, body: 'Delivery was late and the arrangement looked thinner than the listing. I expected more for what I paid.' },
    { name: 'Anna Vu', email: 'anna.vu@gmail.com', date: '3 weeks ago', rating: 5, body: 'Same-day delivery within two hours, communication was perfect, and the calla cascade smells faintly of orange blossom. A small business doing things properly.' },
    { name: 'Bao Tran', email: 'bao.tran@gmail.com', date: '1 month ago', rating: 1, body: 'My order never arrived on the date I selected and I had to chase for an update. Disappointed for a gift that was time-sensitive.' }];

    reviews = base.map((r, i) => {
      const status = routeByRating(r.rating);
      let code = null;
      if (status === 'rewarded') code = DiscountStore.issue(r.email, 10).code;
      return { id: 'gr' + (i + 1), avatar: r.name[0].toUpperCase(), source: 'google', status, code, decidedAt: null, ...r };
    });
    persist();
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) reviews = JSON.parse(raw);else
    seed();
  } catch (e) {seed();}

  return {
    getAll: () => reviews.slice(),
    pending: () => reviews.filter((r) => r.status === 'pending'),
    counts: () => reviews.reduce((m, r) => {m[r.status] = (m[r.status] || 0) + 1;return m;}, {}),
    // Ingest a freshly-read review (e.g. a customer submitting from the storefront).
    ingest: (review) => {
      const status = routeByRating(review.rating);
      let code = null;
      if (status === 'rewarded') code = DiscountStore.issue(review.email, 10).code;
      const entry = {
        id: 'r' + Date.now(),
        avatar: (review.name || '?')[0].toUpperCase(),
        source: 'site',
        date: 'just now',
        decidedAt: null,
        ...review,
        status, code };

      reviews.unshift(entry);
      persist();
      return entry;
    },
    // Admin decisions on 3-star reviews:
    approve: (id) => {
      const r = reviews.find((x) => x.id === id);
      if (r && r.status === 'pending') {
        r.status = 'approved';
        r.code = DiscountStore.issue(r.email, 10).code;
        r.decidedAt = Date.now();
        persist();
      }
      return r;
    },
    reject: (id) => {
      const r = reviews.find((x) => x.id === id);
      if (r && r.status === 'pending') {r.status = 'rejected';r.decidedAt = Date.now();persist();}
      return r;
    },
    subscribe: (fn) => {listeners.push(fn);return () => {listeners = listeners.filter((x) => x !== fn);};}
  };
})();

// ============ NAV ============
const SHOP_DROPDOWN = [
{
  key: 'everyday', eyebrow: 'Nº 01 · Hand-tied', title: 'Bouquets', sub: 'Joyful blooms for the table.', img: 'products/magenta-garden.jpg',
  icon:
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

},
{
  key: 'wedding', eyebrow: 'Nº 02 · Statement', title: 'Luxe vase arrangements', sub: 'Sculptural stems in glass.', img: 'products/ivory-tulip.jpg',
  icon:
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="4.6" r="1.6" />
      <circle cx="8.4" cy="6.2" r="1.4" />
      <circle cx="15.6" cy="6.2" r="1.4" />
      <path d="M12 6.2V12" />
      <path d="M9.2 7.4 11.2 12" />
      <path d="M14.8 7.4 12.8 12" />
      <path d="M8.4 12h7.2l-1 8a1 1 0 0 1-1 1h-3.2a1 1 0 0 1-1-1Z" />
    </svg>

},
{
  key: 'gifts', eyebrow: 'Nº 03 · At scale', title: 'Event and corporate hire', sub: 'Installations for any space.', img: 'products/sunset-atelier.jpg',
  icon:
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

},
{
  key: 'weddinghire', eyebrow: 'Nº 04 · Celebrations', title: 'Wedding hire', sub: 'Arches, aisles & centrepieces.', img: 'products/calla-cascade.jpg',
  icon:
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 21V11a7 7 0 0 1 14 0v10" />
      <circle cx="12" cy="4.3" r="1.2" />
      <circle cx="7.4" cy="6.5" r="1" />
      <circle cx="16.6" cy="6.5" r="1" />
      <circle cx="5.4" cy="11.5" r="0.9" />
      <circle cx="18.6" cy="11.5" r="0.9" />
    </svg>

}];


const Nav = ({ current, navigate }) => {
  const cart = useCart();
  const items = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'reviews', label: 'Reviews' }];

  return (
    <nav className="nav">
      <a className="logo logo-img" onClick={(e) => {e.preventDefault();navigate('home');}} href="#home" aria-label="Rosie's Boutique">
        <img src="logo.png" alt="Rosie's Boutique" style={{ width: "138px", height: "72px" }} />
      </a>
      <div className="nav-links" style={{ fontFamily: "\"Playfair Display\"" }}>
        {items.map((it) => {
          if (it.id === 'shop') {
            return (
              <div key={it.id} className="nav-shop-wrap">
                <button
                  className={'nav-link nav-link-shop' + (current === it.id || current === 'product' ? ' active' : '')}
                  onClick={() => navigate('shop')}>
                  {it.label}
                </button>
                <div className="shop-mega" role="menu" aria-label="Shop collections">
                  <div className="shop-mega-arrow" aria-hidden="true"></div>
                  <div className="shop-mega-inner">
                    <div className="shop-mega-eyebrow">
                      <span className="shop-mega-rule"></span>
                      <span>Curated Collections</span>
                      <span className="shop-mega-rule"></span>
                    </div>
                    <div className="shop-mega-list">
                      {SHOP_DROPDOWN.map((d) =>
                      <a
                        key={d.key}
                        className="shop-mega-row"
                        onClick={() => navigate('shop', { id: d.key })}
                        role="menuitem">
                          <span className="shop-mega-body">
                            <span className="shop-mega-title">{d.title}</span>
                            <span className="shop-mega-sub">{d.sub}</span>
                          </span>
                          <span className="shop-mega-icon" aria-hidden="true">{d.icon}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>);

          }
          return (
            <button
              key={it.id}
              className={'nav-link' + (current === it.id ? ' active' : '')}
              onClick={() => navigate(it.id === 'gifts' ? 'shop' : it.id)}>
              {it.label}
            </button>);

        })}
      </div>
      <div className="nav-right">
        <button className="icon-btn" aria-label="Search"><Icon name="search" /></button>
        <button className="icon-btn" aria-label="Bag" onClick={() => navigate('cart')}>
          <Icon name="bag" />
          {cart.count > 0 && <span className="badge">{cart.count}</span>}
        </button>
      </div>
    </nav>);

};

// ============ FOOTER ============
const Footer = ({ navigate, current }) =>
<footer className="footer">
    <div className="container">
      <div>
        <div className="brand-line">Rosie's Boutique<span style={{ color: 'var(--accent-soft)' }}>.</span></div>
        <p className="brand-desc">Forever bouquets and gifts, hand-tied in our atelier. Botanically-accurate silk and dried florals designed to last a lifetime.</p>
      </div>
      <div>
        <h4>Follow us</h4>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
          <a href="https://www.instagram.com/rosie.sboutique/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" style={{ color: '#e9d8c9', display: 'inline-flex' }}><Icon name="instagram" size={26} /></a>
          <a href="https://www.facebook.com/profile.php?id=61572040978693" aria-label="Facebook" target="_blank" rel="noopener noreferrer" style={{ color: '#e9d8c9', display: 'inline-flex' }}><Icon name="facebook" size={26} /></a>
          <a href="#" aria-label="TikTok" style={{ color: '#e9d8c9', display: 'inline-flex' }}><Icon name="tiktok" size={26} /></a>
        </span>
      </div>
      <div>
        <h4>Shop</h4>
        <a onClick={() => navigate('shop', { id: 'everyday' })}>Bouquets</a>
        <a onClick={() => navigate('shop', { id: 'wedding' })}>Luxe vase arrangements</a>
        <a onClick={() => navigate('shop', { id: 'gifts' })}>Event and corporate hire</a>
        <a onClick={() => navigate('shop', { id: 'weddinghire' })}>Wedding hire</a>
      </div>
      <div>
        <h4>Help</h4>
        <a onClick={() => navigate('shipping')}>Shipping</a>
        <a onClick={() => navigate('returns')}>Returns</a>
        <a onClick={() => navigate('faq')}>FAQ</a>
        <a onClick={() => navigate('contact')}>Contact</a>
      </div>
    </div>
    <div className="bottom">
      <span>© 2026 Rosie Boutique. Hand-tied with care.</span>
      {current === 'home' &&
      <a onClick={() => navigate('admin-login')}
        style={{ color: '#b6a08f', textDecoration: 'none', cursor: 'pointer', fontSize: 12.5, letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#b6a08f'; }}>
        <Icon name="user" size={13} /> Admin
      </a>
      }
    </div>
  </footer>;


// ============ PRODUCT CARD ============
const ProductCard = ({ product, navigate, reveal, index = 0 }) => {
  const [liked, setLiked] = useState(false);
  const ref = useRef(null);
  const [shown, setShown] = useState(!reveal);
  useEffect(() => {
    if (!reveal) return;
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.92) {
        setShown(true);
        window.removeEventListener('scroll', check, true);
        window.removeEventListener('resize', check);
        return true;
      }
      return false;
    };
    if (check()) return;
    window.addEventListener('scroll', check, true);
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check, true);
      window.removeEventListener('resize', check);
    };
  }, [reveal]);
  return (
    <article ref={ref} className={'product-card' + (reveal ? ' reveal-card' : '') + (shown ? ' is-in' : '')} style={reveal ? { transitionDelay: index % 4 * 90 + 'ms' } : undefined} onClick={() => navigate('product', { id: product.id })}>
      <div className="photo" style={!product.img ? { background: FALLBACK_BG } : undefined}>
        {product.img &&
        <img src={product.img} alt={product.name} loading="lazy"
        onError={(e) => {e.target.style.display = 'none';e.target.parentElement.style.background = FALLBACK_BG;}} />
        }

        <button className={'heart' + (liked ? ' active' : '')}
        onClick={(e) => {e.stopPropagation();setLiked(!liked);}}>
          <Icon name={liked ? 'heart-fill' : 'heart'} size={16} />
        </button>
      </div>
      <div className="meta">
        <div className="name">{product.name}</div>
        <div className="sub">{product.category}</div>
        <div className="price-row">
          <span className="price">${product.price}</span>
          <span className="rating">
            <Icon name="star" size={12} /> {product.rating}
            <span className="muted" style={{ marginLeft: 4 }}>({product.reviews})</span>
          </span>
        </div>
      </div>
    </article>);

};

// expose globally
Object.assign(window, { PRODUCTS, CATEGORIES, Icon, Stars, Nav, Footer, ProductCard, useCart, CartStore, DiscountStore, ReviewQueueStore, ADMIN_EMAIL, routeByRating, ProductStore, useProducts, normaliseProduct, FALLBACK_BG });
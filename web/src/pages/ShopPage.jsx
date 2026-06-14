import { useState, useMemo, useRef } from 'react';
import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, FALLBACK_BG } from '../lib/products';
import { useProducts } from '../lib/stores';
import { COLLECTIONS } from '../lib/collections';

export const CollectionCard = ({ title, img, collection, navigate }) =>
<div className="img-elevated" style={{ cursor: 'pointer', position: 'relative', borderRadius: 22, overflow: 'hidden', aspectRatio: '1/1.15', background: FALLBACK_BG }} onClick={() => navigate('shop', collection ? { id: collection } : {})}>
    <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  onError={(e) => {e.target.style.display = 'none';}} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(43,29,24,0.5) 100%)' }}></div>
    <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, color: '#fff' }}>
      <div className="serif" style={{ fontSize: 26, fontWeight: 500 }}>{title}</div>
    </div>
  </div>;


// =========================================================
// SHOP
// =========================================================
// =========================================================
// HOME — collection carousels (drag-to-scroll, one per sub-menu)
// =========================================================
export const CollectionCarousel = ({ collectionKey, eyebrow, title, navigate, products, last }) => {
  const collection = COLLECTIONS[collectionKey];
  const items = useMemo(() => products.filter(collection.filter), [products, collection.filter]);
  const scroller = useRef(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const onDown = (e) => {
    const el = scroller.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.classList.add('is-dragging');
    try {el.setPointerCapture(e.pointerId);} catch {}
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
    try {el.releasePointerCapture(e.pointerId);} catch {}
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
        <div className="carousel-head" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 28 }}>
          <div>
            <span className="eyebrow muted">{eyebrow}</span>
            <h2 className="serif" style={{ fontSize: 44, fontWeight: 500, margin: '12px 0 0', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{title}</h2>
          </div>
          <div className="carousel-head-actions" style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div className="carousel-head-arrows" style={{ display: 'flex', gap: 8 }}>
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

const ShopPage = () => {
  const { navigate, params = {} } = useNav();
  const products = useProducts();
  const collectionKey = params.id && COLLECTIONS[params.id] ? params.id : null;
  const collection = collectionKey ? COLLECTIONS[collectionKey] : null;
  const [category, setCategory] = useState('All');
  const [sort] = useState('featured');

  // Reset the category filter whenever the collection changes (adjusting
  // state during render, per React's guidance, instead of in an effect).
  const [prevCollectionKey, setPrevCollectionKey] = useState(collectionKey);
  if (collectionKey !== prevCollectionKey) {
    setPrevCollectionKey(collectionKey);
    setCategory('All');
  }

  const filtered = useMemo(() => {
    let list = collection ? products.filter(collection.filter) : products;
    if (category !== 'All') list = list.filter((p) => p.category === category);
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, sort, collection]);

  return (
    <div className="page-fade">
      {/* Header band */}
      <section style={{ padding: '64px 56px 60px' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 32 }}>
            <div>
              <h1 className="serif shop-hero-title" style={{ lineHeight: 1.02, margin: '0 0 16px', fontWeight: 500, letterSpacing: '-0.02em' }}>
                {collection ? <>The <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>{collection.title.toLowerCase()}</span> edit.</> : <>The full <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>atelier.</span></>}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            </div>
          </div>
        </div>
      </section>

      {/* Category chips — intentionally disabled (the "all collections" chip view was dropped from the design) */}
      {/* eslint-disable-next-line no-constant-binary-expression */}
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

export default ShopPage;

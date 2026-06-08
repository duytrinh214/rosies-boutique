import { useState, useMemo } from 'react';
import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import Stars from '../components/Stars';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, FALLBACK_BG } from '../lib/products';
import { useProducts, useCart } from '../lib/stores';

// =========================================================
// PRODUCT DETAIL
// =========================================================
const ProductPage = () => {
  const { params, navigate } = useNav();
  const products = useProducts();
  const product = products.find(p => p.id === params.id) || products[0] || PRODUCTS[0];
  const [size] = useState((product.sizes && product.sizes[1]) || 'Standard');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('details');
  const [imgIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const cart = useCart();

  // build gallery: main product image + 3 other product images for variety
  const gallery = useMemo(() => {
    const others = products.filter(p => p.id !== product.id).map(p => p.img);
    return [product.img, ...others.slice(0, 3)];
  }, [product, products]);

  const description = product.description || "A botanically-accurate silk floral arrangement, hand-tied in our atelier. Designed to last a lifetime — no water, no wilting, just timeless beauty.";
  const details = product.details || ['Hand-tied silk stems', 'Wrapped in raw silk ribbon', 'Approx. 30 × 26 cm', 'Made to last 5+ years'];

  const onAdd = () => {
    cart.add(product, qty, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const onBuyNow = () => {
    // Only add if this exact product/size isn't already in the cart —
    // cart.add() merges quantities, so calling it unconditionally here
    // would bump an existing line to qty 2 instead of going straight to checkout.
    const key = product.id + ':' + size;
    if (!cart.items.some((it) => it.key === key)) cart.add(product, qty, size);
    navigate('cart');
  };

  return (
    <div className="page-fade">
      <section style={{ padding: '64px 56px 80px' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div className="g-stack" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64 }}>
            {/* Gallery */}
            <div className="img-elevated product-zoom" style={{ borderRadius: 28, overflow: 'hidden', aspectRatio: '4/4.8', background: FALLBACK_BG, position: 'relative' }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width) * 100;
                const y = ((e.clientY - r.top) / r.height) * 100;
                const img = e.currentTarget.querySelector('img');
                if (img) { img.style.transformOrigin = x + '% ' + y + '%'; img.style.transform = 'scale(2)'; }
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) { img.style.transform = 'scale(1)'; }
              }}>
              <img src={'/' + gallery[imgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.target.style.display = 'none'; }} />
              {product.tag && <span className="tag" style={{ position: 'absolute', top: 22, left: 22, background: '#fff', padding: '8px 14px', borderRadius: 9999, fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>{product.tag}</span>}
            </div>

            {/* Right pane */}
            <div style={{ paddingTop: 8 }}>
              <span className="eyebrow muted">{product.category} · made-to-order</span>
              <h1 className="serif" style={{ fontSize: 56, lineHeight: 1.05, margin: '16px 0 14px', fontWeight: 500, letterSpacing: '-0.02em' }}>
                {product.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                <Stars value={product.rating} size={15} />
                <span style={{ color: 'var(--muted)', fontSize: 13.5 }}>{product.rating} · {product.reviews} reviews</span>
              </div>
              <div className="serif" style={{ fontSize: 36, fontWeight: 600, marginBottom: 28 }}>${product.price}</div>
              <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 32 }}>{description}</p>

              {/* Qty + Add */}
              <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, border: '1px solid var(--ink)', borderRadius: 9999, overflow: 'hidden' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', padding: '14px 18px', cursor: 'pointer', color: 'var(--ink)' }}><Icon name="minus" size={14} /></button>
                  <span style={{ padding: '0 16px', fontWeight: 500, minWidth: 24, textAlign: 'center' }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ background: 'none', border: 'none', padding: '14px 18px', cursor: 'pointer', color: 'var(--ink)' }}><Icon name="plus" size={14} /></button>
                </div>
                <button className="btn btn-primary" onClick={onAdd} style={{ flex: 1, justifyContent: 'center' }}>
                  {added ? <><Icon name="check" size={16} /> Added to bag</> : <>Add to bag — ${product.price * qty}</>}
                </button>
              </div>
              <button className="btn btn-secondary btn-block" onClick={onBuyNow}>
                Buy now <Icon name="arrow-right" size={16} />
              </button>

              {/* Trust strip */}
              <div style={{ marginTop: 32, padding: '20px 0', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', display: 'flex', gap: 32 }}>
                <TrustLine icon="truck" label="Free shipping over $80" />
                <TrustLine icon="shield" label="Lifetime atelier guarantee" />
                <TrustLine icon="leaf" label="Plastic-free packaging" />
              </div>

              {/* Tabs */}
              <div style={{ marginTop: 32 }}>
                <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--hairline)', marginBottom: 20 }}>
                  {['details', 'care', 'shipping'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      style={{
                        background: 'none', border: 'none', padding: '12px 0',
                        borderBottom: tab === t ? '2px solid var(--ink)' : '2px solid transparent',
                        cursor: 'pointer', textTransform: 'capitalize', fontSize: 14,
                        fontWeight: tab === t ? 600 : 400, color: 'var(--ink)', fontFamily: 'inherit'
                      }}>{t}</button>
                  ))}
                </div>
                {tab === 'details' && (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
                    {details.map((d, i) => (
                      <li key={i} style={{ display: 'flex', gap: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
                        <Icon name="check" size={16} /> {d}
                      </li>
                    ))}
                  </ul>
                )}
                {tab === 'care' && <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>Dust with a soft brush every few weeks. Keep out of direct sunlight to preserve the dyed petals. Refresh with the atelier annually — free for life.</p>}
                {tab === 'shipping' && <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>Same-day delivery within the city (orders before 2pm). 2–4 business days nationwide. Free shipping on orders over $80. All pieces ship in custom protective packaging.</p>}
              </div>
            </div>
          </div>

          {/* Related */}
          <div style={{ marginTop: 100 }}>
            <h2 className="serif" style={{ fontSize: 40, fontWeight: 500, marginBottom: 32, letterSpacing: '-0.02em' }}>
              You may also <span className="italic">love</span>
            </h2>
            <div className="grid-4">
              {products.filter(p => p.id !== product.id).slice(0, 4).map(p => <ProductCard key={p.id} product={p} navigate={navigate} />)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const TrustLine = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--ink-soft)' }}>
    <Icon name={icon} size={18} /> {label}
  </div>
);

export default ProductPage;

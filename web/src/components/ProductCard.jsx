import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { FALLBACK_BG } from '../lib/products';

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
    <article
      ref={ref}
      className={'product-card' + (reveal ? ' reveal-card' : '') + (shown ? ' is-in' : '')}
      style={reveal ? { transitionDelay: (index % 4) * 90 + 'ms' } : undefined}
      onClick={() => navigate('product', { id: product.id })}>
      <div className="photo" style={!product.img ? { background: FALLBACK_BG } : undefined}>
        {product.img && (
          <img src={'/' + product.img} alt={product.name} loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = FALLBACK_BG; }} />
        )}
        <button className={'heart' + (liked ? ' active' : '')}
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}>
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
    </article>
  );
};

export default ProductCard;

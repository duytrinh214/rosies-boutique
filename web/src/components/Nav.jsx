import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from './Icon';
import { useCart } from '../lib/stores';

// Flat top-level navigation. "Home" plus the four shop collections, each
// linking straight to its category page (/shop/<collection>).
const NAV_ITEMS = [
  { label: 'Home', page: 'home' },
  { label: 'Bouquets', collection: 'bouquets' },
  { label: 'Luxe Vase Arrangements', collection: 'luxe-vase-arrangements' },
  { label: 'Event and Corporate Hire', collection: 'event-corporate-hire' },
  { label: 'Wedding Hire', collection: 'wedding-hire' },
];

const Nav = ({ current, navigate }) => {
  const cart = useCart();
  const params = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (page, navParams) => {
    setMenuOpen(false);
    navigate(page, navParams);
  };

  const isActive = (it) =>
    it.page ? current === it.page : current === 'shop' && params.id === it.collection;

  const onItem = (it) => (it.page ? go(it.page) : go('shop', { id: it.collection }));

  return (
    <header className="site-header">
      {/* Logo row — centred */}
      <div className="header-logo-row">
        <a className="logo logo-img" onClick={(e) => { e.preventDefault(); go('home'); }} href="#home" aria-label="Rosie's Boutique">
          <img src="/logo.png" alt="Rosie's Boutique" style={{ width: '138px', height: '72px' }} />
        </a>
      </div>

      <nav className="nav">
        {/* Mobile: hamburger LEFT */}
        <button
          className={'icon-btn nav-burger' + (menuOpen ? ' active' : '')}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}>
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>

        <div className="nav-links" style={{ fontFamily: '"Playfair Display"' }}>
          {NAV_ITEMS.map((it) => (
            <button
              key={it.label}
              className={'nav-link' + (isActive(it) ? ' active' : '')}
              onClick={() => onItem(it)}>
              {it.label}
            </button>
          ))}
        </div>

        {/* Mobile: cart RIGHT */}
        <div className="nav-right">
          <button className="icon-btn" aria-label="Bag" onClick={() => navigate('cart')}>
            <Icon name="bag" />
            {cart.count > 0 && <span className="badge">{cart.count}</span>}
          </button>
        </div>

        {/* Mobile slide-down menu */}
        <div className={'nav-mobile' + (menuOpen ? ' is-open' : '')} role="menu" aria-label="Mobile navigation">
          <div className="nav-mobile-links">
            {NAV_ITEMS.map((it) => (
              <button
                key={it.label}
                className={'nav-mobile-link' + (isActive(it) ? ' active' : '')}
                onClick={() => onItem(it)}>
                {it.label}
              </button>
            ))}
          </div>
        </div>
        {menuOpen && <div className="nav-mobile-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true"></div>}
      </nav>

      {/* Torn-paper edge transitioning from the cream header into the pink page */}
      <div className="header-torn-edge" aria-hidden="true">
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,18 L48,9 L96,22 L144,5 L192,16 L240,3 L288,20 L336,8 L384,24 L432,6 L480,17 L528,2 L576,21 L624,9 L672,15 L720,4 L768,19 L816,7 L864,23 L912,10 L960,16 L1008,3 L1056,20 L1104,8 L1152,14 L1200,5 L1248,18 L1296,9 L1344,22 L1392,6 L1440,16 L1440,40 L0,40 Z" fill="var(--bg-pink)" />
        </svg>
      </div>
    </header>
  );
};

export default Nav;

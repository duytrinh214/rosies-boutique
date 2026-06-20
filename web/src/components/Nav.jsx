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
    <nav className="nav">
      {/* Decorative curtain swag + chandelier + roses, both corners.
          Purely decorative — pointer-events disabled so clicks pass through
          to the logo/menu underneath. Hidden on small screens to avoid
          crowding the mobile header. */}
      <img
        src="/images/hero-corner-curtain.png"
        alt=""
        aria-hidden="true"
        className="nav-curtain nav-curtain-left" />
      <img
        src="/images/hero-corner-curtain.png"
        alt=""
        aria-hidden="true"
        className="nav-curtain nav-curtain-right" />

      <a className="logo logo-img" onClick={(e) => { e.preventDefault(); go('home'); }} href="#home" aria-label="Rosie's Boutique">
        <img src="/logo.png" alt="Rosie's Boutique" style={{ width: '138px', height: '72px' }} />
      </a>
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
      <div className="nav-right">
        <button className="icon-btn" aria-label="Search"><Icon name="search" /></button>
        <button className="icon-btn" aria-label="Bag" onClick={() => navigate('cart')}>
          <Icon name="bag" />
          {cart.count > 0 && <span className="badge">{cart.count}</span>}
        </button>
        <button
          className={'icon-btn nav-burger' + (menuOpen ? ' active' : '')}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}>
          <Icon name={menuOpen ? 'close' : 'menu'} />
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
  );
};

export default Nav;

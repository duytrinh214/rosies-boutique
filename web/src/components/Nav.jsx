import { useState } from 'react';
import Icon from './Icon';
import { useCart } from '../lib/stores';

const SHOP_DROPDOWN = [
  {
    key: 'everyday', eyebrow: 'Nº 01 · Hand-tied', title: 'Bouquets', sub: 'Joyful blooms for the table.', img: 'products/magenta-garden.jpg',
    icon: (
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
    ),
  },
  {
    key: 'wedding', eyebrow: 'Nº 02 · Statement', title: 'Luxe Vase Arrangements', sub: 'Sculptural stems in glass.', img: 'products/ivory-tulip.jpg',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="4.6" r="1.6" />
        <circle cx="8.4" cy="6.2" r="1.4" />
        <circle cx="15.6" cy="6.2" r="1.4" />
        <path d="M12 6.2V12" />
        <path d="M9.2 7.4 11.2 12" />
        <path d="M14.8 7.4 12.8 12" />
        <path d="M8.4 12h7.2l-1 8a1 1 0 0 1-1 1h-3.2a1 1 0 0 1-1-1Z" />
      </svg>
    ),
  },
  {
    key: 'gifts', eyebrow: 'Nº 03 · At scale', title: 'Event and Corporate Hire', sub: 'Installations for any space.', img: 'products/sunset-atelier.jpg',
    icon: (
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
    ),
  },
  {
    key: 'weddinghire', eyebrow: 'Nº 04 · Celebrations', title: 'Wedding Hire', sub: 'Arches, aisles & centrepieces.', img: 'products/calla-cascade.jpg',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 21V11a7 7 0 0 1 14 0v10" />
        <circle cx="12" cy="4.3" r="1.2" />
        <circle cx="7.4" cy="6.5" r="1" />
        <circle cx="16.6" cy="6.5" r="1" />
        <circle cx="5.4" cy="11.5" r="0.9" />
        <circle cx="18.6" cy="11.5" r="0.9" />
      </svg>
    ),
  },
];

const Nav = ({ current, navigate }) => {
  const cart = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const go = (page, params) => {
    setMenuOpen(false);
    navigate(page, params);
  };

  return (
    <nav className="nav">
      <a className="logo logo-img" onClick={(e) => { e.preventDefault(); go('home'); }} href="#home" aria-label="Rosie's Boutique">
        <img src="/logo.png" alt="Rosie's Boutique" style={{ width: '138px', height: '72px' }} />
      </a>
      <div className="nav-links" style={{ fontFamily: '"Playfair Display"' }}>
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
                      {SHOP_DROPDOWN.map((d) => (
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
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <button
              key={it.id}
              className={'nav-link' + (current === it.id ? ' active' : '')}
              onClick={() => navigate(it.id)}>
              {it.label}
            </button>
          );
        })}
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
          {items.map((it) => (
            <button
              key={it.id}
              className={'nav-mobile-link' + (current === it.id || (it.id === 'shop' && current === 'product') ? ' active' : '')}
              onClick={() => go(it.id)}>
              {it.label}
            </button>
          ))}
        </div>
        <div className="nav-mobile-eyebrow">Curated Collections</div>
        <div className="nav-mobile-collections">
          {SHOP_DROPDOWN.map((d) => (
            <button key={d.key} className="nav-mobile-collection" onClick={() => go('shop', { id: d.key })}>
              <span className="shop-mega-icon" aria-hidden="true">{d.icon}</span>
              <span className="shop-mega-body">
                <span className="shop-mega-title">{d.title}</span>
                <span className="shop-mega-sub">{d.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      {menuOpen && <div className="nav-mobile-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true"></div>}
    </nav>
  );
};

export default Nav;

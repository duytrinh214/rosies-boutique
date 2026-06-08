import Icon from './Icon';

const Footer = ({ navigate, current }) => (
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
        </span>
      </div>
      <div>
        <h4>Shop</h4>
        <a onClick={() => navigate('shop', { id: 'everyday' })}>Bouquets</a>
        <a onClick={() => navigate('shop', { id: 'wedding' })}>Luxe Vase Arrangements</a>
        <a onClick={() => navigate('shop', { id: 'gifts' })}>Event and Corporate Hire</a>
        <a onClick={() => navigate('shop', { id: 'weddinghire' })}>Wedding Hire</a>
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
      {current === 'home' && (
        <a onClick={() => navigate('admin-login')}
          style={{ color: '#b6a08f', textDecoration: 'none', cursor: 'pointer', fontSize: 12.5, letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#b6a08f'; }}>
          <Icon name="user" size={13} /> Admin
        </a>
      )}
    </div>
  </footer>
);

export default Footer;

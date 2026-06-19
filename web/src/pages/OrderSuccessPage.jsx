import { useEffect, useState } from 'react';
import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import { useCart } from '../lib/stores';

const OrderSuccessPage = () => {
  const { navigate } = useNav();
  const cart = useCart();
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session_id');
    if (sid) {
      setSessionId(sid);
      cart.clear(); // clear giỏ hàng sau khi thanh toán thành công
    }
  }, []);

  // Generate a display order ref from session_id suffix
  const orderRef = sessionId
    ? 'RB-' + sessionId.slice(-6).toUpperCase()
    : 'RB-' + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="page-fade">
      <section style={{ padding: '80px 56px 120px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>

          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'var(--bg-pill)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 32, color: 'var(--ink)'
          }}>
            <Icon name="check" size={48} />
          </div>

          <span className="pill"><span className="pill-dot"></span>Order confirmed</span>

          <h1 className="serif" style={{
            fontSize: 64, fontWeight: 500, lineHeight: 1.05,
            margin: '24px 0 18px', letterSpacing: '-0.02em'
          }}>
            Thank you <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>for your order.</span>
          </h1>

          <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: 32 }}>
            Payment received! Your atelier is hand-tying your order now.
            You'll receive a confirmation email shortly, and we'll dispatch within 2 hours.
          </p>

          <div className="card" style={{ padding: 28, textAlign: 'left', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="muted" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Order reference
                </div>
                <div className="serif" style={{ fontSize: 22, fontWeight: 500, marginTop: 4 }}>
                  {orderRef}
                </div>
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: '#e8f5e9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#2e7d32'
              }}>
                <Icon name="check" size={24} />
              </div>
            </div>
            <hr className="divider" style={{ margin: '20px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
              <Icon name="mail" size={18} />
              A confirmation email with your order details has been sent.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('home')}>
              Back to home <Icon name="arrow-right" size={16} />
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('shop')}>
              Keep shopping
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};

export default OrderSuccessPage;

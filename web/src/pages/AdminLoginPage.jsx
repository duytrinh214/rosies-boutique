import { useState } from 'react';
import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import { getSupabase, isSupabaseConfigured, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '../lib/supabase';

// =========================================================
// SHARED AUTH SHELL (two-column: image left, form right)
// =========================================================
export const AuthShell = ({ accent = 'pink', children }) => (
  <div style={{
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1.05fr 1fr',
    background: 'var(--bg-pink)',
  }}>
    {/* Left art panel */}
    <div style={{
      position: 'relative',
      background: accent === 'dark'
        ? 'linear-gradient(160deg, #2b1d18 0%, #4a3a32 60%, #7a4f3a 100%)'
        : 'linear-gradient(158deg, #f8ddd4 0%, #f1cabf 42%, #ecc4ac 74%, #e7c9a7 100%)',
      overflow: 'hidden',
      padding: '40px 48px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      color: accent === 'dark' ? '#f1e6dc' : 'var(--ink)',
    }}>
      {/* Decorative floral SVG */}
      <div style={{ position: 'absolute', inset: 0, opacity: accent === 'dark' ? 0.25 : 0.5, pointerEvents: 'none' }}>
        <svg viewBox="0 0 600 800" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="petalGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent === 'dark' ? '#e7c9a7' : '#fff'} stopOpacity="0.8" />
              <stop offset="100%" stopColor={accent === 'dark' ? '#b6845f' : '#f4cfc4'} stopOpacity="0.2" />
            </radialGradient>
          </defs>
          {[[120, 220, 80], [420, 160, 110], [500, 520, 90], [180, 600, 100], [340, 380, 130]].map(([cx, cy, r], i) => (
            <g key={i} transform={`translate(${cx} ${cy})`}>
              {[0, 72, 144, 216, 288].map(rot => (
                <ellipse key={rot} cx="0" cy={-r * 0.55} rx={r * 0.35} ry={r * 0.6} fill="url(#petalGrad)" transform={`rotate(${rot})`} />
              ))}
              <circle r={r * 0.18} fill={accent === 'dark' ? '#b6845f' : '#b6845f'} opacity="0.5" />
            </g>
          ))}
        </svg>
      </div>

      <div style={{ position: 'relative', maxWidth: 480 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '10px 20px', background: accent === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
          borderRadius: 9999, fontSize: 11.5, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'inherit', fontWeight: 600, backdropFilter: 'blur(6px)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: accent === 'dark' ? '#e7c9a7' : 'var(--accent)' }}></span>
          {accent === 'dark' ? 'Atelier Admin' : 'Members'}
        </span>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 64, fontWeight: 500,
          lineHeight: 1.02, letterSpacing: '-0.02em', margin: '24px 0 18px',
        }}>
          {accent === 'dark'
            ? <>The <span className="italic" style={{ fontWeight: 400 }}>atelier</span><br />command room.</>
            : <>Bouquets that <span className="italic" style={{ fontWeight: 400 }}>last</span> a lifetime.</>}
        </h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.55, opacity: 0.85, maxWidth: 380 }}>
          {accent === 'dark'
            ? 'Sign in to manage the catalog, seasonal events, pricing and imagery for Rosie Boutique.'
            : 'Sign in to track orders, save favorites, and unlock atelier rewards on every hand-tied piece.'}
        </p>
      </div>
    </div>

    {/* Right form panel */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 56px', background: 'var(--bg-cream)' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {children}
      </div>
    </div>
  </div>
);

// =========================================================
// ADMIN LOGIN
// =========================================================
const AdminLoginPage = () => {
  const { navigate } = useNav();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const sb = getSupabase();
      if (sb) {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // demo mode
        if (email !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
          throw new Error('Invalid credentials. Use the demo credentials shown above, or configure Supabase.');
        }
      }
      localStorage.setItem('rosie_admin', JSON.stringify({ email, at: Date.now() }));
      navigate('admin');
    } catch (e2) {
      setErr(e2.message || 'Sign-in failed.');
    } finally { setBusy(false); }
  };

  return (
    <AuthShell accent="dark" onClose={() => navigate('home')}>
      <div style={{ marginBottom: 32 }}>
        <span className="eyebrow muted">Atelier console</span>
        <h1 className="serif" style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.05, margin: '14px 0 10px', letterSpacing: '-0.02em' }}>
          Admin <span className="italic">sign-in.</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: 0 }}>
          Manage products, categories, events and pricing.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div style={{
          padding: '14px 18px', background: '#fff4e6', border: '1px solid #f0d8b3',
          borderRadius: 14, fontSize: 13, color: '#5a4a32', marginBottom: 22, lineHeight: 1.5,
        }}>
          <strong style={{ fontWeight: 600 }}>Demo mode.</strong> Supabase is not configured yet — sign in with:<br />
          <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: 4 }}>{DEMO_ADMIN_EMAIL}</code>{' / '}
          <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: 4 }}>{DEMO_ADMIN_PASSWORD}</code>
        </div>
      )}

      <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
        <div>
          <label className="input-label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@rosie.co" />
        </div>
        <div>
          <label className="input-label">Password</label>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        {err && <div style={{ padding: '10px 14px', background: '#fbeae5', color: '#9a3a2a', borderRadius: 12, fontSize: 13 }}>{err}</div>}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy} style={{ marginTop: 8 }}>
          {busy ? 'Signing in…' : 'Sign in to console'} <Icon name="arrow-right" size={16} />
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
        <a onClick={() => navigate('home')} style={{ color: 'var(--ink)', textDecoration: 'underline', cursor: 'pointer' }}>← Back to storefront</a>
      </p>
    </AuthShell>
  );
};

export default AdminLoginPage;

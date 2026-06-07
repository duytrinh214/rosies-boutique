/* global React, Icon, Stars, PRODUCTS, ProductStore, useProducts, ReviewQueueStore, DiscountStore, ADMIN_EMAIL, FALLBACK_BG */
const { useState, useEffect, useMemo, useRef } = React;

// =========================================================
// SUPABASE CLIENT (lazy singleton)
// =========================================================
const getSupabase = (() => {
  let client = null;
  return () => {
    if (client) return client;
    const url = window.__SUPABASE_URL;
    const key = window.__SUPABASE_ANON_KEY;
    if (!url || !key || !window.supabase) return null;
    client = window.supabase.createClient(url, key, {
      auth: { persistSession: true, storageKey: 'rosie_admin_auth' },
    });
    return client;
  };
})();
const isSupabaseConfigured = () => !!(window.__SUPABASE_URL && window.__SUPABASE_ANON_KEY && window.supabase);

// LocalProductStore removed — ProductStore (components.jsx) is now the unified source of truth.

// =========================================================
// SHARED AUTH SHELL (two-column: image left, form right)
// =========================================================
const AuthShell = ({ accent = 'pink', children, onClose }) => (
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
// CUSTOMER LOGIN
// =========================================================
const LoginPage = ({ navigate }) => {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const sb = getSupabase();
      if (sb) {
        if (mode === 'signin') {
          const { error } = await sb.auth.signInWithPassword({ email, password });
          if (error) throw error;
        } else {
          const { error } = await sb.auth.signUp({ email, password, options: { data: { full_name: name } } });
          if (error) throw error;
        }
      }
      // mock customer session
      localStorage.setItem('rosie_customer', JSON.stringify({ email, name: name || 'Rosie' }));
      navigate('account');
    } catch (e2) {
      setErr(e2.message || 'Something went wrong.');
    } finally { setBusy(false); }
  };

  return (
    <AuthShell accent="pink" onClose={() => navigate('home')}>
      <div style={{ marginBottom: 36 }}>
        <span className="eyebrow muted">{mode === 'signin' ? 'Welcome back' : 'Create account'}</span>
        <h1 className="serif" style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.05, margin: '14px 0 10px', letterSpacing: '-0.02em' }}>
          {mode === 'signin' ? <>Sign in to <span className="italic">Rosie's Boutique.</span></> : <>Join the <span className="italic">atelier.</span></>}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: 0 }}>
          {mode === 'signin' ? "Don't have an account?" : 'Already a member?'}{' '}
          <a onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            style={{ color: 'var(--ink)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}>
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </a>
        </p>
      </div>

      <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
        {mode === 'signup' && (
          <div>
            <label className="input-label">Full name</label>
            <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Rosie Tran" />
          </div>
        )}
        <div>
          <label className="input-label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@boutique.co" />
        </div>
        <div>
          <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Password</span>
            {mode === 'signin' && <a style={{ color: 'var(--ink)', textTransform: 'none', letterSpacing: 0, fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }}>Forgot?</a>}
          </label>
          <input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        {err && <div style={{ padding: '10px 14px', background: '#fbeae5', color: '#9a3a2a', borderRadius: 12, fontSize: 13 }}>{err}</div>}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy} style={{ marginTop: 8 }}>
          {busy ? 'Please wait…' : (mode === 'signin' ? 'Sign in' : 'Create account')}
          <Icon name="arrow-right" size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0', color: 'var(--muted)', fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--hairline)' }}></div>
          <span style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--hairline)' }}></div>
        </div>

        <button type="button" className="btn btn-secondary btn-block" onClick={() => { localStorage.setItem('rosie_customer', JSON.stringify({ email: 'guest@rosie.co', name: 'Rosie' })); navigate('account'); }}>
          <Icon name="google" size={18} /> Continue with Google
        </button>
      </form>

      <p style={{ marginTop: 28, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
        Are you a team member?{' '}
        <a onClick={() => navigate('admin-login')} style={{ color: 'var(--ink)', textDecoration: 'underline', cursor: 'pointer' }}>Admin sign-in</a>
      </p>
    </AuthShell>
  );
};

// =========================================================
// ADMIN LOGIN
// =========================================================
const AdminLoginPage = ({ navigate }) => {
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
        if (email !== window.__DEMO_ADMIN_EMAIL || password !== window.__DEMO_ADMIN_PASSWORD) {
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

      {!isSupabaseConfigured() && (
        <div style={{
          padding: '14px 18px', background: '#fff4e6', border: '1px solid #f0d8b3',
          borderRadius: 14, fontSize: 13, color: '#5a4a32', marginBottom: 22, lineHeight: 1.5,
        }}>
          <strong style={{ fontWeight: 600 }}>Demo mode.</strong> Supabase is not configured yet — sign in with:<br />
          <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: 4 }}>{window.__DEMO_ADMIN_EMAIL}</code>{' / '}
          <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: 4 }}>{window.__DEMO_ADMIN_PASSWORD}</code>
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

// =========================================================
// ADMIN DASHBOARD
// =========================================================
const AdminPage = ({ navigate }) => {
  // gate: must be signed in (localStorage flag set by admin login)
  useEffect(() => {
    if (!localStorage.getItem('rosie_admin')) navigate('admin-login');
  }, []);
  const adminSession = (() => {
    try { return JSON.parse(localStorage.getItem('rosie_admin') || 'null'); } catch (e) { return null; }
  })();

  const [tab, setTab] = useState('products');
  const [pendingReviews, setPendingReviews] = useState(ReviewQueueStore.pending().length);
  useEffect(() => ReviewQueueStore.subscribe((all) => setPendingReviews(all.filter((r) => r.status === 'pending').length)), []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editing, setEditing] = useState(null); // product being edited, or 'new'
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const load = async () => {
    setLoading(true);
    try {
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        const rows = data || [];
        setItems(rows);
        ProductStore.sync(rows); // keep shop in sync with Supabase
      } else {
        setItems(await ProductStore.list());
      }
    } catch (e) {
      console.error(e); showToast('Failed to load: ' + e.message);
      setItems(await ProductStore.list());
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (row) => {
    try {
      const sb = getSupabase();
      if (row.id) {
        const { id, created_at, ...patch } = row;
        if (sb) {
          const { error } = await sb.from('products').update(patch).eq('id', id);
          if (error) throw error;
        }
        await ProductStore.update(id, patch); // always sync local store
        showToast('Saved changes.');
      } else {
        const { id, created_at, ...insertRow } = row;
        if (sb) {
          const { data, error } = await sb.from('products').insert(insertRow).select().single();
          if (error) throw error;
          await ProductStore.insert(data || insertRow);
        } else {
          await ProductStore.insert(insertRow);
        }
        showToast('Product added.');
      }
      setEditing(null);
      await load();
    } catch (e) { showToast('Save failed: ' + e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const sb = getSupabase();
      if (sb) {
        const { error } = await sb.from('products').delete().eq('id', id);
        if (error) throw error;
      }
      await ProductStore.remove(id); // always remove from local store
      showToast('Deleted.');
      await load();
    } catch (e) { showToast('Delete failed: ' + e.message); }
  };

  const signOut = async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    localStorage.removeItem('rosie_admin');
    navigate('admin-login');
  };

  const filtered = useMemo(() => items.filter(p => {
    const m1 = !query || (p.name || '').toLowerCase().includes(query.toLowerCase());
    const m2 = categoryFilter === 'All' || p.category === categoryFilter;
    return m1 && m2;
  }), [items, query, categoryFilter]);

  const stats = useMemo(() => {
    const totalValue = items.reduce((s, p) => s + (Number(p.price) || 0), 0);
    const byCat = items.reduce((m, p) => { m[p.category || 'Uncategorized'] = (m[p.category || 'Uncategorized'] || 0) + 1; return m; }, {});
    const events = new Set(items.map(p => p.event).filter(Boolean));
    return { count: items.length, totalValue, byCat, eventsCount: events.size };
  }, [items]);

  return (
    <div className="admin-page" style={{ minHeight: '100vh', background: '#faf6f1', color: 'var(--ink)' }}>
      {/* Admin top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: '1px solid var(--hairline)', background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <a href="#admin" style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.01em' }}>
            Rosie's Boutique<span style={{ color: 'var(--accent)' }}>.</span>
          </a>
          <span style={{ width: 1, height: 22, background: 'var(--hairline)' }}></span>
          <span style={{ fontSize: 12.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Atelier Console</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 9999, fontSize: 12,
            background: isSupabaseConfigured() ? '#e8f4ea' : '#fff4e6',
            color: isSupabaseConfigured() ? '#2f6a3c' : '#8a5a1c',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSupabaseConfigured() ? '#3ea25a' : '#d99a3a' }}></span>
            {isSupabaseConfigured() ? 'Supabase connected' : 'Local demo mode'}
          </span>
          <a onClick={() => navigate('home')} style={{ fontSize: 14, color: 'var(--muted)', cursor: 'pointer', textDecoration: 'none' }}>View storefront ↗</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 6px', background: 'var(--bg-cream)', borderRadius: 9999 }}>
            <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
              {(adminSession?.email || 'A')[0].toUpperCase()}
            </span>
            <span style={{ fontSize: 13 }}>{adminSession?.email || 'Admin'}</span>
            <button onClick={signOut} className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }}>Sign out</button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 72px)' }}>
        {/* Sidebar */}
        <aside style={{ padding: '24px 16px', borderRight: '1px solid var(--hairline)', background: '#fff' }}>
          {[
            { id: 'products', label: 'Products', icon: 'bag' },
            { id: 'reviews', label: 'Reviews', icon: 'star', badge: pendingReviews },
            { id: 'overview', label: 'Overview', icon: 'sparkle' },
            { id: 'categories', label: 'Categories & Events', icon: 'leaf' },
            { id: 'settings', label: 'Settings', icon: 'shield' },
          ].map(it => (
            <button key={it.id} onClick={() => setTab(it.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 12, marginBottom: 4,
              background: tab === it.id ? 'var(--ink)' : 'transparent',
              color: tab === it.id ? '#fff' : 'var(--ink)',
              border: 'none', cursor: 'pointer', fontSize: 14.5, textAlign: 'left',
              fontFamily: 'inherit', fontWeight: tab === it.id ? 500 : 400,
            }}>
              <Icon name={it.icon} size={17} /> <span style={{ flex: 1 }}>{it.label}</span>
              {it.badge > 0 && (
                <span style={{
                  minWidth: 20, height: 20, padding: '0 6px', borderRadius: 9999,
                  background: tab === it.id ? '#fff' : 'var(--accent, #c2655a)',
                  color: tab === it.id ? 'var(--ink)' : '#fff',
                  fontSize: 11.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>{it.badge}</span>
              )}
            </button>
          ))}
        </aside>

        {/* Main */}
        <main style={{ padding: '32px 40px 80px' }}>
          {tab === 'overview' && (
            <AdminOverview stats={stats} items={items} />
          )}

          {tab === 'reviews' && <ReviewQueuePanel showToast={showToast} />}

          {tab === 'products' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
                <div>
                  <span className="eyebrow muted">Catalog</span>
                  <h1 className="serif" style={{ fontSize: 40, fontWeight: 500, margin: '8px 0 0', letterSpacing: '-0.02em' }}>
                    Products <span className="italic" style={{ color: 'var(--muted)', fontWeight: 400 }}>({items.length})</span>
                  </h1>
                </div>
                <button className="btn btn-primary" onClick={() => setEditing({ name: '', category: 'Bouquets', event: '', price: '', image_url: '', description: '' })}>
                  <Icon name="plus" size={14} /> Add product
                </button>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 280px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
                    <Icon name="search" size={16} />
                  </span>
                  <input className="input" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 42 }} />
                </div>
                <div className="chip-strip" style={{ flex: '0 0 auto' }}>
                  {['All', 'Bouquets', 'Luxe vase arrangements', 'Event and corporate hire', 'Wedding hire'].map(c => (
                    <button key={c} className={'chip' + (categoryFilter === c ? ' active' : '')} onClick={() => setCategoryFilter(c)}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-cream)', textAlign: 'left' }}>
                      <th style={thStyle}>Product</th>
                      <th style={thStyle}>Category</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Price</th>
                      <th style={thStyle}>Added</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Loading…</td></tr>
                    )}
                    {!loading && filtered.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>
                        No products yet. <a onClick={() => setEditing({ name: '', category: 'Bouquets', event: '', price: '', image_url: '', description: '' })} style={{ color: 'var(--ink)', textDecoration: 'underline', cursor: 'pointer' }}>Add the first one →</a>
                      </td></tr>
                    )}
                    {filtered.map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid var(--hairline)' }}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', background: FALLBACK_BG, flexShrink: 0 }}>
                              {p.image_url && <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />}
                            </div>
                            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>{p.name || 'Untitled'}</div>
                              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.2 }}>ID: {shortId(p.id)}</div>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={pillStyle}>{p.category || '—'}</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600 }}>
                          ${Number(p.price || 0).toFixed(0)}
                        </td>
                        <td style={{ ...tdStyle, color: 'var(--muted)', fontSize: 13 }}>
                          {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(p)}>Edit</button>
                          <button className="btn btn-ghost btn-sm" style={{ color: '#9a3a2a' }} onClick={() => handleDelete(p.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'categories' && <CategoriesPanel items={items} />}
          {tab === 'settings' && <SettingsPanel />}
        </main>
      </div>

      {/* Edit drawer */}
      {editing && (
        <ProductEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--ink)', color: '#fff', padding: '12px 22px',
          borderRadius: 9999, fontSize: 14, boxShadow: 'var(--shadow-soft)', zIndex: 1000,
        }}>{toast}</div>
      )}
    </div>
  );
};

// Show a readable, non-colliding id: keep short slugs/timestamps whole,
// only abbreviate long uuid-style ids (which stay unique in their first 8 chars).
const shortId = (id) => {
  const s = String(id ?? '');
  if (!s) return '—';
  return s.length > 18 ? s.slice(0, 8) + '…' : s;
};

const thStyle = { padding: '14px 20px', fontSize: 11.5, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' };
const tdStyle = { padding: '16px 20px', verticalAlign: 'middle' };
const pillStyle = { display: 'inline-block', padding: '5px 12px', background: 'var(--bg-pill)', borderRadius: 9999, fontSize: 12, fontWeight: 500 };

// ---- Overview ----
const AdminOverview = ({ stats, items }) => {
  const recent = items.slice(0, 5);
  return (
    <div>
      <span className="eyebrow muted">Today</span>
      <h1 className="serif" style={{ fontSize: 44, fontWeight: 500, margin: '8px 0 32px', letterSpacing: '-0.02em' }}>
        Welcome, <span className="italic">Rosie.</span>
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 32 }}>
        <StatCard label="Products" value={stats.count} sub="in catalog" />
        <StatCard label="Categories" value={Object.keys(stats.byCat).length} sub="types" />
        <StatCard label="Events" value={stats.eventsCount} sub="seasonal tags" />
        <StatCard label="Catalog value" value={`$${stats.totalValue.toFixed(0)}`} sub="sum of prices" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: 24 }}>
          <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 16px' }}>By category</h3>
          {Object.entries(stats.byCat).map(([k, v]) => {
            const pct = stats.count ? (v / stats.count) * 100 : 0;
            return (
              <div key={k} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                  <span>{k}</span><span className="muted">{v}</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-cream)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: pct + '%', height: '100%', background: 'var(--ink)' }}></div>
                </div>
              </div>
            );
          })}
          {Object.keys(stats.byCat).length === 0 && <p className="muted" style={{ fontSize: 13 }}>No products yet.</p>}
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: 24 }}>
          <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 16px' }}>Recently added</h3>
          {recent.length === 0 && <p className="muted" style={{ fontSize: 13 }}>Nothing yet.</p>}
          {recent.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid var(--hairline)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: FALLBACK_BG }}>
                {p.image_url && <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15.5 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.category} · {p.event || 'no event'}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>${Number(p.price || 0).toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub }) => (
  <div style={{ background: '#fff', borderRadius: 18, padding: 22 }}>
    <div className="eyebrow muted" style={{ fontSize: 10.5 }}>{label}</div>
    <div className="serif" style={{ fontSize: 38, fontWeight: 600, margin: '8px 0 2px', letterSpacing: '-0.02em' }}>{value}</div>
    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>
  </div>
);

// ---- Categories panel ----
const CategoriesPanel = ({ items }) => {
  const byCat = items.reduce((m, p) => { (m[p.category || 'Uncategorized'] = m[p.category || 'Uncategorized'] || []).push(p); return m; }, {});
  const events = [...new Set(items.map(p => p.event).filter(Boolean))];
  return (
    <div>
      <span className="eyebrow muted">Taxonomy</span>
      <h1 className="serif" style={{ fontSize: 40, fontWeight: 500, margin: '8px 0 28px', letterSpacing: '-0.02em' }}>
        Categories & <span className="italic">events.</span>
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: 24 }}>
          <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 16px' }}>Categories ({Object.keys(byCat).length})</h3>
          {Object.entries(byCat).map(([k, list]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--hairline)' }}>
              <span>{k}</span><span className="muted">{list.length} products</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: 24 }}>
          <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 16px' }}>Events ({events.length})</h3>
          {events.length === 0 && <p className="muted" style={{ fontSize: 13 }}>No event tags yet. Add an event when creating a product.</p>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {events.map(e => <span key={e} style={pillStyle}>{e}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- Settings panel ----
const SettingsPanel = () => (
  <div>
    <span className="eyebrow muted">Configuration</span>
    <h1 className="serif" style={{ fontSize: 40, fontWeight: 500, margin: '8px 0 28px', letterSpacing: '-0.02em' }}>
      Settings.
    </h1>
    <div style={{ background: '#fff', borderRadius: 18, padding: 28, marginBottom: 18 }}>
      <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}>Supabase connection</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>
        To connect a real database, open <code style={{ background: 'var(--bg-cream)', padding: '2px 6px', borderRadius: 4 }}>Fleur Boutique.html</code> and paste your project URL & anon key into the <code>SUPABASE CONFIG</code> block at the top of the file.
      </p>
      <div style={{ padding: '14px 18px', background: isSupabaseConfigured() ? '#e8f4ea' : '#fff4e6', borderRadius: 12, fontSize: 13.5 }}>
        Status: <strong>{isSupabaseConfigured() ? 'Connected ✓' : 'Not configured (using local demo data)'}</strong>
      </div>
    </div>
    <div style={{ background: '#fff', borderRadius: 18, padding: 28, marginBottom: 18 }}>
      <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}>Image storage</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 16px', lineHeight: 1.6 }}>
        Khi đã nối Supabase, ảnh tải lên sẽ được lưu vào Storage bucket <code style={{ background: 'var(--bg-cream)', padding: '2px 6px', borderRadius: 4 }}>product-images</code>. Tạo bucket bằng SQL bên dưới, hoặc vào <strong>Storage → New bucket</strong> trong Supabase dashboard.
      </p>
      <pre style={{ background: '#2b1d18', color: '#f1e6dc', padding: 20, borderRadius: 12, fontSize: 12.5, overflow: 'auto', lineHeight: 1.6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', marginBottom: 0 }}>
{`-- Tạo bucket lưu ảnh sản phẩm
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

-- Cho phép upload ảnh (authenticated users only)
create policy "authed can upload"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Cho phép đọc công khai
create policy "public can read"
  on storage.objects for select
  using (bucket_id = 'product-images');`}
      </pre>
    </div>

    <div style={{ background: '#fff', borderRadius: 18, padding: 28 }}>
      <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}>Database schema</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 16px' }}>Run this SQL in your Supabase project's SQL editor to create the products table:</p>
      <pre style={{ background: '#2b1d18', color: '#f1e6dc', padding: 20, borderRadius: 12, fontSize: 12.5, overflow: 'auto', lineHeight: 1.6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
{`create table products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text,
  event       text,
  price       numeric,
  image_url   text,
  description text,
  created_at  timestamptz default now()
);

-- Allow the public anon role to read & write (for demo):
alter table products enable row level security;
create policy "anyone can read"    on products for select using (true);
create policy "authed can write"   on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');`}
      </pre>
    </div>
  </div>
);

// ---- Product editor (drawer) ----
const ProductEditor = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState({
    id: initial.id,
    name: initial.name || '',
    category: initial.category || 'Bouquets',
    event: initial.event || '',
    price: initial.price ?? '',
    image_url: initial.image_url || '',
    description: initial.description || '',
    created_at: initial.created_at,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr('');
    setUploading(true);
    try {
      const sb = getSupabase();
      if (sb) {
        // Upload to Supabase Storage bucket 'product-images'
        const ext = file.name.split('.').pop();
        const path = `products/${Date.now()}.${ext}`;
        const { error: upErr } = await sb.storage.from('product-images').upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        const { data } = sb.storage.from('product-images').getPublicUrl(path);
        set('image_url', data.publicUrl);
      } else {
        // Demo mode: read as base64 (persists in form state for this session)
        const reader = new FileReader();
        reader.onload = (ev) => set('image_url', ev.target.result);
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setUploadErr(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: Number(form.price) || 0 });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(43,29,24,0.4)', backdropFilter: 'blur(4px)' }}></div>
      <form onSubmit={submit} style={{
        position: 'relative', width: 540, maxWidth: '95vw', background: '#fff',
        padding: '32px 36px', overflowY: 'auto', boxShadow: '-30px 0 60px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <span className="eyebrow muted">{form.id ? 'Edit product' : 'New product'}</span>
            <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, margin: '8px 0 0', letterSpacing: '-0.02em' }}>
              {form.id ? form.name || 'Untitled' : 'Add a new piece'}
            </h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="plus" size={20} stroke={1.4} /><span style={{ position: 'absolute' }}></span>
          </button>
        </div>

        {/* Image preview + upload */}
        <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', background: FALLBACK_BG, marginBottom: 22 }}>
          {form.image_url
            ? <img src={form.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, color: 'var(--muted)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                <span style={{ fontSize: 13 }}>Chưa có ảnh</span>
              </div>}
          {/* Upload overlay */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 12 }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', border: 'none', background: 'rgba(43,29,24,0.82)', color: '#fff', backdropFilter: 'blur(6px)' }}>
              {uploading
                ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}></span> Uploading…</>
                : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> Upload ảnh</>
              }
            </button>
          </div>
        </div>
        {uploadErr && <div style={{ marginTop: -14, marginBottom: 10, padding: '9px 14px', background: '#fbeae5', color: '#9a3a2a', borderRadius: 10, fontSize: 13 }}>{uploadErr}</div>}
        {!isSupabaseConfigured() && (
          <div style={{ marginTop: -10, marginBottom: 14, padding: '10px 14px', background: '#fff4e6', borderRadius: 10, fontSize: 12.5, color: '#8a5a1c', lineHeight: 1.5 }}>
            <strong>Demo mode:</strong> ảnh tải lên chỉ tồn tại trong session này. Kết nối Supabase để lưu ảnh vĩnh viễn trên Storage.
          </div>
        )}

        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label className="input-label">Name (tên hoa)</label>
            <input className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Blush Rose Atelier" />
          </div>
          <div>
            <label className="input-label">Category (loại hoa)</label>
            <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)} style={{ appearance: 'none' }}>
              {['Bouquets', 'Luxe vase arrangements', 'Event and corporate hire', 'Wedding hire'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Price (USD)</label>
            <input className="input" type="number" min="0" step="0.01" required value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="89" />
          </div>
          <div>
            <label className="input-label">Image URL</label>
            <input className="input" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://…" />
          </div>
          <div>
            <label className="input-label">Description</label>
            <textarea className="input" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Hand-tied silk roses in soft blush and ivory…" style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Icon name="check" size={16} /> {form.id ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </div>
  );
};

// =========================================================
// REVIEWS MODERATION PANEL
// 3-star Google reviews land here for a human decision. 4–5★ are auto-rewarded
// and 1–2★ are auto-declined upstream; this panel shows the whole routed pipeline
// and lets the admin approve (issue 10% code) or reject the in-between cases.
// =========================================================
const STATUS_META = {
  pending:  { label: 'Awaiting you',   bg: '#fff4e6', fg: '#8a5a1c', dot: '#d99a3a' },
  approved: { label: 'Approved · 10% sent', bg: '#e8f4ea', fg: '#2f6a3c', dot: '#3ea25a' },
  rewarded: { label: 'Auto · 10% sent',     bg: '#e8f4ea', fg: '#2f6a3c', dot: '#3ea25a' },
  rejected: { label: 'Rejected · no code',  bg: '#f1ece8', fg: '#7a6a60', dot: '#a89486' },
  declined: { label: 'Auto-declined',       bg: '#fbeae5', fg: '#9a3a2a', dot: '#c2655a' },
};

const ReviewStatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px',
      borderRadius: 9999, fontSize: 12, fontWeight: 600, background: m.bg, color: m.fg, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot }}></span>
      {m.label}
    </span>
  );
};

const ReviewQueuePanel = ({ showToast }) => {
  const [reviews, setReviews] = useState(ReviewQueueStore.getAll());
  const [filter, setFilter] = useState('all'); // all | pending | rewarded | declined
  useEffect(() => ReviewQueueStore.subscribe(setReviews), []);

  const counts = reviews.reduce((m, r) => { m[r.status] = (m[r.status] || 0) + 1; return m; }, {});
  const pending = reviews.filter((r) => r.status === 'pending');
  const issuedCount = (counts.rewarded || 0) + (counts.approved || 0);
  const followUp = (counts.declined || 0) + (counts.rejected || 0);

  const approve = (r) => { ReviewQueueStore.approve(r.id); showToast && showToast('Approved — 10% code sent to ' + r.email); };
  const reject = (r) => { ReviewQueueStore.reject(r.id); showToast && showToast('Rejected — no code issued'); };

  const matchesFilter = (r) =>
    filter === 'all' ? true :
    filter === 'pending' ? r.status === 'pending' :
    filter === 'rewarded' ? (r.status === 'rewarded' || r.status === 'approved') :
    (r.status === 'declined' || r.status === 'rejected');
  const list = reviews.filter(matchesFilter);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <span className="eyebrow muted">Google reviews · auto-routed by rating</span>
          <h1 className="serif" style={{ fontSize: 40, fontWeight: 500, margin: '8px 0 0', letterSpacing: '-0.02em' }}>
            Review <span className="italic" style={{ color: 'var(--muted)', fontWeight: 400 }}>rewards.</span>
          </h1>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--muted)' }}>
          <Icon name="google" size={15} /> Synced from Google Business Profile · last updated just now
        </div>
      </div>

      {/* How routing works */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '18px 0 26px' }}>
        {[
          { r: '4–5★', t: 'Auto-rewards a 10% code', meta: STATUS_META.rewarded },
          { r: '3★', t: 'Held for your decision below', meta: STATUS_META.pending },
          { r: '1–2★', t: 'No code · personal follow-up', meta: STATUS_META.declined },
        ].map((x, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: '#fff', borderRadius: 12, border: '1px solid var(--hairline)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: x.meta.dot }}></span>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600 }}>{x.r}</strong>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{x.t}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 30 }}>
        <StatCard label="Awaiting decision" value={pending.length} sub="3-star reviews" />
        <StatCard label="Codes issued" value={issuedCount} sub="auto + approved" />
        <StatCard label="Follow-ups" value={followUp} sub="1–2★ & rejected" />
        <StatCard label="Total reviews" value={reviews.length} sub="synced from Google" />
      </div>

      {/* Needs your decision */}
      <div style={{ marginBottom: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>Needs your decision</h2>
          <span style={{ padding: '4px 11px', borderRadius: 9999, background: '#fff4e6', color: '#8a5a1c', fontSize: 12.5, fontWeight: 700 }}>{pending.length}</span>
        </div>

        {pending.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 18, padding: '44px 28px', textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-cream)', marginBottom: 14, color: 'var(--ink)' }}>
              <Icon name="check" size={26} />
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--ink)', marginBottom: 4 }}>All caught up</div>
            <div style={{ fontSize: 13.5 }}>No 3-star reviews are waiting. New ones from Google appear here automatically.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {pending.map((r) => (
              <div key={r.id} style={{ background: '#fff', borderRadius: 18, border: '1px solid #f0d8b3', boxShadow: 'var(--shadow-card)', padding: 24 }}>
                <div style={{ display: 'flex', gap: 18 }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0, background: 'var(--bg-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 600, color: 'var(--ink)' }}>{r.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{r.name}</span>
                      <Stars value={r.rating} size={14} />
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>· {r.rating}.0</span>
                      <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--muted)' }}>{r.date}</span>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 4, fontSize: 13, color: 'var(--muted)' }}>
                      <Icon name="mail" size={13} /> {r.email}
                    </div>
                    <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '12px 0 18px' }}>{r.body}</p>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                      <button className="btn btn-primary" onClick={() => approve(r)}>
                        <Icon name="check" size={15} /> Approve &amp; send 10%
                      </button>
                      <button className="btn btn-secondary" onClick={() => reject(r)}>Reject</button>
                      <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Code will be emailed to the reviewer instantly.</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full pipeline */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>All reviews</h2>
        <div className="chip-strip">
          {[['all', 'All'], ['pending', 'Awaiting'], ['rewarded', 'Rewarded'], ['declined', 'Follow-up']].map(([id, lbl]) => (
            <button key={id} className={'chip' + (filter === id ? ' active' : '')} onClick={() => setFilter(id)}>{lbl}</button>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--bg-cream)', textAlign: 'left' }}>
              <th style={thStyle}>Reviewer</th>
              <th style={thStyle}>Rating</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Code</th>
              <th style={{ ...thStyle, textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No reviews in this view.</td></tr>
            )}
            {list.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid var(--hairline)' }}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--bg-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600, flexShrink: 0 }}>{r.avatar}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{r.email}</div>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}><Stars value={r.rating} size={13} /></td>
                <td style={tdStyle}><ReviewStatusBadge status={r.status} /></td>
                <td style={{ ...tdStyle, fontFamily: 'var(--font-serif)', letterSpacing: '0.06em', fontWeight: 600 }}>
                  {r.code || <span className="muted" style={{ fontFamily: 'var(--font-sans)', letterSpacing: 0, fontWeight: 400 }}>—</span>}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  {r.status === 'pending' ? (
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => approve(r)}>Approve</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#9a3a2a' }} onClick={() => reject(r)}>Reject</button>
                    </div>
                  ) : <span className="muted" style={{ fontSize: 12.5 }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Object.assign(window, { LoginPage, AdminLoginPage, AdminPage });

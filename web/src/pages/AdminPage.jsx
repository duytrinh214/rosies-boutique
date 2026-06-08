import { useState, useEffect, useMemo, useRef } from 'react';
import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import { ProductStore } from '../lib/stores';
import { FALLBACK_BG } from '../lib/products';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

// =========================================================
// ADMIN DASHBOARD
// =========================================================
const AdminPage = () => {
  const { navigate } = useNav();
  // gate: must be signed in (localStorage flag set by admin login)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `navigate` is stable for the component's lifetime
  useEffect(() => { if (!localStorage.getItem('rosie_admin')) navigate('admin-login'); }, []);
  const adminSession = (() => {
    try { return JSON.parse(localStorage.getItem('rosie_admin') || 'null'); } catch { return null; }
  })();

  const [tab, setTab] = useState('products');
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
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect -- standard fetch-on-mount; `load` is stable for the component's lifetime
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
            background: isSupabaseConfigured ? '#e8f4ea' : '#fff4e6',
            color: isSupabaseConfigured ? '#2f6a3c' : '#8a5a1c',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSupabaseConfigured ? '#3ea25a' : '#d99a3a' }}></span>
            {isSupabaseConfigured ? 'Supabase connected' : 'Local demo mode'}
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
      <div style={{ padding: '14px 18px', background: isSupabaseConfigured ? '#e8f4ea' : '#fff4e6', borderRadius: 12, fontSize: 13.5 }}>
        Status: <strong>{isSupabaseConfigured ? 'Connected ✓' : 'Not configured (using local demo data)'}</strong>
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
  id          text primary key default gen_random_uuid()::text,
  name        text not null,
  description text,
  price       numeric not null default 0,
  category    text,
  event       text,
  image_url   text,
  images      jsonb not null default '[]'::jsonb,
  tag         text,
  rating      numeric not null default 4.8,
  reviews     integer not null default 0,
  stock       integer not null default 0,
  palette     jsonb not null default '[]'::jsonb,
  details     jsonb not null default '[]'::jsonb,
  sizes       jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

-- Public can read the catalog; only authenticated admins can write:
alter table products enable row level security;
create policy "anyone can read"    on products for select using (true);
create policy "authed can write"   on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Full table + RLS + seed data: supabase/migrations/20260608120000_create_products_table.sql`}
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
        {!isSupabaseConfigured && (
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

export default AdminPage;

import { useEffect, useState } from 'react';
import { PRODUCTS, normaliseProduct } from './products';
import { getSupabase } from './supabase';

// ============ PRODUCT STORE ============
// Single source of truth for the catalog. Seeded from PRODUCTS on first load;
// admin CRUD writes back here so the shop, homepage, admin console and product
// pages all stay in sync. `sync()` is called after a Supabase fetch to mirror
// remote data into this local cache.
export const ProductStore = (() => {
  const KEY = 'rosie_products_v1';
  let items = [];
  let listeners = [];
  const persist = () => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    listeners.forEach((fn) => fn(items.slice()));
  };
  const seed = () => {
    items = PRODUCTS.map((p) => normaliseProduct({ ...p, image_url: p.img }));
    persist();
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) items = JSON.parse(raw).map(normaliseProduct);
    else seed();
  } catch (e) { seed(); }

  return {
    getAll: () => items.slice(),
    list: async () => items.slice(),
    sync: (serverItems) => { items = (serverItems || []).map(normaliseProduct); persist(); },
    subscribe: (fn) => { listeners.push(fn); return () => { listeners = listeners.filter((x) => x !== fn); }; },
    insert: async (row) => {
      const newId = row.id || ('p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5));
      const item = normaliseProduct({ ...row, id: newId, created_at: new Date().toISOString() });
      items.unshift(item);
      persist();
      return item;
    },
    update: async (id, patch) => {
      const idx = items.findIndex((x) => x.id === id);
      if (idx >= 0) { items[idx] = normaliseProduct({ ...items[idx], ...patch }); persist(); return items[idx]; }
      return null;
    },
    remove: async (id) => { items = items.filter((x) => x.id !== id); persist(); },
  };
})();

// Pull the live catalog from Supabase once on app start (when configured) so
// every page — not just the admin console — shows the real database catalog.
// Falls back to the localStorage-seeded PRODUCTS if Supabase is unreachable.
(async () => {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length) ProductStore.sync(data);
  } catch (e) { console.error('Failed to load products from Supabase:', e); }
})();

export const useProducts = () => {
  const [products, setProducts] = useState(ProductStore.getAll());
  useEffect(() => ProductStore.subscribe(setProducts), []);
  return products;
};

// ============ CART STORE ============
export const CartStore = (() => {
  const KEY = 'fleur_cart';
  let items = [];
  let listeners = [];
  const read = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) items = JSON.parse(raw);
    } catch (e) {}
  };
  const persist = () => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    listeners.forEach((fn) => fn(items.slice()));
  };
  read();
  return {
    getItems: () => items,
    add: (product, qty = 1, size = 'Standard') => {
      const key = product.id + ':' + size;
      const existing = items.find((it) => it.key === key);
      if (existing) existing.qty += qty;
      else items.push({ key, id: product.id, name: product.name, price: product.price, img: product.img, size, qty });
      persist();
    },
    remove: (key) => { items = items.filter((it) => it.key !== key); persist(); },
    setQty: (key, qty) => {
      const it = items.find((x) => x.key === key);
      if (it) { it.qty = Math.max(1, qty); persist(); }
    },
    clear: () => { items = []; persist(); },
    subscribe: (fn) => { listeners.push(fn); return () => { listeners = listeners.filter((x) => x !== fn); }; },
  };
})();

export const useCart = () => {
  const [items, setItems] = useState(CartStore.getItems());
  useEffect(() => CartStore.subscribe(setItems), []);
  return {
    items,
    count: items.reduce((s, it) => s + it.qty, 0),
    total: items.reduce((s, it) => s + it.qty * it.price, 0),
    add: CartStore.add,
    remove: CartStore.remove,
    setQty: CartStore.setQty,
    clear: CartStore.clear,
  };
};

// ============ DISCOUNT CODES ============
// Used by the newsletter signup to issue a one-time welcome code. Each code is
// a one-shot voucher tied to the email it was sent to, persisted locally so the
// same browser can redeem it at checkout. In production this would be issued
// by a backend (e.g. on newsletter signup or order webhook) rather than purely
// client-side.
export const DiscountStore = (() => {
  const KEY = 'rosie_discount_codes';
  let codes = [];
  let listeners = [];
  const read = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) codes = JSON.parse(raw);
    } catch (e) {}
  };
  const persist = () => {
    try { localStorage.setItem(KEY, JSON.stringify(codes)); } catch (e) {}
    listeners.forEach((fn) => fn(codes));
  };
  read();
  const randomCode = () => {
    const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 5; i++) out += a[Math.floor(Math.random() * a.length)];
    return 'ROSIE-' + out;
  };
  return {
    getAll: () => codes,
    issue: (email, percent = 10) => {
      let code = randomCode();
      while (codes.some((c) => c.code === code)) code = randomCode();
      const entry = { code, email, percent, used: false, issuedAt: Date.now() };
      codes.push(entry);
      persist();
      return entry;
    },
    validate: (input) => {
      const c = (input || '').trim().toUpperCase();
      return codes.find((x) => x.code === c && !x.used) || null;
    },
    markUsed: (code) => {
      const c = codes.find((x) => x.code === code);
      if (c) { c.used = true; c.usedAt = Date.now(); persist(); }
    },
    subscribe: (fn) => { listeners.push(fn); return () => { listeners = listeners.filter((x) => x !== fn); }; },
  };
})();

export const ADMIN_EMAIL = 'admin@rosie.co';

import { createClient } from '@supabase/supabase-js';

// ===== SUPABASE CONFIG =====
// TODO: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
// (see .env.example). Find these under Project Settings → API in your
// Supabase dashboard.
//
// Expected schema — create a `products` table with:
//   id          uuid    primary key default gen_random_uuid()
//   name        text
//   category    text     -- Bouquets, Gifts, ...
//   event       text     -- occasion (Wedding, Birthday, Mother's Day, ...)
//   price       numeric
//   image_url   text
//   description text
//   created_at  timestamptz default now()
//
// Plus a public Storage bucket named `product-images` for uploaded photos.
// Full setup SQL is shown in the admin dashboard's Settings tab.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client = null;
export const getSupabase = () => {
  if (!isSupabaseConfigured) return null;
  if (!client) client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
};

/* Demo admin credentials used only when Supabase is NOT configured, so the
   admin dashboard can still be previewed without a backend. */
export const DEMO_ADMIN_EMAIL = import.meta.env.VITE_DEMO_ADMIN_EMAIL || 'admin@rosie.co';
export const DEMO_ADMIN_PASSWORD = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'rosie2026';

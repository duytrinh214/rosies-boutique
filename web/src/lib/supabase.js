import { createClient } from '@supabase/supabase-js';

// ===== SUPABASE CONFIG =====
// TODO: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
// (see .env.example). Find these under Project Settings → API in your
// Supabase dashboard.
//
// Expected schema — see supabase/migrations/20260608120000_create_products_table.sql
// for the full `products` table definition (name, description, price, category,
// event, image_url, images, tag, rating, reviews, stock, palette, details, sizes,
// created_at) plus row-level security policies and sample seed data.
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

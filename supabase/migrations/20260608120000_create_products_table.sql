-- Create the products table backing the storefront catalog and admin console.
create table if not exists public.products (
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

-- Public storefront reads the catalog directly; only authenticated admins write.
alter table public.products enable row level security;

create policy "anyone can read products"
  on public.products for select
  using (true);

create policy "authenticated users can manage products"
  on public.products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed the catalog with the storefront's sample products so the shop looks
-- populated immediately after setup.
insert into public.products
  (id, name, description, price, category, event, image_url, images, tag, rating, reviews, stock, palette, details, sizes)
values
  ('sunset-atelier', 'Sunset Atelier', 'A warm coral, peach and ivory hand-tied composition centered on a hand-shaped chrysanthemum. Wrapped in raw silk ribbon, set in our signature gift vessel.', 92, 'Bouquets', null, 'products/sunset-atelier.jpg', '["products/sunset-atelier.jpg"]'::jsonb, 'New', 4.9, 184, 73, '["Coral","Ivory","Champagne"]'::jsonb, '["Mixed silk roses, cosmos & chrysanthemum","Hand-tied with silk & satin ribbon","Approx. 28 × 26 cm","Made to last 5+ years"]'::jsonb, '["Petite","Standard","Grand"]'::jsonb),
  ('magenta-garden', 'Magenta Garden', null, 108, 'Bouquets', null, 'products/magenta-garden.jpg', '["products/magenta-garden.jpg"]'::jsonb, 'Bestseller', 4.9, 312, 53, '["Magenta","Blush","Coral"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('graduation-lily', 'Graduation Lily', null, 86, 'Gifts', null, 'products/graduation-lily.jpg', '["products/graduation-lily.jpg"]'::jsonb, 'Gift', 4.8, 142, 75, '["Coral","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('burgundy-crescent', 'Burgundy Crescent', null, 96, 'Bouquets', null, 'products/burgundy-crescent.jpg', '["products/burgundy-crescent.jpg"]'::jsonb, null, 4.9, 220, 46, '["Burgundy","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('studio-pink', 'Studio Pink Bundle', null, 74, 'Bouquets', null, 'products/studio-pink.jpg', '["products/studio-pink.jpg"]'::jsonb, 'New', 4.8, 76, 35, '["Blush","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('sunshine-bear', 'Sunshine Bear', null, 68, 'Gifts', null, 'products/sunshine-bear.jpg', '["products/sunshine-bear.jpg"]'::jsonb, 'Gift', 4.8, 98, 34, '["Mint","Champagne"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('ivory-tulip', 'Ivory Tulip Pot', null, 112, 'Bouquets', null, 'products/ivory-tulip.jpg', '["products/ivory-tulip.jpg"]'::jsonb, null, 4.9, 167, 24, '["Ivory","Champagne"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('coral-peony', 'Coral Peony Bloom', null, 124, 'Bouquets', null, 'products/coral-peony.jpg', '["products/coral-peony.jpg"]'::jsonb, 'Bestseller', 4.9, 248, 61, '["Coral","Blush"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('teacup-romance', 'Teacup Romance', null, 58, 'Gifts', null, 'products/teacup-romance.jpg', '["products/teacup-romance.jpg"]'::jsonb, 'Gift', 4.7, 62, 37, '["Blush","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('calla-cascade', 'Calla Cascade', null, 98, 'Bouquets', null, 'products/calla-cascade.jpg', '["products/calla-cascade.jpg"]'::jsonb, 'New', 4.8, 89, 74, '["Coral","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('crimson-orchid', 'Crimson & Orchid', null, 116, 'Bouquets', null, 'products/crimson-orchid.jpg', '["products/crimson-orchid.jpg"]'::jsonb, null, 4.9, 134, 78, '["Burgundy","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('spring-lush', 'Spring Lush', null, 128, 'Bouquets', null, 'products/spring-lush.jpg', '["products/spring-lush.jpg"]'::jsonb, null, 5, 41, 34, '["Magenta","Coral","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('amber-protea', 'Amber Protea', null, 94, 'Bouquets', null, 'products/sunset-atelier.jpg', '["products/sunset-atelier.jpg"]'::jsonb, 'New', 4.8, 73, 36, '["Amber","Coral","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('jade-orchid', 'Jade Orchid Jar', null, 120, 'Bouquets', null, 'products/ivory-tulip.jpg', '["products/ivory-tulip.jpg"]'::jsonb, 'New', 4.9, 58, 23, '["Lime","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('rose-tote', 'Rosé Posy Tote', null, 88, 'Gifts', null, 'products/magenta-garden.jpg', '["products/magenta-garden.jpg"]'::jsonb, 'Gift', 4.9, 121, 38, '["Blush","Magenta"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('peony-cascade', 'Peony Cascade', null, 118, 'Bouquets', null, 'products/coral-peony.jpg', '["products/coral-peony.jpg"]'::jsonb, null, 4.9, 96, 68, '["Coral","Blush","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('golden-graduate', 'Golden Graduate', null, 90, 'Gifts', null, 'products/graduation-lily.jpg', '["products/graduation-lily.jpg"]'::jsonb, 'Gift', 4.8, 64, 68, '["Coral","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('sunbeam-bundle', 'Sunbeam Bundle', null, 80, 'Bouquets', null, 'products/studio-pink.jpg', '["products/studio-pink.jpg"]'::jsonb, null, 4.7, 52, 66, '["Blush","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('pearl-calla', 'Pearl Calla Pot', null, 102, 'Bouquets', null, 'products/calla-cascade.jpg', '["products/calla-cascade.jpg"]'::jsonb, null, 4.8, 47, 48, '["Peach","Ivory"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('teddy-blossom', 'Teddy Blossom', null, 70, 'Gifts', null, 'products/sunshine-bear.jpg', '["products/sunshine-bear.jpg"]'::jsonb, 'Gift', 4.8, 85, 33, '["Mint","Champagne"]'::jsonb, '[]'::jsonb, '[]'::jsonb)
on conflict (id) do nothing;